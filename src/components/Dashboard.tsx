import React from 'react';
import { Home, Users, TrendingUp, MapPin } from 'lucide-react';
import type { Property } from '../types';

interface Props {
  properties: Property[];
  loading: boolean;
}

export const Dashboard: React.FC<Props> = ({ properties, loading }) => {
  const avgRent = properties.length
    ? Math.round(properties.reduce((s, p) => s + (p.base_rent ?? 0), 0) / properties.length)
    : 0;

  const stats = [
    { icon: Home,      color: 'indigo',  label: 'Total Properties',   value: loading ? '…' : properties.length.toLocaleString() },
    { icon: Users,     color: 'emerald', label: 'Roommate Profiles',  value: loading ? '…' : '100' },
    { icon: TrendingUp,color: 'amber',   label: 'Avg Monthly Rent',   value: loading ? '…' : `₹${avgRent.toLocaleString('en-IN')}` },
    { icon: MapPin,    color: 'purple',  label: 'Cities Covered',     value: loading ? '…' : `${new Set(properties.map(p => p.city)).size}` },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">📊 Dashboard</h2>
        <p className="text-slate-500 text-sm">Live data from your Supabase database</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center space-y-2">
            <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center mx-auto`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <p className={`text-2xl font-black text-${color}-700`}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Top cities */}
      {!loading && properties.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-3">Top Cities by Listings</h3>
          <div className="space-y-2">
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
                  <span className="text-sm text-slate-700 w-36 truncate font-medium">{city}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${(count / properties.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-10 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Property types breakdown */}
      {!loading && properties.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-3">Property Types</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(
              properties.reduce<Record<string, number>>((acc, p) => {
                if (p.property_type) acc[p.property_type] = (acc[p.property_type] ?? 0) + 1;
                return acc;
              }, {})
            )
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="bg-indigo-50 rounded-full px-3 py-1.5 text-sm">
                  <span className="font-semibold text-indigo-700">{type}</span>
                  <span className="text-indigo-400 ml-1">({count})</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
