import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { http } from "./api";

const AuthContext = createContext({ user: null, loading: true, login: () => {}, logout: () => {}, refresh: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    try {
      // skip /me during Google OAuth callback (URL fragment)
      if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
        setLoading(false);
        return;
      }
      const { data } = await http.get("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  const login = async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    setUser(data);
    return data;
  };

  const register = async (email, password, name) => {
    const { data } = await http.post("/auth/register", { email, password, name });
    setUser(data);
    return data;
  };

  const loginWithGoogleSession = async (session_id) => {
    const { data } = await http.post("/auth/google", { session_id });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try { await http.post("/auth/logout"); } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogleSession, refresh: check }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
