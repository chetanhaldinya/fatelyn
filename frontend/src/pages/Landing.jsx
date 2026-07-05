import React from "react";
import { Link } from "react-router-dom";
import { LOGO_URL, IMG, PLANS } from "../data/mockData";
import { PhoneFrame } from "../components/PhoneFrame";
import { DashboardScreen, QuestScreen, SubscriptionScreen } from "../components/screens";
import { useAuth } from "../lib/AuthContext";

const noop = () => {};

export default function Landing() {
  const { user } = useAuth();
  return (
    <div className="cosmic-bg min-h-screen">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Fatelyn" className="w-10 h-10 object-contain" />
          <div>
            <div className="font-serif-lux text-2xl text-gold leading-none">FATELYN</div>
            <div className="text-[9px] uppercase tracking-[0.35em] text-[#a0a0a0]">Unlocking Hidden Truth</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#e0e0e0]">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <Link to="/showcase" className="text-[#f4d68c]" data-testid="nav-showcase-link">All Screens</Link>
          <Link to="/prototype" className="text-[#f4d68c]" data-testid="nav-prototype-link">Prototype</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="btn-gold text-sm" data-testid="nav-dashboard-btn">
              {user.role === "admin" ? "Admin" : "Dashboard"}
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[#f4d68c] hidden md:inline" data-testid="nav-login-link">Login</Link>
              <Link to="/signup" className="btn-gold text-sm" data-testid="nav-signup-btn">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative stars overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-up">
            <div className="text-xs uppercase tracking-[0.4em] text-[#f4d68c] mb-4">
              Vedic Astrology · Lifestyle Motivation
            </div>
            <h1 className="font-serif-lux text-5xl md:text-7xl leading-[1.05] tracking-tight">
              Unlocking <span className="text-gold italic">every</span> <br />
              hidden truth.
            </h1>
            <p className="text-lg text-[#e0e0e0] mt-6 leading-relaxed max-w-lg">
              FATELYN blends ancient Vedic wisdom with modern AI to help you reflect, plan and live
              with clarity — never fear.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/prototype" className="btn-gold" data-testid="hero-cta-primary">Explore Prototype</Link>
              <Link to="/showcase" className="btn-outline-gold" data-testid="hero-cta-secondary">See All Screens</Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-xs text-[#a0a0a0]">
              <div>
                <div className="font-serif-lux text-2xl text-gold">4.8★</div>
                <div>10k reviews</div>
              </div>
              <div>
                <div className="font-serif-lux text-2xl text-gold">120k+</div>
                <div>Charts read</div>
              </div>
              <div>
                <div className="font-serif-lux text-2xl text-gold">98%</div>
                <div>Helpful rating</div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute w-96 h-96 rounded-full bg-[#d4a853]/20 blur-3xl -z-10" />
            <div className="float-3d">
              <PhoneFrame testId="hero-phone">
                <DashboardScreen go={noop} />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.4em] text-[#f4d68c]">What's inside</div>
          <h2 className="font-serif-lux text-4xl md:text-5xl mt-3">A universe in your pocket</h2>
        </div>
        <div className="grid md:grid-cols-6 gap-4">
          <FeatureCard span="md:col-span-3" title="AI Quest" body="Ask anything. Get short, honest, chart-aware guidance in seconds." img={IMG.cosmic[0]} />
          <FeatureCard span="md:col-span-3" title="Compatibility" body="6-way score breakdown with your friends, partners and family." img={IMG.friends[3]} />
          <FeatureCard span="md:col-span-2" title="Birth Chart" body="D1–D60 divisional charts, dashas, ashtakvarga, dosha, rajyog." img={IMG.compass[0]} />
          <FeatureCard span="md:col-span-2" title="Milestones" body="Log life events. Discover the celestial pattern in your journey." img={IMG.journal[0]} />
          <FeatureCard span="md:col-span-2" title="Yearly Outlook" body="12-month theme-by-theme plan with monthly reflections." img={IMG.lifestyle[2]} />
        </div>
      </section>

      {/* Phone showcase strip */}
      <section className="py-16 border-y border-white/5 bg-black/20">
        <div className="text-center mb-10 px-6">
          <div className="text-xs uppercase tracking-[0.4em] text-[#f4d68c]">Preview</div>
          <h2 className="font-serif-lux text-4xl md:text-5xl mt-3">Designed for daily lifestyle</h2>
          <p className="text-sm text-[#a0a0a0] mt-2 max-w-lg mx-auto">Try 3 core screens right here — or open the full clickable prototype.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <PhoneFrame label="Quest AI"><QuestScreen go={noop} /></PhoneFrame>
          <PhoneFrame label="Dashboard"><DashboardScreen go={noop} /></PhoneFrame>
          <PhoneFrame label="Subscription"><SubscriptionScreen go={noop} /></PhoneFrame>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.4em] text-[#f4d68c]">Pricing</div>
          <h2 className="font-serif-lux text-4xl md:text-5xl mt-3">Choose your journey</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div key={p.key} className={`glass p-6 ${p.highlight ? "glass-gold" : ""}`}>
              {p.highlight && <div className="text-[10px] uppercase tracking-widest text-[#0a0a0f] inline-block bg-[#d4a853] px-2 py-0.5 rounded-full mb-3">Best Value</div>}
              <div className="font-serif-lux text-3xl text-white">{p.name}</div>
              <div className="mt-1 text-[#a0a0a0] text-xs">{p.period}</div>
              <div className="mt-4 font-serif-lux text-5xl text-gold">{p.price}</div>
              <ul className="mt-5 space-y-2 text-sm text-[#e0e0e0]">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-[#f4d68c]">✦</span>{f}</li>
                ))}
              </ul>
              <Link to="/prototype" className={`inline-block mt-6 w-full text-center ${p.highlight ? "btn-gold" : "btn-outline-gold"}`} data-testid={`landing-plan-${p.key}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { q: "The Quest feature is like talking to a wise, honest friend. No drama, just clarity.", n: "Ananya · Mumbai" },
            { q: "Finally an astrology app that respects my intelligence — no dooms-day predictions.", n: "Vikram · Bengaluru" },
            { q: "Compatibility breakdown helped me actually understand my partner's love language.", n: "Riya · Delhi" },
          ].map((t, i) => (
            <div key={i} className="glass p-6">
              <div className="text-3xl text-gold font-serif-lux leading-none mb-3">"</div>
              <p className="text-sm text-[#e0e0e0] leading-relaxed">{t.q}</p>
              <div className="text-xs text-[#f4d68c] mt-4">{t.n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="font-serif-lux text-4xl text-gold text-center mb-8">FAQ</h2>
        <div className="space-y-3">
          {[
            ["Is Fatelyn approved on App Store & Play Store?", "Fatelyn is built for the Lifestyle / Entertainment category. All content is framed as guidance & self-reflection — never deterministic — following both stores' policies."],
            ["Is my birth data private?", "Absolutely. Your birth details are used only to generate your charts and are never sold or shared."],
            ["Do I need to know astrology?", "No. Every insight is written in plain language with a reflection prompt."],
            ["Can I cancel my subscription anytime?", "Yes — one tap in Settings. No hidden fees."],
          ].map(([q, a]) => (
            <details key={q} className="glass p-4">
              <summary className="cursor-pointer font-serif-lux text-lg text-white">{q}</summary>
              <p className="text-sm text-[#e0e0e0] mt-2 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto text-center px-6 py-24">
        <h2 className="font-serif-lux text-5xl md:text-6xl text-gold">Ready to unlock your sky?</h2>
        <p className="text-sm text-[#a0a0a0] mt-4 max-w-lg mx-auto">Coming soon on iOS and Android. Try the prototype today.</p>
        <div className="flex justify-center gap-3 mt-8">
          <button className="btn-outline-gold" data-testid="cta-appstore-btn">App Store · Coming soon</button>
          <button className="btn-outline-gold" data-testid="cta-playstore-btn">Play Store · Coming soon</button>
        </div>
        <div className="mt-6">
          <Link to="/prototype" className="btn-gold" data-testid="cta-final-prototype">Try the Prototype</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10 text-center text-xs text-[#a0a0a0]">
        <div className="flex justify-center items-center gap-3 mb-3">
          <img src={LOGO_URL} className="w-8 h-8" alt="" />
          <span className="font-serif-lux text-gold text-lg">FATELYN</span>
        </div>
        <div className="italic opacity-70 max-w-lg mx-auto">
          For guidance & self-reflection only — not a substitute for professional advice.
        </div>
        <div className="mt-3">© 2026 FATELYN · Privacy · Terms · Support</div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, body, img, span }) {
  return (
    <div className={`glass p-6 relative overflow-hidden ${span}`}>
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#f4d68c]">Feature</div>
        <div className="font-serif-lux text-3xl text-white mt-2">{title}</div>
        <p className="text-sm text-[#e0e0e0] mt-3 leading-relaxed max-w-sm">{body}</p>
      </div>
    </div>
  );
}
