import { api } from "./api";
import { mapApiUser } from "./social";
import type { Connection, UserProfile } from "../types";

export const LIMIT_ACTIVE_CONNECTIONS = 3;

/** An incoming (pending) friend request from another member. */
export interface IncomingRequest {
  /** Backend ConnectionRequest document id (used to accept/decline). */
  id: string;
  requester: UserProfile;
  createdAt: string;
}

/** A friend request you sent that is still awaiting a response. */
export interface SentRequest {
  /** Backend ConnectionRequest document id. */
  id: string;
  recipient: UserProfile;
  createdAt: string;
}
export interface ConnectionHistoryItem { id: string; user: UserProfile; endedAt: string; }

export const connectionsService = {
  async getActive(): Promise<Connection[]> {
    const { data } = await api.get<{
      connections?: Array<{ id: string; connectedAt: string; user: Parameters<typeof mapApiUser>[0] | null }>;
    }>("/social/connections");
    return (data.connections ?? [])
      .filter((item) => item.user)
      .map((item) => ({
        id: item.id,
        user: mapApiUser(item.user!),
        status: "active",
        acceptedAt: item.connectedAt,
      }));
  },

  async getRequests(): Promise<IncomingRequest[]> {
    const { data } = await api.get<{
      requests?: Array<{ id: string; createdAt: string; requester: Parameters<typeof mapApiUser>[0] | null }>;
    }>("/social/connections/requests");
    return (data.requests ?? [])
      .filter((item) => item.requester)
      .map((item) => ({
        id: item.id,
        requester: mapApiUser(item.requester!),
        createdAt: item.createdAt,
      }));
  },

  async getSent(): Promise<SentRequest[]> {
    const { data } = await api.get<{
      requests?: Array<{ id: string; createdAt: string; recipient: Parameters<typeof mapApiUser>[0] | null }>;
    }>("/social/connections/sent");
    return (data.requests ?? [])
      .filter((item) => item.recipient)
      .map((item) => ({
        id: item.id,
        recipient: mapApiUser(item.recipient!),
        createdAt: item.createdAt,
      }));
  },

  async sendRequest(profileId: string): Promise<void> {
    await api.post("/social/connections/requests", { profileId });
  },

  async acceptRequest(requestId: string): Promise<void> {
    await api.patch(`/social/connections/requests/${requestId}/accept`);
  },

  async declineRequest(requestId: string): Promise<void> {
    await api.patch(`/social/connections/requests/${requestId}/decline`);
  },

  async remove(connectionId: string): Promise<void> {
    await api.delete(`/social/connections/${connectionId}`);
  },

  async getHistory(): Promise<ConnectionHistoryItem[]> {
    const { data } = await api.get<{ history?: Array<{ id: string; user: Parameters<typeof mapApiUser>[0] | null; endedAt: string }> }>("/social/connections/history");
    return (data.history ?? []).filter((item) => item.user).map((item) => ({ id: item.id, user: mapApiUser(item.user!), endedAt: item.endedAt }));
  },
};
