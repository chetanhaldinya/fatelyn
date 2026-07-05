import React, { useState } from "react";
import {
  CompassMark, TopBar, ChevronRight, Disclaimer, BirthChartSVG,
} from "./PhoneFrame";
import { LOGO_URL, IMG, PLANETS as MOCK_PLANETS, STONES } from "../data/mockData";

// ============ INTRO 1 (storytelling) ============ //
export function Intro1Screen({ go }) {
  const lines = [
    "Stars mirror patterns shaping life.",
    "Planets frame key life moments.",
    "Birth chart reveals growth themes.",
    "Planet shifts guide reflection time.",
  ];
  return (
    <div className="relative h-full stars flex flex-col">
      <div className="flex justify-end pt-2">
        <button className="tab-pill" onClick={() => go("intro2")} data-testid="intro1-skip-btn">Skip</button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <div className="relative w-40 h-40 mb-6">
          <div className="absolute inset-0 rounded-full bg-[#d4a853]/20 blur-3xl" />
          <img src={LOGO_URL} alt="" className="w-full h-full float-3d relative" />
        </div>
        <div className="space-y-3 text-sm text-[#e0e0e0]">
          {lines.map((l, i) => (
            <div key={i} className="font-serif-lux text-lg" style={{ animationDelay: `${i * 120}ms` }}>{l}</div>
          ))}
        </div>
      </div>
      <button className="btn-gold w-full mb-4" onClick={() => go("intro2")} data-testid="intro1-next-btn">Continue</button>
      <Disclaimer />
    </div>
  );
}

// ============ INTRO 2 (persona) ============ //
export function Intro2Screen({ go }) {
  return (
    <div className="relative stars h-full flex flex-col">
      <div className="text-center pt-4">
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#f4d68c]">Inspired by the stars</div>
        <div className="font-serif-lux text-2xl text-gold mt-2">Ancient Astrology,<br/>Modern Technology</div>
      </div>
      <div className="glass glass-gold mt-6 p-5 flex items-center gap-4">
        <img src={IMG.friends[0]} alt="" className="w-16 h-16 rounded-full object-cover border border-[#d4a853]/40" />
        <div>
          <div className="font-serif-lux text-lg text-gold">Chetan</div>
          <div className="text-[11px] text-[#a0a0a0]">Sagittarius · Cancer Asc</div>
          <div className="text-[11px] text-[#e0e0e0] mt-1">A socialite who dreams big and values freedom.</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {["Gemini", "Aquarius", "Aquarius"].map((s, i) => (
          <div key={i} className="glass p-3 text-center">
            <div className="text-[10px] text-[#a0a0a0]">Match</div>
            <div className="text-sm text-gold font-serif-lux">{s}</div>
          </div>
        ))}
      </div>
      <div className="flex-1" />
      <button className="btn-gold w-full mb-4" onClick={() => go("signupBasic")} data-testid="intro2-continue-btn">Continue</button>
      <Disclaimer />
    </div>
  );
}

// ============ SIGNUP BASIC INFO (name / gender + birth entry triggers) ============ //
export function SignupBasicScreen({ go }) {
  const [gender, setGender] = useState("Female");
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  return (
    <div className="relative">
      <TopBar title="Basic Info" onBack={() => go("intro2")} />
      <div className="glass p-4 space-y-3">
        <Field label="Name *" placeholder="Enter full name" testId="signup-name-input" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Gender *</div>
          <div className="flex gap-2 mt-2">
            {["Female", "Male", "Other"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`tab-pill ${gender === g ? "active" : ""}`}
                data-testid={`signup-gender-${g.toLowerCase()}`}
              >{g}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c] mt-4 mb-2">Birth Details</div>
      <div className="glass p-4 space-y-3">
        <button className="w-full text-left" onClick={() => setShowDate(true)} data-testid="signup-dob-btn">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Date of birth *</div>
          <div className="text-white text-sm mt-1">{dob || "Select date"}</div>
        </button>
        <button className="w-full text-left" onClick={() => setShowTime(true)} data-testid="signup-tob-btn">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Birth time *</div>
          <div className="text-white text-sm mt-1">{tob || "Select time"}</div>
        </button>
        <Field label="Birthplace *" placeholder="City, Country" testId="signup-place-input" />
      </div>
      <button className="btn-gold w-full mt-5" onClick={() => go("dashboard")} data-testid="signup-continue-btn">
        Continue
      </button>
      <Disclaimer />
      {showDate && <DatePickerModal onSelect={(v) => { setDob(v); setShowDate(false); }} onClose={() => setShowDate(false)} />}
      {showTime && <TimePickerModal onSelect={(v) => { setTob(v); setShowTime(false); }} onClose={() => setShowTime(false)} />}
    </div>
  );
}

