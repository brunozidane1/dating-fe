import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://dating-be-1.onrender.com/api";

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ?? API_BASE_URL.replace(/\/api\/?$/, "");

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const TOKEN_KEY = "lume_token";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("lume:unauthorized"));
      }
    }
    return Promise.reject(err);
  }
);

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; code?: string }
      | undefined;
    return new ApiError(
      data?.message ?? err.message ?? "Something went wrong",
      err.response?.status,
      data?.code
    );
  }
  if (err instanceof Error) return new ApiError(err.message);
  return new ApiError("Something went wrong");
}
