import { api } from "./api";
import { mapApiUser } from "./social";
import type { DiscoveryProfile } from "../types";

export interface MatchRow {
  /** Backend Match document id (used to remove a match). */
  matchId: string;
  /** The matched member's public profile. */
  player: DiscoveryProfile;
}

export const matchesService = {
  async getMatches(): Promise<MatchRow[]> {
    const { data } = await api.get<{
      matches?: Array<{ id: string; matchPercentage: number; user: Parameters<typeof mapApiUser>[0] | null }>;
    }>("/social/matches");
    return (data.matches ?? [])
      .filter((item) => item.user)
      .map((item) => ({
        matchId: item.id,
        player: mapApiUser(item.user!, item.matchPercentage),
      }));
  },

  async remove(matchId: string): Promise<void> {
    await api.delete(`/social/matches/${matchId}`);
  },
};