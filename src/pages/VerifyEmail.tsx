import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { authService } from "../services/auth";
import { toApiError } from "../services/api";
import { getSessionUser, setSessionUser } from "../services/session";

const message = (error: unknown) => toApiError(error).message;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionUser = getSessionUser();
  const [email, setEmail] = useState<string>(sessionUser?.email ?? "");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const verify = async (token: string) => {
    setVerifying(true);
    try {
      const data = await authService.verifyEmail(token);
      if (sessionUser && !data.user) {
        setSessionUser({ ...sessionUser, isEmailVerified: true });
      } else if (data.user) {
        setSessionUser(data.user);
      }
      toast.success(data.message || "Email verified!");
      navigate("/discover");
    } catch (error) {
      toast.error(message(error));
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token && !verifying) {
      void verify(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const resend = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.resendVerification(email.trim());
      toast.success(data.message || "Verification email sent.");
    } catch (error) {
      toast.error(message(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" className="auth-logo auth-brand-logo">
          <img src="/logo.jpeg" className="brand-logo" alt="Lovinara" />
        </Link>
        <p className="auth-tag">Almost there</p>
        <h1 className="auth-title">Confirm your email</h1>
        <p className="auth-subtitle">
          Verify your inbox to unlock discovery. Once confirmed, you can sign in
          and start meeting new people.
        </p>

        {verifying ? (
          <div className="auth-form">
            <p className="text-center text-sm text-slate-500">
              <LoaderCircle className="animate-spin inline-block" size={16} /> Verifying your email…
            </p>
          </div>
        ) : searchParams.get("token") ? (
          <div className="auth-form">
            <p className="text-center text-sm text-slate-500">Checking your link…</p>
          </div>
        ) : (
          <form onSubmit={resend} className="auth-form">
            <label className="input-group">
              <span>Email address</span>
              <div className="input-with-icon">
                <Mail size={17} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
            </label>
            <button disabled={loading} className="auth-btn">
              {loading && <LoaderCircle className="animate-spin" size={18} />}
              {loading ? "Sending…" : "Resend verification email"}
            </button>
            <p className="mt-3 flex items-center gap-1 text-center text-xs text-slate-400">
              <ShieldCheck size={14} className="text-[#8c0026]" />
              Your inbox link is valid for 60 minutes.
            </p>
          </form>
        )}

        <p className="auth-footer-link">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}