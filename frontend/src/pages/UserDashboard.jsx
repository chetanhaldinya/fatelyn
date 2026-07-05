import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { http } from "../lib/api";
import { LOGO_URL } from "../data/mockData";

/**
 * User Dashboard — 100% real data.
 * Reads user birth from /me/birth, computes via /api/astro/{chart,dasha,panchang,gochar}.
 * No mock data, no prototype phone frames on this page.
 */
export default function UserDashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const [birth, setBirth] = useState(null);
  const [chart, setChart] = useState(null);
  const [dasha, setDasha] = useState(null);
  const [panchang, setPanchang] = useState(null);
  const [gochar, setGochar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    year: 2001, month: 12, day: 7, hour: 22, minute: 38,
    tz_offset: 5.5, latitude: 28.6139, longitude: 77.209, place: "New Delhi, India",
  });
  const [questAns, setQuestAns] = useState(null);
  const [questQ, setQuestQ] = useState("");
  const [questBusy, setQuestBusy] = useState(false);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: b }, { data: g }] = await Promise.all([
        http.get("/me/birth"),
        http.get("/astro/gochar"),
      ]);
      setGochar(g);
      if (b) {
        setBirth(b);
        setForm((f) => ({ ...f, ...b }));
        await compute(b);
      }
      const pInput = b || form;
      const { data: p } = await http.post("/astro/panchang", {
        tz_offset: pInput.tz_offset ?? 5.5,
        latitude: pInput.latitude ?? 28.6139,
        longitude: pInput.longitude ?? 77.209,
      });
      setPanchang(p);
    } finally {
      setLoading(false);
    }
  };

  const compute = async (b) => {
    const [ch, da] = await Promise.all([
      http.post("/astro/chart", b),
      http.post("/astro/dasha", b),
    ]);
    setChart(ch.data);
    setDasha(da.data);
  };

  const save = async () => {
    setSaving(true);
    try {
      await http.put("/me/birth", { ...form });
      setBirth({ ...form });
      await compute(form);
      const { data: p } = await http.post("/astro/panchang", {
        tz_offset: form.tz_offset, latitude: form.latitude, longitude: form.longitude,
      });
      setPanchang(p);
    } finally { setSaving(false); }
  };

  const ask = async () => {
    if (!questQ.trim()) return;
    setQuestBusy(true); setQuestAns(null);
    try {
      const { data } = await http.post("/quest/ask", {
        question: questQ,
        category: "Personal",
        zodiac: chart?.moon_sign,
        ascendant: chart?.ascendant?.sign,
      });
      setQuestAns(data);
    } catch (e) {
      setQuestAns({ answer: e.response?.data?.detail || "Fatelyn is temporarily offline. Try again shortly.", error: true });
    } finally { setQuestBusy(false); }
  };

  const firstName = useMemo(() => (user?.name || "seeker").split(" ")[0], [user]);

  return (
    <div className="min-h-screen cosmic-bg text-white">
      <header className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3" data-testid="dash-home-link">
          <img src={LOGO_URL} alt="" className="w-10 h-10" />
          <div>
            <div className="font-serif-lux text-2xl text-gold leading-none">FATELYN</div>
            <div className="text-[9px] uppercase tracking-[0.35em] text-[#a0a0a0]">Your personal sky</div>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden md:block text-[#a0a0a0]">Namaste, <span className="text-[#f4d68c]">{user?.name}</span></div>
          {user?.role === "admin" && (
            <Link to="/admin" className="btn-outline-gold text-xs" data-testid="dash-admin-link">Admin</Link>
          )}
          <Link to="/prototype" className="btn-outline-gold text-xs" data-testid="dash-prototype-link">Prototype</Link>
          <button onClick={async () => { await logout(); nav("/"); }} className="btn-outline-gold text-xs" data-testid="dash-logout-btn">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-16">
        {!birth ? (
          <BirthForm form={form} setForm={setForm} onSave={save} saving={saving} name={firstName} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Hero snapshot */}
              {chart && (
                <div className="glass glass-gold p-6 fade-up">
                  <div className="flex items-baseline justify-between flex-wrap gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Namaste, {firstName}</div>
                      <div className="font-serif-lux text-4xl text-gold mt-1">{chart.ascendant.sign} Ascendant</div>
                      <div className="text-xs text-[#a0a0a0]">Lagna at {chart.ascendant.degree}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Moon</div>
                      <div className="font-serif-lux text-2xl text-white mt-1">{chart.moon_sign}</div>
                      <div className="text-xs text-[#a0a0a0]">{chart.moon_nakshatra}</div>
                    </div>
                  </div>
                  <button onClick={() => setBirth(null)} className="text-[10px] text-[#f4d68c] mt-4 underline underline-offset-2" data-testid="edit-birth-btn">
                    Edit birth details
                  </button>
                </div>
              )}

              {/* Planetary table */}
              {chart && (
                <div className="glass p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Planetary positions</div>
                  <div className="mt-3 grid grid-cols-5 gap-2 text-[10px] uppercase tracking-widest text-[#a0a0a0]">
                    <div>Planet</div><div>Sign</div><div>Nakshatra</div><div className="text-center">House</div><div className="text-right">Deg</div>
                  </div>
                  {chart.planets.map((p) => (
                    <div key={p.name} className="grid grid-cols-5 gap-2 text-xs py-2 border-t border-white/5" data-testid={`planet-${p.name.toLowerCase()}`}>
                      <div className="text-[#f4d68c]">{p.name}{p.retro && " ʀ"}</div>
                      <div>{p.sign}</div>
                      <div className="text-[#a0a0a0]">{p.nakshatra}</div>
                      <div className="text-center">H{p.house}</div>
                      <div className="text-right">{p.degree}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Full 5-level Vimshottari dasha */}
              {dasha && (
                <div className="glass p-5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Vimshottari Dasha · running now</div>
                      <div className="text-[10px] text-[#a0a0a0] mt-1">Birth nakshatra: <span className="text-[#f4d68c]">{dasha.birth_moon_nakshatra}</span> · Start lord: <span className="text-[#f4d68c]">{dasha.starting_maha_lord_at_birth}</span></div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-5 gap-2 mt-4">
                    {["maha", "antar", "pratyantar", "sookshma", "pran"].map((k) => (
                      <DashaLevel key={k} label={k} data={dasha.current?.[k]} />
                    ))}
                  </div>
                </div>
              )}

              {/* Full Maha Dasha sequence */}
              {dasha?.maha_list && (
                <div className="glass p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Life-long Maha Dasha sequence</div>
                  <div className="mt-3 overflow-hidden">
                    <div className="grid grid-cols-4 text-[10px] uppercase tracking-widest text-[#a0a0a0] pb-2">
                      <div>#</div><div>Lord</div><div>Start</div><div>End</div>
                    </div>
                    {dasha.maha_list.map((m, i) => {
                      const isCurrent = m.lord === dasha.current?.maha?.lord && m.start === dasha.current?.maha?.start;
                      return (
                        <div key={i} className={`grid grid-cols-4 text-xs py-2 border-t border-white/5 ${isCurrent ? "bg-[#d4a853]/10" : ""}`} data-testid={`maha-${i}`}>
                          <div>{i + 1}</div>
                          <div className={isCurrent ? "text-[#f4d68c] font-semibold" : "text-[#f4d68c]"}>{m.lord}</div>
                          <div className="text-[#a0a0a0]">{m.start.slice(0, 10)}</div>
                          <div className="text-[#a0a0a0]">{m.end.slice(0, 10)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Real Quest AI */}
              <div className="glass p-5">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Ask Fatelyn — live AI (uses your real chart context)</div>
                <div className="flex gap-2 mt-3">
                  <input
                    value={questQ}
                    onChange={(e) => setQuestQ(e.target.value)}
                    placeholder="Ask about career, love, growth…"
                    className="flex-1 bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-sm"
                    data-testid="dash-quest-input"
                  />
                  <button disabled={questBusy || !questQ.trim()} onClick={ask} className="btn-gold text-xs disabled:opacity-40" data-testid="dash-quest-ask-btn">
                    {questBusy ? "…" : "Ask"}
                  </button>
                </div>
                {questAns && (
                  <div className="mt-4 p-4 bg-white/[0.02] rounded-lg border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest text-[#f4d68c] mb-2">Guidance</div>
                    <p className="text-sm text-[#e0e0e0] whitespace-pre-wrap leading-relaxed">{questAns.answer}</p>
                  </div>
                )}
                <div className="text-[10px] text-[#a0a0a0] italic mt-3">For guidance & self-reflection only — not a substitute for professional advice.</div>
              </div>
            </div>

            {/* Right column — real Panchang + real Gochar (no mock phone frames) */}
            <aside className="space-y-6">
              {panchang && (
                <div className="glass p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Panchang · {panchang.date}</div>
                  <div className="mt-3 space-y-1 text-xs">
                    <Row k="Tithi" v={panchang.tithi} />
                    <Row k="Paksha" v={panchang.paksha} />
                    <Row k="Nakshatra" v={panchang.nakshatra} />
                    <Row k="Yog" v={panchang.yog} />
                    <Row k="Karan" v={panchang.karan} />
                    <Row k="Sunrise" v={panchang.sunrise} />
                    <Row k="Sunset" v={panchang.sunset} />
                    <Row k="Moonrise" v={panchang.moonrise} />
                    <Row k="Moonset" v={panchang.moonset} />
                  </div>
                </div>
              )}
              {gochar && (
                <div className="glass p-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Today's Gochar · live transits</div>
                  <div className="mt-3 space-y-1.5 text-xs">
                    {gochar.planets.map((p) => (
                      <div key={p.name} className="flex justify-between border-b border-white/5 py-1" data-testid={`gochar-${p.name.toLowerCase()}`}>
                        <span className="text-[#f4d68c]">{p.name}{p.retro && " ʀ"}</span>
                        <span className="text-right">
                          <span className="text-white">{p.sign}</span>
                          <span className="text-[#a0a0a0] ml-2">{p.degree}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
        {loading && !birth && (
          <div className="text-center text-[#a0a0a0] text-sm mt-6">Loading your sky…</div>
        )}
      </main>
    </div>
  );
}

function BirthForm({ form, setForm, onSave, saving, name }) {
  return (
    <div className="glass glass-gold p-6 max-w-2xl mx-auto">
      <h2 className="font-serif-lux text-3xl text-gold">Welcome, {name}</h2>
      <p className="text-xs text-[#a0a0a0] mt-1">Add your birth details to unlock your real chart, dasha, and daily panchang.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
        <Input label="Year" value={form.year} onChange={(v) => setForm({ ...form, year: +v || form.year })} testId="birth-year" />
        <Input label="Month (1-12)" value={form.month} onChange={(v) => setForm({ ...form, month: +v || form.month })} testId="birth-month" />
        <Input label="Day (1-31)" value={form.day} onChange={(v) => setForm({ ...form, day: +v || form.day })} testId="birth-day" />
        <Input label="Hour (0-23)" value={form.hour} onChange={(v) => setForm({ ...form, hour: +v || 0 })} testId="birth-hour" />
        <Input label="Minute (0-59)" value={form.minute} onChange={(v) => setForm({ ...form, minute: +v || 0 })} testId="birth-minute" />
        <Input label="TZ Offset (h)" value={form.tz_offset} onChange={(v) => setForm({ ...form, tz_offset: parseFloat(v) || 0 })} testId="birth-tz" />
        <Input label="Latitude" value={form.latitude} onChange={(v) => setForm({ ...form, latitude: parseFloat(v) || 0 })} testId="birth-lat" />
        <Input label="Longitude" value={form.longitude} onChange={(v) => setForm({ ...form, longitude: parseFloat(v) || 0 })} testId="birth-lng" />
        <Input label="Place" value={form.place} onChange={(v) => setForm({ ...form, place: v })} testId="birth-place" />
      </div>
      <button onClick={onSave} disabled={saving} className="btn-gold mt-5 w-full disabled:opacity-50" data-testid="birth-save-btn">
        {saving ? "Computing your chart…" : "Reveal my chart"}
      </button>
    </div>
  );
}

function Input({ label, value, onChange, testId }) {
  return (
    <div className="glass p-2">
      <div className="text-[9px] uppercase tracking-widest text-[#a0a0a0]">{label}</div>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent outline-none text-white text-sm mt-1" data-testid={testId} />
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-1">
      <span className="text-[#a0a0a0]">{k}</span>
      <span className="text-[#f4d68c]">{v}</span>
    </div>
  );
}

function DashaLevel({ label, data }) {
  if (!data) return null;
  return (
    <div className="glass p-3" data-testid={`dasha-${label}`}>
      <div className="text-[9px] uppercase tracking-widest text-[#a0a0a0]">{label} dasha</div>
      <div className="font-serif-lux text-xl text-gold mt-1">{data.lord}</div>
      <div className="text-[9px] text-[#a0a0a0] mt-1">
        {data.start.slice(0, 10)}
        <br />→ {data.end.slice(0, 10)}
      </div>
    </div>
  );
}
