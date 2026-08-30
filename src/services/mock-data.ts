// Demo dataset used when the backend is not available (VITE_USE_MOCK !== "false").
// Keeps the app fully browsable and interactive for local development/demo.

import type { Connection, DiscoveryProfile, Message, NotificationItem, Subscription, UserProfile } from "../types";

export const DEMO_USER: UserProfile = {
  id: "me",
  name: "Alex Reed",
  email: "alex@lume.app",
  dob: "1996-04-12",
  gender: "woman",
  location: "Kigali, Rwanda",
  distance: 0,
  bio: "Photographer, coffee fanatic, and weekend hiker. Looking for someone genuine to share slow mornings and fast adventures.",
  occupation: "Product Designer",
  education: "Bachelor's",
  languages: ["English", "Kinyarwanda"],
  interests: ["Photography", "Travel", "Hiking", "Coffee"],
  lifestyle: ["Active", "Non-smoker", "Health-conscious"],
  relationshipGoal: "Long-term relationship",
  photos: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  ],
  primaryPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
  verified: true,
  lastActive: new Date().toISOString(),
  online: true,
  age: 29,
  createdAt: "2025-01-10T00:00:00.000Z",
};

const p = (id: string, name: string, age: number, location: string, gender: string, bio: string, interests: string[], photo: string): DiscoveryProfile => ({
  id,
  name,
  age,
  location,
  gender,
  bio,
  interests,
  relationshipGoal: "Long-term relationship",
  lifestyle: ["Active", "Non-smoker"],
  education: "Bachelor's",
  languages: ["English"],
  occupation: location.includes("Kigali") ? "Designer" : "Engineer",
  photos: [
    `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=80`,
    `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80`,
  ],
  primaryPhoto: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=800&q=80`,
  verified: true,
  online: true,
  lastActive: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  matchScore: { overall: 98, interests: 96, lifestyle: 91, goals: 98 },
});

export const DEMO_PROFILES: DiscoveryProfile[] = [
  { ...p("1", "Amelia", 25, "Kigali", "woman", "Creative photographer who lives for golden hour.", ["Photography", "Travel", "Coffee"], "photo-1534528741775-53994a69daeb"), distance: 3, occupation: "Photographer", matchScore: { overall: 98, interests: 96, lifestyle: 91, goals: 98 }, online: true, lastActive: new Date(Date.now() - 4 * 60000).toISOString() },
  { ...p("2", "Elena", 26, "Kimihurura", "woman", "Music producer and food lover.", ["Music", "Cooking", "Travel"], "photo-1517841905240-472988babdf9"), distance: 6, occupation: "Music producer", matchScore: { overall: 96, interests: 92, lifestyle: 94, goals: 96 }, online: true, lastActive: new Date(Date.now() - 9 * 60000).toISOString() },
  { ...p("3", "Marcus", 28, "Kigali", "man", "Tech entrepreneur, fitness fan, amateur chef.", ["Tech", "Fitness", "Cooking"], "photo-1507003211169-0a1dd7228f2d"), distance: 2, occupation: "Founder", matchScore: { overall: 91, interests: 86, lifestyle: 95, goals: 88 }, online: false, lastActive: new Date(Date.now() - 3600000).toISOString() },
  { ...p("4", "Sofia", 24, "Nyarugenge", "woman", "Architect with a soft spot for sunsets.", ["Art", "Hiking", "Coffee"], "photo-1544005313-94ddf0286df2"), distance: 8, occupation: "Architect", matchScore: { overall: 94, interests: 90, lifestyle: 89, goals: 92 }, online: true, lastActive: new Date(Date.now() - 12 * 60000).toISOString() },
  { ...p("5", "David", 30, "Kacyiru", "man", "Runner and nature lover.", ["Running", "Travel", "Books"], "photo-1506794778202-cad84cf45f1d"), distance: 11, occupation: "Engineer", matchScore: { overall: 88, interests: 82, lifestyle: 92, goals: 85 }, online: false, lastActive: new Date(Date.now() - 86400000 * 1.5).toISOString() },
  { ...p("6", "Grace", 27, "Kigali", "woman", "Yoga teacher who loves live music.", ["Yoga", "Music", "Wellness"], "photo-1531746020798-e6953c6e8e04"), distance: 4, occupation: "Yoga teacher", matchScore: { overall: 93, interests: 88, lifestyle: 97, goals: 90 }, online: true, lastActive: new Date(Date.now() - 30 * 60000).toISOString() },
  { ...p("7", "Noah", 29, "Kigali", "man", "Robotics engineer building meaningful things.", ["Engineering", "Gaming", "Fitness"], "photo-1500648767791-00dcc994a43e"), distance: 15, occupation: "Robotics engineer", matchScore: { overall: 85, interests: 78, lifestyle: 86, goals: 90 }, online: false, lastActive: new Date(Date.now() - 86400000 * 3).toISOString() },
  { ...p("8", "Liam", 26, "Nyamirambo", "man", "City walker, urban sketcher.", ["Art", "Music", "Coffee"], "photo-1472099645785-5658abf4ff4e"), distance: 7, occupation: "Illustrator", matchScore: { overall: 89, interests: 91, lifestyle: 80, goals: 84 }, online: true, lastActive: new Date(Date.now() - 18 * 60000).toISOString() },
  { ...p("9", "Imani", 28, "Kigali", "woman", "Marketing lead, salsa dancer, weekend baker.", ["Dance", "Food", "Travel"], "photo-1531123897727-8f129e1688ce"), distance: 5, occupation: "Marketing lead", matchScore: { overall: 96, interests: 93, lifestyle: 90, goals: 97 }, online: true, lastActive: new Date(Date.now() - 20 * 60000).toISOString() },
  { ...p("10", "Thierry", 31, "Kicukiro", "man", "Cyclist and documentary fan.", ["Cycling", "Film", "Books"], "photo-1508341591423-4347099e1f19"), distance: 9, occupation: "Policy analyst", matchScore: { overall: 86, interests: 80, lifestyle: 90, goals: 83 }, online: false, lastActive: new Date(Date.now() - 86400000 * 2).toISOString() },
  { ...p("11", "Nadia", 25, "Kimironko", "woman", "Illustrator who sketches the city after dark.", ["Art", "Photography", "Music"], "photo-1438761681033-6461ffad8d80"), distance: 6, occupation: "Illustrator", matchScore: { overall: 95, interests: 94, lifestyle: 88, goals: 91 }, online: true, lastActive: new Date(Date.now() - 45 * 60000).toISOString() },
  { ...p("12", "Samuel", 29, "Gacuriro", "man", "Chef who loves feeding people well.", ["Cooking", "Food", "Travel"], "photo-1500648767791-00dcc994a43e"), distance: 12, occupation: "Chef", matchScore: { overall: 90, interests: 85, lifestyle: 89, goals: 92 }, online: false, lastActive: new Date(Date.now() - 86400000 * 4).toISOString() },
];

export const DEMO_MATCHES: DiscoveryProfile[] = DEMO_PROFILES.slice(0, 4);

export const DEMO_CONNECTIONS: Connection[] = [
  {
    id: "c1",
    user: DEMO_MATCHES[0],
    status: "active",
    matchScore: DEMO_MATCHES[0].matchScore,
    lastMessage: "Looking forward to it!",
    lastMessageAt: new Date(Date.now() - 10 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "c2",
    user: DEMO_MATCHES[1],
    status: "active",
    matchScore: DEMO_MATCHES[1].matchScore,
    lastMessage: "See you soon 👋",
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    acceptedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "c3",
    user: DEMO_MATCHES[2],
    status: "active",
    matchScore: DEMO_MATCHES[2].matchScore,
    lastMessage: "That sounds wonderful.",
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    acceptedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DEMO_REQUESTS: Connection[] = [
  {
    id: "r1",
    user: DEMO_PROFILES[3],
    status: "pending",
    matchScore: DEMO_PROFILES[3].matchScore,
    lastMessage: "Would like to connect with you.",
    lastMessageAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "r2",
    user: DEMO_PROFILES[4],
    status: "pending",
    matchScore: DEMO_PROFILES[4].matchScore,
    lastMessage: "Would like to connect with you.",
    lastMessageAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    requestedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
];

export const DEMO_SENT: Connection[] = [
  {
    id: "s1",
    user: DEMO_PROFILES[5],
    status: "requested",
    matchScore: DEMO_PROFILES[5].matchScore,
    lastMessage: "Connection request sent.",
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

function messagesFor(userId: string): Message[] {
  const now = Date.now();
  return [
    { id: `${userId}-m1`, conversationId: userId, senderId: "them", text: "Hey! I really enjoyed your profile.", status: "read", createdAt: new Date(now - 86400000 * 2).toISOString(), readAt: new Date().toISOString() },
    { id: `${userId}-m2`, conversationId: userId, senderId: "me", text: "Hi! Great to meet you.", status: "read", createdAt: new Date(now - 86400000 * 2 + 60000).toISOString(), readAt: new Date().toISOString() },
    { id: `${userId}-m3`, conversationId: userId, senderId: "them", text: "How's your week going?", status: "read", createdAt: new Date(now - 86400000 + 3600000).toISOString(), readAt: new Date().toISOString() },
    { id: `${userId}-m4`, conversationId: userId, senderId: "me", text: "Pretty great actually. Ready for the weekend!", status: "delivered", createdAt: new Date(now - 3600000).toISOString() },
  ];
}

export const DEMO_CONVERSATIONS = DEMO_CONNECTIONS.map((c) => ({
  id: c.user.id,
  user: c.user,
  messages: messagesFor(c.user.id),
  unread: c.user.id === "1" ? 2 : 0,
  online: true,
  matchScore: c.matchScore?.overall,
}));

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", type: "connection_request", title: "New connection request", body: "Sofia would like to connect with you.", createdAt: new Date(Date.now() - 30 * 60000).toISOString(), read: false, actor: { id: "4", name: "Sofia", photo: DEMO_PROFILES[3].primaryPhoto } },
  { id: "n2", type: "like", title: "Someone liked your profile", body: "Imani liked your profile.", createdAt: new Date(Date.now() - 90 * 60000).toISOString(), read: false, actor: { id: "9", name: "Imani", photo: DEMO_PROFILES[8].primaryPhoto } },
  { id: "n3", type: "message", title: "New message", body: "Amelia sent you a message.", createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), read: false, actor: { id: "1", name: "Amelia", photo: DEMO_PROFILES[0].primaryPhoto } },
  { id: "n4", type: "match", title: "New match", body: "You have a new 98% match with Amelia.", createdAt: new Date(Date.now() - 86400000).toISOString(), read: true, actor: { id: "1", name: "Amelia", photo: DEMO_PROFILES[0].primaryPhoto } },
  { id: "n5", type: "connection_accepted", title: "Connection accepted", body: "Grace accepted your connection request.", createdAt: new Date(Date.now() - 86400000 - 3600000).toISOString(), read: true, actor: { id: "6", name: "Grace", photo: DEMO_PROFILES[5].primaryPhoto } },
  { id: "n6", type: "profile_view", title: "Someone viewed your profile", body: "Nadia viewed your profile today.", createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), read: true, actor: { id: "11", name: "Nadia", photo: DEMO_PROFILES[10].primaryPhoto } },
  { id: "n7", type: "recommendation", title: "Profile recommendation", body: "Check out Elena — you share a love of music.", createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), read: true, actor: { id: "2", name: "Elena", photo: DEMO_PROFILES[1].primaryPhoto } },
  { id: "n8", type: "system", title: "Welcome to Lume", body: "Your profile is live. Complete it to boost your visibility.", createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), read: true },
];

export const DEMO_SUBSCRIPTION: Subscription = {
  id: "sub-1",
  tier: "free",
  startDate: new Date().toISOString(),
  status: "active",
  autoRenew: true,
};