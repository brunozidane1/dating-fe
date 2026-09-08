import { withDelay } from "../lib/utils";
import type {
  AuthResponse,
  Connection,
  Conversation,
  DiscoveryProfile,
  Message,
  NotificationItem,
  PlanTier,
  ProfileFilters,
  Subscription,
  UserProfile,
} from "../types";
import { ApiError } from "./api";
import {
  DEMO_CONNECTIONS,
  DEMO_CONVERSATIONS,
  DEMO_MATCHES,
  DEMO_NOTIFICATIONS,
  DEMO_PROFILES,
  DEMO_REQUESTS,
  DEMO_SENT,
  DEMO_SUBSCRIPTION,
  DEMO_USER,
} from "./mock-data";
import { LIMIT_ACTIVE_CONNECTIONS } from "./connections";

const state = {
  user: DEMO_USER,
  subscription: DEMO_SUBSCRIPTION,
  connections: DEMO_CONNECTIONS,
  requests: DEMO_REQUESTS,
  sent: DEMO_SENT,
  conversations: DEMO_CONVERSATIONS,
  notifications: DEMO_NOTIFICATIONS,
  liked: new Set<string>(),
  passed: new Set<string>(),
};

function computeProfilePercent(user: UserProfile): number {
  const checks = [
    user.bio,
    user.photos?.length ? 1 : undefined,
    user.interests?.length ? 1 : undefined,
    user.lifestyle?.length ? 1 : undefined,
    user.occupation,
    user.education,
    user.relationshipGoal,
  ].filter((v) => v !== undefined && v !== null && v !== "");
  return Math.min(100, Math.round((checks.length / 7) * 100));
}

export const mockAuth = {
  login(): Promise<AuthResponse> {
    return withDelay(() => ({
      token: "mock-token",
      user: state.user,
      subscription: state.subscription,
    }));
  },
  signup(): Promise<AuthResponse> {
    return withDelay(() => ({
      token: "mock-token",
      user: state.user,
      subscription: state.subscription,
    }));
  },
  forgotPassword(email: string): Promise<{ message: string }> {
    return withDelay(() => ({ message: "Reset link sent to " + email }));
  },
  me(): Promise<AuthResponse> {
    return withDelay(() => ({
      token: "mock-token",
      user: { ...state.user, profilePercent: computeProfilePercent(state.user) },
      subscription: state.subscription,
    }));
  },
};

