import { api, setToken } from "./api";
import type { AuthResponse } from "../types";

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
    name: string;
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

  async me(): Promise<AuthResponse> {
    const { data } = await api.get<AuthResponse>("/auth/me");
    return data;
  },
};