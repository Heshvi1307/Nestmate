import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';
import type { LeaseClause } from '../types';

export function useLeaseClauses() {
  const [clauses, setClauses] = useState<LeaseClause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClauses() {
      setLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from('lease_clauses')
        .select('*')
        .order('clause_number', { ascending: true });

      if (sbError) {
        debugError('useLeaseClauses', sbError);
        setError(sbError.message);
      } else {
        debugLog('useLeaseClauses', `Fetched ${data?.length ?? 0} lease clauses`);
        setClauses((data as LeaseClause[]) ?? []);
      }
      setLoading(false);
    }
    fetchClauses();
  }, []);

  return { clauses, loading, error };
}
