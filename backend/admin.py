"""Admin endpoints: dashboard stats, users, activity, content, prompts, payments."""
from __future__ import annotations
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from auth import require_admin
from db import get_db

router = APIRouter(prefix="/api/admin")


# ---------------- Dashboard ---------------- #
@router.get("/dashboard")
async def dashboard(_: dict = Depends(require_admin)):
    db = get_db()
    now = datetime.now(timezone.utc)
    since_24h = (now - timedelta(hours=24)).isoformat()
    since_7d = (now - timedelta(days=7)).isoformat()
    since_30d = (now - timedelta(days=30)).isoformat()

    total_users = await db.users.count_documents({})
    new_24h = await db.users.count_documents({"created_at": {"$gte": since_24h}})
    active_7d = len(await db.activity.distinct("user_id", {"at": {"$gte": since_7d}}))
    active_30d = len(await db.activity.distinct("user_id", {"at": {"$gte": since_30d}}))

    quest_total = await db.quest_history.count_documents({})
    quest_24h = await db.quest_history.count_documents({"created_at": {"$gte": since_24h}})

    subs_total = await db.subscription_sessions.count_documents({"status": "succeeded"})
    subs_revenue_paise = 0
    async for s in db.subscription_sessions.find({"status": "succeeded"}, {"amount": 1, "_id": 0}):
        subs_revenue_paise += s.get("amount", 0)

    # daily activity counts for last 7 days (chart series)
    series = []
    for i in range(6, -1, -1):
        d0 = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        d1 = d0 + timedelta(days=1)
        count = await db.activity.count_documents({"at": {"$gte": d0.isoformat(), "$lt": d1.isoformat()}})
        series.append({"day": d0.strftime("%a"), "date": d0.strftime("%Y-%m-%d"), "events": count})

    # top clicks
    click_pipeline = [
        {"$match": {"type": "click"}},
        {"$group": {"_id": "$target", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    top_clicks = [{"target": r["_id"], "count": r["count"]} async for r in db.activity.aggregate(click_pipeline)]

    return {
        "users": {"total": total_users, "new_24h": new_24h, "active_7d": active_7d, "active_30d": active_30d},
        "quest": {"total": quest_total, "last_24h": quest_24h},
        "subscriptions": {"succeeded": subs_total, "revenue_inr": subs_revenue_paise / 100},
        "activity_series": series,
        "top_clicks": top_clicks,
    }


# ---------------- Users ---------------- #
@router.get("/users")
async def list_users(_: dict = Depends(require_admin), limit: int = 100, search: Optional[str] = None):
    db = get_db()
    q = {}
    if search:
        q = {"$or": [{"email": {"$regex": search, "$options": "i"}}, {"name": {"$regex": search, "$options": "i"}}]}
    items = await db.users.find(q, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(limit)
    return {"count": len(items), "items": items}


class RoleUpdate(BaseModel):
    role: str = Field(pattern="^(user|admin)$")


@router.patch("/users/{user_id}/role")
async def update_role(user_id: str, body: RoleUpdate, _: dict = Depends(require_admin)):
    res = await get_db().users.update_one({"user_id": user_id}, {"$set": {"role": body.role}})
    if not res.matched_count:
        raise HTTPException(404, "User not found")
    return {"ok": True, "user_id": user_id, "role": body.role}


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, _: dict = Depends(require_admin)):
    res = await get_db().users.delete_one({"user_id": user_id})
    if not res.deleted_count:
        raise HTTPException(404, "User not found")
    return {"ok": True}


# ---------------- Activity ---------------- #
@router.get("/activity")
async def list_activity(_: dict = Depends(require_admin), limit: int = 200, user_id: Optional[str] = None, type: Optional[str] = None):
    db = get_db()
    q = {}
    if user_id:
        q["user_id"] = user_id
    if type:
        q["type"] = type
    items = await db.activity.find(q, {"_id": 0}).sort("at", -1).to_list(limit)
    return {"count": len(items), "items": items}


# ---------------- Content (motivations, disclaimers, quotes) ---------------- #
class ContentDoc(BaseModel):
    key: str
    value: str


@router.get("/content")
async def list_content(_: dict = Depends(require_admin)):
    items = await get_db().content.find({}, {"_id": 0}).to_list(200)
    return {"items": items}


@router.put("/content/{key}")
async def upsert_content(key: str, body: ContentDoc, current: dict = Depends(require_admin)):
    doc = {"key": key, "value": body.value, "updated_at": datetime.now(timezone.utc).isoformat(), "updated_by": current["user_id"]}
    await get_db().content.update_one({"key": key}, {"$set": doc}, upsert=True)
    return doc


# ---------------- Prompts (system prompts for Quest AI) ---------------- #
class PromptDoc(BaseModel):
    key: str
    body: str
    model: Optional[str] = "anthropic/claude-sonnet-4-6"


@router.get("/prompts")
async def list_prompts(_: dict = Depends(require_admin)):
    items = await get_db().prompts.find({}, {"_id": 0}).to_list(200)
    return {"items": items}


@router.put("/prompts/{key}")
async def upsert_prompt(key: str, body: PromptDoc, current: dict = Depends(require_admin)):
    doc = {"key": key, "body": body.body, "model": body.model, "updated_at": datetime.now(timezone.utc).isoformat(), "updated_by": current["user_id"]}
    await get_db().prompts.update_one({"key": key}, {"$set": doc}, upsert=True)
    return doc


# ---------------- Subscriptions / Payments ---------------- #
@router.get("/subscriptions")
async def list_subs(_: dict = Depends(require_admin), limit: int = 200):
    items = await get_db().subscription_sessions.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"count": len(items), "items": items}


@router.get("/quests")
async def list_quests(_: dict = Depends(require_admin), limit: int = 200):
    items = await get_db().quest_history.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"count": len(items), "items": items}


# ---------------- Content seeding ---------------- #
DEFAULT_CONTENT = [
    {"key": "hero_headline", "value": "Unlocking every hidden truth."},
    {"key": "hero_sub", "value": "FATELYN blends ancient Vedic wisdom with modern AI to help you reflect, plan and live with clarity — never fear."},
    {"key": "motivation_of_day", "value": "You don't need a full plan — you need the next honest step."},
    {"key": "disclaimer", "value": "For guidance & self-reflection only — not a substitute for professional advice."},
]

DEFAULT_PROMPTS = [
    {
        "key": "quest_system",
        "body": (
            "You are FATELYN — a warm, modern Vedic-astrology-inspired guide. "
            "Give short (90–140 words), motivational, self-reflective guidance based on the seeker's question. "
            "Reference general Vedic concepts (planets, houses, nakshatras) tastefully. "
            "Never give medical, legal, or deterministic predictions. "
            "Always end with one gentle, actionable reflection prompt. "
            "Tone: premium, editorial, lifestyle-motivation focused."
        ),
        "model": "anthropic/claude-sonnet-4-6",
    }
]


async def seed_defaults():
    db = get_db()
    for c in DEFAULT_CONTENT:
        await db.content.update_one({"key": c["key"]}, {"$setOnInsert": c}, upsert=True)
    for p in DEFAULT_PROMPTS:
        await db.prompts.update_one({"key": p["key"]}, {"$setOnInsert": p}, upsert=True)
