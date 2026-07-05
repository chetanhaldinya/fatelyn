import React from "react";
import { LOGO_URL } from "../data/mockData";

// Reusable phone frame wrapper
export function PhoneFrame({ children, label, testId }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="phone-frame" data-testid={testId || "phone-frame"}>
        <div className="phone-inner">
          <div className="phone-notch" />
          <StatusBar />
          <div className="phone-scroll">{children}</div>
        </div>
      </div>
      {label && (
        <div className="text-xs uppercase tracking-[0.2em] text-[#a0a0a0]">
          {label}
        </div>
      )}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span>●●●●</span>
        <span>5G</span>
        <span>100%</span>
      </span>
    </div>
  );
}

// Small compass logo used across screens
export function CompassMark({ size = 44 }) {
  return (
    <img
      src={LOGO_URL}
      alt="Fatelyn"
      style={{ width: size, height: size, objectFit: "contain" }}
      className="rounded-lg"
    />
  );
}

// Top bar with back button
export function TopBar({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full glass flex items-center justify-center text-[#f4d68c]"
        data-testid="topbar-back-btn"
        aria-label="back"
      >
        <ChevronLeft />
      </button>
      <div className="font-serif-lux text-xl text-gold">{title}</div>
      <div className="w-9 h-9 flex items-center justify-center">{right}</div>
    </div>
  );
}

// Bottom tab nav
export function BottomNav({ active, onNav }) {
  const items = [
    { key: "dashboard", label: "Home", icon: <Home /> },
    { key: "friends", label: "Friends", icon: <Users /> },
    { key: "chart", label: "Chart", icon: <StarIcon /> },
    { key: "milestone", label: "Path", icon: <FlagIcon /> },
    { key: "quest", label: "Quest", icon: <Sparkle /> },
  ];
  return (
    <div className="absolute bottom-3 left-3 right-3 rounded-2xl glass flex justify-around py-2 z-30">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onNav(it.key)}
          data-testid={`nav-${it.key}`}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            active === it.key ? "text-[#f4d68c]" : "text-[#a0a0a0]"
          }`}
        >
          <div className="w-5 h-5">{it.icon}</div>
          <span className="text-[10px] font-medium">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

// Simple inline SVG icons (avoid Lucide bulk import mismatch)
export const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
  </svg>
);
export const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
  </svg>
);
export const Home = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 11l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Users = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="10" r="2.5" />
    <path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" />
    <path d="M14 20c0-2 1.5-3.5 3.5-3.5S21 18 21 20" />
  </svg>
);
export const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3l2.6 5.6 6.2.6-4.7 4.2 1.4 6.1L12 16.9 6.5 19.5l1.4-6.1L3.2 9.2l6.2-.6L12 3z" strokeLinejoin="round" />
  </svg>
);
export const FlagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 21V4" strokeLinecap="round" />
    <path d="M5 4h12l-2 4 2 4H5" />
  </svg>
);
export const Sparkle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" strokeLinecap="round" />
  </svg>
);
export const Search = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>
);

export function Disclaimer() {
  return (
    <div className="mt-6 text-[10px] text-[#a0a0a0] italic text-center opacity-70 px-2">
      For guidance & self-reflection only — not a substitute for professional advice.
    </div>
  );
}

// Vedic-style birth chart (South Indian layout) — 4x4 grid
export function BirthChartSVG() {
  const boxes = [
    { n: 12, sign: "Gemini" }, { n: 1, sign: "Cancer" }, { n: 2, sign: "Leo" }, { n: 3, sign: "Virgo" },
    { n: 11, sign: "Taurus" }, { n: "", sign: "" },       { n: "", sign: "" },   { n: 4, sign: "Libra" },
    { n: 10, sign: "Aries" },  { n: "", sign: "" },       { n: "", sign: "" },   { n: 5, sign: "Scorpio" },
    { n: 9, sign: "Pisces" },  { n: 8, sign: "Aquarius" }, { n: 7, sign: "Capricorn" }, { n: 6, sign: "Sag" },
  ];
  const planets = {
    1: ["As", "Mo"], 5: ["Ve"], 6: ["Su"], 7: ["Me"], 8: ["Sa", "Ma"], 11: ["Ju"],
  };
  return (
    <div className="grid grid-cols-4 gap-1 aspect-square rounded-xl p-2 bg-gradient-to-br from-[#1e1b4b]/60 to-[#0a0a0f] border border-[rgba(212,168,83,0.25)]">
      {boxes.map((b, i) => {
        const inner = i === 5 || i === 6 || i === 9 || i === 10;
        return (
          <div
            key={i}
            className={`relative flex flex-col items-center justify-center text-[9px] ${
              inner ? "bg-transparent" : "bg-white/[0.02] border border-white/5 rounded"
            }`}
          >
            {!inner && (
              <>
                <div className="text-[#f4d68c] font-semibold">{b.n}</div>
                <div className="text-[#a0a0a0]">{b.sign}</div>
                <div className="text-[10px] text-white mt-1 flex gap-1 flex-wrap justify-center">
                  {(planets[b.n] || []).map((p, j) => (
                    <span key={j} className="px-1 rounded bg-[#d4a853]/20 text-[#f4d68c]">
                      {p}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
      <div className="absolute" />
    </div>
  );
}