function Field({ label, placeholder, testId }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">{label}</div>
      <input className="w-full bg-transparent border-b border-white/10 focus:border-[#d4a853] py-2 outline-none text-white text-sm" placeholder={placeholder} data-testid={testId} />
    </div>
  );
}

// ============ DATE PICKER MODAL ============ //
export function DatePickerModal({ onSelect, onClose }) {
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [year, setYear] = useState(2001);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass glass-gold w-[90%] p-5">
        <div className="font-serif-lux text-xl text-gold text-center mb-3">Date of birth</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Wheel items={months} value={month} onChange={setMonth} testId="dp-month" />
          <Wheel items={[...Array(31).keys()].map(n => n + 1)} value={day} onChange={setDay} testId="dp-day" />
          <Wheel items={[...Array(80).keys()].map(n => 1950 + n)} value={year - 1950} onChange={(v) => setYear(1950 + v)} testId="dp-year" />
        </div>
        <div className="flex gap-2 mt-4">
          <button className="btn-outline-gold text-xs flex-1" onClick={onClose} data-testid="dp-cancel-btn">Cancel</button>
          <button className="btn-gold text-xs flex-1" onClick={() => onSelect(`${months[month]} ${day}, ${year}`)} data-testid="dp-select-btn">Select</button>
        </div>
      </div>
    </div>
  );
}

