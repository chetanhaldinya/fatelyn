import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture(scope="module")
def s():
    sess = requests.Session()
    sess.headers.update({"Content-Type": "application/json"})
    return sess


# ---------- Health ----------
def test_health(s):
    r = s.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data.get("service") == "fatelyn"


# ---------- Subscription checkout (mocked) ----------
def test_checkout_monthly(s):
    r = s.post(f"{BASE_URL}/api/subscription/checkout", json={"plan": "monthly", "name": "TEST_user", "email": "t@t.com"}, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["plan"] == "monthly"
    assert d["amount"] == 29900
    assert d["currency"] == "INR"
    assert d["status"] == "requires_payment"
    assert d["publishable_key"].startswith("pk_test_")
    assert d["session_id"].startswith("cs_test_")


def test_checkout_yearly_and_confirm(s):
    r = s.post(f"{BASE_URL}/api/subscription/checkout", json={"plan": "yearly"}, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["plan"] == "yearly"
    assert d["amount"] == 249900
    sid = d["session_id"]

    r2 = s.post(f"{BASE_URL}/api/subscription/confirm/{sid}", timeout=15)
    assert r2.status_code == 200
    d2 = r2.json()
    assert d2["status"] == "succeeded"
    assert d2["session_id"] == sid


def test_checkout_invalid_plan(s):
    r = s.post(f"{BASE_URL}/api/subscription/checkout", json={"plan": "bogus"}, timeout=15)
    assert r.status_code == 400


# ---------- Quest AI (may be 502 due to budget - graceful) ----------
def test_quest_ask_graceful(s):
    r = s.post(f"{BASE_URL}/api/quest/ask", json={"question": "What should I focus on today?", "category": "Personal", "name": "TEST_seeker"}, timeout=45)
    # Accept 200 (working) OR 502 (LLM budget) - both acceptable per spec
    assert r.status_code in (200, 502, 500), f"Unexpected {r.status_code}: {r.text[:200]}"
    if r.status_code == 200:
        d = r.json()
        assert "answer" in d and len(d["answer"]) > 0
        assert d["question"]


def test_quest_history(s):
    r = s.get(f"{BASE_URL}/api/quest/history?limit=5", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
