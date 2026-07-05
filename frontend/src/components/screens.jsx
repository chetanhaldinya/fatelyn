import React, { useState } from "react";
import axios from "axios";
import {
  CompassMark,
  TopBar,
  BottomNav,
  ChevronRight,
  Search,
  Disclaimer,
  BirthChartSVG,
} from "./PhoneFrame";
import {
  ONBOARDING,
  DASH_QUICK,
  FRIENDS,
  COMPAT_METRICS,
  MILESTONES,
  QUEST_SEEDS,
  PANCHANG,
  CHAUGHADIYA,
  YEARLY_MONTHS,
  PLANETS,
  STONES,
  PLANS,
  LOGO_URL,
  IMG,
} from "../data/mockData";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// =============== SPLASH =============== //
export function SplashScreen({ go }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 relative stars">
      <div className="float-3d mb-6 relative">
        <div className="absolute inset-0 rounded-full blur-3xl bg-[#d4a853]/30 -z-10" />
        <img src={LOGO_URL} alt="Fatelyn" className="w-40 h-40 object-contain" />
      </div>
      <div className="font-serif-lux text-4xl text-gold tracking-wide">FATELYN</div>
      <div className="mt-2 text-xs uppercase tracking-[0.35em] text-[#f4d68c]/80">
        Unlocking Every Hidden Truth
      </div>
      <button
        onClick={() => go("intro1")}
        className="btn-gold mt-10"
        data-testid="splash-continue-btn"
      >
        Begin the Journey
      </button>
      <Disclaimer />
    </div>
  );
}

