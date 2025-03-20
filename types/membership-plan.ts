export enum MembershipPlanTypes {
  Free = "free",
  Freemium = "freemium", // Currently 3 days
  OneMonth = "1-month",
  Lifetime = "lifetime",
}

export type MembershipPlanUser = {
  type: MembershipPlanTypes;
  dueDate: number | null; // in seconds
};