// ============ TIME PICKER MODAL ============ //
export function TimePickerModal({ onSelect, onClose }) {
  const [h, setH] = useState(10);
  const [m, setM] = useState(30);
  const [ap, setAp] = useState("PM");
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass glass-gold w-[90%] p-5">
        <div className="font-serif-lux text-xl text-gold text-center mb-3">Birth time</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Wheel items={[...Array(12).keys()].map(n => (n + 1).toString().padStart(2, "0"))} value={h - 1} onChange={(v) => setH(v + 1)} testId="tp-hour" />
          <Wheel items={[...Array(60).keys()].map(n => n.toString().padStart(2, "0"))} value={m} onChange={setM} testId="tp-minute" />
          <Wheel items={["AM", "PM"]} value={ap === "AM" ? 0 : 1} onChange={(v) => setAp(v === 0 ? "AM" : "PM")} testId="tp-ampm" />
        </div>
        <div className="flex gap-2 mt-4">
          <button className="btn-outline-gold text-xs flex-1" onClick={onClose} data-testid="tp-cancel-btn">Cancel</button>
          <button className="btn-gold text-xs flex-1" onClick={() => onSelect(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${ap}`)} data-testid="tp-select-btn">Select</button>
        </div>
      </div>
    </div>
  );
}

function Wheel({ items, value, onChange, testId }) {
  return (
    <div className="glass p-1 h-40 overflow-y-auto scrollbar-none" data-testid={testId}>
      {items.map((it, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-full py-1.5 text-xs rounded ${i === value ? "text-[#f4d68c] bg-[#d4a853]/15 font-semibold" : "text-[#a0a0a0]"}`}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

// ============ COMPATIBILITY VISUAL INTRO ============ //
export function CompatIntroScreen({ go }) {
  return (
    <div className="relative">
      <TopBar title="Compatibility" onBack={() => go("friends")} />
      <div className="rounded-2xl overflow-hidden relative h-56">
        <img src={IMG.cosmic[1]} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Compatibility</div>
          <div className="font-serif-lux text-2xl text-white mt-1">Discover your connection with Aarav</div>
        </div>
      </div>
      <div className="glass p-4 mt-4 text-sm leading-relaxed text-[#e0e0e0]">
        What ties you to Aarav runs deep, firm, and forever. Explore the specifics through six dimensions of compatibility.
      </div>
      <button className="btn-gold w-full mt-5" onClick={() => go("compatReport")} data-testid="compat-intro-continue-btn">
        Dive into the mechanics
      </button>
      <Disclaimer />
    </div>
  );
}

// ============ COMPATIBILITY REPORT (full) ============ //
export function CompatReportScreen({ go }) {
  const sections = [
    { label: "Respect & Admiration", value: 82, note: "Aarav sees you as steady. Your Cancer Ascendant lends nurture that he respects." },
    { label: "Harmony & Influence", value: 74, note: "Moon–Venus link creates fluid conversation. Give it room to breathe." },
    { label: "Mutual Benefit", value: 68, note: "You each bring different strengths. Complement, don't compete." },
    { label: "Trust & Nurture", value: 88, note: "Deep 4th–8th house tie — safety is your bedrock." },
    { label: "Happiness & Luck", value: 79, note: "Jupiter's transit through your 11th blesses shared adventures." },
    { label: "Mood & Emotions", value: 72, note: "Both water-forward — clarify feelings before acting on them." },
  ];
  return (
    <div className="relative">
      <TopBar title="Compatibility Report" onBack={() => go("compatIntro")} />
      <div className="glass p-4 mb-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Dive into the mechanics</div>
        <div className="font-serif-lux text-lg text-white mt-1">You & Aarav — 91% overall</div>
      </div>
      {sections.map((s, i) => (
        <div key={i} className="glass p-3 mb-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#e0e0e0]">{s.label}</span>
            <span className="text-[#f4d68c]">{s.value}%</span>
          </div>
          <div className="pbar mt-2"><span style={{ width: `${s.value}%` }} /></div>
          <div className="text-[10px] text-[#a0a0a0] mt-2 leading-relaxed">{s.note}</div>
        </div>
      ))}
      <button className="btn-outline-gold w-full mt-2" onClick={() => go("compatGuide")} data-testid="compat-report-more-btn">
        Continue guide →
      </button>
      <Disclaimer />
    </div>
  );
}

// ============ COMPATIBILITY EMPTY / PURCHASE ============ //
export function CompatEmptyScreen({ go }) {
  return (
    <div className="relative">
      <TopBar title="Compatibility" onBack={() => go("friends")} />
      <div className="glass glass-gold p-5 mt-2 text-center">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">You have 0 reports available</div>
        <div className="font-serif-lux text-xl text-white mt-2">Explore the spark between friends, partners, and new connections</div>
        <div className="mt-4 space-y-2">
          {[
            ["Trust & Nurture", 100, "Cancer × Gemini"],
            ["Harmony & Influence", 74, "Cancer × Scorpio"],
            ["Mutual Benefit", 68, "Cancer × Leo"],
          ].map(([l, v, tag]) => (
            <div key={l} className="glass p-3 text-left">
              <div className="flex justify-between text-xs">
                <span>{l}</span><span className="text-[#f4d68c]">{v}%</span>
              </div>
              <div className="pbar mt-2"><span style={{ width: `${v}%` }} /></div>
              <div className="text-[9px] text-[#a0a0a0] mt-1">{tag}</div>
            </div>
          ))}
        </div>
        <button className="btn-gold w-full mt-5" onClick={() => go("payment", { plan: "monthly" })} data-testid="compat-empty-buy-btn">
          Check Compatibility · ₹310
        </button>
      </div>
    </div>
  );
}

// ============ COMPATIBILITY GUIDE ============ //
export function CompatGuideScreen({ go }) {
  return (
    <div className="relative">
      <TopBar title="Compatibility Report" onBack={() => go("compatReport")} />
      <Section title="Guide to Compatibility" body="Vedic astrology reads the interplay of two moon signs and ascendants across six lenses. True connection is not identical charts — it's how each chart's strengths meet the other's blind spots." />
      <Section title="A Steady Relationship" body="Stability grows from shared 4th house (roots), 7th house (partnership) and 10th house (public goals). Yours together score 78% average." />
      <Section title="Navigating Moods & Feelings" body="Both of you carry water elements. When emotions rise, name them first — action second. Cancer softens; Scorpio anchors." />
      <button className="btn-outline-gold w-full mt-2" onClick={() => go("compatBond")} data-testid="compat-guide-next-btn">
        Strengthening the bond →
      </button>
      <Disclaimer />
    </div>
  );
}

// ============ COMPATIBILITY STRENGTHENING BOND ============ //
export function CompatBondScreen({ go }) {
  return (
    <div className="relative">
      <TopBar title="Compatibility Report" onBack={() => go("compatGuide")} />
      <Section title="Strengthening the Bond" body="Anchor around three rituals: weekly 30-min honest check-in, monthly shared plan review, quarterly getaway. This trio maps to your 3rd, 7th and 9th house alignment." />
      <Section title="Reflect Upon" body="What of Aarav's quietness might you be reading as distance? What of your softness might he be reading as uncertainty? Ask, don't assume." />
      <Section title="The Initial Connection" body="Foundational trait: Aarav respects steady action; you respect emotional truth. Neither is wrong; both need language." />
      <button className="btn-gold w-full mt-2" onClick={() => go("compat")} data-testid="compat-bond-done-btn">Back to summary</button>
      <Disclaimer />
    </div>
  );
}

function Section({ title, body }) {
  return (
    <div className="glass p-4 mb-3">
      <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">{title}</div>
      <p className="text-xs text-[#e0e0e0] mt-2 leading-relaxed">{body}</p>
    </div>
  );
}

// ============ ASTRO DETAILS TABLE ============ //
export function AstroDetailsScreen({ go }) {
  const rows = [
    ["Ascendant", "Cancer"], ["Sign", "Sagittarius"], ["Nakshatra", "Ashlesha"],
    ["Charan (Pada)", "3"], ["Sign Lord", "Moon"], ["Nakshatra Lord", "Mercury"],
    ["Varna", "Brahmin"], ["Vashya", "Jalachar"], ["Yoni", "Cat (Male)"],
    ["Gana", "Rakshas"], ["Nadi", "Adi"], ["Tatva", "Water"],
    ["Yog", "Vyatipata"], ["Karan", "Kaulava"], ["Tithi", "Krishna Panchami"],
  ];
  return (
    <div className="relative">
      <TopBar title="Astro Details" onBack={() => go("chart")} />
      <div className="glass overflow-hidden">
        {rows.map(([k, v], i) => (
          <div key={k} className={`grid grid-cols-2 px-4 py-2.5 text-xs ${i > 0 ? "border-t border-white/5" : ""}`} data-testid={`astro-${k.toLowerCase().replace(/[^a-z]/g, '-')}`}>
            <span className="text-[#a0a0a0]">{k}</span>
            <span className="text-[#f4d68c] text-right">{v}</span>
          </div>
        ))}
      </div>
      <Disclaimer />
    </div>
  );
}

// ============ BIRTH DETAILS TABLE ============ //
export function BirthDetailsTableScreen({ go }) {
  const rows = [
    ["Name", "Chetan"], ["Year", "2001"], ["Month", "December"], ["Day", "07"],
    ["Hour", "22"], ["Minute", "38"], ["Latitude", "28.6139°N"],
    ["Longitude", "77.2090°E"], ["Timezone", "IST +05:30"],
    ["Sunrise", "07:04"], ["Sunset", "17:32"],
  ];
  return (
    <div className="relative">
      <TopBar title="Birth Details" onBack={() => go("chart")} />
      <div className="glass overflow-hidden">
        {rows.map(([k, v], i) => (
          <div key={k} className={`grid grid-cols-2 px-4 py-2.5 text-xs ${i > 0 ? "border-t border-white/5" : ""}`} data-testid={`bd-${k.toLowerCase()}`}>
            <span className="text-[#a0a0a0]">{k}</span>
            <span className="text-[#f4d68c] text-right">{v}</span>
          </div>
        ))}
      </div>
      <button className="btn-outline-gold w-full mt-4 text-xs" onClick={() => go("birthDetails")} data-testid="bd-edit-btn">Edit birth details</button>
    </div>
  );
}

// ============ DIVISIONAL CHARTS LIST ============ //
export function DivisionalChartsScreen({ go }) {
  const list = [
    { c: "D1", n: "Lagna / Rashi", desc: "Overall self" },
    { c: "D2", n: "Hora", desc: "Wealth" },
    { c: "D3", n: "Drekkana", desc: "Siblings, courage" },
    { c: "D4", n: "Chaturthamsa", desc: "Home, fortune" },
    { c: "D7", n: "Saptamsa", desc: "Children" },
    { c: "D9", n: "Navamsa", desc: "Marriage, dharma" },
    { c: "D10", n: "Dashamsa", desc: "Career" },
    { c: "D12", n: "Dwadashamsa", desc: "Parents" },
    { c: "D16", n: "Shodashamsa", desc: "Vehicles, comforts" },
    { c: "D20", n: "Vimshamsa", desc: "Spiritual pursuits" },
    { c: "D24", n: "Chaturvimshamsa", desc: "Education" },
    { c: "D27", n: "Bhamsa", desc: "Strengths" },
    { c: "D30", n: "Trimshamsa", desc: "Adversities" },
    { c: "D40", n: "Khavedamsa", desc: "Maternal lineage" },
    { c: "D45", n: "Akshavedamsa", desc: "Character" },
    { c: "D60", n: "Shashtiamsa", desc: "All-purpose refinement" },
  ];
  return (
    <div className="relative">
      <TopBar title="Divisional Charts" onBack={() => go("chart")} />
      <div className="space-y-2">
        {list.map((d, i) => (
          <button key={d.c} onClick={() => go("d1Explainer")} className="glass w-full p-3 flex items-center justify-between text-left" data-testid={`div-${d.c.toLowerCase()}`}>
            <div>
              <div className="font-serif-lux text-base text-gold">{d.c} · {d.n}</div>
              <div className="text-[10px] text-[#a0a0a0]">{d.desc}</div>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ D1 BIRTH CHART EXPLAINER ============ //
export function D1ExplainerScreen({ go }) {
  return (
    <div className="relative">
      <TopBar title="D1 · Birth Chart" onBack={() => go("divCharts")} />
      <BirthChartSVG />
      <div className="glass p-4 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">What is a Birth Chart?</div>
        <p className="text-xs text-[#e0e0e0] mt-2 leading-relaxed">
          Your D1 (Lagna / Rashi Kundli) is the sky at your first breath. The 12 houses represent life themes; the planets in
          them show where your energy naturally flows.
        </p>
      </div>
      <button className="btn-outline-gold w-full mt-3 text-xs" onClick={() => go("yearly")} data-testid="d1-year-plan-btn">
        Plan your year — yearly report →
      </button>
      <Disclaimer />
    </div>
  );
}

// ============ SARVASHTAKVARGA ============ //
export function SarvashtakvargaScreen({ go }) {
  const [view, setView] = useState("Table");
  const rows = [
    ["Aries", 4, 5, 3, 4, 6, 4, 3, 29],
    ["Taurus", 3, 4, 4, 5, 3, 5, 4, 28],
    ["Gemini", 5, 4, 5, 6, 4, 5, 5, 34],
    ["Cancer", 5, 3, 4, 4, 5, 6, 4, 31],
    ["Leo", 4, 5, 5, 4, 4, 4, 3, 29],
    ["Virgo", 3, 4, 5, 4, 4, 5, 6, 31],
    ["Libra", 5, 4, 3, 5, 5, 4, 4, 30],
    ["Scorpio", 4, 5, 4, 4, 5, 4, 4, 30],
    ["Sagittarius", 6, 4, 5, 5, 6, 4, 5, 35],
    ["Capricorn", 3, 4, 4, 3, 4, 5, 4, 27],
    ["Aquarius", 4, 3, 4, 4, 4, 3, 5, 27],
    ["Pisces", 5, 4, 5, 4, 5, 5, 4, 32],
  ];
  return (
    <div className="relative">
      <TopBar title="Sarvashtakvarga" onBack={() => go("chart")} />
      <div className="flex gap-2 mb-3">
        {["Table", "Chart"].map((t) => (
          <button key={t} className={`tab-pill ${view === t ? "active" : ""}`} onClick={() => setView(t)} data-testid={`sarva-tab-${t.toLowerCase()}`}>{t}</button>
        ))}
      </div>
      {view === "Table" ? (
        <div className="glass overflow-hidden">
          <div className="grid grid-cols-9 text-[9px] uppercase tracking-widest text-[#a0a0a0] px-2 py-2 bg-white/[0.03]">
            <div className="col-span-2">Sign</div><div>Su</div><div>Mo</div><div>Ma</div><div>Me</div><div>Ju</div><div>Ve</div><div>Sa</div><div>Tot</div>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-9 text-[10px] px-2 py-1.5 border-t border-white/5">
              <div className="col-span-2 text-[#f4d68c]">{r[0]}</div>
              {r.slice(1).map((v, j) => (
                <div key={j} className={j === r.length - 2 ? "text-[#f4d68c] font-semibold" : ""}>{v}</div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass p-3">
          <div className="grid grid-cols-6 gap-1.5">
            {rows.map((r, i) => (
              <div key={i} className="text-center">
                <div className="text-[9px] text-[#a0a0a0]">{r[0].slice(0, 3)}</div>
                <div className="rounded-lg bg-gradient-to-t from-[#d4a853]/50 to-[#f4d68c]" style={{ height: `${r[8] * 2}px` }} />
                <div className="text-[9px] text-[#f4d68c] mt-1">{r[8]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ DASHA PRO (Maha/Antar/Pratyantar) ============ //
export function DashaProScreen({ go }) {
  const [tab, setTab] = useState("Current");
  return (
    <div className="relative">
      <TopBar title="Vimshottari Dasha" onBack={() => go("chart")} />
      <div className="flex gap-2 mb-3">
        {["Current", "Maha", "Pratyantar"].map((t) => (
          <button key={t} className={`tab-pill ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} data-testid={`dashapro-tab-${t.toLowerCase()}`}>{t}</button>
        ))}
      </div>

      {tab === "Current" && (
        <div className="space-y-3">
          <div className="glass glass-gold p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Major Vimshottari Dasha</div>
            <div className="flex justify-between mt-2 text-sm"><span>Rahu</span><span className="text-[#f4d68c]">Aug 2018 → Aug 2036</span></div>
          </div>
          <div className="glass p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Antardasha</div>
            <div className="flex justify-between mt-2 text-sm"><span>Saturn</span><span className="text-[#f4d68c]">Jul 2024 → Feb 2027</span></div>
          </div>
          <div className="glass p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Pratyantardasha</div>
            <div className="flex justify-between mt-2 text-sm"><span>Jupiter</span><span className="text-[#f4d68c]">Nov 2026 → Feb 2027</span></div>
          </div>
        </div>
      )}

      {tab === "Maha" && (
        <div className="glass overflow-hidden">
          {[
            ["Rahu", "2018", "2036"],
            ["Jupiter", "2036", "2052"],
            ["Saturn", "2052", "2071"],
            ["Mercury", "2071", "2088"],
            ["Ketu", "2088", "2095"],
          ].map(([l, s, e]) => (
            <div key={l} className="grid grid-cols-3 text-xs px-3 py-2.5 border-b border-white/5">
              <span className="text-[#f4d68c]">{l}</span><span>{s}</span><span>{e}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "Pratyantar" && (
        <div className="glass overflow-hidden">
          <div className="grid grid-cols-3 text-[9px] uppercase tracking-widest text-[#a0a0a0] px-3 py-2 bg-white/[0.03]">
            <div>Ra / Sa / Lord</div><div>Start</div><div>End</div>
          </div>
          {[
            ["Ra / Sa / Rahu", "Jul 2024", "Nov 2024"],
            ["Ra / Sa / Jupiter", "Nov 2024", "Feb 2025"],
            ["Ra / Sa / Saturn", "Feb 2025", "May 2025"],
            ["Ra / Sa / Mercury", "May 2025", "Aug 2025"],
            ["Ra / Sa / Ketu", "Aug 2025", "Oct 2025"],
            ["Ra / Sa / Venus", "Oct 2025", "Feb 2026"],
            ["Ra / Sa / Sun", "Feb 2026", "Apr 2026"],
            ["Ra / Sa / Moon", "Apr 2026", "Aug 2026"],
            ["Ra / Sa / Mars", "Aug 2026", "Nov 2026"],
            ["Ra / Sa / Jupiter*", "Nov 2026", "Feb 2027"],
          ].map((r, i) => (
            <div key={i} className="grid grid-cols-3 text-[10px] px-3 py-1.5 border-t border-white/5">
              <span className={r[0].endsWith("*") ? "text-[#f4d68c]" : ""}>{r[0]}</span>
              <span className="text-[#a0a0a0]">{r[1]}</span>
              <span className="text-[#a0a0a0]">{r[2]}</span>
            </div>
          ))}
        </div>
      )}
      <Disclaimer />
    </div>
  );
}

// ============ SADE SATI (phases) ============ //
export function SadeSatiScreen({ go }) {
  return (
    <div className="relative">
      <TopBar title="Sade Sati" onBack={() => go("chart")} />
      <div className="glass glass-gold p-4 mb-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Status</div>
        <div className="font-serif-lux text-xl text-white mt-1">You are not currently in Sade Sati.</div>
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c] mb-2">Sade Sati for Cancer moon sign</div>
      <div className="space-y-2">
        {[
          ["First Phase", "May 2029 – Jul 2031", "Saturn enters your 12th"],
          ["Middle Phase", "Jul 2031 – Sep 2033", "Saturn transits your Moon"],
          ["Last Phase", "Sep 2033 – Oct 2036", "Saturn exits into your 2nd"],
        ].map(([t, r, note]) => (
          <div key={t} className="glass p-3">
            <div className="flex justify-between">
              <div className="font-serif-lux text-lg text-gold">{t}</div>
              <div className="text-[10px] text-[#f4d68c]">{r}</div>
            </div>
            <div className="text-[11px] text-[#a0a0a0] mt-1">{note}</div>
          </div>
        ))}
      </div>
      <div className="glass p-4 mt-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">What is Sade Sati?</div>
        <p className="text-xs text-[#e0e0e0] mt-2 leading-relaxed">
          Sade Sati is Saturn's 7½-year passage over the sign preceding, containing, and following your Moon.
          It's less "doom" and more "deep pruning" — themes of responsibility, discipline, and honest reckoning.
        </p>
      </div>
      <Disclaimer />
    </div>
  );
}

// ============ QUEST HISTORY ============ //
export function QuestHistoryScreen({ go }) {
  const items = [
    { q: "Am I letting my emotions cloud my judgment?", when: "2h ago" },
    { q: "How do I become a better version of myself?", when: "Yesterday" },
    { q: "Is this the right time to switch jobs?", when: "2 days ago" },
    { q: "What blocks my growth right now?", when: "3 days ago" },
  ];
  return (
    <div className="relative">
      <TopBar title="Quest History" onBack={() => go("quest")} />
      <div className="text-[10px] text-[#a0a0a0] italic mb-3">Answers are available for 24 hours.</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <button key={i} onClick={() => go("quest")} className="w-full glass p-3 text-left flex justify-between items-start" data-testid={`quest-history-${i}`}>
            <div>
              <div className="text-sm text-white">{it.q}</div>
              <div className="text-[10px] text-[#a0a0a0] mt-1">{it.when}</div>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ PURCHASED REPORTS ============ //
export function PurchasedReportsScreen({ go }) {
  const [tab, setTab] = useState("Compatibility");
  const compat = [
    { name: "Aarav", when: "Nov 2026" },
    { name: "Ananya", when: "Sep 2026" },
    { name: "Vikram", when: "Aug 2026" },
  ];
  const yearly = [{ name: "Yearly Report 2027", when: "Nov 2026" }];
  return (
    <div className="relative">
      <TopBar title="Purchased Reports" onBack={() => go("settings")} />
      <div className="flex gap-2 mb-3">
        {["Compatibility", "Yearly"].map((t) => (
          <button key={t} className={`tab-pill ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} data-testid={`purchased-tab-${t.toLowerCase()}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-2">
        {(tab === "Compatibility" ? compat : yearly).map((r, i) => (
          <div key={i} className="glass p-3 flex justify-between items-center" data-testid={`purchased-${tab.toLowerCase()}-${i}`}>
            <div>
              <div className="font-serif-lux text-lg text-gold">{r.name}</div>
              <div className="text-[10px] text-[#a0a0a0]">{r.when}</div>
            </div>
            <ChevronRight />
          </div>
        ))}
      </div>
      {tab === "Yearly" && (
        <button className="btn-gold w-full mt-4 text-xs" onClick={() => go("yearly")} data-testid="new-yearly-btn">New Yearly Report</button>
      )}
      <button className="btn-outline-gold w-full mt-2 text-xs" onClick={() => go("subscription")} data-testid="discover-more-btn">Discover more →</button>
    </div>
  );
}

// ============ PURCHASED BENEFITS ============ //
export function PurchasedBenefitsScreen({ go }) {
  const items = [
    { label: "Quest count", value: 12, sub: "Remaining this month" },
    { label: "Compatibility reports", value: 3, sub: "Remaining" },
    { label: "Manual friends", value: 5, sub: "Slots available" },
    { label: "Plan Your Year", value: 1, sub: "Full yearly report" },
  ];
  return (
    <div className="relative">
      <TopBar title="Purchased Benefits" onBack={() => go("settings")} />
      <div className="text-center mb-4">
        <img src={LOGO_URL} alt="" className="w-14 h-14 mx-auto" />
        <div className="font-serif-lux text-xl text-gold mt-2">FATELYN Luminary</div>
        <div className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0a0]">Unlocking Hidden Truth</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.label} className="glass p-4" data-testid={`benefit-${it.label.toLowerCase().replace(/\s/g, '-')}`}>
            <div className="text-[10px] uppercase tracking-widest text-[#a0a0a0]">{it.label}</div>
            <div className="font-serif-lux text-3xl text-gold mt-1">{it.value}</div>
            <div className="text-[10px] text-[#a0a0a0]">{it.sub}</div>
          </div>
        ))}
      </div>
      <button className="btn-gold w-full mt-5 text-xs" onClick={() => go("subscription")} data-testid="benefits-upgrade-btn">Upgrade to Luminary+</button>
    </div>
  );
}

// ============ SUGGESTION & FEEDBACK ============ //
export function FeedbackScreen({ go }) {
  return (
    <div className="relative">
      <TopBar title="Suggestion & Feedback" onBack={() => go("settings")} />
      <div className="glass p-4 space-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Your email</div>
          <input className="w-full bg-transparent border-b border-white/10 focus:border-[#d4a853] py-2 outline-none text-white text-sm" defaultValue="chetan@example.com" data-testid="feedback-email-input" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Message</div>
          <textarea rows={5} className="w-full bg-transparent border border-white/10 focus:border-[#d4a853] rounded-lg p-3 mt-1 outline-none text-white text-sm resize-none" placeholder="Tell us what you love, or what could be better…" data-testid="feedback-message-input" />
        </div>
      </div>
      <button className="btn-gold w-full mt-4" onClick={() => go("settings")} data-testid="feedback-submit-btn">Submit</button>
      <div className="text-[10px] text-[#a0a0a0] italic text-center mt-3">We read every message — usually reply within 48h.</div>
    </div>
  );
}

// ============ PAYMENT HISTORY ============ //
export function PaymentHistoryScreen({ go }) {
  const rows = [
    { d: "Nov 05, 2026", desc: "Luminary · Yearly", amt: 2499 },
    { d: "Oct 12, 2026", desc: "Compatibility · Aarav", amt: 310 },
    { d: "Sep 18, 2026", desc: "2 Quest questions", amt: 199 },
    { d: "Aug 09, 2026", desc: "Yearly Report 2027", amt: 599 },
    { d: "Jul 22, 2026", desc: "Compatibility · Ananya", amt: 310 },
  ];
  return (
    <div className="relative">
      <TopBar title="Payment History" onBack={() => go("settings")} />
      <div className="glass overflow-hidden">
        <div className="grid grid-cols-3 text-[9px] uppercase tracking-widest text-[#a0a0a0] px-3 py-2">
          <div>Date</div><div>Item</div><div className="text-right">Amount</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-3 text-[11px] px-3 py-2.5 border-t border-white/5" data-testid={`payment-row-${i}`}>
            <span className="text-[#a0a0a0]">{r.d}</span>
            <span>{r.desc}</span>
            <span className="text-right text-[#f4d68c]">₹{r.amt.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <div className="glass p-3 mt-3 text-[11px] text-[#a0a0a0]">Total spent this year: <span className="text-[#f4d68c] font-semibold">₹3,917</span></div>
    </div>
  );
}

// ============ SHARE APP MODAL ============ //
export function ShareAppScreen({ go }) {
  const apps = ["WhatsApp", "Instagram", "Twitter/X", "Telegram", "Messenger", "Copy Link", "Email", "SMS"];
  return (
    <div className="relative">
      <TopBar title="Share Fatelyn" onBack={() => go("settings")} />
      <div className="glass glass-gold p-4 mb-4">
        <img src={LOGO_URL} alt="" className="w-14 h-14 mx-auto" />
        <div className="font-serif-lux text-xl text-gold text-center mt-2">Give a friend the stars</div>
        <p className="text-xs text-[#e0e0e0] text-center mt-2 leading-relaxed">
          Share Fatelyn — both you and your friend get 3 free Quest questions when they sign up.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {apps.map((a) => (
          <button key={a} className="glass p-3 text-center" data-testid={`share-${a.replace(/[^a-z]/gi, '').toLowerCase()}`}>
            <div className="w-10 h-10 rounded-full mx-auto bg-gradient-to-br from-[#d4a853]/30 to-[#f4d68c]/10 flex items-center justify-center text-[#f4d68c] font-serif-lux">
              {a[0]}
            </div>
            <div className="text-[9px] text-[#a0a0a0] mt-2">{a}</div>
          </button>
        ))}
      </div>
      <div className="glass p-3 mt-4 flex justify-between items-center" data-testid="share-link-box">
        <div className="text-[10px] text-[#a0a0a0] truncate">https://fatelyn.app/r/chetan-7d2</div>
        <button className="btn-outline-gold text-xs" data-testid="share-copy-btn">Copy</button>
      </div>
    </div>
  );
}
