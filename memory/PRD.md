# FATELYN — PRD

## Original problem statement
Ek Vedic astrology + lifestyle motivation full-stack app. Started as an HTML clickable prototype (Figma-style handoff), then evolved into a live app with real auth, real astrology engine, and an admin panel. User's ultimate ambition: same brand on web + Expo React Native mobile (mobile Agent flow — deferred to next session).

## Architecture
### Backend — `/app/backend` (FastAPI + MongoDB, modular)
- `server.py` — main app, wires all routers, quest AI (Emergent LLM · Claude Sonnet 4.6), subscription sandbox, activity logger, profile/birth
- `auth.py` — JWT (bcrypt + PyJWT) email/password + Emergent Google Auth (upsert same user record) + admin seeding + brute-force lockout (email-only, global across pods)
- `astro.py` — Vedic astrology engine using `pyswisseph` (Lahiri sidereal). Endpoints: `/api/astro/chart`, `/api/astro/panchang`, `/api/astro/dasha`, `/api/astro/gochar`
- `admin.py` — admin endpoints: dashboard stats, users CRUD/role, activity log, content CMS, prompt CMS, subscriptions, quest log
- `db.py` — Motor client singleton

### Frontend — `/app/frontend/src`
- `App.js` — routes: `/`, `/prototype`, `/showcase`, `/login`, `/signup`, `/dashboard` (protected), `/admin` (admin only). Wrapped in `AuthProvider`.
- `lib/AuthContext.jsx` — cookies-based auth state (`/auth/me` on mount)
- `lib/ProtectedRoute.jsx` — auth + role guard
- `lib/api.js` — axios instance with `withCredentials`
- `pages/Landing.jsx`, `pages/AppPrototype.jsx`, `pages/Showcase.jsx` — public marketing/design pages
- `pages/Login.jsx`, `pages/Signup.jsx`, `pages/AuthCallback.jsx` — auth flows
- `pages/UserDashboard.jsx` — live chart + dasha + panchang from swiss-ephemeris
- `pages/AdminPanel.jsx` — 7 tabs with Recharts dashboard
- `components/PhoneFrame.jsx`, `components/screens.jsx` — reusable mobile-app-styled screen library
- `data/mockData.js` — content/copy constants

## User personas
- **Chetan (seeker)**: 25-45 y/o lifestyle user, uses Quest AI + charts
- **Fatelyn Admin**: manages content, prompts, monitors activity & revenue
- **Flutter/Expo Dev**: uses `/showcase` + `/prototype` as visual spec

## Core requirements (locked in)
- Cookie-based JWT auth (httpOnly, secure, samesite=none for cross-site preview)
- Admin role gate on `/admin` UI and `/api/admin/*` endpoints
- Live-editable AI prompts and content strings (no redeploy)
- Store-approval-safe copy — every insight has "guidance & self-reflection only" disclaimer

## What's been implemented
### Iteration 1 (initial)
- Landing page + 15-screen HTML prototype + all-screens showcase gallery
- Mocked backend for quest AI + sandbox subscription
- Design system in `/app/design_guidelines.json`

### Iteration 2 (this session — Dec 2026)
- Real JWT email/password auth + Emergent Google login (dual-mode, same user table)
- Brute-force lockout (email-only, 5 attempts / 15 min)
- Idempotent admin seeder on startup (`admin@fatelyn.app`)
- Swiss-ephemeris astrology engine (chart, panchang, dasha, gochar) with Lahiri ayanamsa
- User `/dashboard` with real computed chart + panchang side card
- Admin `/admin` with 7 tabs: Dashboard (Recharts area+bar+pie), Users, Activity, Content CMS, Prompt CMS, Subscriptions, Quest Log
- Testing agent: **100% pass** on 18/18 backend tests + all frontend flows

### Test credentials (see `/app/memory/test_credentials.md`)
- Admin: `admin@fatelyn.app` / `fatelyn@admin2026`

## Prioritised backlog
### P0
- **Top up Universal LLM Key** so Quest AI returns real answers (currently 502 due to exhausted budget)
- **Mobile app (Expo React Native)** — switch to Emergent Mobile Agent in next session

### P1
- Replace mocked `/api/subscription/*` with real Razorpay (INR) or Stripe live
- Email verification + password reset flow (Resend integration)
- Persist `birth_details` per-user is done; add multiple profiles (self + family/friends)
- Compatibility algo using both users' swiss-ephemeris charts
- Divisional charts D2–D60 endpoints

### P2
- Hindi language toggle content (i18n)
- Push notifications for panchang / muhurta reminders
- Share-to-social compatibility cards (revenue lever)
- Referral system + credits

## Next tasks (immediate)
1. Ask user to top up LLM key balance
2. When user is ready → move to Mobile Agent for Expo React Native mobile app
3. Add Razorpay real payments (recommended for India users)
