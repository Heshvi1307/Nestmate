// ─── Property ────────────────────────────────────────────────────────────────
export interface Property {
  id: string;
  landlord_id: string | null;
  title: string;
  tagline: string | null;
  neighborhood: string;
  city: string;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  carpet_area: number | null;
  furnishing: string | null;
  base_rent: number;
  deposit: number | null;
  utilities_estimate: number | null;
  total_estimated_monthly: number | null;
  images: string[] | null;
  amenities: string[] | null;
  created_at: string;
}

// ─── Roommate Profile ─────────────────────────────────────────────────────────
export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  experience_years: string;
  professional_summary: string;
  about_me: string;
  mbti: string;
  interests: string[];
  created_at?: string;
}

// ─── Lease Clause ─────────────────────────────────────────────────────────────
export interface LeaseClause {
  id: string;
  clause_number: number;
  title: string;
  section: string;
  category: string;
  original_text: string;
  ai_explanation: string;
  risk_level: 'Safe & Standard' | 'Important Caveat' | 'Caution / Negotiate';
  potential_hidden_cost: string;
  what_to_clarify: string;
}

// ─── Lease Audit Result (FastAPI /api/audit/upload) ───────────────────────────
export interface AuditedClause {
  clause_id?: string;
  category: string;
  title?: string;
  flagged_text?: string;
  issue?: string;
  mta_position?: string;
  verdict: 'PREDATORY' | 'CAUTION' | 'ACCEPTABLE' | 'SAFE';
  tenant_impact?: string;
  recommended_action?: string;
  // fallback
  [key: string]: unknown;
}

export interface LeaseAuditResult {
  success: boolean;
  filename?: string;
  metadata?: Record<string, unknown>;
  audit: {
    safety_score: number;
    verdict: string;
    verdict_color: string;
    verdict_summary: string;
    total_clauses_analyzed?: number;
    predatory_count?: number;
    caution_count?: number;
    audited_clauses: AuditedClause[];
    [key: string]: unknown;
  };
}

export interface SampleAgreement {
  id: string;
  title: string;
  description: string;
  text: string;
}

// ─── TrueCost ─────────────────────────────────────────────────────────────────
export interface TrueCostInput {
  property_name: string;
  city: string;
  corridor_key: string;
  bhk_type: string;
  base_rent_inr: number;
  security_deposit_inr: number;
  society_maintenance_inr: number;
  parking_fee_inr: number;
  one_time_brokerage_inr: number;
  tenure_months: number;
  daily_commute_km_one_way: number;
  daily_travel_cost_inr: number;
  one_way_commute_minutes: number;
}
