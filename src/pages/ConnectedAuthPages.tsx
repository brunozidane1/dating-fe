import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { BriefcaseBusiness, Camera, Eye, EyeOff, Heart, ImagePlus, LoaderCircle, Lock, Mail, MapPin, School, UserRound, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authService } from "../services/auth";
import { toApiError } from "../services/api";
import { getSessionUser, setSessionUser } from "../services/session";

const preferences = ["Women", "Men", "Non-binary people", "Everyone"];
const goals = ["Long-term relationship", "Life partner", "Dating with intention", "New connections"];
const languages = ["Words of affirmation", "Quality time", "Physical touch", "Acts of service", "Receiving gifts"];

const message = (error: unknown) => toApiError(error).message;

function PasswordField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="input-with-icon">
      <Lock size={17} className="input-icon" />
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#8c0026]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export function ConnectedLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setSessionUser(data.user);
      toast.success("Welcome back!");
      navigate(data.user.role === "admin" ? "/admin" : (data.requiresProfileCompletion ? "/profile/complete" : "/discover"));
    } catch (error) {
      const apiError = toApiError(error);
      if (apiError.code === "EMAIL_NOT_VERIFIED" || apiError.status === 403) {
        toast.error("Please verify your email to sign in.");
        navigate("/verify-email");
      } else {
        toast.error(apiError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={submit} className="auth-card">
        <Link to="/" className="auth-logo">
          <Heart size={22} fill="currentColor" className="text-[#8c0026]" />
          Lume
        </Link>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to return to your connections.</p>
        <div className="auth-form">
          <label className="input-group">
            <span>Email</span>
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
          <label className="input-group">
            <span>Password</span>
            <PasswordField value={password} onChange={setPassword} placeholder="••••••••" />
          </label>
          <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          <button disabled={loading} className="auth-btn">
            {loading && <LoaderCircle className="animate-spin" size={18} />} {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
        <p className="auth-footer-link">New to Lume? <Link to="/signup">Create an account</Link></p>
      </form>
    </div>
  );
}

export function ConnectedSignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await authService.signup({ fullName, email, password });
      setSessionUser(data.user);
      toast.success("Account created. Let’s finish your profile.");
      navigate("/profile/complete");
    } catch (error) {
      toast.error(message(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={submit} className="auth-card">
        <Link to="/" className="auth-logo auth-brand-logo">
          <img src="/logo.jpeg" className="brand-logo" alt="Lovinara" />
        </Link>
        <p className="auth-tag">Begin your story</p>
        <h1 className="auth-title">Make your first move</h1>
        <p className="auth-subtitle">Start with a profile that sounds like you.</p>
        <div className="auth-form">
          <label className="input-group">
            <span>Your name</span>
            <div className="input-with-icon">
              <UserRound size={16} className="input-icon" />
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                minLength={2}
                placeholder="Alex"
                autoFocus
              />
            </div>
          </label>
          <label className="input-group">
            <span>Email address</span>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="hello@example.com"
              />
            </div>
          </label>
          <label className="input-group">
            <span>Password</span>
            <PasswordField value={password} onChange={setPassword} placeholder="Uppercase, number, and symbol required" />
          </label>
          <button disabled={loading} className="auth-btn">
            {loading && <LoaderCircle className="animate-spin" size={18} />} {loading ? "Creating account…" : "Create account"}
          </button>
        </div>
        <p className="auth-footer-link">Already a member? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}

export function ConnectedCompleteProfilePage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [preferencesSelected, setPreferences] = useState<string[]>([]);
  const [goalsSelected, setGoals] = useState<string[]>([]);
  const [languagesSelected, setLanguages] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const addPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    const invalid = selected.find((file) => !file.type.startsWith("image/") || file.size > 10 * 1024 * 1024);
    if (invalid) {
      toast.error(!invalid.type.startsWith("image/") ? "Please select image files only." : "Each photo must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    const remaining = Math.max(0, 6 - files.length);
    const next = selected.slice(0, remaining);
    setFiles((current) => [...current, ...next]);
    setPhotoUrls((current) => [...current, ...next.map((file) => URL.createObjectURL(file))]);
    event.target.value = "";
  };

  const toggle = (value: string, values: string[], setter: (v: string[]) => void) => {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const interestOptions = [
    "Travel & Adventure", "Music", "Movies & TV", "Cooking & Food", "Fitness & Wellness",
    "Sports", "Reading & Books", "Art & Creativity", "Dancing", "Nature & Outdoors",
    "Faith & Spirituality", "Business & Entrepreneurship", "Technology", "Photography", "Gaming",
    "Animals & Pets", "Fashion & Style", "Concerts & Live Events", "Community & Volunteering", "Culture & Languages",
  ];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!getSessionUser()) {
      toast.error("Please sign in before completing your profile.");
      navigate("/login");
      return;
    }

    if (!files.length || !preferencesSelected.length || !goalsSelected.length || !languagesSelected.length || !bio.trim() || !interests.length) {
      toast.error("Add a photo, bio, interests, and select each of the required preferences.");
      return;
    }

    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      for (const file of files) {
        await authService.uploadProfilePhoto(file);
      }
      const data = await authService.completeProfile({
        age: Number(form.get("age")),
        gender: String(form.get("gender")),
        location: String(form.get("location")),
        occupation: String(form.get("occupation")),
        education: String(form.get("education")),
        bio: bio.trim(),
        interests,
        datingPreferences: preferencesSelected,
        relationshipGoals: goalsSelected,
        loveLanguages: languagesSelected,
      });
      setSessionUser(data.user);
      if (data.requiresEmailVerification) {
        toast.success("Profile complete! Check your inbox to verify your email.");
        navigate("/verify-email");
      } else {
        toast.success("Your profile is complete!");
        navigate("/discover");
      }
    } catch (error) {
      toast.error(message(error));
    } finally {
      setLoading(false);
    }
  };

  const group = (title: string, values: string[], selected: string[], setter: (v: string[]) => void) => (
    <section className="onboarding-section choice-section">
      <div className="onboarding-section-title">
        <h2>{title}</h2>
        <span>Required</span>
      </div>
      <div className="choice-chips">
        {values.map((value) => (
          <button
            className={selected.includes(value) ? "selected" : ""}
            type="button"
            onClick={() => toggle(value, selected, setter)}
            key={value}
          >
            {selected.includes(value) && <Heart size={12} fill="currentColor" />}
            {value}
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className="auth-wrapper profile-onboarding">
      <form onSubmit={submit} className="auth-card auth-complete-card">
        <Link to="/" className="auth-logo">
          <img src="/logo.jpeg" className="brand-logo" alt="Lovinara" />
        </Link>
        <div className="onboarding-head">
          <div>
            <p className="auth-tag">Profile setup</p>
            <h1 className="auth-title">Tell your story</h1>
            <p className="auth-subtitle">The details that make an introduction feel right.</p>
          </div>
          <span className="onboarding-step">2 of 2</span>
        </div>

        <section className="onboarding-section">
          <div className="onboarding-section-title">
            <h2>Photos</h2>
            <span>Required</span>
          </div>
          <div className="photo-picker-grid">
            <label className={`profile-photo-picker ${photoUrls[0] ? "has-photo" : ""}`}>
              {photoUrls[0] ? (
                <img src={photoUrls[0]} alt="Selected profile" />
              ) : (
                <>
                  <Camera size={22} />
                  <b>Add profile photo</b>
                  <small>Show your face clearly</small>
                </>
              )}
              <input type="file" accept="image/*" required={!files.length} onChange={addPhotos} />
            </label>
            <div className="extra-photo-grid">
              {photoUrls.slice(1).map((photo, index) => (
                <div className="extra-photo" key={photo}>
                  <img src={photo} alt={`Additional photo ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrls((all) => all.filter((item) => item !== photo));
                      setFiles((all) => all.filter((_, i) => i !== index + 1));
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {photoUrls.length < 6 && (
                <label className="extra-photo-add">
                  <ImagePlus size={18} />
                  <span>Add photos</span>
                  <small>Optional</small>
                  <input type="file" accept="image/*" multiple onChange={addPhotos} />
                </label>
              )}
            </div>
          </div>
        </section>

        <section className="onboarding-section">
          <div className="onboarding-section-title">
            <h2>Biography and interests</h2>
            <span>Visible on your profile</span>
          </div>
          <div className="onboarding-fields">
            <label className="input-group onboarding-wide">
              <span>Bio</span>
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Write a short introduction about yourself."
              />
            </label>
            <div className="input-group onboarding-wide">
              <span>Interests</span>
              <div className="choice-chips" role="group" aria-label="Interests">
                {interestOptions.map((value) => (
                  <label className={interests.includes(value) ? "selected" : ""} key={value}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={interests.includes(value)}
                      onChange={() => toggle(value, interests, setInterests)}
                    />
                    {interests.includes(value) && <Heart size={12} fill="currentColor" />}
                    {value}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="onboarding-section">
          <div className="onboarding-section-title">
            <h2>About you</h2>
          </div>
          <div className="onboarding-fields">
            <label className="input-group">
              <span>Age</span>
              <input name="age" type="number" min="18" max="100" required placeholder="28" />
            </label>
            <label className="input-group">
              <span>Gender</span>
              <select name="gender" required defaultValue="">
                <option value="" disabled>Select gender</option>
                <option>Woman</option>
                <option>Man</option>
              </select>
            </label>
            <label className="input-group onboarding-wide">
              <span>Location</span>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input name="location" required placeholder="City, country" />
              </div>
            </label>
            <label className="input-group">
              <span>Occupation</span>
              <div className="input-with-icon">
                <BriefcaseBusiness size={15} className="input-icon" />
                <input name="occupation" required placeholder="What do you do?" />
              </div>
            </label>
            <label className="input-group">
              <span>Education</span>
              <div className="input-with-icon">
                <School size={15} className="input-icon" />
                <input name="education" required placeholder="School or qualification" />
              </div>
            </label>
          </div>
        </section>

        {group("Who would you like to date?", preferences, preferencesSelected, setPreferences)}
        {group("Relationship goals", goals, goalsSelected, setGoals)}
        {group("Love languages", languages, languagesSelected, setLanguages)}

        <button disabled={loading} className="auth-btn onboarding-submit">
          {loading && <LoaderCircle className="animate-spin" size={18} />}
          {loading ? "Saving profile…" : "Complete my profile"}
        </button>
      </form>
    </div>
  );
}
