import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, BadgeCheck, Ban, Bell, Bike, BookOpen, Briefcase, Camera, Check, ChevronLeft, CircleCheck, Clock, Clapperboard, Coffee, Cpu, Dumbbell, Eye, Filter, Flame, Flower2, Footprints, Gamepad2, Heart, HeartPulse, ImagePlus, Info, LoaderCircle, Lock, MapPin, MessageCircle, Mountain, Music, Palette, Paperclip, Plane, Plus, Search, Send, Settings, Shield, ShieldCheck, SlidersHorizontal, Smile, Sparkles, Star, UtensilsCrossed, UserCheck, UserPlus, UserRound, UsersRound, Video, Wine, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { DEMO_PROFILES, DEMO_USER } from "../services/mock-data";
import type { Connection, Conversation, DiscoveryProfile, Message, NotificationItem, UserProfile } from "../types";
import { formatChatDate, formatChatTime, formatRelativeTime, timeAgo } from "../lib/utils";
import { mapApiUser, socialService } from "../services/social";
import { matchesService } from "../services/matches";
import type { MatchRow } from "../services/matches";
import { connectionsService } from "../services/connections";
import type { IncomingRequest, SentRequest } from "../services/connections";
import { notificationsService } from "../services/notifications";
import { getSessionUser, setSessionUser } from "../services/session";
import { authService } from "../services/auth";
import { api, toApiError } from "../services/api";
import { messagesService } from "../services/messages";
import { acknowledgeDelivered, acknowledgeRead, subscribeToChat, subscribeToPresence, type SocketChatMessage, type SocketChatStatus } from "../services/chat-socket";

