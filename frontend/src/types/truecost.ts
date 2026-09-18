export interface PropertyCostInput {
  property_name?: string;
  city: string;
  corridor_key: string;
  bhk_type: string;
  base_rent_inr: number;
  security_deposit_inr: number;
  society_maintenance_inr: number;
  dg_backup_units_kwh: number;
  dg_backup_rate_per_kwh?: number;
  parking_fee_inr: number;
  one_time_brokerage_inr: number;
  one_time_society_move_in_fee_inr: number;
  tenure_months: number;
  daily_commute_km_one_way: number;
  daily_travel_cost_inr: number;
  one_way_commute_minutes: number;
}

export interface MonthlyBreakdown {
  base_rent: number;
  society_maintenance: number;
  dg_power_backup: number;
  parking_fee: number;
  amortized_brokerage_and_fees: number;
  deposit_opportunity_cost: number;
  commute_expenses: number;
}

export interface DepositAnalytics {
  deposit_amount: number;
  deposit_to_rent_ratio: number;
  monthly_lost_interest: number;
  total_tenure_lost_wealth: number;
}

export interface CommuteBurnout {
  daily_km_roundtrip: number;
  monthly_commute_cost: number;
  monthly_hours_lost_in_traffic: number;
}

export interface CorridorAnalytics {
  corridor_name: string;
  benchmark_avg_rent: number | null;
  deviation_pct: number;
  verdict: 'UNDERPRICED_DEAL' | 'FAIR_MARKET' | 'MODERATE_OVERPRICED' | 'PREDATORY_OVERPRICED';
  verdict_badge: string;
}

export interface TrueCostReport {
  property_name?: string;
  base_rent: number;
  breakdown_monthly: MonthlyBreakdown;
  effective_monthly_cost: number;
  direct_monthly_outflow: number;
  hidden_overhead_monthly: number;
  hidden_overhead_pct: number;
  deposit_analytics: DepositAnalytics;
  commute_burnout: CommuteBurnout;
  corridor_analytics: CorridorAnalytics;
  total_tenure_cash_needed: number;
}

export interface ComparisonResult {
  winner: 'flat_a' | 'flat_b';
  winner_name: string;
  monthly_savings_inr: number;
  total_tenure_savings_inr: number;
  summary: string;
  flat_a: TrueCostReport;
  flat_b: TrueCostReport;
}

export interface NegotiationDraft {
  property_name: string;
  current_rent: number;
  corridor_benchmark: number;
  proposed_rent: number;
  all_inclusive_target: number;
  negotiation_message: string;
  whatsapp_link: string;
}

export interface CorridorData {
  name: string;
  avg_rent: Record<string, number>;
  avg_maintenance: Record<string, number>;
  typical_deposit_months: number;
  demand_index: string;
  tier: string;
}

export interface CityCorridors {
  city_name: string;
  corridors: Record<string, CorridorData>;
}

export type CorridorBenchmarksMap = Record<string, CityCorridors>;
