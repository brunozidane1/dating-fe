import { format, formatDistanceToNowStrict, isToday, isYesterday } from "date-fns";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatRelativeTime(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isToday(date)) return format(date, "hh:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
}

export function formatChatTime(iso?: string | null): string {
  if (!iso) return "";
  return format(new Date(iso), "hh:mm a");
}

export function formatChatDate(iso: string): string {
  const d = new Date(iso);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEEE, MMMM d");
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  return formatDistanceToNowStrict(new Date(iso), { addSuffix: true });
}

export function calculateAge(dob?: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function withDelay<T>(fn: () => T | Promise<T>, ms = 350): Promise<T> {
  return sleep(ms).then(fn);
}