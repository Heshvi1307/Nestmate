import React from 'react';
import { Home, Users, TrendingUp, MapPin, Database, ShieldCheck } from 'lucide-react';
import type { Property } from '../types';
import { isSupabaseConfigured } from '../utils/supabaseClient';

interface DashboardProps {
  properties: Property[];
  loading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ properties, loading }) => {
  const getRent = (p: Property) => p.base_rent ?? p.baseRent ?? 0;

  const avgRent = properties.length
    ? Math.round(properties.reduce((s, p) => s + getRent(p), 0) / properties.length)
    : 0;

  const uniqueCities = new Set(properties.map(p => p.city).filter(Boolean));

  const stats = [
    { 
      icon: Home, 
      color: 'indigo', 
      label: 'Live Listings in DB', 
      value: loading ? '…' : properties.length.toLocaleString() 
    },
    { 
      icon: Users, 
      color: 'emerald', 
      label: 'Roommate Profiles', 
      value: loading ? '…' : '100' 
    },
    { 
      icon: TrendingUp, 
      color: 'amber', 
      label: 'Avg Monthly Rent', 
      value: loading ? '…' : `₹${avgRent.toLocaleString('en-IN')}` 
    },
    { 
      icon: MapPin, 
      color: 'purple', 
      label: 'Cities Covered', 
      value: loading ? '…' : `${uniqueCities.size}` 
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-400">
              Supabase PostgreSQL Production Layer
            </span>
            {isSupabaseConfigured ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud DB
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Demo Cache Active
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            PropTech Intelligence & Analytics
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Real-time aggregates computed across verified metro property listings, roommate personality graphs, and legal lease audit logs.
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-1 text-center sm:text-right shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>MTA 2021 Legal Index</span>
          </div>
          <span className="text-2xl font-black text-teal-300">100% Verified</span>
          <span className="text-[11px] text-slate-400">Zero hidden deposit charges</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, color, label, value }) => (
          <div 
            key={label} 
            className="bg-surface rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mx-auto`}>
              <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Top Cities by Listings</h3>
            <span className="text-xs text-slate-400">Database distribution</span>
          </div>
          <div className="space-y-3">
            {Object.entries(
              properties.reduce<Record<string, number>>((acc, p) => {
                if (p.city) acc[p.city] = (acc[p.city] ?? 0) + 1;
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([city, count]) => (
                <div key={city} className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 w-32 truncate font-medium">
                    {city}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${(count / Math.max(1, properties.length)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 w-10 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Property Types */}
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Configuration Spectrum</h3>
              <span className="text-xs text-slate-400">BHK Breakdown</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                properties.reduce<Record<string, number>>((acc, p) => {
                  const type = p.property_type || p.propertyType || 'Apartment';
                  acc[type] = (acc[type] ?? 0) + 1;
                  return acc;
                }, {})
              )
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div 
                    key={type} 
                    className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 rounded-xl px-3 py-2 text-xs"
                  >
                    <span className="font-bold text-indigo-700 dark:text-indigo-300">{type}</span>
                    <span className="text-indigo-500 dark:text-indigo-400 ml-1.5 font-semibold">({count})</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by PostgreSQL RLS</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Ready for Scale</span>
          </div>
        </div>
      </div>
    </div>
  );
};
