export type Plan = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  contact_unlock_limit: number;
  interest_limit: number;
};

export const BASIC_PLANS: Plan[] = [
  {
    id: "basic_monthly",
    name: "Basic Monthly",
    price: 29900,
    duration_days: 30,
    contact_unlock_limit: 30,
    interest_limit: 100
  },
  {
    id: "basic_3_months",
    name: "Basic 3 Months",
    price: 69900,
    duration_days: 90,
    contact_unlock_limit: 30,
    interest_limit: 100
  },
  {
    id: "basic_6_months",
    name: "Basic 6 Months",
    price: 99900,
    duration_days: 180,
    contact_unlock_limit: 30,
    interest_limit: 100
  }
];

export function formatRupees(paise: number) {
  return `Rs. ${(paise / 100).toLocaleString("en-IN")}`;
}
