/**
 * Plan type constants for feature gating
 *
 * MVP: Free plan allows 1 vehicle, in-app reminders only
 * Premium: Multiple vehicles, WhatsApp/Email channels
 */
export const PLAN_TYPES = {
  FREE: "free",
  PRO: "pro",
  FLEET: "fleet",
} as const;

export type PlanType = typeof PLAN_TYPES[keyof typeof PLAN_TYPES];

/**
 * Type guard to validate plan type strings
 */
export function isValidPlanType(value: string): value is PlanType {
  return Object.values(PLAN_TYPES).includes(value as PlanType);
}

/**
 * Default plan type for new users
 */
export const DEFAULT_PLAN_TYPE: PlanType = PLAN_TYPES.FREE;
