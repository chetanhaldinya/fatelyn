// Static mock data for FATELYN prototype screens.
// Real values come from Flutter dev's astrology engine — this is UI reference only.

export const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_b8a82c54-1400-4535-8649-47c798b49148/artifacts/e9dj2psu_Fatelyn%20Logo.png";

export const IMG = {
  cosmic: [
    "https://images.unsplash.com/photo-1706800696671-570820e7ff39?crop=entropy&cs=srgb&fm=jpg&w=1080&q=85",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?crop=entropy&cs=srgb&fm=jpg&w=1080&q=85",
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?crop=entropy&cs=srgb&fm=jpg&w=1080&q=85",
    "https://images.unsplash.com/photo-1595088402198-24d44e48d57c?crop=entropy&cs=srgb&fm=jpg&w=1080&q=85",
  ],
  compass: [
    "https://images.unsplash.com/photo-1501139083538-0139583c060f?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
  ],
  lifestyle: [
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1474418397713-7ede21d49118?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
  ],
  friends: [
    "https://images.unsplash.com/photo-1536010305525-f7aa0834e2c7?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1511988617509-a57c8a288659?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1543807535-eceef0bc6599?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
  ],
  journal: [
    "https://images.unsplash.com/photo-1517842645767-c639042777db?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
    "https://images.unsplash.com/photo-1455390582262-044cdead2708?crop=entropy&cs=srgb&fm=jpg&w=800&q=85",
  ],
};

export const ONBOARDING = [
  { title: "The Stars Guide Your Story", body: "Ancient Vedic wisdom translated for modern life — clear, honest, actionable." },
  { title: "Your Chart, Your Compass", body: "See how planetary transits shape your career, love, and inner growth." },
  { title: "Motivation, Not Prediction", body: "Fatelyn helps you reflect — never dictates fate. You choose the next step." },
  { title: "Unlock Every Hidden Truth", body: "Compatibility, milestones, yearly outlook & AI guidance — all in one place." },
];

export const DASH_QUICK = [
  { key: "chart", label: "My Chart", sub: "Birth · Divisional · Dasha" },
  { key: "compat", label: "Compatibility", sub: "Friends · Family · Love" },
  { key: "quest", label: "Ask Fatelyn", sub: "AI Guidance · Q&A" },
  { key: "year", label: "Plan the Year", sub: "12-month outlook" },
];

export const FRIENDS = [
  { name: "Ananya", handle: "@ananya", sign: "Pisces", asc: "Cancer", score: 82, quote: "Steady & nurturing bond" },
  { name: "Vikram", handle: "@vikram", sign: "Leo", asc: "Aries", score: 74, quote: "Ambitious counterpart" },
  { name: "Riya", handle: "@riya.k", sign: "Gemini", asc: "Libra", score: 68, quote: "Curious & bright" },
  { name: "Aarav", handle: "@aarav", sign: "Scorpio", asc: "Virgo", score: 91, quote: "Deep, loyal alignment" },
];

export const COMPAT_METRICS = [
  { label: "Respect & Admiration", value: 82 },
  { label: "Harmony & Influence", value: 74 },
  { label: "Mutual Benefit", value: 68 },
  { label: "Trust & Nurture", value: 88 },
  { label: "Happiness & Luck", value: 79 },
  { label: "Mood & Emotions", value: 72 },
];

export const MILESTONES = [
  { date: "Nov 12, 2026", category: "Career", title: "Landed first freelance client", note: "Jupiter transit through 10th house — huge career opening." },
  { date: "Sep 04, 2026", category: "Mood", title: "First real week of calm", note: "Moon peaceful in Taurus." },
  { date: "Jun 21, 2026", category: "Family", title: "Moved into new apartment", note: "Venus in 4th — home matters bloom." },
  { date: "Mar 08, 2026", category: "Education", title: "Completed Vedic astrology 101", note: "Mercury alignment favoured learning." },
];

export const QUEST_SEEDS = {
  Personal: [
    "Am I letting my emotions cloud my judgment?",
    "How do I become a better version of myself?",
    "Do I need to find purpose in my life?",
    "Am I intuitive by nature?",
  ],
  Career: [
    "Is this the right time to switch jobs?",
    "Will my current project succeed?",
    "Which field aligns with my chart?",
  ],
  Relation: [
    "Is this relationship worth pursuing?",
    "How do I communicate better with my partner?",
    "What does my family need from me right now?",
  ],
  Other: ["When should I start something new?", "What's blocking my growth?"],
};