type Toast = { message: string; tone?: "rose" | "emerald" } | null;
const CHAT_EMOJIS = ["😀", "😊", "😍", "🥰", "😂", "😉", "❤️", "🔥", "👍", "🎉", "✨", "🙌"];
const PageTitle = ({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) => <div className="page-heading"><div><p className="kicker">Lume / {title}</p><h1>{title}</h1><p>{copy}</p></div>{action}</div>;
const Online = () => <span className="online-dot" aria-label="Online"/>;
function IconAction({ label, children, onClick, busy = false, disabled = false, tone = "light" }: { label: string; children: ReactNode; onClick?: () => void; busy?: boolean; disabled?: boolean; tone?: "light" | "rose" | "dark" }) {
  const palette = tone === "rose" ? "bg-[#8c0026] text-white" : tone === "dark" ? "bg-[#e6e8ea] text-[#5b4041]" : "bg-white text-[#191c1e]";
  return <button type="button" onClick={onClick} disabled={busy || disabled} aria-label={label} data-tooltip={label} className={`action-icon ${palette}`}>{busy ? <LoaderCircle size={17} className="animate-spin"/> : children}</button>;
}
function ToastNotice({ toast }: { toast: Toast }) {
  if (!toast || typeof document === "undefined") return null;
  return createPortal(<div className={`toast ${toast.tone === "emerald" ? "toast-success" : ""}`} role="status"><CircleCheck size={16}/>{toast.message}</div>, document.body);
}
function LoadingState({ label = "Loading…" }: { label?: string }) { return <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 px-6 py-20 text-center"><LoaderCircle size={30} className="animate-spin text-[#8c0026]"/><p className="text-[13px] font-medium text-[#5b4041]">{label}</p></div>; }
function Avatar({ person, size = "md" }: { person: UserProfile; size?: "sm" | "md" | "lg" }) { return <div className={`avatar avatar-${size}`}><img src={person.primaryPhoto} alt={person.name}/>{person.online && <Online/>}</div>; }
function Badge({ children, rose = false }: { children: ReactNode; rose?: boolean }) { return <span className={`chip ${rose ? "chip-rose" : ""}`}>{children}</span>; }
function Empty({ icon: Icon = Sparkles, title, copy, cta }: { icon?: typeof Sparkles; title: string; copy: string; cta?: ReactNode }) { return <div className="empty-panel"><span className="empty-icon"><Icon size={22}/></span><h2>{title}</h2><p>{copy}</p>{cta && <div className="mt-4">{cta}</div>}</div>; }
const GOAL_OPTIONS = ["Long-term relationship", "Dating intentionally", "Figuring it out"];
const INTEREST_OPTIONS = ["Photography", "Coffee", "Travel", "Music", "Art", "Fitness", "Cooking"];
const INTEREST_ICONS: Record<string, LucideIcon> = { Photography: Camera, Coffee: Coffee, Travel: Plane, Music: Music, Art: Palette, "Art & Design": Palette, Design: Palette, Fitness: Dumbbell, Cooking: UtensilsCrossed, Culinary: UtensilsCrossed, Reading: BookOpen, Cycling: Bike, Tech: Cpu, Hiking: Mountain };
function interestGlyph(name: string) { const Icon = INTEREST_ICONS[name]; return Icon ? <Icon size={12} className="shrink-0"/> : null; }
function activityLabel(user: UserProfile) { return user.online ? "Online now" : user.lastActive ? `Last active ${formatRelativeTime(user.lastActive)}` : "Last active recently"; }

export function DiscoverPage() {
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [filters, setFilters] = useState({ minAge: 18, maxAge: 100, distance: 100, verified: false, online: false, intention: "" });
  const [chips, setChips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<{ profileId: string; action: "pass" | "like" | "superlike" | "connect" } | null>(null);
  const loadProfiles = async () => { setLoading(true); try { setProfiles(await socialService.discovery()); } catch { setToast({ message: "Could not load discovery right now." }); } finally { setLoading(false); } };
  useEffect(() => { void loadProfiles(); }, []);
  const filtered = useMemo(() => profiles
    .filter((person) => (person.age ?? 0) >= filters.minAge && (person.age ?? 0) <= filters.maxAge && (!filters.online || person.online) && (!filters.verified || person.verified) && (!filters.intention || person.relationshipGoal === filters.intention) && (!chips.length || chips.some((chip) => (person.interests ?? []).includes(chip))))
    .sort((a, b) => b.matchScore.overall - a.matchScore.overall)
  , [profiles, filters, chips]);
  const toggleChip = (chip: string) => setChips((c) => c.includes(chip) ? c.filter((x) => x !== chip) : [...c, chip]);
  const resetFilters = () => { setFilters({ minAge: 18, maxAge: 100, distance: 100, verified: false, online: false, intention: "" }); setChips([]); setFilterOpen(false); };
  const reset = () => { resetFilters(); void loadProfiles(); setToast({ message: "Fresh recommendations are ready." }); };
  const applyFilters = () => { setFilterOpen(false); setToast({ message: "Discovery filters applied." }); };
  const decide = async (person: DiscoveryProfile, action: "pass" | "like" | "superlike" | "connect") => { const labels: Record<string, string> = { pass: `${person.name} was passed for now.`, like: `You liked ${person.name}.`, superlike: `You superliked ${person.name}!`, connect: `Friend request sent to ${person.name}.` }; setBusyAction({ profileId: person.id, action }); try { await socialService.discoveryAction(person.id, action); setProfiles((items) => items.filter((item) => item.id !== person.id)); setToast({ message: labels[action], tone: action === "pass" ? "rose" : "emerald" }); } catch { setToast({ message: "That action could not be saved." }); } finally { setBusyAction(null); } };
  if (loading) return <section className="app-page discover-page relative z-10 !max-w-[1600px] !px-[20px] !pb-16 !pt-2 md:!px-[40px]"><LoadingState label="Loading your recommendations…"/></section>;
  return (
    <section className="app-page discover-page relative z-10 !max-w-[1600px] !px-[20px] !pb-16 !pt-2 md:!px-[40px]">
      <ToastNotice toast={toast}/>
      <section className="mobile-discover-native" aria-label="Discover members">
        <div className="mobile-discover-head"><h1>Discover</h1><button onClick={() => setFilterOpen(true)}><Filter size={14}/> Filters</button></div>
        <div className="mobile-discover-list">{filtered.map((person) => <Link to={`/profiles/${person.id}`} className="mobile-discover-card" key={person.id}><img src={person.primaryPhoto} alt={`${person.name}'s profile`}/><div><span>{person.online ? "Online now" : "Active recently"}</span><h2>{person.name}, {person.age} {person.verified && <ShieldCheck size={14}/>}</h2><p><MapPin size={13}/>{person.location} · {person.distance} km away</p><small>{person.matchScore.overall}% match · {person.occupation}</small></div></Link>)}</div>
      </section>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="blob-1 absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-[#8c0026]/5 blur-[120px]"/>
        <div className="blob-2 absolute bottom-[-10%] right-[-5%] h-[60%] w-[60%] rounded-full bg-[#d7dff9]/25 blur-[150px]"/>
      </div>
      <div className="discover-desktop flex items-start gap-6">
        <aside className="no-scrollbar sticky top-20 hidden w-80 shrink-0 self-start overflow-y-auto pb-4 lg:block">
          <div className="glass-panel rounded-3xl p-6 shadow-[0_18px_45px_-24px_rgba(184,0,53,.28)]">
            <h3 className="font-heading text-base font-semibold tracking-tight text-[#191c1e]">Discovery</h3>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">Refine your connections based on intentional preferences.</p>
            <div className="mt-6 space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-[#191c1e]">Distance</span><span className="text-[11px] font-bold text-[#8c0026]">Up to {filters.distance} mi</span></div>
                <input className="h-1 w-full appearance-none rounded-full bg-[#e0e3e5] accent-[#8c0026] outline-none" type="range" min={1} max={100} value={filters.distance} onChange={(event) => setFilters({ ...filters, distance: +event.target.value })}/>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-[#191c1e]">Age Range</span><span className="text-[11px] font-bold text-[#8c0026]">{filters.minAge} - {filters.maxAge}</span></div>
                <div className="flex items-center gap-2">
                  <input className="h-10 w-16 rounded-lg border border-[#e4bdbe]/50 bg-[#f2f4f6] text-center text-sm font-semibold text-[#191c1e] outline-none focus:border-[#8c0026] focus:ring-2 focus:ring-[#8c0026]/20" type="number" min={18} max={80} value={filters.minAge} onChange={(event) => setFilters({ ...filters, minAge: +event.target.value })}/>
                  <span className="text-xs text-slate-400">-</span>
                  <input className="h-10 w-16 rounded-lg border border-[#e4bdbe]/50 bg-[#f2f4f6] text-center text-sm font-semibold text-[#191c1e] outline-none focus:border-[#8c0026] focus:ring-2 focus:ring-[#8c0026]/20" type="number" min={18} max={80} value={filters.maxAge} onChange={(event) => setFilters({ ...filters, maxAge: +event.target.value })}/>
                </div>
              </div>
              <div>
                <span className="mb-3 block text-xs font-semibold text-[#191c1e]">Relationship Goals</span>
                <div className="flex flex-wrap gap-2">{GOAL_OPTIONS.map((goal) => <button key={goal} onClick={() => setFilters({ ...filters, intention: filters.intention === goal ? "" : goal })} className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors ${filters.intention === goal ? "border-[#8c0026] bg-[#8c0026]/5 text-[#8c0026]" : "border-[#e4bdbe]/50 text-slate-500 hover:border-[#8c0026] hover:text-[#8c0026]"}`}>{goal}</button>)}</div>
              </div>
              <div>
                <span className="mb-3 block text-xs font-semibold text-[#191c1e]">Shared Interests</span>
                <div className="flex flex-wrap gap-2">{INTEREST_OPTIONS.map((item) => { const active = chips.includes(item); return <button key={item} onClick={() => toggleChip(item)} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${active ? "bg-[#8c0026] text-white" : "bg-[#e0e3e5]/70 text-slate-500 hover:bg-[#d8dadc]"}`}>{interestGlyph(item)}<span>{item}</span></button>; })}</div>
              </div>
            </div>
            <button onClick={applyFilters} className="mt-8 w-full rounded-xl bg-[#8c0026] py-2.5 text-xs font-bold text-white shadow-[0_12px_26px_-12px_rgba(184,0,53,.65)] transition-all hover:brightness-110 active:scale-[.97]">Apply Filters</button>
            <button onClick={reset} className="mt-2 w-full rounded-xl py-2 text-[11px] font-semibold text-slate-500 transition-colors hover:text-[#8c0026]">Reset preferences</button>
          </div>
        </aside>
        <div className="mb-4 flex w-full items-center justify-between gap-3 lg:hidden">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-[#191c1e]">Discover</h1>
          <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 rounded-full border border-[#e4bdbe]/50 bg-white/70 px-3.5 py-2 text-[11px] font-bold text-[#8c0026] backdrop-blur-md transition active:scale-95"><Filter size={14}/>Filters</button>
        </div>
        <section className="discover-results min-w-0 flex-1">
          {filtered.length ? <div className="discover-masonry">{filtered.map((person) => (
            <article key={person.id} className="group relative min-h-[360px] cursor-pointer overflow-hidden rounded-2xl bg-[#565e74] shadow-[0_22px_45px_-24px_rgba(140,0,38,.38)] sm:min-h-[400px]">
              <img src={person.primaryPhoto} alt={`${person.name}'s profile`} className="absolute inset-0 h-full w-full object-cover"/>
              <Link to={`/profiles/${person.id}`} aria-label={`View ${person.name}'s profile`} className="absolute inset-0 z-[1]"/>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
              <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"/>{person.online ? "Online" : "Active"}</span>
                <span className="rounded-full bg-[#8c0026]/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">{person.matchScore.overall}% Match</span>
              </div>
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-2">
                <h2 className="font-heading text-lg font-semibold leading-none text-white">{person.name}, {person.age} {person.verified && <ShieldCheck size={14} className="mb-1 inline-block text-[#ffc5c7]"/>}</h2>
                <p className="mt-1.5 flex items-center gap-1 text-xs text-white/80"><MapPin size={13}/>{person.location} - {person.distance} mi away</p>
                {person.bio && <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-white/90">"{person.bio}"</p>}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {person.occupation && <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold text-white"><Briefcase size={11}/>{person.occupation}</span>}
                  {person.interests?.slice(0, 2).map((tag) => <span key={tag} className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold text-white">{interestGlyph(tag)}{tag}</span>)}
                </div>
              </div>
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                <Link to={`/profile/${person.id}`} aria-label="View Profile" data-tooltip="View Profile" className="action-icon bg-white text-[#191c1e]"><Eye size={18}/></Link>
                <IconAction label="Like" tone="rose" busy={busyAction?.profileId === person.id && busyAction.action === "like"} disabled={busyAction?.profileId === person.id} onClick={() => decide(person, "like")}><Heart size={18} fill="currentColor"/></IconAction>
                <IconAction label="Connect" tone="dark" busy={busyAction?.profileId === person.id && busyAction.action === "connect"} disabled={busyAction?.profileId === person.id} onClick={() => decide(person, "connect")}><UserPlus size={18}/></IconAction>
                <IconAction label="Pass" tone="dark" busy={busyAction?.profileId === person.id && busyAction.action === "pass"} disabled={busyAction?.profileId === person.id} onClick={() => decide(person, "pass")}><X size={18}/></IconAction>
                <IconAction label="Super Like" tone="dark" busy={busyAction?.profileId === person.id && busyAction.action === "superlike"} disabled={busyAction?.profileId === person.id} onClick={() => decide(person, "superlike")}><Star size={18}/></IconAction>
              </div>
            </article>
          ))}</div> : <Empty icon={Search} title="No one matches these filters" copy="Loosen a preference or refresh your recommendations." cta={<button className="button button-primary" onClick={reset}>Refresh profiles</button>}/>}
        </section>
      </div>
      {filterOpen && <FilterPanel value={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} onReset={resetFilters}/>}
    </section>
  );
}
function FilterPanel({ value, onChange, onClose, onReset }: { value: {minAge: number; maxAge: number; distance: number; verified: boolean; online: boolean; intention: string}; onChange: (value: {minAge: number; maxAge: number; distance: number; verified: boolean; online: boolean; intention: string}) => void; onClose: () => void; onReset: () => void }) { return <div className="modal-backdrop" onMouseDown={onClose}><aside className="filter-drawer" onMouseDown={(event) => event.stopPropagation()} aria-label="Discovery filters"><div className="drawer-head"><div><p className="kicker">Discover</p><h2>Fine tune your feed</h2></div><button onClick={onClose} className="icon-button" aria-label="Close filters"><X/></button></div><div className="drawer-body"><label className="control-label">Age range <span>{value.minAge}–{value.maxAge}</span></label><div className="range-pair"><input type="number" min="18" max="60" value={value.minAge} onChange={(event) => onChange({...value, minAge: +event.target.value})}/><input type="number" min="18" max="60" value={value.maxAge} onChange={(event) => onChange({...value, maxAge: +event.target.value})}/></div><label className="control-label mt-5">Maximum distance <span>{value.distance} km</span></label><input className="range" type="range" min="5" max="100" value={value.distance} onChange={(event) => onChange({...value, distance: +event.target.value})}/><label className="control-label mt-5">Relationship intention</label><select value={value.intention} onChange={(event) => onChange({...value, intention: event.target.value})}><option value="">Any intention</option><option>Long-term relationship</option></select><label className="toggle-row"><span><b>Online now</b><small>Show active members first</small></span><input checked={value.online} type="checkbox" onChange={(event) => onChange({...value, online: event.target.checked})}/></label><label className="toggle-row"><span><b>Verified only</b><small>Show confirmed profiles</small></span><input checked={value.verified} type="checkbox" onChange={(event) => onChange({...value, verified: event.target.checked})}/></label></div><div className="drawer-foot"><button className="button button-quiet" onClick={onReset}>Reset</button><button className="button button-primary" onClick={onClose}>Apply filters</button></div></aside></div>; }


export function ProfileDetailPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const [person, setPerson] = useState<DiscoveryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => { if (!id) { setLoading(false); return; } setLoading(true); api.get<{ profile: Parameters<typeof mapApiUser>[0] }>(`/social/profiles/${id}/review`).then(({ data }) => setPerson(mapApiUser(data.profile))).catch(() => setPerson(null)).finally(() => setLoading(false)); }, [id]);
  if (loading) return <section className="app-page"><LoadingState label="Loading profile…"/></section>;
  if (!person) return <section className="app-page"><Empty title="Profile unavailable" copy="This profile may no longer be in your recommendations." cta={<Link className="button button-primary" to="/discover">Back to discover</Link>}/></section>;
  const act = async (action: "pass" | "like" | "superlike" | "connect") => { setBusy(action); try { await socialService.discoveryAction(person.id, action); setLiked(action === "like"); setToast({ message: action === "connect" ? "Connection request sent." : action === "pass" ? "Profile passed." : action === "superlike" ? "Super Like sent." : "Profile liked.", tone: action === "pass" ? "rose" : "emerald" }); } catch { setToast({ message: "That action could not be saved." }); } finally { setBusy(null); } };
  const photos = person.photos?.filter((src) => src !== person.primaryPhoto).slice(0, 2) ?? [];
  const lifestyle = person.lifestyle?.slice(0, 3) ?? [];
  return <section className="profile-view-page mx-auto max-w-7xl px-3 pb-24 pt-3 sm:px-5 md:px-8 md:pb-10 md:pt-6"><ToastNotice toast={toast}/>
    <button onClick={() => navigate(-1)} className="mb-3 inline-flex items-center gap-1 rounded-full border border-[#e4bdbe]/40 bg-white/70 px-2.5 py-1.5 text-[11px] font-semibold text-[#8c0026] backdrop-blur md:hidden"><ArrowLeft size={14}/> Back</button>
    <section className="relative h-[420px] overflow-hidden rounded-2xl shadow-[0_12px_36px_-14px_rgba(140,0,38,.35)] sm:h-[520px] md:h-[590px]">
      <img src={person.primaryPhoto} alt={person.name} className="h-full w-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"/>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
        <div className="min-w-0 text-white"><span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur">{person.online ? "Online now" : "Active recently"}</span><h1 className="mt-2 font-heading text-[26px] font-semibold leading-none tracking-tight sm:text-[32px]">{person.name}, {person.age} {person.verified && <ShieldCheck size={17} className="mb-1 inline-block text-[#ffc5c7]"/>}</h1><p className="mt-1 flex items-center gap-1 text-[11px] text-white/85 sm:text-[12px]"><MapPin size={13}/>{person.location} · {person.distance} km away</p></div>
        <div className="hidden shrink-0 gap-2 md:flex"><IconAction label="Like" tone="rose" busy={busy === "like"} onClick={() => act("like")}><Heart size={18} fill="currentColor"/></IconAction><IconAction label="Connect" busy={busy === "connect"} onClick={() => act("connect")}><UserPlus size={18}/></IconAction><IconAction label="Pass" tone="dark" busy={busy === "pass"} onClick={() => act("pass")}><X size={18}/></IconAction><IconAction label="Super Like" busy={busy === "superlike"} onClick={() => act("superlike")}><Star size={18}/></IconAction></div>
      </div>
    </section>
    <section className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
      <article className="profile-glass flex min-h-[178px] flex-col items-center justify-center rounded-2xl p-4 text-center"><div className="grid h-20 w-20 place-items-center rounded-full border-[6px] border-[#e11d48] text-[22px] font-bold text-[#8c0026]">{person.matchScore.overall}%</div><h2 className="mt-2 text-[14px] font-semibold text-[#191c1e]">Exceptional match</h2><p className="mt-1 max-w-[220px] text-[10px] leading-4 text-[#565e74]">Based on your shared values and lifestyle choices.</p></article>
      <article className="profile-glass rounded-2xl p-4 md:col-span-2"><h2 className="text-[15px] font-semibold text-[#8c0026]">The story</h2><p className="mt-2 text-[12px] leading-5 text-[#5b4041]">{person.bio} I value honest conversation, everyday kindness, and making time for the people who matter. I’m here to meet someone who enjoys building a meaningful connection at a comfortable pace.</p></article>
      <article className="profile-glass rounded-2xl p-4"><h3 className="text-[10px] font-bold uppercase tracking-[.14em] text-[#565e74]">Lifestyle</h3><div className="mt-3 space-y-2 text-[11px] text-[#191c1e]"><p className="flex items-center gap-2"><Briefcase size={14} className="text-[#8c0026]"/>{person.occupation ?? "Member"}</p><p className="flex items-center gap-2"><BookOpen size={14} className="text-[#8c0026]"/>{person.education ?? "Education not shared"}</p><p className="flex items-center gap-2"><Sparkles size={14} className="text-[#8c0026]"/>{lifestyle[0] ?? person.relationshipGoal}</p></div></article>
      <article className="profile-glass rounded-2xl p-4 md:col-span-2"><h3 className="text-[10px] font-bold uppercase tracking-[.14em] text-[#565e74]">Passions & interests</h3><div className="mt-3 flex flex-wrap gap-1.5">{[...(person.interests ?? []), ...lifestyle.slice(1)].map((item) => <span key={item} className="rounded-full bg-[#8c0026]/10 px-2.5 py-1 text-[10px] font-semibold text-[#8c0026]">{item}</span>)}</div></article>
    </section>
    {photos.length > 0 && <section className="mt-4 grid grid-cols-2 gap-3">{photos.map((src) => <img key={src} src={src} alt={`${person.name}'s gallery`} className="h-40 w-full rounded-2xl object-cover shadow-sm sm:h-56"/>)}</section>}
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[#e4bdbe]/30 bg-white/80 p-3 pb-6 backdrop-blur md:hidden"><button onClick={() => setLiked(false)} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-[#e6e8ea] py-2 text-[11px] font-bold text-[#191c1e]"><X size={15}/>Pass</button><button onClick={() => setLiked(true)} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] py-2 text-[11px] font-bold text-white"><Heart size={15} fill="currentColor"/>{liked ? "Liked" : "Like"}</button></div>
  </section>;
}
export function MatchesPage() {
  const [tab, setTab] = useState<"Mutual" | "Interested" | "My Likes">("Mutual");
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => { setLoading(true); matchesService.getMatches().then(setMatches).catch(() => setToast({ message: "Could not load matches." })).finally(() => setLoading(false)); }, []);
  const remove = (row: MatchRow) => { void matchesService.remove(row.matchId).catch(() => {}); setMatches((items) => items.filter((i) => i.matchId !== row.matchId)); setToast({ message: "Match removed from your list." }); };
  const shown = matches;
  if (loading) return <section className="relative mx-auto max-w-7xl px-[20px] pb-24 pt-6 md:px-[40px] md:pt-10"><LoadingState label="Loading your matches…"/></section>;
  return (
    <section className="relative mx-auto max-w-7xl px-[20px] pb-24 pt-6 md:px-[40px] md:pt-10">
      <ToastNotice toast={toast}/>
      {/* Tabs */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-full border border-[#e4bdbe]/30 bg-white/60 p-1 backdrop-blur-md">
          {(["Mutual", "Interested", "My Likes"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-1.5 text-[13px] font-semibold transition-colors ${tab === t ? "bg-[#8c0026] text-white shadow-sm" : "text-[#5b4041] hover:text-[#8c0026]"}`}>{t}</button>
          ))}
        </div>
      </div>
      {/* Matches Grid (discover-style cards) */}
      <div className="discover-masonry">
        {shown.map((row) => {
          const p = row.player;
          return (
          <article key={row.matchId} className="group relative min-h-[360px] cursor-pointer overflow-hidden rounded-2xl bg-[#565e74] shadow-[0_22px_45px_-24px_rgba(140,0,38,0.38)] sm:min-h-[400px]">
            <img src={p.primaryPhoto} alt={`${p.name}'s profile`} className="absolute inset-0 h-full w-full object-cover"/>
            <Link to={`/profiles/${p.id}`} aria-label={`View ${p.name}'s profile`} className="absolute inset-0 z-[1]"/>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
            <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"/>{p.online ? "Online" : "Active"}</span>
              <span className="rounded-full bg-[#8c0026]/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">{p.matchScore.overall}% Match</span>
            </div>
            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-2">
              <h2 className="font-heading text-lg font-semibold leading-none text-white">{p.name}, {p.age} {p.verified && <ShieldCheck size={14} className="mb-1 inline-block text-[#ffc5c7]"/>}</h2>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-white/80"><MapPin size={13}/>{p.location} - {p.distance} mi away</p>
              {p.bio && <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-white/90">"{p.bio}"</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.occupation && <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold text-white"><Briefcase size={11}/>{p.occupation}</span>}
                {p.interests?.slice(0, 2).map((tag) => <span key={tag} className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[10px] font-semibold text-white">{interestGlyph(tag)}{tag}</span>)}
              </div>
            </div>
            <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
              <Link to={`/profile/${p.id}`} aria-label="View Profile" data-tooltip="View Profile" className="action-icon bg-white text-[#191c1e]"><Eye size={18}/></Link>
              <Link to={`/chat/${p.id}`} aria-label="Send Message" data-tooltip="Send Message" className="action-icon bg-[#8c0026] text-white"><Send size={18}/></Link>
              <IconAction label="Remove Match" tone="dark" onClick={() => remove(row)}><X size={18}/></IconAction>
            </div>
          </article>
          );
        })}
      </div>
      {!matches.length && <p className="mt-10 text-center text-[13px] text-[#5b4041]">No matches yet — keep browsing discovery.</p>}
    </section>
  ); }

export function ConnectionsPage() {
  const [active, setActive] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const [sent, setSent] = useState<SentRequest[]>([]);
  const [history, setHistory] = useState<import("../services/connections").ConnectionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyRequest, setBusyRequest] = useState<{ id: string; action: "accept" | "decline" } | null>(null);
  const [openConnectionMenu, setOpenConnectionMenu] = useState<string | null>(null);
  const [busyConnection, setBusyConnection] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const [conns, reqs, sent, ended] = await Promise.all([connectionsService.getActive(), connectionsService.getRequests(), connectionsService.getSent(), connectionsService.getHistory()]);
        if (ignore) return;
        setActive(conns); setRequests(reqs); setSent(sent); setHistory(ended);
      } catch { if (!ignore) setToast({ message: "Could not load connections." }); } finally { if (!ignore) setLoading(false); }
    };
    void load();
    return () => { ignore = true; };
  }, []);
  useEffect(() => subscribeToPresence(
    ({ userId, online, lastActive }) => setActive((items) => items.map((item) => item.user.id === userId ? { ...item, user: { ...item.user, online, lastActive: lastActive ?? item.user.lastActive } } : item)),
    (onlineUserIds) => setActive((items) => items.map((item) => ({ ...item, user: { ...item.user, online: onlineUserIds.includes(item.user.id) } }))),
  ), []);
  const slots = active.slice(0, 3);
  const removeSlot = async (id: string) => {
    setBusyConnection(id);
    try {
      await connectionsService.remove(id);
      const removed = active.find((item) => item.id === id);
      setActive((items) => items.filter((item) => item.id !== id));
      if (removed) setHistory((items) => [{ id, user: removed.user, endedAt: new Date().toISOString() }, ...items]);
      setToast({ message: "Connection removed." });
    } catch {
      setToast({ message: "Could not remove this connection." });
    } finally {
      setBusyConnection(null);
      setOpenConnectionMenu(null);
    }
  };
  const acceptRequest = async (id: string) => {
    setBusyRequest({ id, action: "accept" });
    try {
      await connectionsService.acceptRequest(id);
      const accepted = requests.find((item) => item.id === id);
      setRequests((items) => items.filter((item) => item.id !== id));
      if (accepted) setActive((items) => [...items, { id: accepted.id, user: accepted.requester, status: "active" as const, acceptedAt: new Date().toISOString() }].slice(0, 3));
      setToast({ message: "Friend request accepted.", tone: "emerald" });
    } catch { setToast({ message: "Could not accept the request." }); } finally { setBusyRequest(null); }
  };
  const declineRequest = async (id: string) => {
    setBusyRequest({ id, action: "decline" });
    try {
      await connectionsService.declineRequest(id);
      setRequests((items) => items.filter((item) => item.id !== id));
      setToast({ message: "Friend request declined." });
    } catch { setToast({ message: "Could not decline the request." }); } finally { setBusyRequest(null); }
  };
  const pj = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;
  const insights = [
    { icon: "psychology", tint: "bg-[#ffdada] text-[#8c0026]", title: "Communication Style", text: "You tend to connect best with those who prefer deep, thoughtful evening conversations over quick daytime texts." },
    { icon: "explore", tint: "bg-[#dae2fc] text-[#565e74]", title: "Shared Interests", text: "Your current circle shows a strong mutual affinity for culinary experiences and weekend getaways." },
  ];
  if (loading) return <section className="relative mx-auto w-full max-w-7xl px-[16px] pb-20 pt-4 md:px-[32px] md:pb-10 md:pt-8"><LoadingState label="Loading your connections…"/></section>;
  return (
    <section className="relative mx-auto w-full max-w-7xl space-y-8 px-[16px] pb-20 pt-4 md:px-[32px] md:pb-10 md:pt-8">
      <ToastNotice toast={toast}/>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-[#ffdada] opacity-30 blur-[100px]"/>
        <div className="absolute bottom-[-20%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-[#dae2fc] opacity-30 blur-[120px]"/>
      </div>
      {/* Header */}
      <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-gradient mb-1 text-[30px] font-bold leading-[36px] tracking-[-0.02em] md:text-[36px] md:leading-[42px]" style={pj}>Inner Circle</h1>
          <p className="max-w-2xl text-[14px] leading-[20px] text-[#5b4041]">Your curated list of meaningful connections. Focus your energy on those who truly resonate.</p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-[#e4bdbe]/30 bg-white/60 px-3 py-1.5 backdrop-blur-md">
          {[0, 1, 2].map((i) => <span key={i} className={"material-symbols-outlined text-[16px] " + (i < slots.length ? "text-[#8c0026]" : "text-[#ffb3b6]")} style={i < slots.length ? { fontVariationSettings: "'FILL' 1" } : undefined}>circle</span>)}
          <span className="ml-2 text-[12px] font-semibold text-[#5b4041]">{slots.length} / 3 Slots Filled</span>
        </div>
      </section>
      {/* Incoming friend requests */}
      {requests.length > 0 && <section className="glass-panel rounded-[20px] p-5">
        <h2 className="text-[20px] font-semibold leading-[26px] text-[#191c1e]" style={pj}>Friend Requests</h2>
        <p className="mt-1 text-[13px] leading-[18px] text-[#5b4041]">{requests.length} pending request{requests.length === 1 ? "" : "s"} — accept one to add them to your Inner Circle.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#e4bdbe]/20 bg-white/50 p-3">
              <Link to={`/profiles/${item.requester.id}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm"><img className="h-full w-full object-cover" src={item.requester.primaryPhoto} alt={item.requester.name}/></Link>
              <div className="min-w-0 flex-1">
                <Link to={`/profiles/${item.requester.id}`} className="block truncate text-[14px] font-semibold text-[#191c1e] hover:text-[#8c0026]">{item.requester.name}, {item.requester.age}</Link>
                <p className="truncate text-[11px] text-[#5b4041]">{item.requester.occupation || "Member"}</p>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => acceptRequest(item.id)} disabled={busyRequest?.id === item.id} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8c0026] text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100" aria-label="Accept request">{busyRequest?.id === item.id && busyRequest.action === "accept" ? <LoaderCircle size={16} className="animate-spin"/> : <Check size={16}/>}</button>
                <button onClick={() => declineRequest(item.id)} disabled={busyRequest?.id === item.id} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6e8ea] text-[#5b4041] shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100" aria-label="Decline request">{busyRequest?.id === item.id && busyRequest.action === "decline" ? <LoaderCircle size={16} className="animate-spin"/> : <X size={16}/>}</button>
              </div>
            </div>
          ))}
        </div>
      </section>}
      {/* Sent (outgoing) friend requests awaiting a response */}
      {sent.length > 0 && <section className="glass-panel rounded-[20px] p-5">
        <h2 className="text-[20px] font-semibold leading-[26px] text-[#191c1e]" style={pj}>Sent Requests</h2>
        <p className="mt-1 text-[13px] leading-[18px] text-[#5b4041]">{sent.length} request{sent.length === 1 ? "" : "s"} awaiting a response — these are people you’ve reached out to.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sent.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#e4bdbe]/20 bg-white/50 p-3">
              <Link to={`/profiles/${item.recipient.id}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm"><img className="h-full w-full object-cover" src={item.recipient.primaryPhoto} alt={item.recipient.name}/></Link>
              <div className="min-w-0 flex-1">
                <Link to={`/profiles/${item.recipient.id}`} className="block truncate text-[14px] font-semibold text-[#191c1e] hover:text-[#8c0026]">{item.recipient.name}, {item.recipient.age}</Link>
                <p className="truncate text-[11px] text-[#5b4041]">{item.recipient.occupation || "Member"}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#fff1e0] px-2.5 py-1 text-[10px] font-semibold text-[#b45309]"><Clock size={12}/>Pending</span>
            </div>
          ))}
        </div>
      </section>}
      {/* Slots */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {slots.map((connection) => {
          const u = connection.user;
          const health = (connection.matchScore?.overall ?? 85) >= 90;
          return (
            <div key={connection.id} className="glass-panel ambient-shadow relative flex flex-col gap-3 overflow-hidden rounded-[20px] p-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <Link to={`/profiles/${u.id}`} aria-label={`View ${u.name}'s profile`} className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md transition-transform hover:scale-105">
                  <img className="h-full w-full object-cover" src={u.primaryPhoto} alt={u.name}/>
                </Link>
                <div className="flex gap-1">
                  <Link to={`/messages?user=${u.id}`} aria-label={`Message ${u.name}`} title="Open Messages" className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#8c0026] shadow-sm transition-transform hover:scale-105"><MessageCircle size={15}/></Link>
                  <div className="relative">
                    <button type="button" onClick={() => setOpenConnectionMenu((current) => current === connection.id ? null : connection.id)} title="More options" aria-label={`More options for ${u.name}`} aria-expanded={openConnectionMenu === connection.id} aria-haspopup="menu" className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#5b4041] shadow-sm transition-transform hover:scale-105"><span className="material-symbols-outlined text-[16px]">more_vert</span></button>
                    {openConnectionMenu === connection.id && <div role="menu" className="absolute right-0 top-9 z-20 min-w-36 rounded-xl border border-[#e4bdbe]/40 bg-white p-1 shadow-lg">
                      <button type="button" role="menuitem" onClick={() => void removeSlot(connection.id)} disabled={busyConnection === connection.id} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[12px] font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">{busyConnection === connection.id ? <LoaderCircle size={14} className="animate-spin"/> : <X size={14}/>}Remove connection</button>
                    </div>}
                  </div>
                </div>
              </div>
              <div>
                <Link to={`/profiles/${u.id}`} className="text-[20px] font-semibold leading-[26px] text-[#191c1e] hover:text-[#8c0026]" style={pj}>{u.name}, {u.age}</Link>
                <p className="mt-1 flex items-center gap-1 text-[13px] font-medium leading-[18px] text-[#8c0026]">
                  {u.online ? <span className="h-2 w-2 animate-pulse rounded-full bg-[#e11d48]"/> : <span className="material-symbols-outlined text-[14px]">schedule</span>}
                  {activityLabel(u)}
                </p>
              </div>
              <div className="mt-auto rounded-lg bg-[#f2f4f6] p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#5b4041]">Health</span>
                  <span className={"text-[12px] font-semibold " + (health ? "text-[#8c0026]" : "text-[#565e74]")}>{health ? "High" : "Moderate"}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-[#e0e3e5]">
                  <div className={"h-1 rounded-full " + (health ? "bg-[#8c0026]" : "bg-[#565e74]")} style={{ width: health ? "85%" : "50%" }}/>
                </div>
                <p className="mt-2 text-[11px] leading-[15px] text-[#5b4041]">{connection.lastMessage ?? "You're connected."}</p>
              </div>
            </div>
          );
        })}
        {slots.length < 3 && (
          <div className="glass-panel flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#e4bdbe]/40 bg-white/30 p-4 text-center transition-colors hover:bg-white/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffdada] text-[#8c0026]">
              <span className="material-symbols-outlined text-[26px]">add</span>
            </div>
            <div>
              <h3 className="text-[20px] font-semibold leading-[26px] text-[#191c1e]" style={pj}>Available Slot</h3>
              <p className="mt-1 px-4 text-[13px] leading-[18px] text-[#5b4041]">Ready for someone new. Head back to Discover to fill this space.</p>
            </div>
            <Link to="/discover" className="mt-2 rounded-full bg-gradient-to-r from-[#8c0026] to-[#b80035] px-5 py-1.5 text-[12px] font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95">Discover Now</Link>
          </div>
        )}
      </section>
      {/* Insights & History */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="glass-panel relative overflow-hidden rounded-[20px] p-4 md:col-span-8">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#d7dff9] opacity-20 blur-[80px]"/>
          <h2 className="mb-3 text-[22px] font-semibold leading-[28px] text-[#191c1e]" style={pj}>Compatibility Insights</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            {insights.map((c) => (
              <div key={c.title} className="flex-1 rounded-xl border border-[#e4bdbe]/20 bg-white/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <span className={"material-symbols-outlined rounded-full p-1 text-[16px] " + c.tint}>{c.icon}</span>
                  <h4 className="text-[12px] font-semibold text-[#191c1e]">{c.title}</h4>
                </div>
                <p className="text-[12px] leading-[16px] text-[#5b4041]">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-[20px] p-4 md:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[20px] font-semibold leading-[26px] text-[#191c1e]" style={pj}>History</h2>
            <button className="text-[12px] font-semibold text-[#8c0026] hover:underline">View All</button>
          </div>
          <ul className="space-y-2">
            {history.length ? history.map((h) => (
            <li key={h.id}><Link to={`/profiles/${h.user.id}`} className="flex cursor-pointer items-center justify-between rounded-lg p-1.5 transition-colors hover:bg-white/50">
                <div className="flex items-center gap-2">
                  <img className="h-9 w-9 rounded-full object-cover opacity-60 grayscale" src={h.user.primaryPhoto} alt={h.user.name}/>
                  <div>
                    <p className="text-[12px] font-semibold text-[#191c1e]">{h.user.name}</p>
                    <p className="text-[11px] text-[#5b4041]">Connection ended {formatRelativeTime(h.endedAt)}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-[#5b4041]">chevron_right</span>
            </Link></li>
            )) : <li className="py-3 text-center text-[12px] text-[#5b4041]">No connection history yet.</li>}
          </ul>
        </div>
      </section>
    </section>
  );
}

export function MessagesPage() { return <MessagesShell/>; }

export function RealMessagesPage() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true); const [sending, setSending] = useState(false); const [draft, setDraft] = useState(""); const [query, setQuery] = useState(""); const [error, setError] = useState("");
  const myId = getSessionUser()?.id;
  useEffect(() => { messagesService.getConversations().then(async (items) => { setConversations(items); const userId = searchParams.get("user"); const initial = userId ? items.find((item) => item.user.id === userId) : items[0]; if (initial) setSelected(await messagesService.getConversation(initial.user.id)); }).catch(() => setError("Unable to load conversations.")).finally(() => setLoading(false)); }, [searchParams]);
  const open = async (conversation: Conversation) => { setError(""); try { setSelected(await messagesService.getConversation(conversation.user.id)); } catch { setError("Unable to load this conversation."); } };
  const send = async (event: FormEvent) => { event.preventDefault(); const text = draft.trim(); if (!text || !selected || sending) return; setSending(true); setError(""); try { const message = await messagesService.sendMessage(selected.user.id, text); setSelected((current) => current ? { ...current, messages: [...current.messages, message] } : current); setConversations((items) => items.map((item) => item.user.id === selected.user.id ? { ...item, messages: [...item.messages, message] } : item)); setDraft(""); } catch { setError("Message could not be sent."); } finally { setSending(false); } };
  const visible = conversations.filter((item) => item.user.name.toLowerCase().includes(query.toLowerCase()));
  if (loading) return <section className="messages-page-full"><LoadingState label="Loading your conversations…"/></section>;
  return <section className="messages-page-full"><div className="messenger3"><aside className="conv3"><div className="conv3-tools"><h1>Messages</h1><div className="conv3-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search connections..."/></div></div><div className="conv3-list">{visible.map((conversation) => { const last = conversation.messages.at(-1); return <button key={conversation.id} onClick={() => void open(conversation)} className={`conv3-item ${selected?.user.id === conversation.user.id ? "selected" : ""}`}><span className="conv3-avatar"><img src={conversation.user.primaryPhoto} alt={conversation.user.name}/></span><span className="conv3-copy"><span className="conv3-line1"><b>{conversation.user.name}</b><small>{last ? formatRelativeTime(last.createdAt) : ""}</small></span><p>{last?.text ?? "Start a conversation"}</p></span></button>; })}{!visible.length && <Empty icon={MessageCircle} title="No conversations" copy="Your connected people will appear here after a conversation starts."/>}</div></aside><section className="chat3"><div className="chat3-stream">{selected ? selected.messages.map((message) => <div key={message.id} className={`chat3-row ${message.senderId === myId ? "out" : ""}`}><div className={message.senderId === myId ? "chat3-bubble-out" : "chat3-bubble-in"}><span>{message.text}</span><small className="chat3-meta">{formatChatTime(message.createdAt)}</small></div></div>) : <Empty icon={MessageCircle} title="Select a conversation" copy="Choose a connected person to view your real messages."/>}</div>{selected && <div className="chat3-input"><form className="chat3-form" onSubmit={send}><textarea rows={1} value={draft} disabled={sending} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message..."/><button className="chat3-send" disabled={sending || !draft.trim()} aria-label="Send message">{sending ? <LoaderCircle size={17} className="animate-spin"/> : <Send size={17}/>}</button></form></div>}</section></div>{error && <p className="mx-auto max-w-5xl px-4 pt-3 text-sm text-red-700" role="alert">{error}</p>}</section>;
}

const interestIcon: Record<string, typeof Camera> = { Photography: Camera, Travel: Plane, Coffee: Coffee, Music: Music, Cooking: UtensilsCrossed, Food: UtensilsCrossed, Art: Palette, Books: BookOpen, Running: Footprints, Hiking: Mountain, Yoga: Flower2, Engineering: Cpu, Gaming: Gamepad2, Wellness: HeartPulse, Cycling: Bike, Film: Clapperboard, Dance: Music, Tech: Cpu, Fitness: Dumbbell, "Wine Tasting": Wine };
const vibeIcon = (interest: string) => interestIcon[interest] ?? Sparkles;

export function MessagesShell() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState(""); const [pane, setPane] = useState<"all" | "unread" | "online">("all"); const [draft, setDraft] = useState(""); const [file, setFile] = useState<File | null>(null); const [sending, setSending] = useState(false); const [typing, setTyping] = useState(false); const [emojiOpen, setEmojiOpen] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const myId = getSessionUser()?.id;
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [existingConversations, activeConnections] = await Promise.all([
          messagesService.getConversations(),
          connectionsService.getActive(),
        ]);
        if (cancelled) return;

        // A connection can start a chat before either person has sent a message.
        // Add those people to the sidebar with an empty local conversation.
        const conversationByUserId = new Map(existingConversations.map((item) => [item.user.id, item]));
        const next = activeConnections.map((connection) => conversationByUserId.get(connection.user.id) ?? {
          id: `new-${connection.user.id}`,
          user: connection.user,
          messages: [],
          unread: 0,
        });
        setConversations(next);

        const requestedUserId = searchParams.get("user");
        const initial = requestedUserId ? next.find((item) => item.user.id === requestedUserId) : undefined;
        if (!initial) {
          setSelectedId(null);
          return;
        }

        const conversation = await messagesService.getConversation(initial.user.id);
        if (cancelled) return;
        setConversations((items) => items.map((item) => item.user.id === initial.user.id ? { ...conversation, unread: 0 } : item));
        setSelectedId(conversation.id);
      } catch {
        if (!cancelled) setConversations([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [searchParams]);
  const selected = conversations.find((item) => item.id === selectedId);
  useEffect(() => subscribeToChat(
    (payload: SocketChatMessage) => {
      acknowledgeDelivered(payload.id);
      void messagesService.getConversation(payload.senderId).then((incoming) => {
        setConversations((items) => items.some((item) => item.id === incoming.id) ? items.map((item) => item.id === incoming.id ? { ...incoming, unread: item.id === selectedId ? 0 : incoming.unread } : item) : [incoming, ...items]);
        if (incoming.id === selectedId) acknowledgeRead(payload.id);
      });
    },
    (status: SocketChatStatus) => setConversations((items) => items.map((conversation) => ({ ...conversation, messages: conversation.messages.map((message) => message.id === status.messageId ? { ...message, status: status.status, readAt: status.readAt ?? message.readAt } : message) }))),
  ), [selectedId]);
  useEffect(() => subscribeToPresence(
    ({ userId, online, lastActive }) => setConversations((items) => items.map((item) => item.user.id === userId ? { ...item, user: { ...item.user, online, lastActive: lastActive ?? item.user.lastActive } } : item)),
    (onlineUserIds) => setConversations((items) => items.map((item) => ({ ...item, user: { ...item.user, online: onlineUserIds.includes(item.user.id) } }))),
  ), []);
  useEffect(() => { if (selected) selected.messages.filter((message) => message.senderId !== myId && message.status !== "read").forEach((message) => acknowledgeRead(message.id)); }, [selected, myId]);
  useEffect(() => { requestAnimationFrame(() => messageEndRef.current?.scrollIntoView({ block: "end" })); }, [selectedId, selected?.messages.length]);
  const filtered = conversations.filter((item) => item.user.name.toLowerCase().includes(query.toLowerCase()) && (pane === "all" ? true : pane === "unread" ? item.unread > 0 : item.online));
  const select = async (id: string) => { const existing = conversations.find((item) => item.id === id); if (!existing) return; setSelectedId(id); try { const loaded = await messagesService.getConversation(existing.user.id); setConversations((items) => items.map((item) => item.user.id === existing.user.id ? { ...loaded, unread: 0 } : item)); setSelectedId(loaded.id); } catch { setSelectedId(null); } };
  const send = (event: FormEvent) => { event.preventDefault(); const text = draft.trim(); if (!text || !selected) return; const msg: Message = { id: `new-${Date.now()}`, conversationId: selected.id, senderId: "me", text, status: "read", createdAt: new Date().toISOString() }; setConversations((items) => items.map((item) => item.id === selected.id ? {...item, messages: [...item.messages, msg], unread: 0} : item)); setDraft(""); setTyping(true); window.setTimeout(() => { setTyping(false); const reply: Message = { id: `reply-${Date.now()}`, conversationId: selected.id, senderId: "them", text: "That sounds lovely — I’d like that!", status: "read", createdAt: new Date().toISOString() }; setConversations((items) => items.map((item) => item.id === selected.id ? {...item, messages: [...item.messages, reply]} : item)); }, 1300); };
  const sendReal = async (event: FormEvent) => { event.preventDefault(); const text = draft.trim(); if ((!text && !file) || !selected || sending) return; setSending(true); try { const message = await messagesService.sendMessage(selected.user.id, text, file); setConversations((items) => items.map((item) => item.id === selected.id ? { ...item, messages: [...item.messages, message], unread: 0 } : item)); setDraft(""); setFile(null); } finally { setSending(false); } };
  void send;
  if (loading) return <section className="messages-page-full"><div className="messenger3"><LoadingState label="Loading your conversations…"/></div></section>;
  return <section className="messages-page-full"><div className={`messenger3 ${selected ? "chat-open" : ""}`}>
    <aside className="conv3">
      <div className="conv3-tools"><h1>Messages</h1><div className="conv3-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search connections..."/></div><div className="conv3-filters"><button className={pane === "all" ? "active" : ""} onClick={() => setPane("all")}>All</button><button className={pane === "unread" ? "active" : ""} onClick={() => setPane("unread")}>Unread</button><button className={pane === "online" ? "active" : ""} onClick={() => setPane("online")}>Online</button></div></div>
      <div className="conv3-list">{filtered.length ? filtered.map((conversation) => { const last = conversation.messages.at(-1); return <button onClick={() => select(conversation.id)} className={`conv3-item ${conversation.id === selectedId ? "selected" : ""} ${conversation.unread > 0 ? "has-unread" : ""}`} key={conversation.id}><span className="conv3-avatar"><img src={conversation.user.primaryPhoto} alt={conversation.user.name}/>{conversation.user.online && <i className="conv3-dot"/>}</span><span className="conv3-copy"><span className="conv3-line1"><b>{conversation.user.name}</b><small>{last ? formatRelativeTime(last.createdAt) : ""}</small></span><p>{conversation.user.online ? `${conversation.user.name.split(" ")[0]} is typing...` : (last?.text ?? "Start a conversation")}</p></span>{conversation.unread > 0 && <i className="conv3-unread">{conversation.unread}</i>}</button>; }) : <div className="conv3-empty"><Empty icon={MessageCircle} title="No conversations" copy="Nothing here under this filter yet."/></div>}</div>
    </aside>
    {selected ? <section className="chat3">
      <div className="chat3-bg"><div className="chat3-blob1"/><div className="chat3-blob2"/></div>
      <div className="chat3-glass"><div className="chat3-who"><button className="icon-button mobile-back" onClick={() => setSelectedId(null)} aria-label="Back"><ArrowLeft size={18}/></button><Link to={`/profiles/${selected.user.id}`} aria-label={`View ${selected.user.name}'s profile`}><img src={selected.user.primaryPhoto} alt={selected.user.name}/></Link><Link to={`/profiles/${selected.user.id}`}><div><h2>{selected.user.name} {selected.user.verified && <BadgeCheck size={15}/>}</h2><p className="chat3-online"><span/>{activityLabel(selected.user)}</p></div></Link></div><div className="chat3-actions"><button className="icon-button" aria-label="Video call"><Video size={18}/></button><Link to={`/profiles/${selected.user.id}`} className="icon-button" aria-label="View profile"><Info size={18}/></Link></div></div>
      <div className="chat3-stream">
        <div className="chat3-day"><span>{formatChatDate(selected.messages[0]?.createdAt ?? new Date().toISOString())}</span></div>
        {selected.messages.map((message) => { const mine = message.senderId === myId; const attachment = message.attachmentUrl && (message.attachmentType === "image" ? <a href={message.attachmentUrl} target="_blank" rel="noreferrer"><img className="chat3-image" src={message.attachmentUrl} alt="Shared image"/></a> : <a className="chat3-file" href={message.attachmentUrl} target="_blank" rel="noreferrer"><Paperclip size={15}/> Open attachment</a>); return <div key={message.id} className={`chat3-row ${mine ? "out" : ""}`}><div className={mine ? "chat3-bubble-out" : "chat3-bubble-in"}>{attachment}<span>{message.text}</span><small className="chat3-meta" style={mine ? { color: "rgba(255,255,255,.75)" } : undefined}>{formatChatTime(message.createdAt)}{mine ? ` · ${message.status}` : ""}</small></div></div>; })}
        {typing && <div className="chat3-row"><img className="ava" src={selected.user.primaryPhoto} alt={selected.user.name}/><div className="chat3-typing"><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div></div>}
        <div className="h-4" ref={messageEndRef}/>
      </div>
      <div className="chat3-input"><form className="chat3-form" onSubmit={sendReal}><label className="icon-button" aria-label="Attach image or file"><Paperclip size={18}/><input className="sr-only" type="file" accept="image/*,.pdf,.doc,.docx,.txt" onChange={(event) => setFile(event.target.files?.[0] ?? null)}/></label><textarea rows={1} value={draft} disabled={sending} onChange={(event) => setDraft(event.target.value)} placeholder={file ? file.name : "Type a message..."}/><div className="relative"><button type="button" className="icon-button" aria-label="Choose emoji" aria-expanded={emojiOpen} onClick={() => setEmojiOpen((open) => !open)}><Smile size={18}/></button>{emojiOpen && <div className="absolute bottom-11 right-0 z-[60] grid w-48 grid-cols-4 gap-1 rounded-xl border border-[#e4bdbe]/40 bg-white p-2 shadow-xl">{CHAT_EMOJIS.map((emoji) => <button key={emoji} type="button" className="rounded-lg p-1.5 text-lg transition hover:bg-[#fff2f2]" onClick={() => { setDraft((value) => `${value}${emoji}`); setEmojiOpen(false); }}>{emoji}</button>)}</div>}</div><button className="chat3-send" disabled={sending || (!draft.trim() && !file)} aria-label="Send message"><Send size={17}/></button></form></div>
    </section> : <section className="chat3"><div className="chat3-bg"><div className="chat3-blob1"/><div className="chat3-blob2"/></div><div className="chat3-stream" style={{ justifyContent: "center", alignItems: "center" }}><Empty icon={MessageCircle} title="Select a conversation" copy="Choose a conversation from the list to start chatting."/></div></section>}
    {selected && <aside className="profile3"><div className="profile3-cover"><Link to={`/profiles/${selected.user.id}`}><img src={selected.user.photos?.[1] ?? selected.user.primaryPhoto} alt={selected.user.name}/></Link></div><div className="profile3-body"><div className="profile3-card"><Link to={`/profiles/${selected.user.id}`}><h2>{selected.user.name}, {selected.user.age} <BadgeCheck size={18}/></h2></Link><p className="profile3-loc"><MapPin size={14}/>{selected.user.location} · {selected.user.distance} km away</p><p className="profile3-quote">“{(selected.user.bio ?? "Looking for someone genuine.").slice(0, 48)}…”</p></div><div className="profile3-vibe"><h3>Vibe</h3><div className="tag-grid">{selected.user.interests?.slice(0, 6).map((interest) => { const Icon = vibeIcon(interest); return <span className="vibe-chip" key={interest}><Icon size={13}/>{interest}</span>; })}</div></div></div></aside>}
  </div></section>;
}

const notifIcon: Record<string, typeof Bell> = { connection_request: UserPlus, like: Heart, match: Flame, message: MessageCircle, connection_accepted: Check, profile_view: Eye, recommendation: Sparkles, system: Bell };
export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => { setLoading(true); notificationsService.getNotifications().then(setItems).catch(() => setToast({ message: "Could not load notifications." })).finally(() => setLoading(false)); }, []);
  const markRead = (id: string) => { void notificationsService.markRead(id).catch(() => {}); setItems((current) => current.map((item) => item.id === id ? {...item, read: true} : item)); };
  const markAll = () => { void notificationsService.markAllRead().catch(() => {}); setItems((current) => current.map((item) => ({...item, read: true}))); setToast({message: "All notifications marked as read."}); };
  const INTERACTION_TYPES = ["match", "like", "superlike", "connection_request", "connection_accepted"];
  const categoryGroups: Array<[string, typeof items]> = [["Matches", items.filter((i) => INTERACTION_TYPES.includes(i.type))], ["Messages", items.filter((i) => i.type === "message")], ["System", items.filter((i) => !INTERACTION_TYPES.includes(i.type) && i.type !== "message")]];
  const groups = categoryGroups.filter(([, list]) => list.length > 0);
  const unread = items.filter((i) => !i.read).length;
  if (loading) return <section className="notifications-editorial"><LoadingState label="Loading your notifications…"/></section>;
  return <section className="notifications-editorial"><ToastNotice toast={toast}/><header><div><h1>Notifications</h1><p>Stay updated with your latest interactions.</p></div><button onClick={markAll}><Check size={16}/>{unread ? "Mark all as read" : "All caught up"}</button></header>
    <div className="notifications-groups">{groups.map(([label, list]) => <section key={label}><h2><i/> {label}</h2><div className="notifications-panel">{list.map((item) => { const Icon = notifIcon[item.type] ?? Bell; return <article onClick={() => markRead(item.id)} className={item.read ? "" : "notification-new"} key={item.id}>{item.actor?.photo ? <Link onClick={(event) => event.stopPropagation()} to={`/profiles/${item.actor.id}`}><img src={item.actor.photo} alt={item.actor.name}/></Link> : <span className="notification-type"><Icon size={20}/></span>}<div><div><h3>{item.type === "match" ? "New Match!" : item.actor?.name ?? item.title}</h3><time>{timeAgo(item.createdAt)}</time></div><p>{item.type === "match" && item.actor ? <>You and <b>{item.actor.name}</b> liked each other.</> : item.body}</p></div></article>; })}</div></section>)}</div>
    {!items.length && <Empty icon={Bell} title="You're all caught up" copy="When something happens around your connections, it will appear here."/>}
  </section>; }
const settingsSections = ["Profile", "Discovery preferences", "Notifications", "Privacy & safety", "Account & security", "Blocked users", "App preferences"];
export function SettingsPage() {
  const [saved, setSaved] = useState(false); const [section, setSection] = useState("Profile");
  const [blocked, setBlocked] = useState<string[]>(["Thierry"]);
  const [photo, setPhoto] = useState(DEMO_USER.primaryPhoto);
  const note = (section === "Profile" ? "The details people see when they discover you." : "Set these options to make the experience yours.");
  return <section className="app-page"><PageTitle title="Profile & settings" copy="Manage how you appear and how Lume works for you." action={<button className="button button-quiet" onClick={() => setSection("Account & security")}>Log out</button>}/><div className="settings-layout"><aside className="settings-menu">{settingsSections.map((name) => <button key={name} onClick={() => { setSection(name); setSaved(false); }} className={`settings-nav-item ${section === name ? "selected" : ""}`}>{SECTION_ICONS[name]}<span>{name}</span><span className="spacer"/>{name === "Blocked users" && blocked.length > 0 && <span className="count">{blocked.length}</span>}</button>)}</aside><form className="settings-card" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><div className="settings-card-head"><div><h2>{section}</h2><p>{note}</p></div>{section === "Profile" && <Avatar person={DEMO_USER} size="lg"/>}</div>
    {section === "Profile" && <><div className="photo-management"><img src={photo} alt="Your profile"/><button type="button" className="button button-quiet" onClick={() => setPhoto(DEMO_USER.photos?.[1] ?? DEMO_USER.primaryPhoto)}><ImagePlus size={15}/> Change photo</button></div><div className="form-grid"><Input label="Name" defaultValue={DEMO_USER.name}/><Input label="Location" defaultValue={DEMO_USER.location}/><Input label="Occupation" defaultValue={DEMO_USER.occupation}/><Input label="Looking for" defaultValue={DEMO_USER.relationshipGoal}/><label className="form-field full"><span>About you</span><textarea defaultValue={DEMO_USER.bio}/></label></div><p className="kicker mt-4">Interests</p><div className="pill-list">{DEMO_USER.interests?.map((item) => <Badge rose key={item}>{item}</Badge>)}</div></>}
    {section === "Discovery preferences" && <SettingsToggles options={["Show people within 25 km", "Prioritize verified profiles", "Only show people online now", "Show me to others in discovery"]}/>}
    {section === "Notifications" && <SettingsToggles options={["New message alerts", "Connection request alerts", "New match and like alerts", "Email activity summaries"]}/>}
    {section === "Privacy & safety" && <SettingsToggles options={["Require verified connections", "Hide my activity status", "Only verified members can message me", "Review community safety tips"]}/>}
    {section === "Account & security" && <><div className="form-grid"><label className="form-field"><span>Email</span><input defaultValue={DEMO_USER.email}/></label><label className="form-field"><span>Phone (optional)</span><input defaultValue="+250 700 000 000"/></label></div><div className="settings-card-head" style={{ marginTop: 18, paddingBottom: 12 }}><div><h2>Membership</h2><p>Current plan: Free</p></div><Link className="button button-quiet" to="/pricing">Manage</Link></div><SettingsToggles options={["Require password on sign-in", "Receive security alerts"]}/></>}
    {section === "Blocked users" && <div className="connection-list mt-2">{blocked.length ? blocked.map((name) => <div className="connection-item" key={name}><span className="notification-icon"><Ban size={16}/></span><div className="connection-copy"><h3>{name}</h3><p>Blocked from contacting you</p></div><button className="button button-quiet" onClick={() => setBlocked((items) => items.filter((item) => item !== name))}>Unblock</button></div>) : <Empty icon={Ban} title="No blocked users" copy="People you block will be listed here."/>}</div>}
    {section === "App preferences" && <SettingsToggles options={["Compact density", "Reduce motion", "Sound effects"]}/>}
    <footer><button className="button button-primary"><Check size={15}/> Save changes</button>{saved && <span className="saved-state">Saved locally</span>}<Link className="button button-quiet ml-auto" to="/profile/complete"><Sparkles size={15}/> Complete profile</Link></footer></form></div></section>; }
const SECTION_ICONS: Record<string, ReactNode> = { Profile: <UserRound size={16}/>, "Discovery preferences": <SlidersHorizontal size={16}/>, Notifications: <Bell size={16}/>, "Privacy & safety": <Shield size={16}/>, "Account & security": <Lock size={16}/>, "Blocked users": <Ban size={16}/>, "App preferences": <Settings size={16}/> };
function SettingsToggles({ options }: { options: string[] }) { const [state, setState] = useState<Record<string, boolean>>(() => Object.fromEntries(options.map((o) => [o, true]))); return <div className="setting-options">{options.map((option) => <label className="toggle-row" key={option}><span><b>{option}</b><small>Update this preference anytime.</small></span><input type="checkbox" checked={state[option]} onChange={(event) => setState((s) => ({...s, [option]: event.target.checked}))}/></label>)}</div>; }
function Input({label, defaultValue}: {label: string; defaultValue?: string}) { return <label className="form-field"><span>{label}</span><input defaultValue={defaultValue}/></label>; }

export function MyProfilePage() {
  const sessionUser = getSessionUser();
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => {
    setLoading(true);
    authService.me()
      .then((data) => { setMe(mapApiUser(data.user as unknown as Parameters<typeof mapApiUser>[0])); return data; })
      .catch(() => setMe(sessionUser ?? null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) return <section className="app-page"><LoadingState label="Loading your profile…"/></section>;
  if (!me) return <section className="app-page"><Empty title="Profile unavailable" copy="Sign in to view your profile." cta={<Link className="button button-primary" to="/login">Sign in</Link>}/></section>;
  const pct = me.profilePercent ?? 92;
  return <section className="app-page my-profile"><ToastNotice toast={toast}/><div className="my-profile-cover"/><div className="my-profile-head"><Avatar person={me} size="lg"/><div><p className="kicker">Your profile</p><h1>{me.name}, {me.age} <ShieldCheck size={18}/></h1><p><MapPin size={14}/>{me.location} · {me.occupation}</p></div><div className="person-buttons"><Link className="button button-quiet" to="/settings"><SlidersHorizontal size={15}/> Settings</Link><Link className="button button-primary" to="/profile/edit"><ImagePlus size={15}/> Edit profile</Link></div></div><div className="profile-completion"><span>Profile completeness</span><i><em style={{ width: `${pct}%` }}/></i><b>{pct}%</b><Link to="/profile/complete">Finish profile →</Link></div><div className="stat-grid" style={{ margin: "18px 16px" }}><div className="stat-card"><span><Eye size={17}/></span><div><b>34</b><small>Profile views</small></div></div><div className="stat-card"><span><Heart size={17}/></span><div><b>12</b><small>Likes</small></div></div><div className="stat-card"><span><UsersRound size={17}/></span><div><b>3</b><small>Connections</small></div></div><div className="stat-card"><span><MessageCircle size={17}/></span><div><b>2</b><small>Unread</small></div></div></div><div className="my-profile-columns"><article className="card compact-about"><h2>About me</h2><p>{me.bio}</p><h3>Interests</h3><div>{me.interests?.map((item) => <Badge rose key={item}>{item}</Badge>)}</div><h3>Looking for</h3><div className="interest-row"><Badge>{me.relationshipGoal}</Badge></div></article><aside className="card profile-status"><h2>Visibility</h2><p><Online/> {paused ? "Discovery paused" : "You’re visible in discovery"}</p><button className="button button-quiet" onClick={() => { setPaused(!paused); setToast({ message: paused ? "You’re visible in discovery again." : "Discovery is paused. You won’t appear to new people.", tone: paused ? "emerald" : "rose" }); }}>{paused ? "Resume discovery" : "Pause discovery"}</button><Link to="/settings">Discovery preferences <SlidersHorizontal size={14}/></Link><h2 style={{ marginTop: 14 }}>At a glance</h2><p><UserCheck size={15}/>Verified member</p><p><MapPin size={15}/>{me.location ?? "Kigali"} · 0 km away</p><p><Clock size={15}/>Active now</p></aside></div><div className="row-head" style={{ margin: "6px 16px" }}><h2>My photos</h2><Link to="/profile/edit">Manage</Link></div><div className="profile-gallery" style={{ margin: "0 16px" }}>{(me.photos?.length ? me.photos : [me.primaryPhoto].filter(Boolean)).map((src) => <img src={src} alt="Your photo" key={src}/>)}</div></section>;
}

export function ProfileStudioPage() {
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({ bio: "", location: "", occupation: "", education: "", interests: "", relationshipGoals: "" });
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => { authService.me().then((data) => { const user = mapApiUser(data.user as unknown as Parameters<typeof mapApiUser>[0]); setMe(user); setDraft({ bio: user.bio ?? "", location: user.location ?? "", occupation: user.occupation ?? "", education: user.education ?? "", interests: (user.interests ?? []).join(", "), relationshipGoals: user.relationshipGoal ?? "" }); }).catch(() => setMe(null)).finally(() => setLoading(false)); }, []);
  const applyUser = (raw: unknown) => { const user = mapApiUser(raw as Parameters<typeof mapApiUser>[0]); setMe(user); setSessionUser(user); };
  const save = async (event: FormEvent) => { event.preventDefault(); setSaving(true); try { const { data } = await api.patch<{ profile: unknown }>("/profile", { bio: draft.bio, location: draft.location, occupation: draft.occupation, education: draft.education, interests: draft.interests.split(",").map((item) => item.trim()).filter(Boolean), relationshipGoals: draft.relationshipGoals ? [draft.relationshipGoals] : [] }); applyUser(data.profile); setToast({ message: "Profile updated.", tone: "emerald" }); } catch (error) { setToast({ message: toApiError(error).message }); } finally { setSaving(false); } };
  const upload = async (file?: File) => { if (!file) return; try { await authService.uploadProfilePhoto(file); const data = await authService.me(); applyUser(data.user); setToast({ message: "Photo uploaded.", tone: "emerald" }); } catch (error) { setToast({ message: toApiError(error).message }); } };
  const setPrimary = async (url: string) => { try { await api.patch("/profile/photos/primary", { url }); const data = await authService.me(); applyUser(data.user); } catch { setToast({ message: "Could not set the primary photo." }); } };
  const removePhoto = async (url: string) => { try { await api.delete("/profile/photos", { data: { url } }); const data = await authService.me(); applyUser(data.user); } catch { setToast({ message: "Could not remove this photo." }); } };
  if (loading) return <section className="profile-studio"><LoadingState label="Loading your profile..."/></section>;
  if (!me) return <section className="profile-studio"><Empty title="Profile unavailable" copy="Please sign in again to update your profile." cta={<Link className="button button-primary" to="/login">Sign in</Link>}/></section>;
  const photos = me.photos ?? [];
  return <section className="profile-studio"><ToastNotice toast={toast}/><form className="profile-studio-editor" onSubmit={save}><header className="profile-studio-head"><div><h1>Edit profile</h1><p>Keep your details and photos current.</p></div></header><div className="profile-studio-scroll"><StudioTitle icon={<Camera size={19}/>} title="Photos" action={`${photos.length} / 6`}/><div className="studio-gallery">{photos.map((src, index) => <div className="studio-photo" key={src}><img src={src} alt={`Profile photo ${index + 1}`}/>{index === 0 ? <b>Primary</b> : <button type="button" onClick={() => void setPrimary(src)}>Make primary</button>}<button type="button" onClick={() => void removePhoto(src)} aria-label="Remove photo"><X size={14}/></button></div>)}{photos.length < 6 && <label className="studio-photo-add"><ImagePlus size={20}/><span>Add photo</span><input className="sr-only" type="file" accept="image/*" onChange={(event) => void upload(event.target.files?.[0])}/></label>}</div><StudioTitle icon={<UserRound size={19}/>} title="About you"/><div className="studio-fields"><StudioField label="Location" value={draft.location} onChange={(location) => setDraft((current) => ({ ...current, location }))}/><StudioField label="Occupation" value={draft.occupation} onChange={(occupation) => setDraft((current) => ({ ...current, occupation }))}/><StudioField label="Education" value={draft.education} onChange={(education) => setDraft((current) => ({ ...current, education }))}/><StudioField label="Looking for" value={draft.relationshipGoals} onChange={(relationshipGoals) => setDraft((current) => ({ ...current, relationshipGoals }))}/></div><StudioTitle icon={<BookOpen size={19}/>} title="Bio"/><label className="studio-textarea"><textarea value={draft.bio} maxLength={500} onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}/><small>{draft.bio.length} / 500</small></label><StudioTitle icon={<Heart size={19}/>} title="Interests"/><label className="studio-textarea"><input value={draft.interests} onChange={(event) => setDraft((current) => ({ ...current, interests: event.target.value }))} placeholder="Travel, music, cooking"/></label></div><footer className="profile-studio-actions"><button type="submit" className="button button-primary" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button></footer></form></section>;
}

export function LegacyProfileStudioPage() {
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);
  useEffect(() => { authService.me().then((data) => setMe(mapApiUser(data.user as unknown as Parameters<typeof mapApiUser>[0]))).finally(() => setLoading(false)); }, []);
  if (loading) return <section className="profile-studio"><LoadingState label="Loading your profile…"/></section>;
  if (!me) return <section className="profile-studio"><Empty title="Profile unavailable" copy="Please sign in again to load your profile." cta={<Link className="button button-primary" to="/login">Sign in</Link>}/></section>;
  const DEMO_USER = me;
  const photos = DEMO_USER.photos?.slice(0, 4) ?? [DEMO_USER.primaryPhoto];
  return <section className="profile-studio"><ToastNotice toast={toast}/>
    <div className="profile-studio-editor">
      <header className="profile-studio-head"><div><h1>Professional Presence Manager</h1><p>Curate your identity and preferences.</p></div><Link to="/settings" className="profile-studio-close" aria-label="Close profile manager"><X size={18}/></Link></header>
      <div className="profile-studio-scroll">
        <StudioTitle icon={<UserRound size={19}/>} title="Identity" action="Edit"/><div className="studio-fields"><StudioField label="First Name" value={DEMO_USER.name}/><StudioField label="Age" value={String(DEMO_USER.age ?? "")}/><StudioField label="Location" value={DEMO_USER.location ?? ""} wide/></div>
        <StudioTitle icon={<Camera size={19}/>} title="Professional Gallery" action={`${photos.length} / 6`}/><div className="studio-gallery"><div className="studio-photo studio-photo-primary"><img src={photos[0]} alt="Primary profile"/><b>Primary</b></div>{photos.slice(1).map((src) => <div className="studio-photo" key={src}><img src={src} alt="Profile gallery"/></div>)}<button className="studio-photo-add"><ImagePlus size={20}/><span>Add photo</span></button></div>
        <StudioTitle icon={<BookOpen size={19}/>} title="Manifesto"/><label className="studio-textarea"><textarea defaultValue={DEMO_USER.bio ?? ""}/><small>{DEMO_USER.bio?.length ?? 0} / 500</small></label>
        <StudioTitle icon={<Heart size={19}/>} title="Vibe & Interests"/><div className="studio-interests">{DEMO_USER.interests?.map((item) => <span key={item}>{item}<X size={13}/></span>)}<button><Plus size={14}/> Add interest</button></div>
        <StudioTitle icon={<Briefcase size={19}/>} title="Professional Stats" action="Edit"/><div className="studio-fields"><StudioField label="Profession" value={DEMO_USER.occupation ?? ""}/><StudioField label="Education" value={DEMO_USER.education ?? ""}/></div>
      </div>
      <footer className="profile-studio-actions"><div><b>Profile Strength: 92%</b><i><em/></i></div><button className="button button-quiet">Discard</button><button className="button button-primary" onClick={() => setToast({ message: "Profile changes saved.", tone: "emerald" })}>Save Changes</button></footer>
    </div>
    <aside className="profile-studio-preview"><span>Live Preview</span><div className="profile-preview-phone"><img src={DEMO_USER.primaryPhoto} alt="Profile preview"/><div><p>98% Match</p><h2>{DEMO_USER.name}, {DEMO_USER.age} <ShieldCheck size={17}/></h2><small><MapPin size={13}/>{DEMO_USER.location}</small><section><b><Briefcase size={14}/>{DEMO_USER.occupation}</b><b><BookOpen size={14}/>{DEMO_USER.education}</b></section><blockquote>{DEMO_USER.bio}</blockquote><footer>{DEMO_USER.interests?.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</footer></div></div></aside>
  </section>;
}
function StudioTitle({ icon, title, action }: { icon: ReactNode; title: string; action?: string }) { return <div className="studio-title"><h2>{icon}{title}</h2>{action && <span>{action}</span>}</div>; }
function StudioField({ label, value, wide = false, onChange }: { label: string; value: string; wide?: boolean; onChange?: (value: string) => void }) { return <label className={wide ? "studio-field studio-field-wide" : "studio-field"}><span>{label}</span><input value={value} onChange={(event) => onChange?.(event.target.value)}/></label>; }

export function PricingPage() {
  const [selected, setSelected] = useState("standard");
  const plans = [
    { id: "standard", name: "Lume Standard", price: "Free", description: "For casual discovery", label: "Included", features: ["Curated daily matches", "Basic discovery filters", "Limited daily likes"] },
    { id: "premium", name: "Lume Premium", price: "$24.99", description: "For intentional connection", label: "Everything in Standard, plus:", features: ["Unlimited likes & undo", "Advanced relationship filters", "See who liked you instantly", "Incognito mode browsing"], featured: true, slots: "3" },
    { id: "elite", name: "Lume Elite", price: "$49.99", description: "For maximum visibility", label: "Everything in Premium, plus:", features: ["Profile highlighted in Discovery", "Dedicated concierge support"], slots: "7" },
  ];
  return <section className="pricing-page">
    <div className="pricing-intro">
      <span className="pricing-kicker"><BadgeCheck size={13}/> Select your experience</span>
      <h1>Choose Your <br/>Level of Intent</h1>
      <p>Find the perfect balance of discovery and intentional connection. Upgrade anytime.</p>
    </div>
    <div className="pricing-plans">
      {plans.map((plan) => <article className={`pricing-plan ${plan.featured ? "pricing-plan-featured" : ""}`} key={plan.id}>
        {plan.featured && <span className="pricing-popular">Most popular</span>}
        <div className="pricing-plan-head"><h2>{plan.name}</h2><div className="pricing-price">{plan.price}{plan.price !== "Free" && <small>/mo</small>}</div><p>{plan.description}</p></div>
        {plan.slots && <div className="pricing-slots"><div><span>The slot system</span><b>Priority Connections</b></div><strong>{plan.slots}<small>/wk</small></strong><div className="pricing-slot-bars">{Array.from({ length: plan.id === "elite" ? 5 : 3 }).map((_, i) => <i key={i}/>)}</div>{plan.featured && <p>Intentional scarcity ensures your interest signals genuine intent.</p>}</div>}
        <div className="pricing-features"><span>{plan.label}</span><ul>{plan.features.map((feature) => <li key={feature}><Check size={16}/>{feature}</li>)}</ul></div>
        <button onClick={() => setSelected(plan.id)} className={plan.featured ? "pricing-cta pricing-cta-featured" : "pricing-cta"}>{selected === plan.id ? "Current plan" : plan.id === "standard" ? "Current plan" : `Upgrade to ${plan.id === "premium" ? "Premium" : "Elite"}`}</button>
      </article>)}
    </div>
    <section className="pricing-benefits"><h2>The Premium Experience</h2><div>{[[ShieldCheck, "Verified Authenticity", "Connect with confidence knowing our premium members undergo rigorous profile verification."], [HeartPulse, "Curated Excellence", "Our algorithm learns your preferences, presenting the most compatible matches."], [MessageCircle, "Concierge Support", "Enjoy priority access to our dedicated support team whenever you need it."]].map(([Icon, title, copy]) => { const BenefitIcon = Icon as typeof ShieldCheck; return <article key={title as string}><span><BenefitIcon size={20}/></span><h3>{title as string}</h3><p>{copy as string}</p></article>; })}</div></section>
    <section className="pricing-voice"><span>Premium voices</span><h2>Stories of Connection</h2><p>“The priority connection slots completely changed how I use the app. It forced me to be intentional, and the people I reached out to knew I was serious.”</p><b>Sarah T.</b><small>Premium Member since 2023</small></section>
  </section>;
}

const info: Record<string, [string, string, string[]]> = { about: ["Dating with intention", "A calmer, more considered space for people who want genuine conversations.", ["Build a profile that reflects who you are.", "Explore recommendations that feel considered.", "Keep your attention on a few meaningful connections."]], safety: ["Safety at Lume", "Clear choices, practical safeguards and a respectful community are part of every connection.", ["Use in-app controls to shape your experience.", "Keep personal details private until you feel ready.", "Report behavior that feels unsafe or disrespectful."]], help: ["Help centre", "Quick answers about your profile, connections and account.", ["Complete your profile from Profile & settings.", "Connection requests appear in Connections.", "Only active connections can start a conversation."]], guidelines: ["Community guidelines", "Lume is for respectful adults seeking genuine connections.", ["Be honest about who you are and what you want.", "Treat every person with kindness and respect.", "Do not share someone else’s information without permission."]], privacy: ["Privacy at Lume", "Your privacy matters. You decide what you share and when.", ["Share only what feels comfortable.", "Use profile and account settings to control visibility.", "We do not sell personal profile information."]], terms: ["Terms of service", "Using Lume means participating respectfully and lawfully.", ["You must be eligible to use the service.", "Keep account information accurate.", "Do not misuse the platform or harm other members."]], cookies: ["Cookie preferences", "Cookies help remember preferences and keep the experience reliable.", ["Essential cookies support core functionality.", "Analytics help improve the experience.", "Manage browser cookie preferences any time."]], contact: ["Contact Lume", "Questions, feedback or a safety concern? We’re here.", ["Email hello@lume.example for general questions.", "Visit Safety for reporting guidance.", "We aim to reply within two business days."]] };
export function InfoPage({page}: {page: string}) { const [title, copy, points] = info[page] ?? info.about; return <section className="app-page info-page"><p className="kicker">Lume</p><h1>{title}</h1><p className="info-intro">{copy}</p><div className="info-points">{points.map((point) => <article key={point}><ShieldCheck size={18}/><p>{point}</p></article>)}</div>{page === "contact" && <Link to="/signup" className="button button-primary mt-6">Join Lume</Link>}</section>; }
function SearchCard({ person }: { person: DiscoveryProfile }) { return <article className="profile-card"><Link to={`/profiles/${person.id}`} className="profile-image"><img src={person.primaryPhoto} alt={person.name}/><span className="compatibility"><Heart size={12} fill="currentColor"/>{person.matchScore.overall}%</span>{person.online ? <span className="photo-online">Online</span> : <span className="photo-online" style={{ background: "rgba(15,23,42,.73)" }}>Active</span>}</Link><div className="profile-card-body"><div className="profile-card-title"><div><Link to={`/profiles/${person.id}`}><h2>{person.name}, {person.age} {person.verified && <ShieldCheck size={15}/>}</h2></Link><p><MapPin size={13}/>{person.location} · {person.distance} km</p></div></div><p className="profile-bio">{person.bio}</p><div className="interest-row">{person.interests?.slice(0, 3).map((interest) => <Badge key={interest}>{interest}</Badge>)}</div>{person.relationshipGoal && <div className="interest-row" style={{ marginTop: 6 }}><Badge rose>{person.relationshipGoal}</Badge></div>}<div className="action-panel"><Link className="button button-primary" to={`/profiles/${person.id}`}>View profile</Link></div></div></article>; }

export function ChatPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const myId = getSessionUser()?.id;
  const [person, setPerson] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(""); const [sending, setSending] = useState(false);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    api.get<{ conversation: { participant: Parameters<typeof mapApiUser>[0]; messages?: Array<{ id: string; sender: string; text: string; status: Message["status"]; createdAt: string }> } }>(`/chat/conversations/${id}`)
      .then(({ data }) => {
        setPerson(mapApiUser(data.conversation.participant));
        setMessages((data.conversation.messages ?? []).map((message) => ({ id: message.id, conversationId: id, senderId: message.sender, text: message.text, status: message.status, createdAt: message.createdAt })));
      })
      .catch(() => setPerson(null))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => subscribeToChat(
    (payload) => {
      if (payload.senderId !== id) return;
      acknowledgeDelivered(payload.id);
      acknowledgeRead(payload.id);
      setMessages((items) => items.some((message) => message.id === payload.id) ? items : [...items, { ...payload, senderId: payload.senderId }]);
    },
    (status) => setMessages((items) => items.map((message) => message.id === status.messageId ? { ...message, status: status.status, readAt: status.readAt ?? message.readAt } : message)),
  ), [id]);
  if (loading) return <section className="app-page"><LoadingState label="Loading conversation…"/></section>;
  if (!person) return <section className="app-page"><Empty icon={MessageCircle} title="No active conversation" copy="Messages are only available with people you’re actively connected to." cta={<Link className="button button-primary" to="/messages">Back to messages</Link>}/></section>;
  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !id || sending) return;
    const optimistic: Message = { id: `me-${Date.now()}`, conversationId: id, senderId: myId ?? "me", text, status: "sending", createdAt: new Date().toISOString() };
    setMessages((items) => [...items, optimistic]); setDraft(""); setSending(true);
    try {
      const { data } = await api.post<{ message: { id: string; text: string; status: Message["status"]; senderId: string; createdAt: string } }>(`/chat/conversations/${id}/messages`, { text });
      setMessages((items) => items.map((item) => item.id === optimistic.id ? { ...item, id: data.message.id, status: data.message.status, senderId: data.message.senderId } : item));
    } catch { setMessages((items) => items.map((item) => item.id === optimistic.id ? { ...item, status: "failed" } : item)); }
    finally { setSending(false); }
  };
  return <section className="app-page messages-page"><div className="chat-standalone"><header className="chat-head"><button className="icon-button mobile-back" onClick={() => navigate(-1)} aria-label="Go back"><ChevronLeft size={18}/></button><Avatar person={person}/><div><p className="kicker">Conversation</p><h2>{person.name} {person.verified && <ShieldCheck size={14}/>}</h2><p>{person.online ? "Online now" : "Active recently"}</p></div><Link className="button button-quiet ml-auto" to={`/profiles/${person.id}`}>View profile</Link></header><div className="chat-messages">{messages.map((message) => <div key={message.id} className={`message ${message.senderId === myId ? "mine" : "theirs"} ${message.status === "failed" ? "failed" : ""}`}><p>{message.text}</p><small>{formatChatTime(message.createdAt)}{message.status === "sending" ? " · Sending" : message.status === "failed" ? " · Failed" : ""}</small></div>)}</div><form className="chat-compose" onSubmit={send}><button type="button" className="icon-button" aria-label="Attach file"><Paperclip size={18}/></button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${person.name.split(" ")[0]}…`}/><button className="send-button" disabled={sending || !draft.trim()} aria-label="Send message"><Send size={16}/></button></form></div></section>;
}

export function SearchPage() {
  const [query, setQuery] = useState(""); const [gender, setGender] = useState("any"); const [onlineOnly, setOnlineOnly] = useState(false); const [maxDistance, setMaxDistance] = useState(50);
  const results = useMemo(() => DEMO_PROFILES.filter((person) => (!query || `${person.name} ${person.location} ${person.occupation} ${person.interests?.join(" ")}`.toLowerCase().includes(query.toLowerCase())) && (gender === "any" || person.gender === gender) && (!onlineOnly || person.online) && (person.distance ?? 99) <= maxDistance), [query, gender, onlineOnly, maxDistance]);
  return <section className="app-page"><PageTitle title="Search" copy="Find people by name, interest, or place." action={<button className="button button-quiet" onClick={() => { setGender("any"); setOnlineOnly(false); setMaxDistance(50); setQuery(""); }}><X size={15}/> Clear</button>}/>
    <div className="discover-toolbar"><label className="search-box search-box-wide"><Search size={16}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people, interests, places…"/></label><span className="search-results-count">{results.length} {results.length === 1 ? "result" : "results"}</span></div>
    <div className="toolbar-row"><div className="segmented"><button className={gender === "any" ? "active" : ""} onClick={() => setGender("any")}>Any</button><button className={gender === "woman" ? "active" : ""} onClick={() => setGender("woman")}>Women</button><button className={gender === "man" ? "active" : ""} onClick={() => setGender("man")}>Men</button></div><label className="toggle-row" style={{ border: 0, margin: 0, padding: 0 }}><span><b>Online now</b></span><input type="checkbox" checked={onlineOnly} onChange={(e) => setOnlineOnly(e.target.checked)}/></label><label className="control-label" style={{ display: "flex", gap: 8, alignItems: "center" }}>Distance <span>{maxDistance} km</span><input className="range" type="range" min="5" max="100" value={maxDistance} onChange={(e) => setMaxDistance(+e.target.value)}/></label></div>
    <div className="mt-4"><p className="kicker">Popular interests</p><div className="tag-grid mt-2">{["Travel", "Coffee", "Hiking", "Music", "Art", "Fitness", "Photography", "Cooking"].map((tag) => <button key={tag} type="button" className={`chip ${query === tag ? "selected chip-toggle" : "chip-toggle"}`} onClick={() => setQuery(query === tag ? "" : tag)}>{tag}</button>)}</div></div>
    {results.length ? <div className="profile-grid mt-5">{results.map((person) => <SearchCard key={person.id} person={person}/>)}</div> : <Empty title="No results yet" copy="Try a different name, interest, or place."/>}
  </section>;
}
export function EditProfilePage() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(DEMO_USER.name); const [location, setLocation] = useState(DEMO_USER.location ?? ""); const [occupation, setOccupation] = useState(DEMO_USER.occupation ?? ""); const [bio, setBio] = useState(DEMO_USER.bio ?? ""); const [goal, setGoal] = useState(DEMO_USER.relationshipGoal ?? "");
  const same = name === DEMO_USER.name && location === DEMO_USER.location && occupation === (DEMO_USER.occupation ?? "") && bio === (DEMO_USER.bio ?? "") && goal === (DEMO_USER.relationshipGoal ?? "");
  const save = (event: FormEvent) => { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2400); };
  return <section className="app-page"><PageTitle title="Edit profile" copy="This is the first thing people see when they discover you."/><form className="settings-card edit-card" onSubmit={save}><div className="settings-card-head"><div><h2>Profile details</h2><p>Keep it honest and current.</p></div><Avatar person={DEMO_USER} size="lg"/></div><div className="photo-management"><img src={DEMO_USER.primaryPhoto} alt="Your profile"/><div><button type="button" className="button button-quiet"><ImagePlus size={15}/> Change photo</button><p className="field-hint">A clear, recent photo performs best.</p></div></div><div className="form-grid"><Field label="Name" value={name} onChange={setName}/><Field label="Location" value={location} onChange={setLocation}/><Field label="Occupation" value={occupation} onChange={setOccupation}/><label className="form-field"><span>Looking for</span><select className="select-native" value={goal} onChange={(e) => setGoal(e.target.value)}><option>Long-term relationship</option><option>Marriage</option><option>Friendship first</option></select></label><label className="form-field full"><span>About you</span><textarea value={bio} onChange={(e) => setBio(e.target.value)}/></label></div><footer><button className="button button-primary" disabled={same}><Check size={15}/> Save changes</button>{saved && <span className="saved-state">Saved locally ✓</span>}<Link className="button button-quiet ml-auto" to="/profile/complete"><Sparkles size={15}/> Complete profile</Link></footer></form></section>; }
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label className="form-field"><span>{label}</span><input value={value} onChange={(e) => onChange(e.target.value)}/></label>; }

export function CompleteProfilePage() {
  const [bio, setBio] = useState(DEMO_USER.bio ?? ""); const [interests, setInterests] = useState<string[]>(DEMO_USER.interests ?? []); const [lifestyle, setLifestyle] = useState<string[]>(DEMO_USER.lifestyle ?? []); const [goal, setGoal] = useState(DEMO_USER.relationshipGoal ?? ""); const [done, setDone] = useState(false);
  const toggle = (list: string[], setList: (value: string[]) => void, value: string) => setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  const interestOptions = ["Photography", "Travel", "Hiking", "Coffee", "Music", "Art", "Fitness", "Cooking", "Books", "Wellness"];
  const lifestyleOptions = ["Active", "Non-smoker", "Health-conscious", "Adventurer", "Homebody", "Foodie"];
  const goals = ["Long-term relationship", "Marriage", "Friendship first"];
  const checks = [Boolean(bio.trim()), interests.length > 0, lifestyle.length > 0, Boolean(goal), DEMO_USER.photos && DEMO_USER.photos.length > 0, Boolean(DEMO_USER.occupation), Boolean(DEMO_USER.education)];
  const percent = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const prompts: Array<[string, boolean]> = [["Write a short bio", Boolean(bio.trim())], ["Add at least one interest", interests.length > 0], ["Share your lifestyle", lifestyle.length > 0], ["Set a relationship goal", Boolean(goal)]];
  const missing = prompts.filter(([, done]) => !done);
  return <section className="app-page"><PageTitle title="Complete your profile" copy="A few thoughtful details help people connect with the real you."/>
    <div className="settings-card" style={{ marginTop: 16 }}><div className="settings-card-head"><div><h2>Profile completeness</h2><p>{percent >= 100 ? "Your profile is ready to go live." : "Add these to boost your visibility and matching."}</p></div><div className="completion-ring"><strong>{percent}%</strong><small>complete</small></div></div>{missing.length > 0 && <div className="check-list">{missing.map(([label, ok]) => <label key={label}><input type="checkbox" checked={ok} readOnly/> {label}</label>)}</div>}</div>
  <div className="complete-steps"><article className="complete-card"><div className="complete-card-head"><span className="complete-num">01</span><div><h2>Introduce yourself</h2><p>Tell people what a first date with you might feel like.</p></div></div><label className="form-field"><span>About you</span><textarea value={bio} onChange={(event) => setBio(event.target.value)}/></label></article><article className="complete-card"><div className="complete-card-head"><span className="complete-num">02</span><div><h2>Pick your passions</h2><p>The more you share, the better the matching.</p></div></div><div className="tag-grid mt-3">{interestOptions.map((item) => <button key={item} type="button" onClick={() => toggle(interests, setInterests, item)} className={`chip chip-toggle ${interests.includes(item) ? "selected" : ""}`}>{item}</button>)}</div></article><article className="complete-card"><div className="complete-card-head"><span className="complete-num">03</span><div><h2>Describe your pace</h2><p>Set expectations with your lifestyle and intentions.</p></div></div><p className="kicker mt-3">Lifestyle</p><div className="tag-grid mt-2">{lifestyleOptions.map((item) => <button key={item} type="button" onClick={() => toggle(lifestyle, setLifestyle, item)} className={`chip chip-toggle ${lifestyle.includes(item) ? "selected" : ""}`}>{item}</button>)}</div><p className="kicker mt-4">Relationship intention</p><div className="tag-grid mt-2">{goals.map((item) => <button key={item} type="button" onClick={() => setGoal(goal === item ? "" : item)} className={`chip chip-toggle ${goal === item ? "selected" : ""}`}>{item}</button>)}</div></article><div className="complete-actions"><Link className="button button-quiet" to="/profile">Skip for now</Link><button className="button button-primary" onClick={() => setDone(true)}><Check size={15}/> Save & go live</button>{done && <span className="saved-state">Profile updated — {percent}% complete</span>}</div></div></section>;
}
