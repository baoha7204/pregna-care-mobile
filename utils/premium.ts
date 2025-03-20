import { User } from "@/contexts/auth.context";
import { MembershipPlanTypes } from "@/types/membership-plan";

export const checkValidPremium = (user: User | null) => {
  if (!user) return false;
  const { membership } = user;

  if (membership.type === MembershipPlanTypes.Lifetime) return true;

  if (membership.type === MembershipPlanTypes.Free || !membership.dueDate)
    return false;

  const currentDate = Math.round(new Date().getTime() / 1000);
  return currentDate < membership.dueDate;
};
