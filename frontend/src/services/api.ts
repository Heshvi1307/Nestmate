import { AuditResponse, SampleAgreement } from '../types/lease';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export async function fetchSampleAgreements(): Promise<SampleAgreement[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/samples`);
    if (!res.ok) throw new Error('Failed to fetch samples');
    const data = await res.json();
    return data.samples;
  } catch (err) {
    console.warn('Backend unavailable, using fallback samples', err);
    return [
      {
        id: 'predatory_urban_lease',
        title: 'Unfair 2BHK Urban Lease (High Risk Sample)',
        description: '6-month deposit, unnotified entry, arbitrary 15% escalation, full deposit forfeiture.',
        text: `RESIDENTIAL LEASE AND TENANCY AGREEMENT\n\n1. PREMISES & MONTHLY RENT: INR 28,000/- monthly.\n2. SECURITY DEPOSIT: INR 1,68,000/- (six months rent). Lessor reserves the right to forfeit the entire deposit if tenant moves before 11 months.\n3. INSPECTION AND ENTRY: Lessor may enter at any time without prior notice.\n4. REPAIRS: Tenant bears all maintenance and structural seepage.\n5. RENT ESCALATION: Lessor may hike rent up to 15% at sole discretion.\n6. TERMINATION: Landlord may disconnect electricity and lock premises upon 5-day delay.`
      }
    ];
  }
}

export async function auditText(raw_text: string): Promise<AuditResponse> {
  const res = await fetch(`${API_BASE_URL}/api/audit/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw_text }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Audit failed');
  }
  return res.json();
}

export async function auditFile(file: File): Promise<AuditResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/audit/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'File upload audit failed');
  }
  return res.json();
}

export async function getCounterClause(category: string, original_clause: string, tone = 'diplomatic') {
  const res = await fetch(`${API_BASE_URL}/api/counter-clause`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, original_clause, concern_tone: tone }),
  });
  if (!res.ok) throw new Error('Failed to generate counter clause');
  return res.json();
}

// ==========================================
// Pillar 2: HarmonyMatch API Client
// ==========================================

import { RoommateProfile, LifestyleVector, HarmonyMatchResponse, HarmonyCharterResponse } from '../types/harmony';

export async function fetchHarmonyCandidates(): Promise<RoommateProfile[]> {
  const res = await fetch(`${API_BASE_URL}/api/harmony/candidates`);
  if (!res.ok) throw new Error('Failed to fetch roommate candidates');
  const data = await res.json();
  return data.candidates;
}

export async function matchHarmonyProfiles(
  userName: string,
  userVector: LifestyleVector,
  candidateId?: string,
  candidateName?: string,
  candidateVector?: LifestyleVector
): Promise<HarmonyMatchResponse> {
  const res = await fetch(`${API_BASE_URL}/api/harmony/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: userName,
      user_vector: userVector,
      candidate_id: candidateId,
      candidate_name: candidateName,
      candidate_vector: candidateVector,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to calculate compatibility');
  }
  return res.json();
}

export async function generateHarmonyCharter(
  userName: string,
  candidateName: string,
  userVector: LifestyleVector,
  candidateVector: LifestyleVector,
  matchResult: any
): Promise<HarmonyCharterResponse> {
  const res = await fetch(`${API_BASE_URL}/api/harmony/charter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_name: userName,
      candidate_name: candidateName,
      user_vector: userVector,
      candidate_vector: candidateVector,
      match_result: matchResult,
    }),
  });
  if (!res.ok) throw new Error('Failed to generate Living Charter');
  return res.json();
}

// ==========================================
// Pillar 3: SnapFix Triage & Anti-Fraud API Client
// ==========================================

import { SnapFixChallenge, SnapFixVerifyResponse } from '../types/snapfix';

export async function fetchSnapFixChallenge(): Promise<SnapFixChallenge> {
  const res = await fetch(`${API_BASE_URL}/api/snapfix/challenge`);
  if (!res.ok) throw new Error('Failed to fetch liveness challenge');
  const data = await res.json();
  return data.challenge;
}

export async function fetchSnapFixTaxonomy(): Promise<Record<string, any>> {
  const res = await fetch(`${API_BASE_URL}/api/snapfix/taxonomy`);
  if (!res.ok) throw new Error('Failed to fetch repair taxonomy');
  const data = await res.json();
  return data.categories;
}

export async function verifyAndTriagePhoto(formData: FormData): Promise<SnapFixVerifyResponse> {
  const res = await fetch(`${API_BASE_URL}/api/snapfix/verify-and-triage`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Photo forensic triage failed');
  }
  return res.json();
}
