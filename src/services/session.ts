import type { UserProfile } from "../types";

const USER_KEY = "lume_user";
export const getSessionUser = (): UserProfile | null => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? "null") as UserProfile | null; }
  catch { return null; }
};
export const setSessionUser = (user: UserProfile) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("lume:auth-change"));
};
export const clearSessionUser = () => {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("lume:auth-change"));
};
