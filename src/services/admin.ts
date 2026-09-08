import { api } from "./api";
import type { AdminActivityResponse, AdminOverviewResponse, AdminUsersResponse, AdminUserSummary } from "../types";

export const adminService = {
  async overview(): Promise<AdminOverviewResponse> {
    const { data } = await api.get<AdminOverviewResponse>("/admin/dashboard/overview");
    return data;
  },

  async activity(): Promise<AdminActivityResponse> {
    const { data } = await api.get<AdminActivityResponse>("/admin/dashboard/activity");
    return data;
  },

  async listUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "disabled";
    complete?: boolean;
  }): Promise<AdminUsersResponse> {
    const { data } = await api.get<AdminUsersResponse>("/admin/users", { params });
    return data;
  },

  async getUser(id: string): Promise<{ user: AdminUserSummary }> {
    const { data } = await api.get<{ user: AdminUserSummary }>(`/admin/users/${id}`);
    return data;
  },

  async setUserStatus(id: string, isActive: boolean): Promise<{ user: AdminUserSummary }> {
    const { data } = await api.patch<{ user: AdminUserSummary }>(`/admin/users/${id}/status`, { isActive });
    return data;
  },

  async logout(): Promise<void> {
    await api.post("/admin/auth/logout");
  },
};
