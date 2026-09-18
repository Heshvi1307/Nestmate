import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';
import type { RoommateProfile } from '../types';

export function useRoommates() {
  const [roommates, setRoommates] = useState<RoommateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoommates() {
      setLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from('roommate_profiles')
        .select('*');

      if (sbError) {
        debugError('useRoommates', sbError);
        setError(sbError.message);
      } else {
        debugLog('useRoommates', `Fetched ${data?.length ?? 0} roommate profiles`);
        setRoommates((data as RoommateProfile[]) ?? []);
      }
      setLoading(false);
    }
    fetchRoommates();
  }, []);

  return { roommates, loading, error };
}
