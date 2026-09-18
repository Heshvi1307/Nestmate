import React from 'react';
import { MapPin } from 'lucide-react';
import type { Property } from '../types';
import { debugLog } from '../utils/debug';

interface Props {
  properties: Property[];
  onSelect: (p: Property) => void;
}

export const InteractiveMap: React.FC<Props> = ({ properties, onSelect }) => {
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-100 to-indigo-50 rounded-2xl overflow-hidden border border-slate-200">
      {/* Map background decoration */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-3 left-3 bg-white/80 backdrop-blur rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 shadow">
        📍 {properties.filter(p => p.coordinates).length} properties on map
      </div>

      {properties.map((property) => {
        // Guard against missing coordinates
        if (!property.coordinates) {
          debugLog('InteractiveMap', `Skipping pin for "${property.title}" — no coordinates`);
          return null;
        }

        const x = property.coordinates.x ?? 50;
        const y = property.coordinates.y ?? 50;

        return (
          <button
            key={property.id}
            onClick={() => onSelect(property)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            title={property.title}
          >
            <div className="relative">
              <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg 
                             group-hover:bg-indigo-800 transition-colors whitespace-nowrap">
                ₹{(property.base_rent / 1000).toFixed(0)}k
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                             border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-indigo-600 group-hover:border-t-indigo-800" />
            </div>

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 hidden group-hover:block z-10 pointer-events-none">
              <div className="bg-white rounded-xl shadow-xl p-2 w-40 text-left border border-slate-100">
                <p className="font-semibold text-slate-800 text-xs line-clamp-2">{property.title}</p>
                <p className="text-slate-500 text-xs flex items-center gap-0.5 mt-0.5">
                  <MapPin className="w-3 h-3" />{property.neighborhood}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
