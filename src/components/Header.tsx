import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/auth";
import { clearSessionUser, getSessionUser } from "../services/session";
import { socialService } from "../services/social";
import { getChatSocket } from "../services/chat-socket";
import type { UserProfile } from "../types";

const nav = [
  { label: "Home", to: "/", icon: "home" },
  { label: "Discover", to: "/discover", icon: "explore" },
  { label: "Matches", to: "/matches", icon: "favorite" },
  { label: "Connections", to: "/connections", icon: "hub" },
  { label: "Messages", to: "/messages", icon: "chat_bubble" },
] as const;

const titles: Record<string, string> = {
  "/discover": "Discover",
  "/matches": "Matches",
  "/connections": "Connections",
  "/messages": "Messages",
  "/profile": "Profile",
  "/notifications": "Notifications",
  "/settings": "Settings",
  "/search": "Search",
  "/pricing": "Membership",
};

const headline = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;
const fallbackAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(getSessionUser);
  const [accountOpen, setAccountOpen] = useState(false);
  const [counters, setCounters] = useState({ unreadMessages: 0, unreadNotifications: 0, connections: { active: 0, pending: 0, incomingPending: 0, outgoingPending: 0 } });
  useEffect(() => {
    const sync = () => setUser(getSessionUser());
    window.addEventListener("lume:auth-change", sync);
    return () => window.removeEventListener("lume:auth-change", sync);
  }, []);
  useEffect(() => { if (!user) return; const load = () => socialService.counters().then(setCounters).catch(() => {}); load(); window.addEventListener("lume:auth-change", load); return () => window.removeEventListener("lume:auth-change", load); }, [user]);
  useEffect(() => {
    if (!user) return;
    const socket = getChatSocket();
    if (!socket) return;
    const updateMessageBadge = ({ unreadMessagesDelta }: { unreadMessagesDelta?: number }) => {
      if (!unreadMessagesDelta) return;
      setCounters((current) => ({ ...current, unreadMessages: Math.max(0, current.unreadMessages + unreadMessagesDelta) }));
    };
    const updateNotificationBadge = () => setCounters((current) => ({ ...current, unreadNotifications: current.unreadNotifications + 1 }));
    socket.on("chat:badge", updateMessageBadge);
    socket.on("notification:new", updateNotificationBadge);
    return () => { socket.off("chat:badge", updateMessageBadge); socket.off("notification:new", updateNotificationBadge); };
  }, [user]);
  const logout = async () => {
    try { await authService.logout(); } catch { /* Clear the local session even if the server session has expired. */ }
    clearSessionUser(); setAccountOpen(false); toast.success("You’ve been logged out."); navigate("/");
  };
  const title = titles[pathname] ?? "Lovinara";
  const avatar = user?.primaryPhoto || user?.photos?.[0] || fallbackAvatar;
  const accountControl = user ? <div className="relative"><button type="button" onClick={() => setAccountOpen(!accountOpen)} className={`ml-1 inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-2 text-[11px] font-bold transition-all duration-200 ${accountOpen ? "border-[#8c0026] bg-[#fff2f2] text-[#8c0026] shadow-md" : "border-[#e4bdbe]/50 bg-white/65 text-[#8c0026] shadow-sm hover:border-[#8c0026]/30 hover:bg-[#fff2f2] hover:shadow-md"}`} aria-label="Open account menu" aria-haspopup="menu" aria-expanded={accountOpen}><img className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm" src={avatar} alt="" /><span className="max-w-24 truncate">{user.name || "Account"}</span><ChevronDown size={16} strokeWidth={2.5} className={`shrink-0 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}/></button>{accountOpen && <div role="menu" className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-[#e4bdbe]/50 bg-white py-1 shadow-lg"><Link onClick={() => setAccountOpen(false)} to="/profile" className="block px-4 py-2 text-sm font-medium text-[#5b4041] hover:bg-[#fff2f2]">Profile</Link><button onClick={logout} className="block w-full px-4 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50">Log out</button></div>}</div> : <Link to="/login" className="ml-1 inline-flex items-center rounded-full border border-[#8c0026] bg-[#8c0026] px-4 py-2 text-[11px] font-bold text-white transition hover:bg-[#71001f]">Log in</Link>;
  return (
    <>
      {/* Desktop Top App Bar (reference style) */}
      <header className="sticky top-0 z-50 hidden h-20 w-full items-center justify-between border-b border-[#e4bdbe]/30 bg-white/10 px-[20px] shadow-sm shadow-[#8c0026]/15 backdrop-blur-md md:flex lg:px-[40px]">
        <Link to="/" className="site-logo" aria-label="Lovinara home"><img src="/logo.jpeg" alt="Lovinara" /></Link>
        {user && <nav className="flex items-center gap-3 lg:gap-5" aria-label="Primary">
          {nav.map(({ label, to, icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex h-full items-center gap-1 text-[11px] transition-opacity hover:opacity-80 lg:gap-1.5 lg:text-[12px] ${isActive ? "border-b-2 border-[#8c0026] pb-1 font-bold text-[#8c0026]" : "font-medium text-[#5b4041]"}`}>
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={isActive && icon === "favorite" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
                  {label}{label === "Messages" && counters.unreadMessages > 0 && <span className="rounded-full bg-[#8c0026] px-1.5 py-0.5 text-[8px] text-white">{counters.unreadMessages}</span>}{label === "Connections" && counters.connections.incomingPending > 0 && <span className="rounded-full bg-[#8c0026] px-1.5 py-0.5 text-[8px] text-white">{counters.connections.incomingPending}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>}
        <div className="flex items-center gap-4">
          <Link to="/pricing" aria-label="Pricing" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8c0026] transition-all hover:opacity-80"><span className="material-symbols-outlined">crown</span>Pricing</Link>
          {user && <Link to="/notifications" aria-label="Notifications" className="relative text-[#8c0026] transition-all hover:opacity-80 active:scale-95"><span className="material-symbols-outlined">notifications</span>{counters.unreadNotifications > 0 && <span className="absolute -right-2 -top-2 grid min-w-4 place-items-center rounded-full bg-[#8c0026] px-1 text-[8px] font-bold text-white">{counters.unreadNotifications}</span>}</Link>}
          {accountControl}
        </div>
      </header>

      {/* Mobile Top Header (page title) */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-center border-b border-[#e4bdbe]/20 bg-white/80 px-3 backdrop-blur-md md:hidden">
        {pathname === "/" ? <Link to="/" className="site-logo site-logo-mobile" aria-label="Lovinara home"><img src="/logo.jpeg" alt="Lovinara" /></Link> : <span style={headline} className="text-2xl font-bold tracking-[-0.02em] text-[#8c0026]">{title}</span>}
        <div className="absolute right-3">{accountControl}</div>
      </header>

      {/* Mobile Bottom Navigation (reference style) */}
      {user && <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-lg border-t border-[#e4bdbe]/20 bg-white/60 px-4 pb-8 pt-4 shadow-[0_-8px_30px_rgba(184,0,53,0.1)] backdrop-blur-xl md:hidden" aria-label="Mobile primary navigation">
        {nav.map(({ label, to, icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex min-w-0 flex-col items-center justify-center transition-transform duration-300 ease-out ${isActive ? "scale-105 text-[#8c0026]" : "text-[#3e465b] opacity-60 hover:text-[#8c0026]"}`}>
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined mb-1" style={isActive && icon === "favorite" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
                <span className="relative text-[9px] font-semibold leading-none sm:text-[10px]">{label}{label === "Messages" && counters.unreadMessages > 0 && <i className="absolute -right-3 -top-2 grid min-w-3 place-items-center rounded-full bg-[#8c0026] px-0.5 text-[7px] not-italic text-white">{counters.unreadMessages}</i>}{label === "Connections" && counters.connections.incomingPending > 0 && <i className="absolute -right-3 -top-2 grid min-w-3 place-items-center rounded-full bg-[#8c0026] px-0.5 text-[7px] not-italic text-white">{counters.connections.incomingPending}</i>}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>}
    </>
  );
}
