import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';
import { MOCK_LEASE_CLAUSES } from '../data/mockData';
import type { LeaseClause } from '../types';

function normalizeClause(c: any): LeaseClause {
  return {
    ...c,
    id: String(c.id),
    title: c.title || 'Standard Lease Clause',
    clauseNumber: c.clauseNumber ?? c.clause_number ?? '1',
    clause_number: typeof c.clause_number === 'number' ? c.clause_number : Number(c.clauseNumber) || 1,
    section: c.section || 'General Terms',
    originalText: c.originalText ?? c.original_text ?? '',
    original_text: c.original_text ?? c.originalText ?? '',
    aiExplanation: c.aiExplanation ?? c.ai_explanation ?? '',
    ai_explanation: c.ai_explanation ?? c.aiExplanation ?? '',
    riskLevel: c.riskLevel ?? c.risk_level ?? 'Safe & Standard',
    risk_level: c.risk_level ?? c.riskLevel ?? 'Safe & Standard',
    potentialHiddenCost: c.potentialHiddenCost ?? c.potential_hidden_cost ?? 'None',
    potential_hidden_cost: c.potential_hidden_cost ?? c.potentialHiddenCost ?? 'None',
    whatToClarify: c.whatToClarify ?? c.what_to_clarify ?? 'Standard terms verified.',
    what_to_clarify: c.what_to_clarify ?? c.whatToClarify ?? 'Standard terms verified.',
    category: c.category || 'Rent'
  };
}

export function useLeaseClauses() {
  const [clauses, setClauses] = useState<LeaseClause[]>(() => (MOCK_LEASE_CLAUSES || []).map(normalizeClause));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClauses = useCallback(async () => {
    if (!isSupabaseConfigured) {
      debugLog('useLeaseClauses', 'Supabase not configured, using mock lease clauses.');
      setClauses((MOCK_LEASE_CLAUSES || []).map(normalizeClause));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from('lease_clauses')
        .select('*')
        .order('clause_number', { ascending: true });

      if (sbError) {
        debugError('useLeaseClauses', sbError);
        setError(sbError.message);
        setClauses((MOCK_LEASE_CLAUSES || []).map(normalizeClause));
      } else if (data && data.length > 0) {
        debugLog('useLeaseClauses', `Fetched ${data.length} live lease clauses from Supabase`);
        setClauses(data.map(normalizeClause));
      } else {
        debugLog('useLeaseClauses', 'Supabase lease clauses empty, using fallback.');
        setClauses((MOCK_LEASE_CLAUSES || []).map(normalizeClause));
      }
    } catch (err: any) {
      debugError('useLeaseClauses', err);
      setError(err?.message || 'Failed to fetch lease clauses');
      setClauses((MOCK_LEASE_CLAUSES || []).map(normalizeClause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClauses();
  }, [fetchClauses]);

  return { clauses, loading, error, refetch: fetchClauses };
}
