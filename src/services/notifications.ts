import { api } from "./api";
import type { NotificationItem } from "../types";

export const notificationsService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const { data } = await api.get<NotificationItem[]>("/notifications");
    return data;
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ count: number }>("/notifications/unread");
    return data.count;
  },

  async markAllRead(): Promise<void> {
    await api.post("/notifications/read-all");
  },

  async markRead(id: string): Promise<void> {
    await api.post(`/notifications/${id}/read`);
  },
};