export const PANCHANG = {
  date: "Sunday, Dec 07, 2026",
  sunrise: "07:04",
  sunset: "17:32",
  moonrise: "22:48",
  moonset: "10:16",
  tithi: "Krishna Paksha · Panchami",
  nakshatra: "Ashlesha",
  yog: "Vyatipata",
  karan: "Kaulava",
  moonPhase: "Waning Gibbous",
};

export const CHAUGHADIYA = [
  { name: "Udveg", time: "07:04 – 08:30", type: "B" },
  { name: "Chal", time: "08:30 – 09:55", type: "N" },
  { name: "Labh", time: "09:55 – 11:21", type: "G" },
  { name: "Amrit", time: "11:21 – 12:47", type: "G" },
  { name: "Kaal", time: "12:47 – 14:13", type: "B" },
  { name: "Shubh", time: "14:13 – 15:38", type: "G" },
];

export const YEARLY_MONTHS = [
  { month: "Jan 2027", theme: "Reset & Reflection", house: "12th House · Solitude", body: "Saturn asks you to slow down. Journal daily; big decisions can wait." },
  { month: "Feb 2027", theme: "Partnership Focus", house: "7th House · Relationships", body: "Venus in your 7th brings clarity in bonds — old wounds surface to heal." },
  { month: "Mar 2027", theme: "Career Momentum", house: "10th House · Public Life", body: "Jupiter expands visibility. Ask for what you deserve." },
  { month: "Apr 2027", theme: "Financial Grounding", house: "2nd House · Wealth", body: "Budget with warmth. Small habits compound." },
  { month: "May 2027", theme: "Voice & Learning", house: "3rd House · Communication", body: "Mercury supports courses, writing, sibling ties." },
  { month: "Jun 2027", theme: "Home & Roots", house: "4th House · Family", body: "A comforting month — nest, cook, call your parents." },
];

export const PLANETS = [
  { name: "Sun", deg: "22° 14'", sign: "Sagittarius", nak: "Uttara Ashadha", house: 6, retro: false },
  { name: "Moon", deg: "08° 31'", sign: "Cancer", nak: "Pushya", house: 1, retro: false },
  { name: "Mars", deg: "15° 47'", sign: "Aquarius", nak: "Shatabhisha", house: 8, retro: false },
  { name: "Mercury", deg: "02° 08'", sign: "Capricorn", nak: "Uttara Ashadha", house: 7, retro: true },
  { name: "Jupiter", deg: "28° 55'", sign: "Taurus", nak: "Mrigashira", house: 11, retro: false },
  { name: "Venus", deg: "11° 22'", sign: "Scorpio", nak: "Anuradha", house: 5, retro: false },
  { name: "Saturn", deg: "05° 40'", sign: "Aquarius", nak: "Dhanishta", house: 8, retro: false },
];

export const STONES = [
  { stone: "Pearl", planet: "Moon", finger: "Little", carat: "5–7", metal: "Silver", day: "Monday" },
  { stone: "Yellow Sapphire", planet: "Jupiter", finger: "Index", carat: "3–5", metal: "Gold", day: "Thursday" },
  { stone: "Red Coral", planet: "Mars", finger: "Ring", carat: "6–9", metal: "Copper", day: "Tuesday" },
];

export const PLANS = [
  {
    key: "free",
    name: "Explorer",
    price: "₹0",
    period: "forever",
    features: ["Birth chart & basics", "3 Quest questions / month", "Daily panchang", "1 compatibility match"],
    cta: "Current Plan",
  },
  {
    key: "monthly",
    name: "Seeker",
    price: "₹299",
    period: "per month",
    features: ["Unlimited Quest AI", "15 compatibility reports", "Full dasha & ashtakvarga", "Milestone tracker"],
    cta: "Choose Seeker",
    highlight: false,
  },
  {
    key: "yearly",
    name: "Luminary",
    price: "₹2,499",
    period: "per year",
    features: ["Everything in Seeker", "Yearly outlook report", "Priority AI answers", "Save ₹1,089 vs monthly"],
    cta: "Go Luminary",
    highlight: true,
  },
];
