import { Link, NavLink, useLocation } from "react-router-dom";

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

const avatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80";

const headline = { fontFamily: "'Plus Jakarta Sans', sans-serif" } as const;

export default function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "Lume";
  return (
    <>
      {/* Desktop Top App Bar (reference style) */}
      <header className="sticky top-0 z-50 hidden h-20 w-full items-center justify-between border-b border-[#e4bdbe]/30 bg-white/10 px-[20px] shadow-sm shadow-[#8c0026]/15 backdrop-blur-md md:flex lg:px-[40px]">
        <Link to="/" style={headline} className="text-[32px] font-bold leading-none tracking-[-0.02em] text-[#8c0026]">
          Lume
        </Link>
        <nav className="flex items-center gap-3 lg:gap-5" aria-label="Primary">
          {nav.map(({ label, to, icon }) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex h-full items-center gap-1 text-[11px] transition-opacity hover:opacity-80 lg:gap-1.5 lg:text-[12px] ${isActive ? "border-b-2 border-[#8c0026] pb-1 font-bold text-[#8c0026]" : "font-medium text-[#5b4041]"}`}>
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={isActive && icon === "favorite" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/pricing" aria-label="Premium" className="text-[#8c0026] transition-all hover:opacity-80 active:scale-95"><span className="material-symbols-outlined">crown</span></Link>
          <Link to="/notifications" aria-label="Notifications" className="relative text-[#8c0026] transition-all hover:opacity-80 active:scale-95"><span className="material-symbols-outlined">notifications</span></Link>
          <Link to="/profile" className="ml-2" aria-label="Your profile"><img className="h-10 w-10 rounded-full border-2 border-[#e4bdbe]/30 object-cover" src={avatar} alt="Your profile" /></Link>
        </div>
      </header>

      {/* Mobile Top Header (page title) */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-center border-b border-[#e4bdbe]/20 bg-white/80 backdrop-blur-md md:hidden">
        <span style={headline} className="text-2xl font-bold tracking-[-0.02em] text-[#8c0026]">{title}</span>
      </header>

      {/* Mobile Bottom Navigation (reference style) */}
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-lg border-t border-[#e4bdbe]/20 bg-white/60 px-4 pb-8 pt-4 shadow-[0_-8px_30px_rgba(184,0,53,0.1)] backdrop-blur-xl md:hidden" aria-label="Mobile primary navigation">
        {nav.map(({ label, to, icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex min-w-0 flex-col items-center justify-center transition-transform duration-300 ease-out ${isActive ? "scale-105 text-[#8c0026]" : "text-[#3e465b] opacity-60 hover:text-[#8c0026]"}`}>
            {({ isActive }) => (
              <>
                <span className="material-symbols-outlined mb-1" style={isActive && icon === "favorite" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{icon}</span>
                <span className="text-[9px] font-semibold leading-none sm:text-[10px]">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
