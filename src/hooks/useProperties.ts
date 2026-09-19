import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';
import type { Property } from '../types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: sbError } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(300);

    if (sbError) {
      debugError('useProperties', sbError);
      setError(sbError.message);
    } else {
      debugLog('useProperties', `Fetched ${data?.length ?? 0} properties`);
      setProperties((data as Property[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}