// =============== ONBOARDING =============== //
export function OnboardingScreen({ go }) {
  const [i, setI] = useState(0);
  const item = ONBOARDING[i];
  return (
    <div className="h-full flex flex-col relative stars">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <img
          src={IMG.cosmic[i % IMG.cosmic.length]}
          alt=""
          className="w-56 h-56 rounded-3xl object-cover mb-6 border border-[#d4a853]/30 shadow-2xl"
        />
        <h2 className="font-serif-lux text-2xl text-gold px-2">{item.title}</h2>
        <p className="text-sm text-[#e0e0e0] mt-3 leading-relaxed">{item.body}</p>
      </div>
      <div className="flex justify-center gap-1.5 my-4">
        {ONBOARDING.map((_, idx) => (
          <span
            key={idx}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-6 bg-[#d4a853]" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>
      <div className="flex gap-3 px-2 pb-2">
        <button className="btn-outline-gold flex-1" onClick={() => go("auth")} data-testid="onboarding-skip-btn">
          Skip
        </button>
        <button
          className="btn-gold flex-1"
          onClick={() => (i < ONBOARDING.length - 1 ? setI(i + 1) : go("signupBasic"))}
          data-testid="onboarding-next-btn"
        >
          {i < ONBOARDING.length - 1 ? "Next" : "Get Started"}
        </button>
      </div>
    </div>
  );
}

// =============== AUTH =============== //
export function AuthScreen({ go }) {
  return (
    <div className="h-full flex flex-col relative stars px-2">
      <div className="flex flex-col items-center pt-4">
        <CompassMark size={64} />
        <h2 className="font-serif-lux text-3xl text-gold mt-3">Welcome back</h2>
        <p className="text-xs text-[#a0a0a0] mt-1">Sign in to continue your journey</p>
      </div>
      <div className="glass mt-8 p-5 space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Email or phone</label>
          <input
            className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-white text-sm"
            placeholder="you@example.com"
            data-testid="auth-email-input"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Password</label>
          <input
            type="password"
            className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-white text-sm"
            placeholder="••••••••"
            data-testid="auth-password-input"
          />
        </div>
        <button className="btn-gold w-full" onClick={() => go("birthDetails")} data-testid="auth-login-btn">
          Login
        </button>
        <div className="text-center text-[11px] text-[#f4d68c]">Forgot password?</div>
      </div>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[10px] uppercase tracking-widest text-[#a0a0a0]">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-outline-gold text-sm" data-testid="auth-google-btn">Google</button>
        <button className="btn-outline-gold text-sm" data-testid="auth-apple-btn">Apple</button>
      </div>
      <p className="text-center text-xs text-[#a0a0a0] mt-6">
        New here? <span className="text-[#f4d68c]">Create account</span>
      </p>
    </div>
  );
}

// =============== BIRTH DETAILS =============== //
export function BirthDetailsScreen({ go }) {
  return (
    <div className="relative stars">
      <TopBar title="Birth Details" onBack={() => go("auth")} />
      <p className="text-xs text-[#a0a0a0] mb-4">These stay private — used only for your chart.</p>
      <div className="space-y-4">
        {[
          { l: "Full Name", ph: "Enter name", id: "name" },
          { l: "Date of Birth", ph: "Dec 07, 2001", id: "dob" },
          { l: "Time of Birth", ph: "22:38", id: "tob" },
          { l: "Birthplace", ph: "City, Country", id: "place" },
        ].map((f) => (
          <div key={f.id} className="glass p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">{f.l}</div>
            <input
              className="w-full bg-transparent outline-none text-white mt-1 text-sm"
              placeholder={f.ph}
              data-testid={`birth-${f.id}-input`}
            />
          </div>
        ))}
        <div className="glass p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Gender</div>
            <div className="flex gap-2 mt-2">
              {["Female", "Male", "Other"].map((g) => (
                <button
                  key={g}
                  className="tab-pill"
                  data-testid={`gender-${g.toLowerCase()}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button className="btn-gold w-full mt-6" onClick={() => go("dashboard")} data-testid="birth-continue-btn">
        Reveal My Chart
      </button>
      <Disclaimer />
    </div>
  );
}

// =============== DASHBOARD =============== //
export function DashboardScreen({ go }) {
  return (
    <div className="relative stars pb-16">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] text-[#a0a0a0]">Namaste, Chetan</div>
          <div className="font-serif-lux text-xl text-gold">Sunday · Dec 07</div>
        </div>
        <button
          onClick={() => go("settings")}
          className="w-10 h-10 rounded-full border border-[#d4a853]/40 flex items-center justify-center overflow-hidden"
          data-testid="dashboard-profile-btn"
        >
          <img src={LOGO_URL} alt="" className="w-6 h-6" />
        </button>
      </div>

      {/* Cosmic snapshot */}
      <div className="glass glass-gold p-4 mb-4 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 spin-slow opacity-20">
          <img src={LOGO_URL} alt="" className="w-24 h-24" />
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Today's Sky</div>
        <div className="font-serif-lux text-2xl text-white mt-1">
          Moon in Cancer · <span className="text-gold">Waning</span>
        </div>
        <p className="text-xs text-[#e0e0e0] mt-2 leading-relaxed">
          A soft, introspective day. Journal your feelings — clarity arrives after quiet.
        </p>
      </div>

      {/* Insight of the day */}
      <div className="glass p-4 mb-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Insight of the Day</div>
        <p className="text-sm text-white mt-2 leading-relaxed">
          "You don't need a full plan — you need the next honest step. The stars support movement, not perfection."
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        {DASH_QUICK.map((q) => (
          <button
            key={q.key}
            onClick={() =>
              go(
                q.key === "chart"
                  ? "chart"
                  : q.key === "compat"
                  ? "friends"
                  : q.key === "quest"
                  ? "quest"
                  : "yearly"
              )
            }
            className="glass p-3 text-left hover:glass-gold transition"
            data-testid={`dash-quick-${q.key}`}
          >
            <div className="font-serif-lux text-lg text-gold">{q.label}</div>
            <div className="text-[10px] text-[#a0a0a0] mt-1">{q.sub}</div>
          </button>
        ))}
      </div>

      {/* Motivation */}
      <div className="mt-4 rounded-2xl overflow-hidden relative">
        <img src={IMG.lifestyle[0]} alt="" className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#f4d68c]">Motivation</div>
          <div className="font-serif-lux text-lg text-white">Move gently, arrive certainly.</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={() => go("milestone")} className="glass p-3 text-left" data-testid="dash-milestone-btn">
          <div className="font-serif-lux text-base text-gold">Log a Milestone</div>
          <div className="text-[10px] text-[#a0a0a0]">Track events, notice patterns</div>
        </button>
        <button onClick={() => go("gochar")} className="glass p-3 text-left" data-testid="dash-gochar-btn">
          <div className="font-serif-lux text-base text-gold">Gochar / Panchang</div>
          <div className="text-[10px] text-[#a0a0a0]">Today's timings</div>
        </button>
      </div>

      <button
        onClick={() => go("subscription")}
        className="w-full mt-4 rounded-2xl p-3 border border-[#d4a853]/50 bg-gradient-to-r from-[#d4a853]/20 to-transparent flex items-center justify-between"
        data-testid="dash-subscribe-btn"
      >
        <div>
          <div className="text-xs text-[#f4d68c] uppercase tracking-[0.2em]">Unlock Luminary</div>
          <div className="font-serif-lux text-lg text-white">Full year outlook + AI Quest</div>
        </div>
        <ChevronRight />
      </button>

      <Disclaimer />
      <BottomNav active="dashboard" onNav={go} />
    </div>
  );
}

// =============== MY CHART =============== //
export function ChartScreen({ go }) {
  const [tab, setTab] = useState("Chart");
  const tabs = ["Chart", "Dasha", "Planets", "Ashtakvarga", "Rajyog", "Dosh", "Stones", "Sade Sati"];
  return (
    <div className="relative pb-16">
      <TopBar title="My Chart" onBack={() => go("dashboard")} />
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-2 px-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-pill ${tab === t ? "active" : ""}`}
            data-testid={`chart-tab-${t.toLowerCase().replace(/\s/g, "-")}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Chart" && (
        <>
          <BirthChartSVG />
          <div className="glass p-4 mt-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">D1 · Birth Chart (Lagna)</div>
            <p className="text-xs text-[#e0e0e0] mt-2 leading-relaxed">
              Moon in Cancer for a Cancer Ascendant intensifies emotional intelligence.
              Your inner life is your compass — safeguard your quiet time.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button onClick={() => go("astroDetails")} className="glass p-3 text-left" data-testid="chart-open-astro"><div className="font-serif-lux text-sm text-gold">Astro Details</div><div className="text-[9px] text-[#a0a0a0]">Varna · Yoni · Gana …</div></button>
            <button onClick={() => go("birthTable")} className="glass p-3 text-left" data-testid="chart-open-birth"><div className="font-serif-lux text-sm text-gold">Birth Details</div><div className="text-[9px] text-[#a0a0a0]">Raw natal data</div></button>
            <button onClick={() => go("divCharts")} className="glass p-3 text-left" data-testid="chart-open-div"><div className="font-serif-lux text-sm text-gold">D1 – D60 Charts</div><div className="text-[9px] text-[#a0a0a0]">Divisional charts</div></button>
            <button onClick={() => go("sarva")} className="glass p-3 text-left" data-testid="chart-open-sarva"><div className="font-serif-lux text-sm text-gold">Sarvashtakvarga</div><div className="text-[9px] text-[#a0a0a0]">Table & chart</div></button>
            <button onClick={() => go("dashaPro")} className="glass p-3 text-left" data-testid="chart-open-dasha"><div className="font-serif-lux text-sm text-gold">Vimshottari Dasha</div><div className="text-[9px] text-[#a0a0a0]">Maha · Antar · Praty</div></button>
            <button onClick={() => go("sadeSati")} className="glass p-3 text-left" data-testid="chart-open-sadesati"><div className="font-serif-lux text-sm text-gold">Sade Sati</div><div className="text-[9px] text-[#a0a0a0]">3 phases</div></button>
          </div>
        </>
      )}

      {tab === "Planets" && (
        <div className="glass overflow-hidden">
          <div className="grid grid-cols-5 text-[9px] uppercase tracking-widest text-[#a0a0a0] px-3 py-2 bg-white/[0.03]">
            <div>Planet</div><div>Sign</div><div>Deg</div><div>House</div><div>Nak</div>
          </div>
          {PLANETS.map((p) => (
            <div key={p.name} className="grid grid-cols-5 text-[11px] px-3 py-2 border-t border-white/5">
              <div className="text-[#f4d68c]">{p.name}{p.retro && "ʀ"}</div>
              <div>{p.sign}</div>
              <div>{p.deg}</div>
              <div>{p.house}</div>
              <div className="text-[#a0a0a0]">{p.nak}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "Dasha" && (
        <div className="space-y-3">
          <div className="glass p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Vimshottari · Current</div>
            <div className="mt-2 text-sm">
              <div className="flex justify-between"><span>Maha Dasha</span><span className="text-[#f4d68c]">Rahu</span></div>
              <div className="flex justify-between mt-1"><span>Antardasha</span><span className="text-[#f4d68c]">Saturn</span></div>
              <div className="flex justify-between mt-1"><span>Pratyantar</span><span className="text-[#f4d68c]">Jupiter</span></div>
              <div className="flex justify-between mt-2 text-[10px] text-[#a0a0a0]"><span>Ends</span><span>Aug 14, 2028</span></div>
            </div>
          </div>
          {["Sun MD (Jan 26 – Jan 32)", "Moon MD (Jan 32 – Jan 42)", "Mars MD (Jan 42 – Jan 49)"].map((s) => (
            <div key={s} className="glass p-3 flex justify-between text-xs">
              <span>{s}</span><ChevronRight />
            </div>
          ))}
        </div>
      )}

      {tab === "Ashtakvarga" && (
        <div className="glass p-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Sarvashtakvarga totals</div>
          <div className="grid grid-cols-6 gap-2 text-[11px] mt-3">
            {[28, 34, 22, 31, 39, 27, 25, 33, 30, 26, 29, 32].map((v, i) => (
              <div key={i} className="glass p-2 text-center">
                <div className="text-[9px] text-[#a0a0a0]">H{i + 1}</div>
                <div className="text-[#f4d68c] font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Stones" && (
        <div className="space-y-2">
          {STONES.map((s) => (
            <div key={s.stone} className="glass p-3 flex justify-between items-center">
              <div>
                <div className="font-serif-lux text-lg text-gold">{s.stone}</div>
                <div className="text-[10px] text-[#a0a0a0]">{s.planet} · {s.day}</div>
              </div>
              <div className="text-right text-[11px]">
                <div>{s.finger} finger</div>
                <div className="text-[#a0a0a0]">{s.carat} ct · {s.metal}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Rajyog" && (
        <div className="glass p-4">
          <div className="text-sm text-[#e0e0e0] mb-3">Active auspicious combinations detected in your chart.</div>
          {["Shash Mahapurush · Active", "Gaja Kesari · Partial", "Neech Bhang · Inactive"].map((r) => (
            <div key={r} className="flex justify-between text-xs py-2 border-b border-white/5">
              <span>{r.split("·")[0]}</span>
              <span className="text-[#f4d68c]">{r.split("·")[1]}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Dosh" && (
        <div className="glass p-4 space-y-2 text-xs">
          {["Mangal", "Kaal Sarp", "Pitra", "Kemdrum", "Guru Chandal"].map((d) => (
            <div key={d} className="flex justify-between border-b border-white/5 py-2">
              <span>{d}</span><span className="text-[#a0a0a0]">Not present</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Sade Sati" && (
        <div className="glass p-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Status</div>
          <div className="font-serif-lux text-xl text-white mt-1">Currently not in Sade Sati</div>
          <p className="text-xs text-[#e0e0e0] mt-3 leading-relaxed">
            Sade Sati is Saturn's 7½-year transit over the moon sign. Yours next begins around 2029.
          </p>
        </div>
      )}

      <Disclaimer />
      <BottomNav active="chart" onNav={go} />
    </div>
  );
}

// =============== FRIENDS =============== //
export function FriendsScreen({ go }) {
  return (
    <div className="relative pb-16">
      <TopBar
        title="Friends"
        onBack={() => go("dashboard")}
        right={<button data-testid="friends-add-btn"><Search /></button>}
      />
      <div className="glass p-3 flex items-center gap-2 mb-4">
        <Search />
        <input className="bg-transparent outline-none text-sm w-full" placeholder="Search by name or handle" data-testid="friends-search-input" />
      </div>
      <div className="space-y-3">
        {FRIENDS.map((f, i) => (
          <button
            key={f.handle}
            onClick={() => go("compatIntro")}
            className="w-full glass p-3 flex items-center gap-3 text-left"
            data-testid={`friend-item-${i}`}
          >
            <img src={IMG.friends[i % IMG.friends.length]} alt="" className="w-11 h-11 rounded-full object-cover" />
            <div className="flex-1">
              <div className="text-sm text-white">{f.name} <span className="text-[#a0a0a0] text-[10px]">{f.handle}</span></div>
              <div className="text-[11px] text-[#e0e0e0]">{f.quote}</div>
              <div className="text-[10px] text-[#f4d68c] mt-0.5">{f.sign} · Asc {f.asc}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-serif-lux text-gold">{f.score}%</div>
              <div className="text-[9px] text-[#a0a0a0]">match</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-5 glass p-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Add Friends</div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {["From Contacts", "By Username", "From Social", "Manual (Compat)"].map((a) => (
            <button key={a} className="tab-pill" data-testid={`friends-add-${a.split(" ")[0].toLowerCase()}`}>{a}</button>
          ))}
        </div>
      </div>
      <BottomNav active="friends" onNav={go} />
    </div>
  );
}

// =============== COMPATIBILITY DETAIL =============== //
export function CompatScreen({ go }) {
  return (
    <div className="relative pb-4">
      <TopBar title="Compatibility" onBack={() => go("friends")} />
      <div className="glass glass-gold p-4 mb-4 flex items-center gap-3">
        <img src={IMG.friends[3]} alt="" className="w-14 h-14 rounded-full object-cover border border-[#d4a853]/40" />
        <div>
          <div className="font-serif-lux text-xl text-gold">You & Aarav</div>
          <div className="text-[11px] text-[#a0a0a0]">Cancer Asc · Scorpio Asc Virgo</div>
        </div>
        <div className="ml-auto text-right">
          <div className="font-serif-lux text-3xl text-gold">91%</div>
          <div className="text-[9px] text-[#a0a0a0]">deep bond</div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-2 px-2">
        {["Alignment", "Match", "Opportunity", "Current", "Birth"].map((t) => (
          <button key={t} className={`tab-pill ${t === "Alignment" ? "active" : ""}`} data-testid={`compat-tab-${t.toLowerCase()}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {COMPAT_METRICS.map((m) => (
          <div key={m.label} className="glass p-3">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-[#e0e0e0]">{m.label}</span>
              <span className="text-[#f4d68c]">{m.value}%</span>
            </div>
            <div className="pbar"><span style={{ width: `${m.value}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="glass p-4 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Reflect Upon</div>
        <p className="text-xs text-[#e0e0e0] mt-2 leading-relaxed">
          What ties you two runs deep and quiet. Aarav's Scorpio grit meets your Cancer softness — build rituals of trust,
          not just moments of intensity.
        </p>
      </div>

      <button className="btn-gold w-full mt-4" data-testid="compat-full-report-btn">
        Buy Full Report · ₹310
      </button>
      <Disclaimer />
    </div>
  );
}

// =============== MILESTONE =============== //
export function MilestoneScreen({ go }) {
  const [tab, setTab] = useState("timeline");
  return (
    <div className="relative pb-16">
      <TopBar title="Milestones" onBack={() => go("dashboard")} />
      <div className="flex gap-2 mb-3">
        <button className={`tab-pill ${tab === "timeline" ? "active" : ""}`} onClick={() => setTab("timeline")} data-testid="ms-tab-timeline">Timeline</button>
        <button className={`tab-pill ${tab === "add" ? "active" : ""}`} onClick={() => setTab("add")} data-testid="ms-tab-add">Add New</button>
        <button className={`tab-pill ${tab === "favor" ? "active" : ""}`} onClick={() => setTab("favor")} data-testid="ms-tab-favor">Favourable Time</button>
      </div>

      {tab === "timeline" && (
        <div className="space-y-4 relative">
          <div className="absolute left-[9px] top-1 bottom-1 w-px bg-gradient-to-b from-[#d4a853] to-transparent" />
          {MILESTONES.map((m, i) => (
            <div key={i} className="flex gap-3 relative">
              <div className="w-5 h-5 rounded-full bg-[#d4a853] shadow-[0_0_15px_rgba(212,168,83,0.6)] mt-1 relative z-10" />
              <div className="flex-1 glass p-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#f4d68c]">{m.category} · {m.date}</div>
                <div className="font-serif-lux text-lg text-white mt-1">{m.title}</div>
                <div className="text-[11px] text-[#a0a0a0] mt-1">{m.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "add" && (
        <div className="space-y-3">
          <div className="glass p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Category</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {["Mood", "Education", "Career", "Family", "Love", "Health"].map((c) => (
                <button key={c} className="tab-pill" data-testid={`ms-cat-${c.toLowerCase()}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="glass p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">What happened?</div>
            <textarea rows="3" className="w-full bg-transparent border-b border-white/10 outline-none text-sm text-white mt-2" placeholder="Describe the moment…" data-testid="ms-note-input" />
          </div>
          <div className="glass p-4 flex items-center justify-between">
            <span className="text-sm">Add photo</span><button className="btn-outline-gold text-xs" data-testid="ms-photo-btn">Upload</button>
          </div>
          <button className="btn-gold w-full" data-testid="ms-submit-btn">Save Milestone</button>
        </div>
      )}

      {tab === "favor" && (
        <div className="space-y-2">
          {[
            { n: "Brahma Muhurta", t: "04:31 – 05:19", d: "Deep intention setting" },
            { n: "Abhijit Muhurta", t: "11:53 – 12:42", d: "Signing contracts, launches" },
            { n: "Amrit Kaal", t: "19:14 – 20:41", d: "Auspicious for beginnings" },
          ].map((f) => (
            <div key={f.n} className="glass p-3">
              <div className="flex justify-between">
                <div className="font-serif-lux text-lg text-gold">{f.n}</div>
                <div className="text-[10px] text-[#f4d68c]">{f.t}</div>
              </div>
              <div className="text-[11px] text-[#a0a0a0] mt-1">{f.d}</div>
            </div>
          ))}
        </div>
      )}
      <Disclaimer />
      <BottomNav active="milestone" onNav={go} />
    </div>
  );
}

// =============== QUEST =============== //
export function QuestScreen({ go }) {
  const [cat, setCat] = useState("Personal");
  const [q, setQ] = useState("");
  const [ans, setAns] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = async (question) => {
    setLoading(true);
    setAns(null);
    try {
      const res = await axios.post(`${API}/quest/ask`, {
        question,
        category: cat,
        name: "Chetan",
        zodiac: "Sagittarius",
        ascendant: "Cancer",
      });
      setAns(res.data);
    } catch (e) {
      setAns({ answer: "Fatelyn couldn't reach the stars right now. Try again shortly.", error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative pb-16">
      <TopBar
        title="Quest"
        onBack={() => go("dashboard")}
        right={<button onClick={() => go("questHistory")} className="text-[10px] text-[#f4d68c]" data-testid="quest-history-btn">History</button>}
      />

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-2 px-2">
        {Object.keys(QUEST_SEEDS).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`tab-pill ${cat === c ? "active" : ""}`}
            data-testid={`quest-cat-${c.toLowerCase()}`}
          >
            {c}
          </button>
        ))}
      </div>

      {!ans && !loading && (
        <div className="space-y-2">
          {QUEST_SEEDS[cat].map((s, i) => (
            <button
              key={i}
              onClick={() => { setQ(s); ask(s); }}
              className="glass w-full p-3 text-left text-sm hover:glass-gold transition"
              data-testid={`quest-seed-${i}`}
            >
              {s}
              <ChevronRight />
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="glass glass-gold p-5 text-center">
          <div className="spin-slow mx-auto w-10 h-10 mb-3">
            <img src={LOGO_URL} alt="" className="w-full h-full" />
          </div>
          <div className="text-sm text-[#f4d68c]">Fatelyn is consulting the sky…</div>
        </div>
      )}

      {ans && (
        <div className="glass glass-gold p-4 mt-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Guidance</div>
          <div className="font-serif-lux text-lg text-white mt-2">{q || ans.question}</div>
          <p className="text-sm text-[#e0e0e0] mt-3 leading-relaxed whitespace-pre-wrap">
            {ans.answer}
          </p>
          <div className="flex justify-between items-center mt-4 text-[11px] text-[#a0a0a0]">
            <span>Was this helpful?</span>
            <div className="flex gap-2">
              <button className="tab-pill" data-testid="quest-thumb-up">👍</button>
              <button className="tab-pill" data-testid="quest-thumb-down">👎</button>
            </div>
          </div>
          <button
            className="btn-outline-gold w-full mt-3 text-xs"
            onClick={() => { setAns(null); setQ(""); }}
            data-testid="quest-new-btn"
          >
            Ask another
          </button>
        </div>
      )}

      <div className="glass p-3 mt-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask your own question…"
          className="bg-transparent outline-none text-sm w-full text-white"
          data-testid="quest-custom-input"
        />
        <button
          disabled={!q.trim() || loading}
          onClick={() => ask(q)}
          className="btn-gold text-xs disabled:opacity-40"
          data-testid="quest-ask-btn"
        >
          Ask
        </button>
      </div>
      <Disclaimer />
      <BottomNav active="quest" onNav={go} />
    </div>
  );
}

// =============== GOCHAR / PANCHANG =============== //
export function GocharScreen({ go }) {
  const [tab, setTab] = useState("Panchang");
  const tabs = ["Panchang", "Lagna", "Positions", "Chaughadiya"];
  return (
    <div className="relative pb-4">
      <TopBar title="Gochar" onBack={() => go("dashboard")} />
      <div className="flex gap-2 mb-3">
        {tabs.map((t) => (
          <button key={t} className={`tab-pill ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} data-testid={`gochar-tab-${t.toLowerCase()}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Panchang" && (
        <div className="space-y-2">
          <div className="text-xs text-[#f4d68c] mb-1">{PANCHANG.date}</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Sunrise", PANCHANG.sunrise], ["Sunset", PANCHANG.sunset],
              ["Moonrise", PANCHANG.moonrise], ["Moonset", PANCHANG.moonset],
              ["Tithi", PANCHANG.tithi], ["Nakshatra", PANCHANG.nakshatra],
              ["Yog", PANCHANG.yog], ["Karan", PANCHANG.karan],
            ].map(([k, v]) => (
              <div key={k} className="glass p-3">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">{k}</div>
                <div className="text-sm text-[#f4d68c] mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Positions" && (
        <div className="glass overflow-hidden">
          {PLANETS.map((p) => (
            <div key={p.name} className="grid grid-cols-4 text-[11px] px-3 py-2 border-b border-white/5">
              <div className="text-[#f4d68c]">{p.name}{p.retro && "ʀ"}</div>
              <div>{p.sign}</div>
              <div>{p.deg}</div>
              <div>H{p.house}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "Chaughadiya" && (
        <div className="space-y-2">
          {CHAUGHADIYA.map((c) => (
            <div key={c.name} className="glass p-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-white">{c.name}</div>
                <div className="text-[10px] text-[#a0a0a0]">{c.time}</div>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-[10px] ${
                c.type === "G" ? "bg-green-500/20 text-green-300" :
                c.type === "B" ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white"
              }`}>
                {c.type === "G" ? "Good" : c.type === "B" ? "Avoid" : "Neutral"}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Lagna" && (
        <div className="glass overflow-hidden">
          <div className="grid grid-cols-3 text-[9px] uppercase tracking-widest text-[#a0a0a0] px-3 py-2">
            <div>Lagna</div><div>Starts</div><div>Ends</div>
          </div>
          {["Aries 05:12 06:58","Taurus 06:58 08:52","Gemini 08:52 11:04","Cancer 11:04 13:18","Leo 13:18 15:26","Virgo 15:26 17:34"].map((r,i)=>{
            const [s, a, b] = r.split(" ");
            return (
              <div key={i} className="grid grid-cols-3 text-[11px] px-3 py-2 border-t border-white/5">
                <div className="text-[#f4d68c]">{s}</div><div>{a}</div><div>{b}</div>
              </div>
            );
          })}
        </div>
      )}
      <Disclaimer />
    </div>
  );
}

// =============== YEARLY REPORT =============== //
export function YearlyScreen({ go }) {
  return (
    <div className="relative pb-4">
      <TopBar title="Plan Your Year" onBack={() => go("dashboard")} />
      <div className="glass glass-gold p-4 mb-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">2027 · Cancer Ascendant</div>
        <div className="font-serif-lux text-2xl text-white mt-1">A year of rooted becoming</div>
        <p className="text-xs text-[#e0e0e0] mt-2">Jupiter blesses your 11th house; Saturn asks patience in the 8th.</p>
      </div>
      <div className="space-y-3">
        {YEARLY_MONTHS.map((m) => (
          <div key={m.month} className="glass p-4">
            <div className="flex justify-between items-baseline">
              <div className="font-serif-lux text-lg text-gold">{m.month}</div>
              <div className="text-[10px] text-[#a0a0a0]">{m.house}</div>
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#f4d68c] mt-1">{m.theme}</div>
            <p className="text-xs text-[#e0e0e0] mt-2 leading-relaxed">{m.body}</p>
          </div>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}

// =============== SUBSCRIPTION =============== //
export function SubscriptionScreen({ go }) {
  return (
    <div className="relative pb-4">
      <TopBar title="Subscription" onBack={() => go("dashboard")} />
      <div className="text-center mb-4">
        <div className="font-serif-lux text-3xl text-gold">Unlock the sky</div>
        <p className="text-xs text-[#a0a0a0] mt-1">Cancel anytime · Test sandbox enabled</p>
      </div>
      <div className="space-y-3">
        {PLANS.map((p) => (
          <div
            key={p.key}
            className={`glass p-4 relative ${p.highlight ? "glass-gold" : ""}`}
          >
            {p.highlight && (
              <div className="absolute -top-2 right-3 bg-[#d4a853] text-[#0a0a0f] text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                Best value
              </div>
            )}
            <div className="flex justify-between items-baseline">
              <div className="font-serif-lux text-2xl text-white">{p.name}</div>
              <div>
                <span className="font-serif-lux text-2xl text-gold">{p.price}</span>
                <span className="text-[10px] text-[#a0a0a0] ml-1">{p.period}</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-[11px] text-[#e0e0e0]">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><span className="text-[#f4d68c]">✦</span>{f}</li>
              ))}
            </ul>
            <button
              className={`w-full mt-3 ${p.highlight ? "btn-gold" : "btn-outline-gold"} text-xs`}
              onClick={() => go(p.key === "free" ? "dashboard" : "payment", { plan: p.key })}
              data-testid={`plan-${p.key}-btn`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}

// =============== PAYMENT (sandbox) =============== //
export function PaymentScreen({ go, params }) {
  const plan = params?.plan || "monthly";
  const [step, setStep] = useState("card"); // 'card' | 'processing' | 'success'
  const [session, setSession] = useState(null);
  const [card, setCard] = useState("4242 4242 4242 4242");

  const start = async () => {
    setStep("processing");
    try {
      const res = await axios.post(`${API}/subscription/checkout`, { plan, name: "Chetan", email: "chetan@example.com" });
      setSession(res.data);
      await new Promise((r) => setTimeout(r, 1300));
      await axios.post(`${API}/subscription/confirm/${res.data.session_id}`);
      setStep("success");
    } catch {
      setStep("card");
    }
  };

  const amount = plan === "yearly" ? "₹2,499" : "₹299";

  return (
    <div className="relative pb-4">
      <TopBar title="Checkout" onBack={() => go("subscription")} />

      {step === "card" && (
        <>
          <div className="glass glass-gold p-4 mb-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">You're paying</div>
            <div className="flex justify-between items-baseline mt-1">
              <div className="font-serif-lux text-2xl text-white capitalize">{plan}</div>
              <div className="font-serif-lux text-2xl text-gold">{amount}</div>
            </div>
          </div>
          <div className="glass p-4 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Card number</div>
              <input value={card} onChange={(e) => setCard(e.target.value)} className="w-full bg-transparent outline-none text-white text-sm py-1 border-b border-white/10 focus:border-[#d4a853]" data-testid="pay-card-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Expiry</div>
                <input defaultValue="12/29" className="w-full bg-transparent outline-none text-white text-sm py-1 border-b border-white/10" data-testid="pay-exp-input" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">CVC</div>
                <input defaultValue="123" className="w-full bg-transparent outline-none text-white text-sm py-1 border-b border-white/10" data-testid="pay-cvc-input" />
              </div>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-[#a0a0a0]">
            🔒 Test mode · pk_test_TYooMQauvdEDq54NiTphI7jx · No real charge
          </div>
          <button className="btn-gold w-full mt-4" onClick={start} data-testid="pay-submit-btn">
            Pay {amount} securely
          </button>
        </>
      )}

      {step === "processing" && (
        <div className="glass glass-gold p-6 text-center">
          <div className="spin-slow mx-auto w-14 h-14 mb-4">
            <img src={LOGO_URL} alt="" className="w-full h-full" />
          </div>
          <div className="text-sm text-[#f4d68c]">Confirming with sandbox…</div>
        </div>
      )}

      {step === "success" && (
        <div className="glass glass-gold p-6 text-center">
          <div className="text-5xl mb-3">✦</div>
          <div className="font-serif-lux text-2xl text-gold">Welcome to Luminary</div>
          <p className="text-xs text-[#e0e0e0] mt-2">Session {session?.session_id?.slice(-8)} · Sandbox success</p>
          <button className="btn-gold mt-5" onClick={() => go("dashboard")} data-testid="pay-done-btn">
            Explore your app
          </button>
        </div>
      )}
      <Disclaimer />
    </div>
  );
}

// =============== SETTINGS =============== //
export function SettingsScreen({ go }) {
  const rows = [
    { l: "Language · English / हिन्दी", to: null },
    { l: "Biometrics", to: null },
    { l: "Notifications", to: null },
    { l: "Default chart", to: null },
    { l: "Change password", to: null },
    { l: "Purchased reports", to: "purchasedReports" },
    { l: "Purchased benefits", to: "purchasedBenefits" },
    { l: "Payment history", to: "paymentHistory" },
    { l: "Suggestion & feedback", to: "feedback" },
    { l: "Share app", to: "shareApp" },
    { l: "Privacy policy", to: null },
    { l: "Terms of service", to: null },
    { l: "Delete account", to: null },
  ];
  return (
    <div className="relative pb-4">
      <TopBar title="Settings" onBack={() => go("dashboard")} />
      <div className="flex items-center gap-3 glass glass-gold p-4 mb-4">
        <img src={LOGO_URL} alt="" className="w-12 h-12 rounded-full border border-[#d4a853]/40 bg-black/40" />
        <div>
          <div className="font-serif-lux text-lg text-gold">Chetan</div>
          <div className="text-[10px] text-[#a0a0a0]">Sagittarius · Cancer Ascendant</div>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <button
            key={r.l}
            onClick={() => r.to && go(r.to)}
            className="w-full glass p-3 flex justify-between items-center text-sm text-left"
            data-testid={`setting-${r.l.split(" ")[0].toLowerCase()}`}
          >
            <span>{r.l}</span>
            <ChevronRight />
          </button>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}
