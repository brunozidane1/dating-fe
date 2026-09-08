import { io, type Socket } from "socket.io-client";
import { getToken, SOCKET_URL } from "./api";

export type SocketChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text: string;
  mimeType?: string;
  attachmentUrl?: string;
  attachmentType?: "image" | "file" | "none";
  status: "sent" | "delivered" | "read";
  createdAt: string;
};

export type SocketChatStatus = {
  messageId: string;
  status: "delivered" | "read";
  deliveredAt?: string;
  readAt?: string;
};
export type PresenceUpdate = { userId: string; online: boolean; lastActive?: string };
export type ConversationRemovedUpdate = { pairKey?: string; connectionId?: string; otherUserId?: string };

let socket: Socket | null = null;

export function getChatSocket(): Socket | null {
  const token = getToken();
  if (!token) return null;

  if (!socket) {
    socket = io(SOCKET_URL, { auth: { token }, transports: ["websocket", "polling"] });
  } else if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }

  return socket;
}

export function subscribeToChat(
  onMessage: (message: SocketChatMessage) => void,
  onStatus: (status: SocketChatStatus) => void,
) {
  const client = getChatSocket();
  if (!client) return () => {};
  client.on("chat:message", onMessage);
  client.on("chat:status", onStatus);
  return () => {
    client.off("chat:message", onMessage);
    client.off("chat:status", onStatus);
  };
}

export function subscribeToPresence(onUpdate: (update: PresenceUpdate) => void, onSnapshot?: (onlineUserIds: string[]) => void) {
  const client = getChatSocket();
  if (!client) return () => {};
  const snapshot = ({ onlineUserIds }: { onlineUserIds: string[] }) => onSnapshot?.(onlineUserIds);
  client.on("presence:update", onUpdate);
  client.on("presence:snapshot", snapshot);
  return () => { client.off("presence:update", onUpdate); client.off("presence:snapshot", snapshot); };
}

export function subscribeToConversationRemoval(onRemove: (update: ConversationRemovedUpdate) => void) {
  const client = getChatSocket();
  if (!client) return () => {};
  client.on("chat:conversation-removed", onRemove);
  return () => { client.off("chat:conversation-removed", onRemove); };
}

export function acknowledgeDelivered(messageId: string) {
  getChatSocket()?.emit("chat:delivered", { messageId });
}

export function acknowledgeRead(messageId: string) {
  getChatSocket()?.emit("chat:read", { messageId });
}
