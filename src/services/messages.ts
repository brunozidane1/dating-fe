import { api } from "./api";
import { mapApiUser } from "./social";
import { getSessionUser } from "./session";
import type { Conversation, Message } from "../types";

type ApiMessage = { id: string; sender?: string; senderId?: string; text: string; status: Message["status"]; createdAt: string; readAt?: string; mimeType?: string; attachmentUrl?: string; attachmentType?: Message["attachmentType"] };
const mapMessage = (message: ApiMessage, conversationId: string): Message => ({
  id: message.id, conversationId, senderId: message.senderId ?? message.sender ?? "", text: message.text,
  status: message.status, createdAt: message.createdAt, readAt: message.readAt, mimeType: message.mimeType, attachmentUrl: message.attachmentUrl, attachmentType: message.attachmentType,
});

export const messagesService = {
  async getConversations(): Promise<Conversation[]> {
    const { data } = await api.get<{ conversations?: Array<{ id: string; participant: Parameters<typeof mapApiUser>[0] | null; messages?: ApiMessage[] }> }>("/messages/conversations");
    return (data.conversations ?? []).filter((item) => item.participant).map((item) => ({
      id: item.id, user: mapApiUser(item.participant!), messages: (item.messages ?? []).map((message) => mapMessage(message, item.id)),
      unread: (item.messages ?? []).filter((message) => message.sender !== getSessionUser()?.id && message.senderId !== getSessionUser()?.id && message.status !== "read").length,
    }));
  },

  async getConversation(userId: string): Promise<Conversation> {
    const { data } = await api.get<{ conversation: { id: string; participant: Parameters<typeof mapApiUser>[0]; messages?: ApiMessage[] } }>(`/messages/conversations/${userId}`);
    const conversation = data.conversation;
    const messages = (conversation.messages ?? []).map((message) => mapMessage(message, conversation.id));
    const myId = getSessionUser()?.id;
    return { id: conversation.id, user: mapApiUser(conversation.participant), messages, unread: messages.filter((message) => message.senderId !== myId && message.status !== "read").length };
  },

  async sendMessage(userId: string, text: string, file?: File | null): Promise<Message> {
    const body = file ? (() => { const form = new FormData(); form.append("text", text); form.append("file", file); return form; })() : { text };
    const { data } = await api.post<{ message: ApiMessage & { conversationId: string } }>(`/messages/conversations/${userId}/messages`, body, file ? { headers: { "Content-Type": "multipart/form-data" } } : undefined);
    return mapMessage(data.message, data.message.conversationId);
  },

};