export const mockProfiles = {
  getDiscovery(filters?: ProfileFilters): Promise<DiscoveryProfile[]> {
    return withDelay(() => {
      let list = DEMO_PROFILES.filter((pr) => !state.passed.has(pr.id));
      if (filters?.minAge)
        list = list.filter((pr) => (pr.age ?? 0) >= filters.minAge!);
      if (filters?.maxAge)
        list = list.filter((pr) => (pr.age ?? 0) <= filters.maxAge!);
      if (filters?.gender) list = list.filter((pr) => pr.gender === filters.gender);
      if (filters?.relationshipGoal)
        list = list.filter((pr) => pr.relationshipGoal === filters.relationshipGoal);
      return list;
    });
  },
  getProfile(id: string): Promise<DiscoveryProfile> {
    return withDelay(() => {
      const profile = DEMO_PROFILES.find((pr) => pr.id === id);
      if (!profile) throw new ApiError("Profile not found", 404);
      return profile;
    });
  },
  search(query: string): Promise<UserProfile[]> {
    return withDelay(() =>
      DEMO_PROFILES.filter((pr) =>
        pr.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  },
  getMe(): Promise<UserProfile> {
    return withDelay(() => ({
      ...state.user,
      profilePercent: computeProfilePercent(state.user),
    }));
  },
  updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    return withDelay(() => {
      state.user = { ...state.user, ...payload };
      return state.user;
    });
  },
  uploadPhoto(): Promise<{ url: string }> {
    return withDelay(() => ({
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    }));
  },
  deletePhoto(): Promise<void> {
    return withDelay(() => undefined);
  },
  setPrimaryPhoto(url: string): Promise<void> {
    return withDelay(() => {
      state.user = { ...state.user, primaryPhoto: url };
    });
  },
  reorderPhotos(): Promise<void> {
    return withDelay(() => undefined);
  },
};

export const mockMatches = {
  getMatches(): Promise<DiscoveryProfile[]> {
    return withDelay(() => DEMO_MATCHES);
  },
  like(profileId: string): Promise<{ matched: boolean }> {
    return withDelay(() => {
      state.liked.add(profileId);
      return { matched: true };
    });
  },
  pass(profileId: string): Promise<void> {
    return withDelay(() => {
      state.passed.add(profileId);
    });
  },
};

export const mockConnections = {
  getActive(): Promise<Connection[]> {
    return withDelay(() => state.connections);
  },
  getRequests(): Promise<Connection[]> {
    return withDelay(() => state.requests);
  },
  getSent(): Promise<Connection[]> {
    return withDelay(() => state.sent);
  },
  getCounts(): Promise<{ active: number; requests: number; sent: number }> {
    return withDelay(() => ({
      active: state.connections.length,
      requests: state.requests.length,
      sent: state.sent.length,
    }));
  },
  request(profileId: string): Promise<Connection> {
    return withDelay(() => {
      const activeCount = state.connections.length;
      if (activeCount >= LIMIT_ACTIVE_CONNECTIONS) {
        throw new ApiError(
          `You can only have ${LIMIT_ACTIVE_CONNECTIONS} active connections. End one to connect with someone new.`,
          409,
          "CONNECTION_LIMIT_REACHED"
        );
      }
      const profile = DEMO_PROFILES.find((pr) => pr.id === profileId);
      if (!profile) throw new ApiError("Profile not found", 404);
      return { id: `r-${Date.now()}`, user: profile, status: "active", matchScore: profile.matchScore };
    });
  },
  accept(id: string): Promise<Connection> {
    return withDelay(() => {
      const req = state.requests.find((r) => r.id === id);
      if (!req) throw new ApiError("Request not found", 404);
      state.requests = state.requests.filter((r) => r.id !== id);
      state.connections = [...state.connections, { ...req, status: "active" }];
      return { ...req, status: "active" };
    });
  },
  reject(id: string): Promise<void> {
    return withDelay(() => {
      state.requests = state.requests.filter((r) => r.id !== id);
    });
  },
  end(id: string): Promise<void> {
    return withDelay(() => {
      state.connections = state.connections.filter((c) => c.id !== id);
    });
  },
};

export const mockMessages = {
  getConversations(): Promise<Conversation[]> {
    return withDelay(() => state.conversations);
  },
  getMessages(conversationId: string): Promise<Message[]> {
    return withDelay(() => {
      const conv = state.conversations.find((c) => c.id === conversationId);
      return conv?.messages ?? [];
    });
  },
  sendMessage(conversationId: string, text: string): Promise<Message> {
    return withDelay(() => {
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (!conv) throw new ApiError("Conversation not found", 404);
      const message: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        senderId: "me",
        text,
        status: "read",
        createdAt: new Date().toISOString(),
      };
      conv.messages = [...conv.messages, message];
      return message;
    });
  },
};

export const mockNotifications = {
  getNotifications(): Promise<NotificationItem[]> {
    return withDelay(() => state.notifications);
  },
  getUnreadCount(): Promise<number> {
    return withDelay(() => state.notifications.filter((n) => !n.read).length);
  },
  markAllRead(): Promise<void> {
    return withDelay(() => {
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
    });
  },
};

export const mockSubscriptions = {
  getMyPlan(): Promise<Subscription> {
    return withDelay(() => state.subscription);
  },
  selectPlan(tier: PlanTier): Promise<Subscription> {
    return withDelay(() => {
      state.subscription = { ...state.subscription, tier };
      return state.subscription;
    });
  },
  cancel(): Promise<Subscription> {
    return withDelay(() => {
      state.subscription = { ...state.subscription, tier: "free", status: "canceled" };
      return state.subscription;
    });
  },
};
