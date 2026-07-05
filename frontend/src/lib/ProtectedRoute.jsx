import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="spin-slow w-16 h-16">
          <img src="https://customer-assets.Fatelynagent.com/job_b8a82c54-1400-4535-8649-47c798b49148/artifacts/e9dj2psu_Fatelyn%20Logo.png" alt="" className="w-full h-full" />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
