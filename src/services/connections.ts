import { api } from "./api";
import type { Connection } from "../types";

export const LIMIT_ACTIVE_CONNECTIONS = 3;

export const connectionsService = {
  async getConnections(): Promise<Connection[]> {
    const { data } = await api.get<Connection[]>("/connections");
    return data;
  },

  async getActive(): Promise<Connection[]> {
    const { data } = await api.get<Connection[]>("/connections/active");
    return data;
  },

  async getRequests(): Promise<Connection[]> {
    const { data } = await api.get<Connection[]>("/connections/requests");
    return data;
  },

  async getSent(): Promise<Connection[]> {
    const { data } = await api.get<Connection[]>("/connections/sent");
    return data;
  },

  async getCounts(): Promise<{ active: number; requests: number; sent: number }> {
    const { data } = await api.get<{ active: number; requests: number; sent: number }>(
      "/connections/counts"
    );
    return data;
  },

  async request(profileId: string): Promise<Connection> {
    const { data } = await api.post<Connection>("/connections", { profileId });
    return data;
  },

  async accept(connectionId: string): Promise<Connection> {
    const { data } = await api.post<Connection>(
      `/connections/${connectionId}/accept`
    );
    return data;
  },

  async reject(connectionId: string): Promise<void> {
    await api.post(`/connections/${connectionId}/reject`);
  },

  async end(connectionId: string): Promise<void> {
    await api.delete(`/connections/${connectionId}`);
  },
};