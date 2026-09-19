import React from 'react';
import { MapPin } from 'lucide-react';
import type { Property } from '../types';

interface Props {
  properties: Property[];
  onSelect: (p: Property) => void;
}

// City-level bounding boxes (Step 8: cluster pins by real city)
const CITY_BOUNDS: Record<string, { x: [number, number]; y: [number, number] }> = {
  'Mumbai':    { x: [10, 25], y: [20, 45] },
  'Delhi':     { x: [35, 55], y: [10, 30] },
  'Bangalore': { x: [55, 75], y: [55, 75] },
  'Pune':      { x: [40, 58], y: [45, 65] },
  'Hyderabad': { x: [60, 78], y: [35, 55] },
  'Chennai':   { x: [68, 85], y: [65, 82] },
  'Kolkata':   { x: [80, 95], y: [25, 45] },
  'Ahmedabad': { x: [20, 38], y: [30, 50] },
  'Jaipur':    { x: [30, 48], y: [15, 32] },
  'Surat':     { x: [15, 30], y: [48, 62] },
};

function cityPin(property: Property): { x: number; y: number } {
  const city = property.city ?? '';
  const bounds = CITY_BOUNDS[city];
  // Stable offset from property id
  const seed = property.id.replace(/-/g, '');
  const a = parseInt(seed.slice(0, 4), 16) / 65535;
  const b = parseInt(seed.slice(4, 8), 16) / 65535;
  if (bounds) {
    const x = bounds.x[0] + a * (bounds.x[1] - bounds.x[0]);
    const y = bounds.y[0] + b * (bounds.y[1] - bounds.y[0]);
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  }
  // Unknown city: spread around center with large scatter
  return { x: 10 + a * 80, y: 10 + b * 80 };
}

export const InteractiveMap: React.FC<Props> = ({ properties, onSelect }) => {
  // Only show first 300 for performance; skip properties with no city
  const valid = properties.filter(p => p.city).slice(0, 300);
  const withPos = valid.map(p => ({ ...p, ...cityPin(p) }));

  // Top 3 city labels
  const cityCounts = valid.reduce<Record<string, { count: number; x: number; y: number }>>((acc, p) => {
    const bounds = CITY_BOUNDS[p.city!];
    if (!acc[p.city!] && bounds) {
      acc[p.city!] = {
        count: 0,
        x: (bounds.x[0] + bounds.x[1]) / 2,
        y: (bounds.y[0] + bounds.y[1]) / 2,
      };
    }
    if (acc[p.city!]) acc[p.city!].count++;
    return acc;
  }, {});

  const topCities = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="relative w-full h-[480px] bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapgrid)" />
        </svg>
      </div>

      {/* India outline hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span className="text-[200px] select-none">🇮🇳</span>
      </div>

      {/* City labels */}
      {topCities.map(([city, info]) => (
        <div key={city}
          style={{ left: `${info.x}%`, top: `${info.y}%` }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap bg-white/60 px-1.5 py-0.5 rounded-full">
            {city} ({info.count})
          </span>
        </div>
      ))}

      {/* Property pins */}
      {withPos.map(p => (
        <button key={p.id} onClick={() => onSelect(p)}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20"
          title={p.title}>
          <div className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md group-hover:bg-indigo-800 group-hover:scale-110 transition-all whitespace-nowrap">
            ₹{((p.base_rent ?? 0) / 1000).toFixed(0)}k
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block z-30 pointer-events-none">
            <div className="bg-white rounded-xl shadow-2xl p-2.5 w-44 text-left border border-slate-100">
              <p className="font-semibold text-slate-800 text-xs line-clamp-2">{p.title}</p>
              <p className="text-slate-400 text-xs flex items-center gap-0.5 mt-0.5">
                <MapPin className="w-2.5 h-2.5" />{p.neighborhood}, {p.city}
              </p>
              <p className="text-indigo-600 font-bold text-xs mt-1">₹{(p.base_rent ?? 0).toLocaleString('en-IN')}/mo</p>
            </div>
          </div>
        </button>
      ))}

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 shadow">
        📍 {valid.length} properties across India
      </div>
    </div>
  );
};
