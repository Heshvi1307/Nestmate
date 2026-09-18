// ─── Property ────────────────────────────────────────────────────────────────
export interface Property {
  id: string;
  landlord_id: string | null;
  title: string;
  tagline: string;
  neighborhood: string;
  city: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  carpet_area: number;
  furnishing: string;
  base_rent: number;
  deposit: number;
  utilities_estimate: number;
  maintenance_monthly: number;
  internet_monthly: number;
  total_estimated_monthly: number;
  move_in_total_cost: number;
  images: string[];
  amenities: string[];
  verified: boolean;
  verified_owner: boolean;
  recently_inspected: boolean;
  fast_response: boolean;
  rating: number;
  reviews_count: number;
  available_from: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transparency_details: any;
  coordinates?: {
    lat: number;
    lng: number;
    x: number;
    y: number;
  };
  distances?: {
    officeMinutes: number;
    metroMinutes: number;
    groceryMinutes: number;
    universityMinutes: number;
  };
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

// ─── Lease Audit (FastAPI response) ──────────────────────────────────────────
export interface AuditedClause {
  title: string;
  statutory_reference: string;
  issue_summary: string;
  plain_english_impact: string;
  status: 'HIGH_RISK' | 'CAUTION' | 'SAFE';
}

export interface LeaseAuditResult {
  success: boolean;
  filename: string;
  metadata: Record<string, unknown>;
  audit: {
    safety_score: number;
    verdict: string;
    verdict_color: 'emerald' | 'amber' | 'rose';
    verdict_summary: string;
    metrics: Record<string, unknown>;
    audited_clauses: AuditedClause[];
  };
}

export interface SampleLease {
  id: string;
  name: string;
  description: string;
}
