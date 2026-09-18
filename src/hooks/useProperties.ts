import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';
import type { Property } from '../types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from('properties')
        .select('*')
        .order('verified', { ascending: false })
        .order('rating', { ascending: false })
        .limit(200);

      if (sbError) {
        debugError('useProperties', sbError);
        setError(sbError.message);
      } else {
        debugLog('useProperties', `Fetched ${data?.length ?? 0} properties`);
        setProperties((data as Property[]) ?? []);
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);

  return { properties, loading, error };
}
