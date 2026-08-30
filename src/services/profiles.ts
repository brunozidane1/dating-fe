import { api } from "./api";
import type { DiscoveryProfile, ProfileFilters, UserProfile } from "../types";

export const profilesService = {
  async getDiscovery(filters?: ProfileFilters): Promise<DiscoveryProfile[]> {
    const { data } = await api.get<DiscoveryProfile[]>("/discovery", {
      params: filters,
    });
    return data;
  },

  async getProfile(id: string): Promise<DiscoveryProfile> {
    const { data } = await api.get<DiscoveryProfile>(`/profiles/${id}`);
    return data;
  },

  async search(query: string, filters?: ProfileFilters): Promise<UserProfile[]> {
    const { data } = await api.get<UserProfile[]>("/profiles/search", {
      params: { query, ...filters },
    });
    return data;
  },

  async getMe(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>("/profiles/me");
    return data;
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    const { data } = await api.patch<UserProfile>("/profiles/me", payload);
    return data;
  },

  async uploadPhoto(file: File): Promise<{ url: string }> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<{ url: string }>(
      "/profiles/me/photos",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  async deletePhoto(url: string): Promise<void> {
    await api.delete("/profiles/me/photos", { data: { url } });
  },

  async setPrimaryPhoto(url: string): Promise<void> {
    await api.patch("/profiles/me/photos/primary", { url });
  },

  async reorderPhotos(urls: string[]): Promise<void> {
    await api.put("/profiles/me/photos/order", { urls });
  },
};