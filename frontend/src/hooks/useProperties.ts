import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';
import { MOCK_PROPERTIES } from '../data/mockData';
import type { Property } from '../types';

// Normalizer to ensure both Supabase snake_case and UI camelCase are present
function normalizeProperty(p: any): Property {
  const baseRent = p.base_rent ?? p.baseRent ?? 15000;
  const deposit = p.deposit ?? baseRent * 2;
  const maintenance = p.maintenance_monthly ?? p.maintenanceMonthly ?? 2000;
  const utilities = p.utilities_estimate ?? p.utilitiesEstimate ?? 2500;
  const internet = p.internet_monthly ?? p.internetMonthly ?? 1000;
  const totalMonthly = p.total_estimated_monthly ?? p.totalEstimatedMonthly ?? (baseRent + maintenance + utilities + internet);
  const moveIn = p.move_in_total_cost ?? p.moveInTotalCost ?? (deposit + totalMonthly);

  return {
    ...p,
    id: String(p.id),
    title: p.title || 'Spacious Apartment',
    tagline: p.tagline || 'Verified Rental Home',
    neighborhood: p.neighborhood || 'Central District',
    city: p.city || 'Ahmedabad',
    propertyType: p.property_type || p.propertyType || '2 BHK',
    property_type: p.property_type || p.propertyType || '2 BHK',
    bedrooms: p.bedrooms ?? 2,
    bathrooms: p.bathrooms ?? 2,
    carpetArea: p.carpet_area ?? p.carpetArea ?? 950,
    carpet_area: p.carpet_area ?? p.carpetArea ?? 950,
    furnishing: p.furnishing || 'Semi-Furnished',
    rating: p.rating ?? 4.8,
    reviewsCount: p.reviews_count ?? p.reviewsCount ?? 12,
    reviews_count: p.reviews_count ?? p.reviewsCount ?? 12,
    verified: p.verified ?? true,
    verifiedOwner: p.verified_owner ?? p.verifiedOwner ?? true,
    verified_owner: p.verified_owner ?? p.verifiedOwner ?? true,
    recentlyInspected: p.recently_inspected ?? p.recentlyInspected ?? true,
    recently_inspected: p.recently_inspected ?? p.recentlyInspected ?? true,
    fastResponse: p.fast_response ?? p.fastResponse ?? true,
    fast_response: p.fast_response ?? p.fastResponse ?? true,
    baseRent,
    base_rent: baseRent,
    deposit,
    maintenanceMonthly: maintenance,
    maintenance_monthly: maintenance,
    utilitiesEstimate: utilities,
    utilities_estimate: utilities,
    internetMonthly: internet,
    internet_monthly: internet,
    totalEstimatedMonthly: totalMonthly,
    total_estimated_monthly: totalMonthly,
    moveInTotalCost: moveIn,
    move_in_total_cost: moveIn,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (MOCK_PROPERTIES[0]?.images || []),
    coordinates: p.coordinates || { lat: 23.0225, lng: 72.5714, x: 50, y: 50 },
    distances: p.distances || { officeMinutes: 15, metroMinutes: 8, groceryMinutes: 5, universityMinutes: 20 },
    amenities: Array.isArray(p.amenities) ? p.amenities : ['Power Backup', 'Lift', 'Security', 'Covered Parking'],
    transparencyDetails: p.transparency_details || p.transparencyDetails || {
      ownerKycVerified: true,
      ownerName: 'Verified Landlord',
      inspectionDate: '2026-02-15',
      inspectionScore: 94,
      inspectionChecks: { electrical: 96, plumbing: 92, structural: 95, safety: 93 },
      historicalRentStability: 'Stable (0% hike in 2 yrs)',
      maintenanceTicketsPastYear: 2,
      avgResolutionHours: 4,
      standardLeaseAvailable: true,
      lockInMonths: 11,
      noticePeriodDays: 30,
      depositReturnPolicy: 'Full return in 7 banking days'
    }
  };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(() => MOCK_PROPERTIES.map(normalizeProperty));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    if (!isSupabaseConfigured) {
      debugLog('useProperties', 'Supabase not configured, using local mock properties.');
      setProperties(MOCK_PROPERTIES.map(normalizeProperty));
      setLoading(false);
      return;
    }

    try {
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
        setProperties(MOCK_PROPERTIES.map(normalizeProperty));
      } else if (data && data.length > 0) {
        debugLog('useProperties', `Fetched ${data.length} live properties from Supabase`);
        setProperties(data.map(normalizeProperty));
      } else {
        debugLog('useProperties', 'Supabase properties empty, falling back to mock dataset.');
        setProperties(MOCK_PROPERTIES.map(normalizeProperty));
      }
    } catch (err: any) {
      debugError('useProperties', err);
      setError(err?.message || 'Failed to fetch properties');
      setProperties(MOCK_PROPERTIES.map(normalizeProperty));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}
