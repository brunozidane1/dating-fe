import { api } from "./api";
import type { DiscoveryProfile } from "../types";

type ApiUser = { id: string; fullName?: string; name?: string; email?: string; profile?: Record<string, unknown>; createdAt?: string; lastActive?: string };
export function mapApiUser(raw: ApiUser, matchPercentage = 0): DiscoveryProfile {
  const profile = raw.profile ?? {}; const photos = Array.isArray(profile.photos) ? profile.photos.map((photo) => typeof photo === "string" ? photo : (photo as { url?: string }).url).filter(Boolean) as string[] : [];
  return { id: String(raw.id), name: raw.fullName ?? raw.name ?? "Member", email: raw.email, age: profile.age as number | undefined, gender: profile.gender as string | undefined, location: profile.location as string | undefined, occupation: profile.occupation as string | undefined, education: profile.education as string | undefined, bio: profile.bio as string | undefined, interests: profile.interests as string[] | undefined, lifestyle: profile.lifestyle as string[] | undefined, relationshipGoal: (profile.relationshipGoals as string[] | undefined)?.[0], photos, primaryPhoto: photos[0], createdAt: raw.createdAt ?? new Date().toISOString(), lastActive: raw.lastActive, matchScore: { overall: matchPercentage, interests: 0, lifestyle: 0, goals: 0 } };
}
export const socialService = {
  async discovery(): Promise<DiscoveryProfile[]> { const { data } = await api.get<{ profiles: ApiUser[] }>("/social/discovery"); return (data.profiles ?? []).map((user) => mapApiUser(user)); },
  async discoveryAction(profileId: string, action: "pass" | "like" | "superlike" | "connect") { return api.post("/social/discovery/action", { profileId, action }); },
  async counters(): Promise<{ unreadMessages: number; unreadNotifications: number; connections: { active: number; pending: number; incomingPending: number; outgoingPending: number } }> { const { data } = await api.get("/social/counters"); return data; },
};
