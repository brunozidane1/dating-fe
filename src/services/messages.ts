import { api } from "./api";
import type { Conversation, Message } from "../types";

export const messagesService = {
  async getConversations(): Promise<Conversation[]> {
    const { data } = await api.get<Conversation[]>("/messages/conversations");
    return data;
  },

  async getConversation(conversationId: string): Promise<Conversation> {
    const { data } = await api.get<Conversation>(
      `/messages/conversations/${conversationId}`
    );
    return data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const { data } = await api.get<Message[]>(
      `/messages/conversations/${conversationId}/messages`
    );
    return data;
  },

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const { data } = await api.post<Message>(
      `/messages/conversations/${conversationId}/messages`,
      { text }
    );
    return data;
  },

  async markRead(conversationId: string): Promise<void> {
    await api.post(`/messages/conversations/${conversationId}/read`);
  },

  async createConversation(userId: string): Promise<Conversation> {
    const { data } = await api.post<Conversation>("/messages/conversations", {
      userId,
    });
    return data;
  },

  async deleteConversation(conversationId: string): Promise<void> {
    await api.delete(`/messages/conversations/${conversationId}`);
  },
};