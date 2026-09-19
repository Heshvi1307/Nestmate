import React, { useState } from 'react';
import { MapPin, Eye, BedDouble, Bath, Maximize, IndianRupee } from 'lucide-react';
import type { Property } from '../types';

// BHK-matched curated Unsplash apartment images (Step 7)
const BHK_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  '2': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  '3': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  '4': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'studio': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'coliving': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
};

export function getPropertyImage(property: Property): string {
  // Use real image if available
  if (property.images?.[0]?.startsWith('http')) return property.images[0];
  // Fall back to BHK-matched Unsplash
  const beds = property.bedrooms ?? (() => {
    const m = property.title?.match(/(\d+)\s*BHK/i);
    return m ? parseInt(m[1]) : null;
  })();
  if (property.title?.toLowerCase().includes('studio')) return BHK_IMAGES.studio;
  if (property.title?.toLowerCase().includes('co-living') || property.title?.toLowerCase().includes('coliving')) return BHK_IMAGES.coliving;
  return BHK_IMAGES[String(beds)] ?? BHK_IMAGES.default;
}

const FURNISH_STYLE: Record<string, string> = {
  'Furnished':      'bg-emerald-100 text-emerald-700',
  'Semi-Furnished': 'bg-sky-100 text-sky-700',
  'Unfurnished':    'bg-slate-100 text-slate-600',
};

interface Props {
  property: Property;
  onSelect: (p: Property) => void;
  onCompare?: (p: Property) => void;
  selected?: boolean;
}

export const PropertyCard: React.FC<Props> = ({ property, onSelect, onCompare, selected }) => {
  const [err, setErr] = useState(false);

  const beds = property.bedrooms ?? (() => {
    const m = property.title?.match(/(\d+)\s*BHK/i);
    return m ? parseInt(m[1]) : null;
  })();

  const img = err ? BHK_IMAGES.default : getPropertyImage(property);
  const furnStyle = FURNISH_STYLE[property.furnishing ?? ''] ?? 'bg-slate-100 text-slate-600';

  return (
    <div
      onClick={() => onSelect(property)}
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-2 ${
        selected ? 'border-indigo-500' : 'border-transparent hover:border-indigo-100'
      }`}
    >
      {/* Image 4:3 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={img}
          alt={property.title}
          onError={() => setErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Furnishing badge top-left */}
        {property.furnishing && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${furnStyle}`}>
            {property.furnishing}
          </span>
        )}

        {/* City top-right */}
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          <MapPin className="w-2.5 h-2.5" />{property.city}
        </span>

        {/* Rent bottom-left — ON TOP of image */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-0.5">
          <IndianRupee className="w-4 h-4 text-white" />
          <span className="text-white font-black text-xl leading-none drop-shadow-lg">
            {(property.base_rent ?? 0).toLocaleString('en-IN')}
          </span>
          <span className="text-white/80 text-sm">/mo</span>
        </div>

        {/* Compare bottom-right */}
        {onCompare && (
          <button
            onClick={e => { e.stopPropagation(); onCompare(property); }}
            className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 px-2.5 py-1 rounded-full hover:bg-white/40 transition"
          >
            <Eye className="w-3 h-3" /> Compare
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
          {property.title}
        </h3>
        <p className="text-slate-500 text-xs flex items-center gap-1">
          <MapPin className="w-3 h-3 text-indigo-300 shrink-0" />
          {property.neighborhood}{property.city ? `, ${property.city}` : ''}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500 border-t border-slate-50 pt-2">
          {beds !== null && <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-indigo-300" />{beds} Bed</span>}
          {property.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-indigo-300" />{property.bathrooms} Bath</span>}
          {property.carpet_area && <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5 text-indigo-300" />{property.carpet_area} sqft</span>}
        </div>
      </div>
    </div>
  );
};
