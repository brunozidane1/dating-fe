import { api } from "./api";
import type { NotificationItem } from "../types";

export const notificationsService = {
  async getNotifications(): Promise<NotificationItem[]> {
    const { data } = await api.get<{ notifications?: NotificationItem[] }>(
      "/social/notifications"
    );
    return data.notifications ?? [];
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ count: number }>(
      "/social/notifications/unread"
    );
    return data.count;
  },

  async markAllRead(): Promise<void> {
    await api.post("/social/notifications/read-all");
  },

  async markRead(id: string): Promise<void> {
    await api.patch(`/social/notifications/${id}/read`);
  },
};