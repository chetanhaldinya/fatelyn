"""Auth utilities and endpoints for FATELYN.

- Email/password JWT (bcrypt + PyJWT) via cookies (access 15min, refresh 7d)
- Emergent-managed Google Login (session_id → session_data) that upserts the same user record
- Admin seeding on startup
- Brute-force protection (5 attempts / 15 min)
- Role-based access (`user` | `admin`)
"""
from __future__ import annotations
import os
import uuid
import secrets
from datetime import datetime, timezone, timedelta
from typing import Optional

import bcrypt
import jwt
import httpx
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr, Field

from db import get_db

JWT_ALGORITHM = "HS256"
ACCESS_MINUTES = 15
REFRESH_DAYS = 7

router = APIRouter(prefix="/api/auth")


# ---------------- helpers ---------------- #
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_MINUTES),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "type": "refresh",
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_DAYS),
    }
    return jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


def _set_auth_cookies(response: Response, access: str, refresh: str):
    # secure=True and samesite="none" would require cross-site cookies with HTTPS; the preview URL is HTTPS so we allow it.
    response.set_cookie("access_token", access, httponly=True, secure=False, samesite="lax", max_age=ACCESS_MINUTES * 60, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=False, samesite="lax", max_age=REFRESH_DAYS * 86400, path="/")


def _clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def _sanitize_user(u: dict) -> dict:
    if not u:
        return u
    u.pop("_id", None)
    u.pop("password_hash", None)
    return u


# ---------------- current user dep ---------------- #
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        h = request.headers.get("Authorization", "")
        if h.startswith("Bearer "):
            token = h[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    db = get_db()
    user = await db.users.find_one({"user_id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user.pop("password_hash", None)
    return user


async def require_admin(current: dict = Depends(get_current_user)) -> dict:
    if current.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return current


# ---------------- request/response models ---------------- #
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=200)
    name: str = Field(min_length=1, max_length=80)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    user_id: str
    email: str
    name: str
    role: str
    picture: Optional[str] = None
    provider: str = "email"


# ---------------- brute-force ---------------- #
async def _check_lockout(identifier: str) -> None:
    db = get_db()
    doc = await db.login_attempts.find_one({"identifier": identifier})
    if doc and doc.get("locked_until"):
        lu = doc["locked_until"]
        if isinstance(lu, str):
            lu = datetime.fromisoformat(lu)
        if lu.tzinfo is None:
            lu = lu.replace(tzinfo=timezone.utc)
        if lu > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in a few minutes.")


async def _record_failed(identifier: str) -> None:
    db = get_db()
    doc = await db.login_attempts.find_one({"identifier": identifier}) or {"identifier": identifier, "count": 0}
    doc["count"] = doc.get("count", 0) + 1
    if doc["count"] >= 5:
        doc["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        doc["count"] = 0
    await db.login_attempts.replace_one({"identifier": identifier}, doc, upsert=True)


async def _clear_failed(identifier: str) -> None:
    await get_db().login_attempts.delete_one({"identifier": identifier})


# ---------------- endpoints ---------------- #
@router.post("/register", response_model=UserOut)
async def register(body: RegisterIn, response: Response):
    db = get_db()
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    doc = {
        "user_id": user_id,
        "email": email,
        "name": body.name,
        "password_hash": hash_password(body.password),
        "role": "user",
        "provider": "email",
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    access = create_access_token(user_id, email, "user")
    refresh = create_refresh_token(user_id)
    _set_auth_cookies(response, access, refresh)
    return UserOut(**_sanitize_user({**doc}))


@router.post("/login", response_model=UserOut)
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.lower()
    ip = request.client.host if request.client else "unknown"
    identifier = email  # global-across-pods lockout keyed by email only
    await _check_lockout(identifier)

    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user or not user.get("password_hash") or not verify_password(body.password, user["password_hash"]):
        await _record_failed(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await _clear_failed(identifier)
    access = create_access_token(user["user_id"], email, user.get("role", "user"))
    refresh = create_refresh_token(user["user_id"])
    _set_auth_cookies(response, access, refresh)
    # activity log
    await db.activity.insert_one({
        "user_id": user["user_id"],
        "type": "login",
        "provider": user.get("provider", "email"),
        "ip": ip,
        "at": datetime.now(timezone.utc).isoformat(),
    })
    return UserOut(**_sanitize_user(dict(user)))


@router.post("/logout")
async def logout(response: Response, current: dict = Depends(get_current_user)):
    _clear_auth_cookies(response)
    await get_db().activity.insert_one({
        "user_id": current["user_id"], "type": "logout", "at": datetime.now(timezone.utc).isoformat()
    })
    return {"ok": True}


@router.get("/me", response_model=UserOut)
async def me(current: dict = Depends(get_current_user)):
    return UserOut(**_sanitize_user(dict(current)))


@router.post("/refresh")
async def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    db = get_db()
    user = await db.users.find_one({"user_id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access = create_access_token(user["user_id"], user["email"], user.get("role", "user"))
    _set_auth_cookies(response, access, token)
    return {"ok": True}


# ---------------- Google (Emergent) login ---------------- #
class GoogleSessionIn(BaseModel):
    session_id: str


@router.post("/google", response_model=UserOut)
async def google_login(body: GoogleSessionIn, response: Response, request: Request):
    """Exchange Emergent session_id for user info, upsert user, and issue our own JWT cookies."""
    async with httpx.AsyncClient(timeout=15) as http:
        try:
            r = await http.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": body.session_id},
            )
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Auth provider unreachable: {e}")
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    data = r.json()
    email = (data.get("email") or "").lower()
    if not email:
        raise HTTPException(status_code=400, detail="No email from provider")
    db = get_db()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": data.get("name") or email.split("@")[0],
            "picture": data.get("picture"),
            "role": "user",
            "provider": "google",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user)
    else:
        await db.users.update_one({"email": email}, {"$set": {"name": data.get("name") or user["name"], "picture": data.get("picture") or user.get("picture"), "provider": user.get("provider", "google")}})
    access = create_access_token(user["user_id"], email, user.get("role", "user"))
    refresh = create_refresh_token(user["user_id"])
    _set_auth_cookies(response, access, refresh)
    ip = request.client.host if request.client else "unknown"
    await db.activity.insert_one({
        "user_id": user["user_id"], "type": "login", "provider": "google", "ip": ip, "at": datetime.now(timezone.utc).isoformat()
    })
    user.pop("password_hash", None)
    return UserOut(**user)


# ---------------- startup helpers ---------------- #
async def ensure_indexes():
    db = get_db()
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.activity.create_index("user_id")
    await db.activity.create_index("at")


async def seed_admin():
    """Idempotent admin seeder — creates or updates admin from env."""
    db = get_db()
    email = os.environ.get("ADMIN_EMAIL", "admin@fatelyn.app").lower()
    password = os.environ.get("ADMIN_PASSWORD", "fatelyn@admin2026")
    existing = await db.users.find_one({"email": email})
    if not existing:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": "Fatelyn Admin",
            "password_hash": hash_password(password),
            "role": "admin",
            "provider": "email",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    else:
        updates = {"role": "admin"}
        if not existing.get("password_hash") or not verify_password(password, existing["password_hash"]):
            updates["password_hash"] = hash_password(password)
        await db.users.update_one({"email": email}, {"$set": updates})
