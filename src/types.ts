export type PlanTier = "free" | "basic" | "classic" | "premium";

export interface Subscription {
  id: string;
  tier: PlanTier;
  startDate: string;
  endDate?: string;
  status: "active" | "expired" | "canceled" | "none";
  autoRenew: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  location?: string;
  distance?: number;
  bio?: string;
  occupation?: string;
  education?: string;
  languages?: string[];
  interests?: string[];
  lifestyle?: string[];
  relationshipGoal?: string;
  photos?: string[];
  primaryPhoto?: string;
  verified?: boolean;
  lastActive?: string;
  online?: boolean;
  age?: number;
  profilePercent?: number;
  createdAt: string;
}

export interface ProfileFilters {
  minAge: number;
  maxAge: number;
  gender?: string;
  location?: string;
  maxDistance?: number;
  interests?: string[];
  relationshipGoal?: string;
  lifestyle?: string[];
  education?: string;
}

export interface MatchScore {
  overall: number;
  interests: number;
  lifestyle: number;
  goals: number;
}

export interface DiscoveryProfile extends UserProfile {
  matchScore: MatchScore;
}

export interface Connection {
  id: string;
  user: UserProfile;
  status: "active" | "pending" | "requested" | "rejected" | "ended";
  matchScore?: MatchScore;
  lastMessage?: string;
  lastMessageAt?: string;
  unread?: number;
  requestedAt?: string;
  acceptedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  user: UserProfile;
  messages: Message[];
  lastMessage?: Message;
  unread: number;
  online?: boolean;
  matchScore?: number;
}

export interface NotificationItem {
  id: string;
  type: "connection_request" | "connection_accepted" | "message" | "match" | "like" | "profile_view" | "recommendation" | "system";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  actor?: { id: string; name: string; photo?: string };
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  subscription: Subscription;
}