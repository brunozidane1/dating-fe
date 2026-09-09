import { api, clearToken, setToken } from "./api";
import type { AuthResponse, UserProfile } from "../types";

const MAX_PROFILE_PHOTO_BYTES = 10 * 1024 * 1024;

function validateProfilePhoto(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file for your profile photo.");
  }
  if (file.size > MAX_PROFILE_PHOTO_BYTES) {
    throw new Error("That photo is too large. Choose an image smaller than 10 MB.");
  }
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    setToken(data.token);
    return data;
  },

  async signup(payload: {
    fullName: string;
    email: string;
    password: string;
    dob?: string;
    gender?: string;
    location?: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    setToken(data.token);
    return data;
  },

  async uploadProfilePhoto(file: File): Promise<{ url: string }> {
    validateProfilePhoto(file);
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<{ url: string }>("/profile/photos", form, {
      // Keep this request multipart even though the shared API client defaults to JSON.
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async completeProfile(payload: {
    age: number; gender: string; location: string; occupation: string; education: string;
    datingPreferences: string[]; relationshipGoals: string[]; loveLanguages: string[]; bio: string; interests: string[];
  }): Promise<AuthResponse> {
    const { data } = await api.put<AuthResponse>("/auth/complete-profile", payload);
    return data;
  },

  async logout(): Promise<void> {
    try { await api.post("/auth/logout"); } finally { clearToken(); }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return data;
  },

  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(
      "/auth/reset-password",
      { token, password }
    );
    return data;
  },

  async verifyEmail(token: string): Promise<{ message: string; user: UserProfile }> {
    const { data } = await api.post<{ message: string; user: UserProfile }>("/auth/verify-email", { token });
    return data;
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/auth/resend-verification", { email });
    return data;
  },

  async me(): Promise<AuthResponse> {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data;
  },
};
