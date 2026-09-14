import type { UserProfile } from "../types";

const USER_KEY = "lume_user";
export const getSessionUser = (): UserProfile | null => {
  try {
    const legacyUser = localStorage.getItem(USER_KEY);
    if (legacyUser) localStorage.removeItem(USER_KEY);
    return JSON.parse(sessionStorage.getItem(USER_KEY) ?? "null") as UserProfile | null;
  }
  catch { return null; }
};
export const setSessionUser = (user: UserProfile) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("lume:auth-change"));
};
export const clearSessionUser = () => {
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("lume:auth-change"));
};
