import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { formatApiError } from "../lib/api";
import { LOGO_URL } from "../data/mockData";

export default function Signup() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      await register(email, password, name);
      nav("/dashboard", { replace: true });
    } catch (e2) {
      setErr(formatApiError(e2.response?.data?.detail) || e2.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen cosmic-bg stars flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex flex-col items-center gap-2" data-testid="signup-logo-link">
          <img src={LOGO_URL} alt="Fatelyn" className="w-14 h-14 object-contain" />
          <div className="font-serif-lux text-3xl text-gold">FATELYN</div>
        </Link>

        <form onSubmit={submit} className="glass mt-10 p-6 space-y-4">
          <h1 className="font-serif-lux text-2xl text-white">Begin your journey</h1>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-white text-sm" required data-testid="signup-name-input" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-white text-sm" type="email" required data-testid="signup-email-input" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#a0a0a0]">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-b border-white/20 focus:border-[#d4a853] py-2 outline-none text-white text-sm" type="password" required minLength={6} data-testid="signup-password-input" />
            <div className="text-[10px] text-[#a0a0a0] mt-1">Min 6 chars</div>
          </div>
          {err && <div className="text-red-300 text-xs" data-testid="signup-error">{err}</div>}
          <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-50" data-testid="signup-submit-btn">
            {busy ? "Creating…" : "Create account"}
          </button>
          <div className="text-center text-xs text-[#a0a0a0]">
            Already have an account? <Link to="/login" className="text-[#f4d68c]" data-testid="signup-login-link">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
