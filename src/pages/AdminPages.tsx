import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Download,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Search,
  AlertTriangle,
  ShieldCheck,
  ShieldOff,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { adminService } from "../services/admin";
import { clearToken } from "../services/api";
import { clearSessionUser, getSessionUser } from "../services/session";
import { plansService, type PlanDetail } from "../services/plans";
import { toApiError } from "../services/api";
import type {
  AdminActivityResponse,
  AdminConnectionRequestItem,
  AdminMatchItem,
  AdminOverviewResponse,
  AdminUserSummary,
  AdminUsersResponse, AdminOperationalResponse,
} from "../types";

const fallbackAvatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80";

const adminNav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Activity", to: "/admin/activity", icon: Activity },
  { label: "Plans", to: "/admin/plans", icon: CreditCard },
  { label: "Safety alerts", to: "/admin/safety-alerts", icon: AlertTriangle },
] as const;

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/activity": "Activity",
  "/admin/plans": "Plans",
  "/admin/safety-alerts": "Critical safety alerts",
};

const apiMessage = (error: unknown) => toApiError(error).message;

function Modal({
  open,
  title,
  children,
  onClose,
  footer,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4 py-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1dada] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Admin</p>
            <h3 className="text-xl font-bold text-[#36151a]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e4bdbe] p-2 text-[#5b4041] transition hover:bg-[#fff2f2]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#f1dada] px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

function Avatar({ user }: { user: AdminUserSummary }) {
  return (
    <img
      src={user.primaryPhoto || user.photos?.[0] || fallbackAvatar}
      alt=""
      className="h-12 w-12 rounded-2xl object-cover ring-1 ring-[#f0dada]"
    />
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
      {active ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}
      {active ? "Active" : "Disabled"}
    </span>
  );
}

function CompletionPill({ complete }: { complete: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${complete ? "bg-[#fff0f4] text-[#8c0026]" : "bg-amber-50 text-amber-700"}`}>
      <BadgeCheck size={12} />
      {complete ? "Profile complete" : "Profile incomplete"}
    </span>
  );
}

function MetricCard({
  label,
  value,
  helper,
  to,
  tone = "rose",
}: {
  label: string;
  value: string | number;
  helper?: string;
  to?: string;
  tone?: "rose" | "amber" | "red" | "emerald" | "violet";
}) {
  const tones = {
    rose: "border-rose-200/60 bg-rose-50/70 text-rose-950 shadow-rose-500/10",
    amber: "border-amber-200/70 bg-amber-50/80 text-amber-950 shadow-amber-500/10",
    red: "border-red-200/70 bg-red-50/80 text-red-950 shadow-red-500/10",
    emerald: "border-emerald-200/70 bg-emerald-50/80 text-emerald-950 shadow-emerald-500/10",
    violet: "border-violet-200/70 bg-violet-50/80 text-violet-950 shadow-violet-500/10",
  }[tone];
  const body = <>
    <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-65">{label}</p>
    <div className="mt-2 text-3xl font-black">{value}</div>
    {helper && <p className="mt-2 text-sm opacity-75">{helper}</p>}
  </>;
  return (
    to ? <Link to={to} className={`block rounded-3xl border p-5 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl ${tones}`}>{body}</Link>
      : <article className={`rounded-3xl border p-5 shadow-lg backdrop-blur-xl ${tones}`}>{body}</article>
  );
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getSessionUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = pageTitles[location.pathname] ?? "Dashboard";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const logout = async () => {
    try {
      await adminService.logout();
    } catch {
      // We still clear the local session below so the UI stays safe and consistent.
    }
    clearSessionUser();
    clearToken();
    toast.success("Admin session closed.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fff9f9] text-[#36151a] lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 border-r border-[#f1dada] bg-white shadow-xl shadow-[#8c0026]/5 transition-transform duration-300 lg:static lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-[#f1dada] px-6 py-5">
            <img src="/logo.jpeg" alt="Lovinara" className="h-12 w-12 rounded-2xl object-cover" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Admin console</p>
              <h1 className="text-lg font-black text-[#36151a]">Lovinara</h1>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-5" aria-label="Admin navigation">
            {adminNav.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-[#8c0026] text-white shadow-lg shadow-[#8c0026]/20" : "text-[#5b4041] hover:bg-[#fff2f2] hover:text-[#8c0026]"
                  }`
                }
              >
                <Icon size={17} />
                <span>{label}</span>
                <ChevronRight size={15} className="ml-auto opacity-60" />
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-[#f1dada] px-5 py-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#fff7f7] p-3">
              {currentUser ? <Avatar user={currentUser as AdminUserSummary} /> : <div className="h-12 w-12 rounded-2xl bg-[#fff0f4]" />}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#36151a]">{currentUser?.name || "Admin"}</p>
                <p className="truncate text-xs text-[#7b6466]">{currentUser?.email || "admin"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e4bdbe] px-4 py-3 text-sm font-semibold text-[#8c0026] transition hover:bg-[#fff2f2]"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && <button type="button" aria-label="Close admin menu" className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <header className="sticky top-0 z-30 border-b border-[#f1dada] bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex rounded-2xl border border-[#e4bdbe] p-2 text-[#5b4041] transition hover:bg-[#fff2f2] lg:hidden"
              aria-label="Open admin menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Admin</p>
              <h2 className="truncate text-xl font-black text-[#36151a]">{title}</h2>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 rounded-full bg-[#8c0026] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#8c0026]/20 transition hover:bg-[#71001f]"
              >
                <Users size={15} /> Users
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function UserCard({
  user,
  onOpen,
  onToggle,
}: {
  user: AdminUserSummary;
  onOpen: (user: AdminUserSummary) => void;
  onToggle: (user: AdminUserSummary) => void;
}) {
  return (
    <article className="rounded-3xl border border-[#f1dada] bg-white p-4 shadow-sm shadow-[#8c0026]/5">
      <div className="flex items-start gap-3">
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-[#36151a]">{user.name}</h3>
            <StatusPill active={user.isActive} />
          </div>
          <p className="truncate text-sm text-[#7b6466]">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CompletionPill complete={user.isProfileComplete} />
            {user.location && <span className="rounded-full bg-[#fff7f7] px-3 py-1 text-xs font-semibold text-[#8c0026]">{user.location}</span>}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpen(user)}
          className="inline-flex items-center gap-2 rounded-full border border-[#e4bdbe] px-4 py-2 text-sm font-semibold text-[#5b4041] transition hover:bg-[#fff7f7]"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onToggle(user)}
          className="inline-flex items-center gap-2 rounded-full bg-[#8c0026] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#71001f]"
        >
          {user.isActive ? "Disable" : "Enable"}
        </button>
      </div>
    </article>
  );
}

export function AdminDashboardPage() {
  const [data, setData] = useState<AdminOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState<"daily" | "weekly" | "monthly" | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminService
      .overview()
      .then((response) => {
        if (active) setData(response);
      })
      .catch((error) => toast.error(apiMessage(error)))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const metrics = data?.metrics;
  const downloadReport = async (period: "daily" | "weekly" | "monthly") => {
    setReportPeriod(period);
    try { await adminService.downloadReport(period); toast.success(`${period[0].toUpperCase()}${period.slice(1)} PDF report downloaded.`); }
    catch (error) { toast.error(apiMessage(error)); }
    finally { setReportPeriod(null); }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-amber-200/70 bg-amber-50/80 p-5 shadow-lg shadow-amber-500/10 backdrop-blur-xl">
        <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800/70">Exports</p><h2 className="mt-1 text-xl font-black text-amber-950">Download admin reports</h2><p className="mt-1 text-sm text-amber-900/75">Get a PDF snapshot of platform activity, safety, and subscriptions.</p></div>
        <div className="flex flex-wrap gap-2">{(["daily", "weekly", "monthly"] as const).map((period) => <button key={period} type="button" disabled={reportPeriod !== null} onClick={() => void downloadReport(period)} className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-950 disabled:opacity-60"><Download size={15}/>{reportPeriod === period ? "Preparing..." : `${period[0].toUpperCase()}${period.slice(1)} PDF`}</button>)}</div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard to="/admin/users" tone="rose" label="Total users" value={metrics?.totalUsers ?? 0} helper="Registered accounts" />
        <MetricCard to="/admin/new-users" tone="amber" label="New users" value={metrics?.newUsersToday ?? 0} helper={`${metrics?.newUsersWeek ?? 0} this week · ${metrics?.newUsersMonth ?? 0} this month`} />
        <MetricCard to="/admin/users" tone="emerald" label="Active users" value={metrics?.activeUsers ?? 0} helper="Accounts currently enabled" />
        <MetricCard to="/admin/matches" tone="violet" label="New matches" value={metrics?.totalMatches ?? 0} helper="All recorded matches" />
        <MetricCard to="/admin/messages" tone="rose" label="Messages sent" value={metrics?.totalMessages ?? 0} helper="Stored delivery records" />
        <MetricCard to="/admin/reports" tone="red" label="Reports" value={metrics?.reports ?? 0} helper="Open or under review" />
        <MetricCard to="/admin/moderation" tone="red" label="Suspended / banned" value={(metrics?.suspendedUsers ?? 0) + (metrics?.bannedUsers ?? 0)} helper={`${metrics?.bannedUsers ?? 0} permanently banned`} />
        <MetricCard to="/admin/verification" tone="emerald" label="Verified users" value={metrics?.verifiedUsers ?? 0} helper="Email-verified accounts" />
        <MetricCard to="/admin/premium-users" tone="violet" label="Premium users" value={metrics?.premiumUsers ?? 0} helper="Active premium subscriptions" />
        <MetricCard to="/admin/revenue" tone="amber" label="Revenue" value={`UGX ${(metrics?.revenueUGX ?? 0).toLocaleString()}`} helper="Estimated monthly recurring" />
        <MetricCard to="/admin/safety-alerts" tone="red" label="Critical safety alerts" value={metrics?.criticalSafetyAlerts ?? 0} helper="High-priority reports" />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/admin/users" className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5 transition hover:-translate-y-0.5 hover:shadow-md">
          <Users className="text-[#8c0026]" />
          <h3 className="mt-3 text-lg font-bold text-[#36151a]">Manage users</h3>
          <p className="mt-2 text-sm text-[#5b4041]">Search, inspect, and enable or disable accounts from one place.</p>
        </Link>
        <Link to="/admin/activity" className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5 transition hover:-translate-y-0.5 hover:shadow-md">
          <Activity className="text-[#8c0026]" />
          <h3 className="mt-3 text-lg font-bold text-[#36151a]">Track activity</h3>
          <p className="mt-2 text-sm text-[#5b4041]">See new signups, connection requests, and recent matches.</p>
        </Link>
        <Link to="/admin/plans" className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5 transition hover:-translate-y-0.5 hover:shadow-md">
          <CreditCard className="text-[#8c0026]" />
          <h3 className="mt-3 text-lg font-bold text-[#36151a]">Review plans</h3>
          <p className="mt-2 text-sm text-[#5b4041]">Keep the pricing catalog visible while payments are being prepared.</p>
        </Link>
      </section>


      <section className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#36151a]">Recent signups</h2>
            <p className="text-sm text-[#5b4041]">The latest people joining the platform.</p>
          </div>
          <Link to="/admin/users" className="text-sm font-semibold text-[#8c0026]">
            Open users
          </Link>
        </div>
        {loading ? (
          <div className="mt-4 flex items-center gap-3 text-sm text-[#5b4041]">
            <LoaderCircle className="animate-spin" size={18} /> Loading overview...
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {(data?.recentUsers ?? []).map((user) => (
              <div key={user.id} className="rounded-2xl border border-[#f1dada] bg-[#fffdfd] p-4">
                <div className="flex items-center gap-3">
                  <Avatar user={user} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#36151a]">{user.name}</p>
                    <p className="truncate text-xs text-[#7b6466]">{user.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusPill active={user.isActive} />
                  <CompletionPill complete={user.isProfileComplete} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function AdminUsersPage() {
  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "disabled">("all");
  const [complete, setComplete] = useState<"all" | "true" | "false">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [confirmUser, setConfirmUser] = useState<AdminUserSummary | null>(null);

  const filters = useMemo(
    () => ({
      page,
      limit: 10,
      search: search.trim() || undefined,
      status: status === "all" ? undefined : status,
      complete: complete === "all" ? undefined : complete === "true",
    }),
    [page, search, status, complete],
  );

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.listUsers(filters);
      setData(response);
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [filters]);

  const openUser = async (user: AdminUserSummary) => {
    setSelectedUser(user);
    setSelectedLoading(true);
    try {
      const response = await adminService.getUser(user.id);
      setSelectedUser(response.user);
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setSelectedLoading(false);
    }
  };

  const toggleStatus = async (user: AdminUserSummary) => {
    setSavingId(user.id);
    try {
      await adminService.setUserStatus(user.id, !user.isActive);
      toast.success(`${user.name} has been ${user.isActive ? "disabled" : "enabled"}.`);
      setConfirmUser(null);
      await loadUsers();
      if (selectedUser?.id === user.id) {
        const refreshed = await adminService.getUser(user.id);
        setSelectedUser(refreshed.user);
      }
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setSavingId(null);
    }
  };

  const pages = data?.pagination.pages ?? 1;

  return (
    <>
      <section className="rounded-3xl border border-[#f1dada] bg-white p-4 shadow-sm shadow-[#8c0026]/5">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Search</span>
            <div className="flex items-center gap-2 rounded-2xl border border-[#e4bdbe] bg-white px-4 py-3">
              <Search size={16} className="text-[#7b6466]" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search by name or email"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Status</span>
            <select
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value as typeof status);
              }}
              className="w-full rounded-2xl border border-[#e4bdbe] bg-white px-4 py-3 outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Profile</span>
            <select
              value={complete}
              onChange={(event) => {
                setPage(1);
                setComplete(event.target.value as typeof complete);
              }}
              className="w-full rounded-2xl border border-[#e4bdbe] bg-white px-4 py-3 outline-none"
            >
              <option value="all">All</option>
              <option value="true">Complete</option>
              <option value="false">Incomplete</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {loading ? (
          <div className="flex items-center gap-3 rounded-3xl border border-[#f1dada] bg-white p-6 text-[#5b4041]">
            <LoaderCircle className="animate-spin" size={18} /> Loading users...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:hidden">
              {(data?.users ?? []).map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onOpen={openUser}
                  onToggle={(item) => setConfirmUser(item)}
                />
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-3xl border border-[#f1dada] bg-white shadow-sm shadow-[#8c0026]/5 md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-[#fff7f7] text-xs uppercase tracking-[0.18em] text-[#8c0026]/70">
                    <tr>
                      <th className="px-5 py-4">User</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Profile</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.users ?? []).map((user) => (
                      <tr key={user.id} className="border-t border-[#f3dfdf]">
                        <td className="px-5 py-4">
                          <button type="button" onClick={() => openUser(user)} className="text-left">
                            <div className="flex items-center gap-3">
                              <Avatar user={user} />
                              <div>
                                <p className="font-semibold text-[#36151a]">{user.name}</p>
                                <p className="text-xs text-[#7b6466]">{user.email}</p>
                              </div>
                            </div>
                          </button>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#5b4041]">{user.location || "—"}</td>
                        <td className="px-5 py-4">
                          <CompletionPill complete={user.isProfileComplete} />
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill active={user.isActive} />
                        </td>
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setConfirmUser(user)}
                            disabled={savingId === user.id}
                            className="inline-flex items-center gap-2 rounded-full bg-[#8c0026] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#71001f] disabled:opacity-60"
                          >
                            {savingId === user.id && <LoaderCircle className="animate-spin" size={14} />}
                            {user.isActive ? "Disable" : "Enable"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!data?.users.length && (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-sm text-[#7b6466]">
                          No users match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#5b4041]">
          Page {data?.pagination.page ?? 1} of {pages} · {data?.pagination.total ?? 0} total users
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page <= 1 || loading}
            className="rounded-full border border-[#e4bdbe] px-4 py-2 text-sm font-semibold text-[#5b4041] disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pages, value + 1))}
            disabled={page >= pages || loading}
            className="rounded-full border border-[#e4bdbe] px-4 py-2 text-sm font-semibold text-[#5b4041] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Modal
        open={Boolean(selectedUser)}
        title={selectedUser?.name ?? "User details"}
        onClose={() => {
          setSelectedUser(null);
          setSelectedLoading(false);
        }}
        footer={
          <>
            {selectedUser && (
              <button
                type="button"
                onClick={() => setConfirmUser(selectedUser)}
                className="rounded-full bg-[#8c0026] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#71001f]"
              >
                {selectedUser.isActive ? "Disable account" : "Enable account"}
              </button>
            )}
          </>
        }
      >
        {selectedLoading ? (
          <div className="flex items-center gap-3 text-[#5b4041]">
            <LoaderCircle className="animate-spin" size={18} /> Loading profile...
          </div>
        ) : selectedUser ? (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Avatar user={selectedUser} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-bold text-[#36151a]">{selectedUser.name}</h4>
                  <StatusPill active={selectedUser.isActive} />
                  <CompletionPill complete={selectedUser.isProfileComplete} />
                </div>
                <p className="mt-1 text-sm text-[#7b6466]">{selectedUser.email}</p>
                {selectedUser.location && <p className="mt-1 text-sm text-[#5b4041]">{selectedUser.location}</p>}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Bio" value={selectedUser.profile?.bio || selectedUser.bio || "No bio yet"} />
              <InfoBox label="Interests" value={(selectedUser.profile?.interests || selectedUser.interests || []).join(", ") || "No interests yet"} />
              <InfoBox label="Gender" value={selectedUser.profile?.gender || selectedUser.gender || "Not set"} />
              <InfoBox label="Occupation" value={selectedUser.profile?.occupation || selectedUser.occupation || "Not set"} />
              <InfoBox label="Education" value={selectedUser.profile?.education || selectedUser.education || "Not set"} />
              <InfoBox label="Created" value={selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "Unknown"} />
            </div>

            <div className="rounded-2xl bg-[#fff7f7] p-4">
              <h5 className="text-sm font-bold uppercase tracking-[0.18em] text-[#8c0026]/70">Photos</h5>
              <div className="mt-3 flex flex-wrap gap-3">
                {((selectedUser.profile?.photos || selectedUser.photos) || []).length ? (
                  ((selectedUser.profile?.photos || selectedUser.photos) || []).map((photo) => (
                    <img key={photo} src={photo} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                  ))
                ) : (
                  <p className="text-sm text-[#7b6466]">No photos uploaded.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(confirmUser)}
        title={confirmUser ? (confirmUser.isActive ? "Disable user" : "Enable user") : "Confirm action"}
        onClose={() => setConfirmUser(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setConfirmUser(null)}
              className="rounded-full border border-[#e4bdbe] px-4 py-2 text-sm font-semibold text-[#5b4041]"
            >
              Cancel
            </button>
            {confirmUser && (
              <button
                type="button"
                onClick={() => void toggleStatus(confirmUser)}
                className="rounded-full bg-[#8c0026] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#71001f]"
              >
                Confirm
              </button>
            )}
          </>
        }
      >
        <p className="text-sm text-[#5b4041]">
          {confirmUser
            ? `Are you sure you want to ${confirmUser.isActive ? "disable" : "enable"} ${confirmUser.name}?`
            : ""}
        </p>
      </Modal>
    </>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#f1dada] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">{label}</p>
      <p className="mt-2 text-sm text-[#36151a]">{value}</p>
    </div>
  );
}

export function AdminActivityPage() {
  const [data, setData] = useState<AdminActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AdminUserSummary | AdminConnectionRequestItem | AdminMatchItem | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminService
      .activity()
      .then((response) => {
        if (active) setData(response);
      })
      .catch((error) => toast.error(apiMessage(error)))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-[#f1dada] bg-white p-6 text-[#5b4041]">
          <LoaderCircle className="animate-spin" size={18} /> Loading activity...
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-[#36151a]">Recent signups</h3>
                <p className="text-sm text-[#5b4041]">New profiles that just entered the platform.</p>
              </div>
              <Link to="/admin/users" className="text-sm font-semibold text-[#8c0026]">
                Inspect users
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {(data?.recentUsers ?? []).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setDetail(user)}
                  className="rounded-2xl border border-[#f1dada] bg-[#fffdfd] p-4 text-left transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#36151a]">{user.name}</p>
                      <p className="truncate text-xs text-[#7b6466]">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusPill active={user.isActive} />
                    <CompletionPill complete={user.isProfileComplete} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5">
              <h3 className="text-xl font-bold text-[#36151a]">Connection requests</h3>
              <p className="text-sm text-[#5b4041]">A quick look at who is requesting to connect.</p>
              <div className="mt-4 space-y-3">
                {(data?.connectionRequests ?? []).map((request) => (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setDetail(request)}
                    className="w-full rounded-2xl border border-[#f1dada] bg-[#fffdfd] p-4 text-left transition hover:bg-[#fff7f7]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#36151a]">
                          {request.requester.name} → {request.recipient.name}
                        </p>
                        <p className="text-xs text-[#7b6466]">
                          Requested on {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#fff0f4] px-3 py-1 text-xs font-semibold text-[#8c0026]">
                        {request.status}
                      </span>
                    </div>
                  </button>
                ))}
                {!data?.connectionRequests.length && <p className="text-sm text-[#7b6466]">No recent requests.</p>}
              </div>
            </div>

            <div className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5">
              <h3 className="text-xl font-bold text-[#36151a]">Recent matches</h3>
              <p className="text-sm text-[#5b4041]">Match records are useful for moderation and analytics.</p>
              <div className="mt-4 space-y-3">
                {(data?.recentMatches ?? []).map((match) => (
                  <button
                    key={match.id}
                    type="button"
                    onClick={() => setDetail(match)}
                    className="w-full rounded-2xl border border-[#f1dada] bg-[#fffdfd] p-4 text-left transition hover:bg-[#fff7f7]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#36151a]">
                          {match.users.map((user) => user.name).join(" + ")}
                        </p>
                        <p className="text-xs text-[#7b6466]">
                          Matched on {new Date(match.matchedAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {match.matchPercentage}%
                      </span>
                    </div>
                  </button>
                ))}
                {!data?.recentMatches.length && <p className="text-sm text-[#7b6466]">No recent matches.</p>}
              </div>
            </div>
          </section>
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        title="Activity details"
        onClose={() => setDetail(null)}
      >
        {detail && "requester" in detail ? (
          <div className="space-y-4">
            <p className="text-sm text-[#5b4041]">
              Request from <b>{detail.requester.name}</b> to <b>{detail.recipient.name}</b>.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Requester" value={detail.requester.email || "No email"} />
              <InfoBox label="Recipient" value={detail.recipient.email || "No email"} />
              <InfoBox label="Status" value={detail.status} />
              <InfoBox label="Created" value={new Date(detail.createdAt).toLocaleString()} />
            </div>
          </div>
        ) : detail && "matchPercentage" in detail ? (
          <div className="space-y-4">
            <p className="text-sm text-[#5b4041]">
              Match record with {detail.users.length} participants.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Match percentage" value={`${detail.matchPercentage}%`} />
              <InfoBox label="Matched at" value={new Date(detail.matchedAt).toLocaleString()} />
              <InfoBox label="Pair key" value={detail.pairKey} />
              <InfoBox label="Users" value={detail.users.map((user) => user.name).join(", ")} />
            </div>
          </div>
        ) : detail ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar user={detail} />
              <div>
                <h4 className="text-lg font-bold text-[#36151a]">{detail.name}</h4>
                <p className="text-sm text-[#7b6466]">{detail.email}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoBox label="Location" value={detail.profile?.location || detail.location || "Not set"} />
              <InfoBox label="Status" value={detail.isActive ? "Active" : "Disabled"} />
              <InfoBox label="Profile" value={detail.isProfileComplete ? "Complete" : "Incomplete"} />
              <InfoBox label="Created" value={new Date(detail.createdAt).toLocaleString()} />
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

const operationPages: Record<string, { title: string; resource: string; description: string }> = {
  "new-users": { title: "New users", resource: "new-users", description: "Review the most recent people who have joined the platform." },
  matches: { title: "Matches", resource: "matches", description: "Inspect recently created matches across the platform." },
  messages: { title: "Messages sent", resource: "messages", description: "Review message delivery metadata. Message contents remain private." },
  reports: { title: "Reports", resource: "reports", description: "Triage user reports and record a moderation outcome." },
  moderation: { title: "Suspended and banned users", resource: "moderation", description: "Restore, suspend, or permanently ban accounts." },
  verification: { title: "Verified users", resource: "verification", description: "Review verified accounts and revoke verification when necessary." },
  "premium-users": { title: "Premium users", resource: "premium-users", description: "Review active premium members and update a subscription tier." },
  revenue: { title: "Revenue", resource: "revenue", description: "Estimated recurring subscription revenue from active plans." },
  "safety-alerts": { title: "Critical safety alerts", resource: "safety-alerts", description: "High-severity reports that need immediate review." },
};

export function AdminOperationsPage() {
  const location = useLocation();
  const key = location.pathname.split("/").pop() || "reports";
  const config = operationPages[key] || operationPages.reports;
  const [data, setData] = useState<AdminOperationalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { setData(await adminService.operational(config.resource)); } catch (error) { toast.error(apiMessage(error)); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, [config.resource]);
  const action = async (item: Record<string, unknown>, name: string) => {
    try {
      const id = String(item.id || item._id);
      if (config.resource === "reports" || config.resource === "safety-alerts") await adminService.reviewReport(id, name as "reviewing" | "resolved" | "dismissed");
      if (config.resource === "moderation") await adminService.updateModeration(id, name as "active" | "suspended" | "banned");
      if (config.resource === "verification") await adminService.updateVerification(id, name === "verify");
      if (config.resource === "premium-users") await adminService.updateSubscription(id, name as "free" | "basic" | "premium");
      toast.success("Update saved."); await load();
    } catch (error) { toast.error(apiMessage(error)); }
  };
  const userName = (person: unknown) => typeof person === "object" && person ? String((person as { fullName?: string }).fullName || "Unknown user") : "Unknown user";
  return <div className="space-y-5">
    <section className="rounded-3xl border border-rose-200/60 bg-rose-50/70 p-5 shadow-lg shadow-rose-500/10 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Operations</p><h3 className="mt-1 text-2xl font-black text-[#36151a]">{config.title}</h3><p className="mt-2 text-sm text-[#5b4041]">{config.description}</p>
    </section>
    {loading ? <div className="flex items-center gap-3 rounded-3xl border border-[#f1dada] bg-white/75 p-6 backdrop-blur-xl text-[#5b4041]"><LoaderCircle className="animate-spin" size={18} /> Loading records...</div> :
      <section className="space-y-3">{(data?.items || []).map((item, index) => <article key={String(item.id || item._id || index)} className="rounded-3xl border border-[#f1dada] bg-white/75 p-5 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h4 className="font-bold text-[#36151a]">{String(item.reason || item.label || item.pairKey || userName(item.sender) || item.fullName || "Record")}</h4>
          <p className="mt-1 text-sm text-[#5b4041]">{item.reporter ? `${userName(item.reporter)} reported ${userName(item.reportedUser)}` : item.email ? String(item.email) : item.amountUGX ? `UGX ${Number(item.amountUGX).toLocaleString()}` : item.createdAt ? new Date(String(item.createdAt)).toLocaleString() : ""}</p>
          {Boolean(item.status) && <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{String(item.status)}</span>}</div>
          <div className="flex flex-wrap gap-2">{(config.resource === "reports" || config.resource === "safety-alerts") && <><button onClick={() => action(item, "reviewing")} className="rounded-full border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-800">Review</button><button onClick={() => action(item, "resolved")} className="rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Resolve</button><button onClick={() => action(item, "dismissed")} className="rounded-full border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700">Dismiss</button></>}
          {config.resource === "moderation" && <><button onClick={() => action(item, "active")} className="rounded-full bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Restore</button><button onClick={() => action(item, "banned")} className="rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white">Ban</button></>}
          {config.resource === "verification" && <button onClick={() => action(item, "revoke")} className="rounded-full border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700">Revoke verification</button>}
          {config.resource === "premium-users" && <button onClick={() => action(item, "free")} className="rounded-full border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700">Move to free</button>}</div></div>
      </article>)}{!data?.items.length && <p className="rounded-3xl border border-dashed border-[#e4bdbe] bg-white/60 p-8 text-center text-sm text-[#7b6466]">No records need attention right now.</p>}</section>}
  </div>;
}

export function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    plansService
      .listPlans()
      .then((response) => {
        if (!active) return;
        setPlans(response.plans);
        setNote(response.note);
        setPaymentsEnabled(response.paymentsEnabled);
      })
      .catch((error) => toast.error(apiMessage(error)))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Pricing</p>
        <h3 className="mt-1 text-2xl font-black text-[#36151a]">Plans catalog</h3>
        <p className="mt-2 text-sm text-[#5b4041]">
          {note || "This catalog stays visible while payment gateway integration is prepared."}
        </p>
        <div className="mt-4 inline-flex rounded-full bg-[#fff7f7] px-3 py-1 text-xs font-semibold text-[#8c0026]">
          Payments {paymentsEnabled ? "enabled" : "not enabled yet"}
        </div>
      </section>

      {loading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-[#f1dada] bg-white p-6 text-[#5b4041]">
          <LoaderCircle className="animate-spin" size={18} /> Loading plans...
        </div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-3xl border border-[#f1dada] bg-white p-5 shadow-sm shadow-[#8c0026]/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">{plan.id}</p>
                  <h4 className="mt-1 text-2xl font-black text-[#36151a]">{plan.name}</h4>
                </div>
                <div className="rounded-2xl bg-[#fff7f7] px-3 py-2 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">UGX</p>
                  <p className="text-lg font-black text-[#8c0026]">{plan.priceUGX.toLocaleString()}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#5b4041]">{plan.headline}</p>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c0026]/70">Includes</p>
                  <ul className="mt-2 space-y-2 text-sm text-[#5b4041]">
                    {plan.includes.map((item) => (
                      <li key={item} className="rounded-2xl bg-[#fffafa] px-3 py-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.limits && (
                  <div className="grid grid-cols-2 gap-2">
                    <InfoBox
                      label="Outbound chats"
                      value={plan.limits.uniqueOutboundChats === null ? "Unlimited" : String(plan.limits.uniqueOutboundChats)}
                    />
                    <InfoBox
                      label="Connections"
                      value={plan.limits.activeConnections === null ? "Unlimited" : String(plan.limits.activeConnections)}
                    />
                  </div>
                )}
                <div className="inline-flex rounded-full bg-[#fff0f4] px-3 py-1 text-xs font-semibold text-[#8c0026]">
                  {plan.paymentReady ? "Ready for payment gateway" : "Waiting for payment gateway"}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export { AdminLayout };
