import React from "react";
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

const noop = () => {};

const ALL = [
  // Onboarding
  ["01 · Splash", SplashScreen],
  ["02 · Intro Storytelling", Intro1Screen],
  ["03 · Intro Persona", Intro2Screen],
  ["04 · Onboarding Swipe", OnboardingScreen],
  ["05 · Login", AuthScreen],
  ["06 · Signup Basic", SignupBasicScreen],
  ["07 · Birth Details Wizard", BirthDetailsScreen],
  // Home + Chart deep dive
  ["08 · Dashboard", DashboardScreen],
  ["09 · My Chart (tabs)", ChartScreen],
  ["10 · Astro Details Table", AstroDetailsScreen],
  ["11 · Birth Details Table", BirthDetailsTableScreen],
  ["12 · Divisional Charts D1–D60", DivisionalChartsScreen],
  ["13 · D1 Birth Chart Explainer", D1ExplainerScreen],
  ["14 · Sarvashtakvarga", SarvashtakvargaScreen],
  ["15 · Dasha Pro (Maha/Antar/Praty)", DashaProScreen],
  ["16 · Sade Sati Phases", SadeSatiScreen],
  // Friends & Compat
  ["17 · Friends", FriendsScreen],
  ["18 · Compatibility Intro", CompatIntroScreen],
  ["19 · Compatibility Empty", CompatEmptyScreen],
  ["20 · Compatibility Summary", CompatScreen],
  ["21 · Compatibility Report", CompatReportScreen],
  ["22 · Compatibility Guide", CompatGuideScreen],
  ["23 · Compatibility Bond", CompatBondScreen],
  // Modules
  ["24 · Milestones", MilestoneScreen],
  ["25 · Quest AI", QuestScreen],
  ["26 · Quest History", QuestHistoryScreen],
  ["27 · Gochar / Panchang", GocharScreen],
  ["28 · Yearly Report", YearlyScreen],
  // Billing
  ["29 · Subscription", SubscriptionScreen],
  ["30 · Payment (sandbox)", PaymentScreen],
  ["31 · Purchased Reports", PurchasedReportsScreen],
  ["32 · Purchased Benefits", PurchasedBenefitsScreen],
  ["33 · Payment History", PaymentHistoryScreen],
  // Profile
  ["34 · Settings", SettingsScreen],
  ["35 · Suggestion & Feedback", FeedbackScreen],
  ["36 · Share App", ShareAppScreen],
];

export default function Showcase() {
  return (
    <div className="min-h-screen cosmic-bg stars py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-[#a0a0a0]" data-testid="showcase-home-link">
          ← Home
        </Link>
        <h1 className="font-serif-lux text-5xl md:text-6xl text-gold mt-4">All Screens · Design Handoff</h1>
        <p className="text-sm text-[#e0e0e0] mt-3 max-w-xl mx-auto">
          All {ALL.length} FATELYN screens rendered inside realistic phone frames.
          Share this page with your Flutter developer.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <Link to="/prototype" className="btn-gold text-sm" data-testid="showcase-prototype-link">Interactive prototype</Link>
          <a href="#screens" className="btn-outline-gold text-sm">Scroll gallery</a>
        </div>
      </div>

      <div id="screens" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 max-w-7xl mx-auto place-items-center">
        {ALL.map(([label, C]) => (
          <div key={label} className="flex flex-col items-center">
            <PhoneFrame label={label} testId={`showcase-${label.split(" · ")[0]}`}>
              <C go={noop} params={{ plan: "yearly" }} />
            </PhoneFrame>
          </div>
        ))}
      </div>
    </div>
  );
}
