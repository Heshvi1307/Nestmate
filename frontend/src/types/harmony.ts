export interface LifestyleVector {
  cleanliness: number;
  sleep_schedule: number;
  guest_policy: number;
  bill_discipline: number;
  noise_tolerance: number;
  dietary_kitchen: number;
}

export interface DimensionBreakdown {
  dimension: string;
  title: string;
  user_val: number;
  candidate_val: number;
  diff: number;
  match_pct: number;
  weight: number;
}

export interface CompatibilityResult {
  compatibility_score: number;
  verdict: 'HIGH_COMPATIBILITY' | 'MODERATE_COMPATIBILITY' | 'HIGH_FRICTION_RISK';
  badge: string;
  badge_color: 'emerald' | 'amber' | 'rose';
  summary: string;
  friction_points: string[];
  synergies: string[];
  dimension_breakdown: DimensionBreakdown[];
}

export interface RoommateProfile {
  id: string;
  name: string;
  avatar_url?: string;
  age: number;
  occupation: string;
  city: string;
  budget_range_inr: string;
  work_style: string;
  bio: string;
  lifestyle_vector: LifestyleVector;
}

export interface HouseRule {
  category: string;
  rule_text: string;
}

export interface LivingCharter {
  title: string;
  engine_used?: string;
  engine_badge?: string;
  house_rules: HouseRule[];
  whatsapp_summary: string;
}

export interface HarmonyMatchResponse {
  success: boolean;
  user_name: string;
  candidate_name: string;
  candidate_profile?: RoommateProfile;
  match: CompatibilityResult;
}

export interface HarmonyCharterResponse {
  success: boolean;
  charter: LivingCharter;
}
