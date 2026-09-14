import { api } from "./api";
import type { AdminActivityResponse, AdminOperationalResponse, AdminOverviewResponse, AdminUsersResponse, AdminUserSummary } from "../types";

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
  async operational(type: string): Promise<AdminOperationalResponse> {
    const { data } = await api.get<AdminOperationalResponse>(`/admin/operations/${type}`);
    return data;
  },
  async updateModeration(id: string, status: "active" | "suspended" | "banned") {
    const { data } = await api.patch(`/admin/users/${id}/moderation`, { status }); return data;
  },
  async updateVerification(id: string, verified: boolean) {
    const { data } = await api.patch(`/admin/users/${id}/verification`, { verified }); return data;
  },
  async updateSubscription(id: string, tier: "free" | "basic" | "premium") {
    const { data } = await api.patch(`/admin/users/${id}/subscription`, { tier }); return data;
  },
  async reviewReport(id: string, status: "reviewing" | "resolved" | "dismissed") {
    const { data } = await api.patch(`/admin/reports/${id}`, { status }); return data;
  },
  async downloadReport(period: "daily" | "weekly" | "monthly"): Promise<void> {
    const response = await api.get("/admin/reports/export", { params: { period }, responseType: "blob" });
    const url = URL.createObjectURL(response.data as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lovinara-${period}-report.pdf`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  },

  async logout(): Promise<void> {
    await api.post("/admin/auth/logout");
  },
};
