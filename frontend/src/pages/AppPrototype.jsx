import React, { useState } from "react";
import { PhoneFrame } from "../components/PhoneFrame";
import {
  SplashScreen, OnboardingScreen, AuthScreen, BirthDetailsScreen,
  DashboardScreen, ChartScreen, FriendsScreen, CompatScreen,
  MilestoneScreen, QuestScreen, GocharScreen, YearlyScreen,
  SubscriptionScreen, PaymentScreen, SettingsScreen,
} from "../components/screens";
import {
  Intro1Screen, Intro2Screen, SignupBasicScreen,
  CompatIntroScreen, CompatReportScreen, CompatEmptyScreen, CompatGuideScreen, CompatBondScreen,
  AstroDetailsScreen, BirthDetailsTableScreen, DivisionalChartsScreen, D1ExplainerScreen,
  SarvashtakvargaScreen, DashaProScreen, SadeSatiScreen,
  QuestHistoryScreen, PurchasedReportsScreen, PurchasedBenefitsScreen,
  FeedbackScreen, PaymentHistoryScreen, ShareAppScreen,
} from "../components/screensExtra";
import { Link } from "react-router-dom";

const SCREENS = {
  // Onboarding
  splash: SplashScreen,
  intro1: Intro1Screen,
  intro2: Intro2Screen,
  onboarding: OnboardingScreen,
  auth: AuthScreen,
  signupBasic: SignupBasicScreen,
  birthDetails: BirthDetailsScreen,
  // Core
  dashboard: DashboardScreen,
  chart: ChartScreen,
  astroDetails: AstroDetailsScreen,
  birthTable: BirthDetailsTableScreen,
  divCharts: DivisionalChartsScreen,
  d1Explainer: D1ExplainerScreen,
  sarva: SarvashtakvargaScreen,
  dashaPro: DashaProScreen,
  sadeSati: SadeSatiScreen,
  // Friends & Compat
  friends: FriendsScreen,
  compatIntro: CompatIntroScreen,
  compatEmpty: CompatEmptyScreen,
  compat: CompatScreen,
  compatReport: CompatReportScreen,
  compatGuide: CompatGuideScreen,
  compatBond: CompatBondScreen,
  // Modules
  milestone: MilestoneScreen,
  quest: QuestScreen,
  questHistory: QuestHistoryScreen,
  gochar: GocharScreen,
  yearly: YearlyScreen,
  // Billing
  subscription: SubscriptionScreen,
  payment: PaymentScreen,
  purchasedReports: PurchasedReportsScreen,
  purchasedBenefits: PurchasedBenefitsScreen,
  paymentHistory: PaymentHistoryScreen,
  // Profile
  settings: SettingsScreen,
  feedback: FeedbackScreen,
  shareApp: ShareAppScreen,
};

const ORDER = [
  ["Onboarding", ["splash", "intro1", "intro2", "onboarding", "auth", "signupBasic", "birthDetails"]],
  ["Home & Chart", ["dashboard", "chart", "astroDetails", "birthTable", "divCharts", "d1Explainer", "sarva", "dashaPro", "sadeSati"]],
  ["Friends & Compat", ["friends", "compatIntro", "compatEmpty", "compat", "compatReport", "compatGuide", "compatBond"]],
  ["Modules", ["milestone", "quest", "questHistory", "gochar", "yearly"]],
  ["Billing", ["subscription", "payment", "purchasedReports", "purchasedBenefits", "paymentHistory"]],
  ["Profile", ["settings", "feedback", "shareApp"]],
];

export default function AppPrototype() {
  const [screen, setScreen] = useState("splash");
  const [params, setParams] = useState({});

  const go = (name, extra) => {
    if (extra) setParams(extra);
    if (SCREENS[name]) setScreen(name);
  };

  const Screen = SCREENS[screen] || SplashScreen;

  return (
    <div className="min-h-screen cosmic-bg flex flex-col lg:flex-row gap-8 p-6 lg:p-12">
      <aside className="lg:w-72 lg:sticky lg:top-6 self-start">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-[#a0a0a0] hover:text-[#f4d68c]" data-testid="proto-home-link">
          ← Fatelyn
        </Link>
        <h2 className="font-serif-lux text-3xl text-gold mt-2">Prototype</h2>
        <p className="text-xs text-[#a0a0a0] mt-1">All {Object.keys(SCREENS).length} screens · click any to preview.</p>
        <Link to="/showcase" className="btn-outline-gold text-xs mt-4 inline-block" data-testid="proto-showcase-link">
          View all screens →
        </Link>
        <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {ORDER.map(([group, keys]) => (
            <div key={group}>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c] mb-2">{group}</div>
              <div className="space-y-1">
                {keys.map((k) => (
                  <button
                    key={k}
                    onClick={() => setScreen(k)}
                    className={`w-full text-left text-[13px] px-3 py-1.5 rounded-lg transition ${
                      screen === k
                        ? "bg-[#d4a853]/20 text-[#f4d68c] border border-[#d4a853]/40"
                        : "text-[#e0e0e0] hover:bg-white/5"
                    }`}
                    data-testid={`nav-screen-${k}`}
                  >
                    {formatLabel(k)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex justify-center items-start">
        <PhoneFrame label={formatLabel(screen)} testId="prototype-phone">
          <Screen go={go} params={params} />
        </PhoneFrame>
      </div>

      <aside className="lg:w-72 hidden lg:block">
        <div className="glass p-4">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#f4d68c]">Flutter dev notes</div>
          <ul className="mt-3 text-xs text-[#e0e0e0] space-y-2 leading-relaxed">
            <li>• Screen: <span className="text-[#f4d68c]">{screen}</span></li>
            <li>• Total screens: <span className="text-[#f4d68c]">{Object.keys(SCREENS).length}</span></li>
            <li>• Buttons carry <code className="text-[#f4d68c]">data-testid</code>.</li>
            <li>• Theme locked in <code>index.css</code>.</li>
            <li>• Quest is powered by live AI (Claude Sonnet 4.6).</li>
            <li>• Payment uses Stripe test public key.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function formatLabel(k) {
  return k
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
}
