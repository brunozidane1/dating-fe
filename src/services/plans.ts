import { api } from "./api";

export interface PlanDetail {
  id: string;
  name: string;
  priceUGX: number;
  billingPeriod: string;
  headline: string;
  includes: string[];
  limits?: {
    uniqueOutboundChats: number | null;
    activeConnections: number | null;
  };
  paymentReady?: boolean;
}

export interface PlansResponse {
  plans: PlanDetail[];
  paymentsEnabled: boolean;
  note: string;
}

export const plansService = {
  async listPlans(): Promise<PlansResponse> {
    const { data } = await api.get<PlansResponse>("/plans");
    return data;
  },
};
