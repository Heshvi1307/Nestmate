import { AuditResponse, SampleAgreement } from '../types/lease';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
