import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

export default function AuthCallback() {
  const { loginWithGoogleSession } = useAuth();
  const nav = useNavigate();
  const done = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const hash = window.location.hash || "";
    const match = hash.match(/session_id=([^&]+)/);
    const session_id = match ? decodeURIComponent(match[1]) : null;
    if (!session_id) {
      nav("/login", { replace: true });
      return;
    }
    // clear the hash
    window.history.replaceState(null, "", window.location.pathname);
    loginWithGoogleSession(session_id)
      .then((u) => nav(u.role === "admin" ? "/admin" : "/dashboard", { replace: true }))
      .catch((e) => { setError(e.response?.data?.detail || "Login failed"); setTimeout(() => nav("/login"), 2500); });
  }, [loginWithGoogleSession, nav]);

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center text-[#f4d68c] text-sm">
      {error ? `⚠ ${error}` : "Completing sign-in…"}
    </div>
  );
}
