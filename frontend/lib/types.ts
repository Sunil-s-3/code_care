export interface StatCards {
  total_spending: number;
  average_insurance_cost: number;
  high_risk_patients: number;
  bmi_average: number;
  smoking_impact_score: number;
}

export interface DashboardData {
  stats: StatCards;
  age_vs_charges: { age: number; charges: number }[];
  bmi_vs_charges: { bmi: number; charges: number }[];
  smoker_comparison: { category: string; avgCharges: number; count: number }[];
  region_costs: { region: string; avgCharges: number; totalCharges: number }[];
  gender_analysis: { gender: string; avgCharges: number; minCharges: number; maxCharges: number }[];
  monthly_trends: { month: string; avgCharges: number; totalCharges: number; patients: number }[];
  total_records: number;
}

export interface UserProfile {
  id: number;
  user_id: string;
  user_name: string;
  email: string;
  phone_number: string;
}

export interface RegisterPayload {
  user_id: string;
  user_name: string;
  password: string;
  email: string;
  phone_number: string;
}

export interface LoginPayload {
  user_name: string;
  password: string;
}
