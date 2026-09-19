import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';
import { MOCK_ROOMMATES } from '../data/mockData';
import type { RoommateProfile } from '../types';

function normalizeRoommate(r: any): RoommateProfile {
  return {
    ...r,
    id: String(r.id),
    name: r.name || 'Verified Roommate',
    age: r.age ?? 24,
    location: r.location || 'Ahmedabad',
    profession: r.profession || 'Software Engineer',
    companyOrCollege: r.companyOrCollege || r.company_or_college || 'Tech Innovator',
    avatar: r.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces&q=80`,
    compatibilityScore: r.compatibilityScore ?? 88,
    budgetRange: r.budgetRange || { min: 8000, max: 15000 },
    preferredLocations: r.preferredLocations || ['Navrangpura', 'Satellite', 'Bodakdev'],
    moveInDate: r.moveInDate || 'Immediate',
    bio: r.bio || r.about_me || 'Clean, respectful roommate looking for friendly flatmates.',
    about_me: r.about_me || r.bio || 'Clean, respectful roommate looking for friendly flatmates.',
    mbti: r.mbti || 'INFJ',
    interests: Array.isArray(r.interests) ? r.interests : ['Reading', 'Cooking', 'Tech', 'Yoga'],
    experience_years: r.experience_years || '2+ yrs',
    professional_summary: r.professional_summary || 'Full-time working professional with predictable schedule.',
    lifestyleTraits: r.lifestyleTraits || {
      sleepSchedule: 'Moderate (7-8 AM)',
      workStyle: 'Hybrid',
      cleanliness: 'Consistently clean',
      cooking: 'Cooks occasionally',
      social: 'Occasional friends',
      guests: 'Weekends okay',
      pets: 'Loves pets',
      smoking: 'Strict non-smoker'
    },
    matchedTraits: r.matchedTraits || ['Cleanliness discipline', 'Financial reliability'],
    minorDifferences: r.minorDifferences || ['Slightly different weekend wake-up times'],
    verifiedId: r.verifiedId ?? true,
    backgroundCheck: r.backgroundCheck ?? true
  };
}

export function useRoommates() {
  const [roommates, setRoommates] = useState<RoommateProfile[]>(() => MOCK_ROOMMATES.map(normalizeRoommate));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoommates = useCallback(async () => {
    if (!isSupabaseConfigured) {
      debugLog('useRoommates', 'Supabase not configured, using local mock roommates.');
      setRoommates(MOCK_ROOMMATES.map(normalizeRoommate));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data, error: sbError } = await supabase
        .from('roommate_profiles')
        .select('*');

      if (sbError) {
        debugError('useRoommates', sbError);
        setError(sbError.message);
        setRoommates(MOCK_ROOMMATES.map(normalizeRoommate));
      } else if (data && data.length > 0) {
        debugLog('useRoommates', `Fetched ${data.length} live roommate profiles from Supabase`);
        setRoommates(data.map(normalizeRoommate));
      } else {
        debugLog('useRoommates', 'Supabase profiles empty, using mock roommate profiles.');
        setRoommates(MOCK_ROOMMATES.map(normalizeRoommate));
      }
    } catch (err: any) {
      debugError('useRoommates', err);
      setError(err?.message || 'Failed to fetch roommates');
      setRoommates(MOCK_ROOMMATES.map(normalizeRoommate));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoommates();
  }, [fetchRoommates]);

  return { roommates, loading, error, refetch: fetchRoommates };
}
