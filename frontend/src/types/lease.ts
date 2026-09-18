export interface AuditedClause {
  category: string;
  title: string;
  clause_text: string;
  status: 'HIGH_RISK' | 'CAUTION' | 'SAFE';
  risk_score_impact: number;
  statutory_reference: string;
  issue_summary: string;
  plain_english_impact: string;
  recommended_counter_clause: string;
}

export interface AuditMetrics {
  total_clauses_reviewed: number;
  high_risk_flags: number;
  caution_flags: number;
  safe_clauses: number;
}

export interface AuditData {
  safety_score: number;
  verdict: 'SAFE' | 'MODERATE_RISK' | 'HIGH_RISK_PREDATORY';
  verdict_color: string;
  verdict_summary: string;
  metrics: AuditMetrics;
  audited_clauses: AuditedClause[];
}

export interface LeaseMetadata {
  monthly_rent_inr: number | null;
  security_deposit_inr: number | null;
  tenure_months: number;
  lessor_name: string | null;
  lessee_name: string | null;
}

export interface AuditResponse {
  success: boolean;
  filename?: string;
  file_size_bytes?: number;
  metadata: LeaseMetadata;
  audit: AuditData;
}

export interface SampleAgreement {
  id: string;
  title: string;
  description: string;
  text: string;
}
