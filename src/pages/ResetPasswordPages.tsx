import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { toApiError } from "../services/api";
import { authService } from "../services/auth";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (requestError) {
      setError(toApiError(requestError).message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="auth-wrapper"><form onSubmit={submit} className="auth-card"><Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16}/> Back to sign in</Link><p className="auth-tag">Account recovery</p><h1 className="auth-title mt-6">Reset your password</h1><p className="auth-subtitle">Enter your email and we’ll send reset instructions.</p><div className="auth-form"><label className="input-group"><span>Email</span><div className="input-with-icon"><Mail size={17} className="input-icon"/><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="hello@example.com"/></div></label><button disabled={loading} className="auth-btn">{loading ? "Sending…" : "Send reset link"}</button>{sent && <p className="text-center text-sm font-medium text-emerald-700">Check your inbox for the reset link.</p>}{error && <p className="text-center text-sm font-medium text-rose-700">{error}</p>}</div></form></div>;
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = params.get("token") || "";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!token) return setError("This reset link is invalid or incomplete.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      navigate("/login");
    } catch (requestError) {
      setError(toApiError(requestError).message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="auth-wrapper"><form onSubmit={submit} className="auth-card"><Link to="/login" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-950"><ArrowLeft size={16}/> Back to sign in</Link><p className="auth-tag">Account recovery</p><h1 className="auth-title mt-6">Choose a new password</h1><p className="auth-subtitle">Use at least 8 characters including an uppercase letter, number, and symbol.</p><div className="auth-form"><label className="input-group"><span>New password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8}/></label><label className="input-group"><span>Confirm new password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8}/></label><button disabled={loading || !token} className="auth-btn">{loading ? "Resetting…" : "Reset password"}</button>{error && <p className="text-center text-sm font-medium text-rose-700">{error}</p>}</div></form></div>;
}
