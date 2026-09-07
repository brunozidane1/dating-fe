import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../services/api";
import { getSessionUser } from "../services/session";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!getToken() || !getSessionUser()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
