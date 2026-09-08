import { api } from "./api";
import type { PlanTier, Subscription } from "../types";

export interface Plan {
  tier: PlanTier;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Try the experience with a small outbound message allowance.",
    features: ["Message up to 2 different people", "Browse discovery and home", "Complete your profile with bio and interests"],
  },
  {
    tier: "basic",
    name: "Basic",
    price: 6000,
    period: "UGX / month",
    description: "Keep things focused with a three-connection limit.",
    features: ["Connect with up to 3 people", "Everything in Free", "Priority discovery visibility"],
  },
  {
    tier: "premium",
    name: "Premium",
    price: 10000,
    period: "UGX / month",
    description: "Unlimited access across the app.",
    features: [
      "Unlimited connections and chats",
      "Everything in Basic",
      "Unlimited discovery visibility",
      "Best for future payment gateway activation",
    ],
    highlighted: true,
  },
];

export const subscriptionsService = {
  async getMyPlan(): Promise<Subscription> {
    const { data } = await api.get<Subscription>("/subscriptions/me");
    return data;
  },

  async selectPlan(tier: PlanTier): Promise<Subscription> {
    const { data } = await api.post<Subscription>("/subscriptions/select", { tier });
    return data;
  },

  async cancel(): Promise<Subscription> {
    const { data } = await api.post<Subscription>("/subscriptions/cancel");
    return data;
  },
};
