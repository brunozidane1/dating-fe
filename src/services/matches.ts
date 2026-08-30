import { api } from "./api";
import type { DiscoveryProfile } from "../types";

export const matchesService = {
  async getMatches(): Promise<DiscoveryProfile[]> {
    const { data } = await api.get<DiscoveryProfile[]>("/matches");
    return data;
  },

  async like(profileId: string): Promise<{ matched: boolean }> {
    const { data } = await api.post<{ matched: boolean }>("/matches/like", {
      profileId,
    });
    return data;
  },

  async pass(profileId: string): Promise<void> {
    await api.post("/matches/pass", { profileId });
  },
};