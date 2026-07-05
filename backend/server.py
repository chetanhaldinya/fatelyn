"""FATELYN main FastAPI app — wires auth, astrology (swiss-ephemeris), admin, quest AI, sandbox subscriptions."""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db import get_db, close_client
import auth as auth_module
from auth import router as auth_router, get_current_user
from astro import router as astro_router
from admin import router as admin_router, seed_defaults

app = FastAPI(title="FATELYN API", version="1.0.0")

# ---------------- Core /api router (health, quest, subs, content, activity) ---------------- #
core = APIRouter(prefix="/api")


@core.get("/health")
async def health():
    return {"status": "ok", "service": "fatelyn", "version": "1.0.0"}


# ------- Quest AI ------- #
class QuestAskRequest(BaseModel):
    question: str
    category: Optional[str] = "Personal"
    zodiac: Optional[str] = None
    ascendant: Optional[str] = None


class QuestAnswerResponse(BaseModel):
    id: str
    question: str
    answer: str
    created_at: str


@core.post("/quest/ask", response_model=QuestAnswerResponse)
async def quest_ask(payload: QuestAskRequest, request: Request):
    """Ask Fatelyn a question. Auth optional — anonymous users get a limited answer.

    Reads the live `quest_system` prompt from Mongo so admins can tune it without redeploy.
    """
    from Fatelynintegrations.llm.chat import LlmChat, UserMessage

    db = get_db()
    api_key = os.environ.get("Fatelyn_LLM_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Fatelyn_LLM_KEY not configured")

    # Try to attach user context if logged in (soft auth)
    user = None
    try:
        user = await get_current_user(request)
    except HTTPException:
        pass

    prompt_doc = await db.prompts.find_one({"key": "quest_system"}, {"_id": 0})
    system_message = (
        prompt_doc["body"] if prompt_doc else
        "You are FATELYN — a warm Vedic-astrology-inspired guide. Give 90-140 words of motivational guidance."
    )
    model_str = (prompt_doc or {}).get("model", "anthropic/claude-sonnet-4-6")
    provider, model_name = model_str.split("/", 1) if "/" in model_str else ("anthropic", model_str)

    session_id = f"quest-{uuid.uuid4()}"
    chat = LlmChat(api_key=api_key, session_id=session_id, system_message=system_message).with_model(provider, model_name)

    ctx = [f"Category: {payload.category}"]
    if user:
        ctx.append(f"Seeker: {user.get('name')}")
    if payload.zodiac:
        ctx.append(f"Sun/Moon sign: {payload.zodiac}")
    if payload.ascendant:
        ctx.append(f"Ascendant: {payload.ascendant}")
    ctx.append(f"Question: {payload.question}")
    prompt = "\n".join(ctx)

    try:
        response = await chat.send_message(UserMessage(text=prompt))
        answer_text = response if isinstance(response, str) else str(response)
    except Exception as e:
        logging.exception("LLM error")
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")

    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["user_id"] if user else None,
        "question": payload.question,
        "category": payload.category,
        "answer": answer_text.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.quest_history.insert_one({**doc})
    if user:
        await db.activity.insert_one({"user_id": user["user_id"], "type": "quest_ask", "at": doc["created_at"], "category": payload.category})
    return QuestAnswerResponse(id=doc["id"], question=doc["question"], answer=doc["answer"], created_at=doc["created_at"])


@core.get("/quest/history", response_model=List[QuestAnswerResponse])
async def quest_history(request: Request, limit: int = 20):
    user = await get_current_user(request)
    items = await get_db().quest_history.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return [QuestAnswerResponse(id=i["id"], question=i["question"], answer=i["answer"], created_at=i["created_at"]) for i in items]


# ------- Subscriptions (sandbox) ------- #
class CheckoutIn(BaseModel):
    plan: str


class CheckoutOut(BaseModel):
    session_id: str
    publishable_key: str
    plan: str
    amount: int
    currency: str
    status: str
    test_card_hint: str


@core.post("/subscription/checkout", response_model=CheckoutOut)
async def sub_checkout(body: CheckoutIn, request: Request):
    plan = body.plan.lower()
    if plan not in {"monthly", "yearly"}:
        raise HTTPException(400, "Invalid plan")
    amount = 29900 if plan == "monthly" else 249900
    session_id = f"cs_test_{uuid.uuid4().hex[:24]}"

    # try to attach user
    user = None
    try:
        user = await get_current_user(request)
    except HTTPException:
        pass

    await get_db().subscription_sessions.insert_one({
        "session_id": session_id,
        "user_id": user["user_id"] if user else None,
        "plan": plan,
        "amount": amount,
        "currency": "INR",
        "status": "requires_payment",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return CheckoutOut(
        session_id=session_id,
        publishable_key="pk_test_TYooMQauvdEDq54NiTphI7jx",
        plan=plan,
        amount=amount,
        currency="INR",
        status="requires_payment",
        test_card_hint="Test card: 4242 4242 4242 4242 · Any future date · Any CVC",
    )


@core.post("/subscription/confirm/{session_id}")
async def sub_confirm(session_id: str):
    res = await get_db().subscription_sessions.update_one({"session_id": session_id}, {"$set": {"status": "succeeded", "succeeded_at": datetime.now(timezone.utc).isoformat()}})
    return {"session_id": session_id, "status": "succeeded", "updated": res.modified_count}


# ------- Public content (for landing / app) ------- #
@core.get("/content/{key}")
async def get_content(key: str):
    doc = await get_db().content.find_one({"key": key}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Not found")
    return doc


# ------- Activity logger (client-side click tracking) ------- #
class ActivityIn(BaseModel):
    type: str
    target: Optional[str] = None
    meta: Optional[dict] = None


@core.post("/activity")
async def log_activity(body: ActivityIn, request: Request):
    user = None
    try:
        user = await get_current_user(request)
    except HTTPException:
        pass
    await get_db().activity.insert_one({
        "user_id": user["user_id"] if user else None,
        "type": body.type,
        "target": body.target,
        "meta": body.meta,
        "ip": request.client.host if request.client else None,
        "at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


# ------- Profile / birth details (per user) ------- #
class BirthDetails(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    year: int
    month: int
    day: int
    hour: int = 12
    minute: int = 0
    tz_offset: float = 5.5
    latitude: float = 28.6139
    longitude: float = 77.2090
    place: Optional[str] = None


@core.put("/me/birth")
async def save_birth(body: BirthDetails, current: dict = Depends(get_current_user)):
    await get_db().users.update_one({"user_id": current["user_id"]}, {"$set": {"birth": body.dict()}})
    return {"ok": True}


@core.get("/me/birth")
async def get_birth(current: dict = Depends(get_current_user)):
    doc = await get_db().users.find_one({"user_id": current["user_id"]}, {"_id": 0, "birth": 1})
    return doc.get("birth") if doc else None


# ---------------- register routers ---------------- #
app.include_router(core)
app.include_router(auth_router)
app.include_router(astro_router)
app.include_router(admin_router)

# ---------------- CORS ---------------- #
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


# ---------------- startup / shutdown ---------------- #
@app.on_event("startup")
async def _startup():
    await auth_module.ensure_indexes()
    await auth_module.seed_admin()
    await seed_defaults()


@app.on_event("shutdown")
async def _shutdown():
    await close_client()
