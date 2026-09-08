import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../services/api";
import { getSessionUser } from "../services/session";

export default function ProtectedRoute({ children, requireRole }: { children: ReactNode; requireRole?: "user" | "admin" }) {
  const location = useLocation();
  const user = getSessionUser();
  if (!getToken() || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (requireRole && user.role !== requireRole) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/discover"} replace />;
  }
  return <>{children}</>;
}
