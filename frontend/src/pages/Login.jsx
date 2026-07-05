import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { formatApiError } from "../lib/api";
import { LOGO_URL } from "../data/mockData";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || "/dashboard";

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const u = await login(email, password);
      nav(u.role === "admin" ? "/admin" : from, { replace: true });
    } catch (e2) {
      setErr(formatApiError(e2.response?.data?.detail) || e2.message);
    } finally { setBusy(false); }
  };

  const google = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/dashboard";
    window.location.href = `https://auth.Fatelynagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen cosmic-bg stars flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center gap-2" data-testid="login-logo-link">
          <img src={LOGO_URL} alt="Fatelyn" className="w-14 h-14 object-contain" />
          <div className="font-serif-lux text-3xl text-gold">FATELYN</div>
          <div className="text-[10px] uppercase tracking-[0.35em] text-[#a0a0a0]">Unlocking Hidden Truth</div>
        </Link>

        <form onSubmit={submit} className="glass mt-10 p-6 space-y-4">
          <h1 className="font-serif-lux text-2xl text-white">Welcome back</h1>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-white text-sm"
              placeholder="you@example.com"
              type="email"
              required
              data-testid="login-email-input"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-white text-sm"
              placeholder="••••••••"
              type="password"
              required
              data-testid="login-password-input"
            />
          </div>
          {err && <div className="text-red-300 text-xs" data-testid="login-error">{err}</div>}
          <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-50" data-testid="login-submit-btn">
            {busy ? "Signing in…" : "Login"}
          </button>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-[#a0a0a0]">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <button type="button" onClick={google} className="btn-outline-gold w-full text-sm" data-testid="login-google-btn">
            Continue with Google
          </button>
          <div className="text-center text-xs text-[#a0a0a0]">
            New here? <Link to="/signup" className="text-[#f4d68c]" data-testid="login-signup-link">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
