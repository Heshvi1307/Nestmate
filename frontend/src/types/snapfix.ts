export interface SnapFixChallenge {
  challenge_code: string;
  timestamp_iso: string;
  expires_in_seconds: number;
  instructions: string;
}

export interface AuthenticityReport {
  sha256_hash: string;
  trust_score: number;
  verdict: 'AUTHENTIC_LIVE_CAPTURE' | 'PROVISIONAL_NEEDS_COUNTER_SIGN' | 'SUSPECTED_SPOOF_OR_TAMPERED';
  dimensions: string;
  format: string;
  device_model: string;
  has_hardware_exif: boolean;
  gps_coordinates: { lat: number; lon: number } | null;
  distance_meters_from_property: number | null;
  geofence_verified: boolean;
  challenge_code_used: string | null;
  challenge_verified: boolean;
  fraud_flags: string[];
  is_admissible_evidence: boolean;
}

export interface DamageTriageReport {
  category: string;
  issue_title: string;
  severity: 'CRITICAL_EMERGENCY' | 'HIGH_PRIORITY' | 'ROUTINE_MAINTENANCE';
  statutory_liability: 'LANDLORD' | 'TENANT' | 'JOINT_INSPECTION_REQUIRED';
  mta_legal_basis: string;
  estimated_cost_inr: {
    min: number;
    max: number;
    fair_market_average: number;
  };
  statutory_turnaround_hours: number;
  contractor_scope_of_work: string;
}

export interface InspectionCertificate {
  certificate_id: string;
  ticket_id: string;
  issued_at: string;
  property_address: string;
  tenant_name: string;
  landlord_name: string;
  authenticity_summary: {
    sha256_seal: string;
    trust_score: number;
    verdict: string;
    admissible_evidence: boolean;
  };
  triage_summary: DamageTriageReport;
  whatsapp_counter_sign_link: string;
  whatsapp_preview_text: string;
  status: string;
}

export interface SnapFixVerifyResponse {
  success: boolean;
  ticket_id: string;
  filename: string;
  authenticity: AuthenticityReport;
  triage: DamageTriageReport;
  certificate: InspectionCertificate;
}
