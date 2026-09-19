import React, { useEffect, useState } from 'react';
import { Home, Shield, Star, MapPin, TrendingUp } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { debugLog, debugError } from '../utils/debug';

interface LiveStats {
  total: number;
  cities: number;
  avgRent: number;
  topCities: { city: string; count: number }[];
}

export const TrustCenter: React.FC = () => {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('city, base_rent')
          .limit(7691);
        if (error) throw error;
        debugLog('TrustCenter stats', `${data?.length} rows`);
        const rows = data ?? [];
        const cityMap: Record<string, number> = {};
        let rentSum = 0;
        rows.forEach(p => {
          if (p.city) cityMap[p.city] = (cityMap[p.city] ?? 0) + 1;
          if (p.base_rent) rentSum += p.base_rent;
        });
        const topCities = Object.entries(cityMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([city, count]) => ({ city, count }));
        setStats({
          total: rows.length,
          cities: Object.keys(cityMap).length,
          avgRent: rows.length ? Math.round(rentSum / rows.length) : 0,
          topCities,
        });
      } catch (err) {
        debugError('TrustCenter stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const pillars = [
    {
      icon: Shield,
      color: 'indigo',
      title: 'Lease DNA™',
      desc: 'Every clause decoded using the Model Tenancy Act 2021. Know what you sign before you sign it.',
    },
    {
      icon: Star,
      color: 'amber',
      title: 'Zero Mock Data',
      desc: 'All 7,691 properties are real listings sourced from verified Indian real estate datasets.',
    },
    {
      icon: TrendingUp,
      color: 'emerald',
      title: 'TrueCost Index',
      desc: 'Hyper-local benchmarks for 5 Indian cities uncover hidden costs beyond the headline rent.',
    },
    {
      icon: MapPin,
      color: 'purple',
      title: 'City Intelligence',
      desc: 'Neighbourhood-level data from Mumbai, Delhi, Bangalore, Pune, Hyderabad and more.',
    },
  ];

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">🛡️ Trust Center</h2>
        <p className="text-slate-500 text-sm mt-1">Transparency is our product</p>
      </div>

      {/* Live DB stats from Supabase */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-white/80 text-sm mb-4 uppercase tracking-wide">Live Database Stats</h3>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-xl h-16 animate-pulse" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-black">{stats.total.toLocaleString('en-IN')}</p>
              <p className="text-white/70 text-xs mt-0.5">Properties</p>
            </div>
            <div>
              <p className="text-3xl font-black">{stats.cities}</p>
              <p className="text-white/70 text-xs mt-0.5">Cities</p>
            </div>
            <div>
              <p className="text-3xl font-black">₹{(stats.avgRent / 1000).toFixed(0)}k</p>
              <p className="text-white/70 text-xs mt-0.5">Avg Rent</p>
            </div>
          </div>
        ) : (
          <p className="text-white/60 text-sm text-center">Could not load live stats</p>
        )}

        {/* Top cities */}
        {stats?.topCities && stats.topCities.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">Top Cities by Listings</p>
            {stats.topCities.map(({ city, count }) => (
              <div key={city} className="flex items-center gap-3">
                <span className="text-white/80 text-sm w-24 truncate">{city}</span>
                <div className="flex-1 bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full"
                    style={{ width: `${(count / stats.total) * 100}%` }} />
                </div>
                <span className="text-white/60 text-xs w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pillars.map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3 hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <h4 className="font-bold text-slate-800">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Data source */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 text-center space-y-2">
        <Home className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-slate-600 font-semibold text-sm">Data Sources</p>
        <p className="text-slate-400 text-xs leading-relaxed">
          Property listings from Indian real estate datasets (Kaggle) ·
          Lease clauses from MoHUA Model Tenancy Act 2021 ·
          Corridor benchmarks from RentFair AI research
        </p>
      </div>
    </div>
  );
};
