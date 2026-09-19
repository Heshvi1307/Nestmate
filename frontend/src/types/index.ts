// Re-export portal types (compatible with DB)
export * from './portal';

// Re-export engine types
export * from './lease';
export * from './snapfix';
export * from './truecost';

// Re-export harmony types except RoommateProfile which is defined in portal
export type {
  LifestyleVector,
  CompatibilityResult,
  HarmonyMatchResponse,
  LivingCharter
} from './harmony';

// Audit & Benchmark types for LeaseLens
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

