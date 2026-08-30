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
    tier: "basic",
    name: "Basic",
    price: 0,
    period: "forever",
    description: "Essential dating features to explore the platform.",
    features: ["Browse curated profiles", "Basic discovery filters", "View limited profile previews"],
  },
  {
    tier: "classic",
    name: "Classic",
    price: 14.99,
    period: "/month",
    description: "Enhanced discovery for active searchers.",
    features: ["Full profile photo access", "3 active connections", "Standard chat access"],
  },
  {
    tier: "premium",
    name: "Premium",
    price: 24.99,
    period: "/month",
    description: "The complete experience with priority visibility.",
    features: [
      "Full profile access",
      "Unlimited profile browsing",
      "Advanced AI compatibility",
      "Priority support",
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