import React, { useState } from 'react';
import { MapPin, Star, Shield, Zap, Eye, BedDouble, Bath, Maximize } from 'lucide-react';
import type { Property } from '../types';

interface Props {
  property: Property;
  onSelect: (p: Property) => void;
  onCompare?: (p: Property) => void;
  selected?: boolean;
}

export const PropertyCard: React.FC<Props> = ({ property, onSelect, onCompare, selected }) => {
  const [imgError, setImgError] = useState(false);
  const img = !imgError && property.images?.[0]
    ? property.images[0]
    : `https://source.unsplash.com/640x480/?apartment,${encodeURIComponent(property.city)}`;

  return (
    <div
      onClick={() => onSelect(property)}
      className={`group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 ${selected ? 'border-indigo-500' : 'border-transparent'}`}
    >
      {/* Image container – 4:3 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={property.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Verified badge – top-left */}
        {property.verified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            <Shield className="w-3 h-3" /> Verified
          </div>
        )}

        {/* Fast response badge – top-right */}
        {property.fast_response && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            <Zap className="w-3 h-3" /> Fast Reply
          </div>
        )}

        {/* Rent on image – bottom-left */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-black text-lg drop-shadow-lg">
            ₹{property.base_rent.toLocaleString('en-IN')}
            <span className="text-sm font-medium opacity-90">/mo</span>
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{property.title}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{property.neighborhood}, {property.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
          <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {property.bedrooms} Bed</span>
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {property.bathrooms} Bath</span>
          <span className="flex items-center gap-1"><Maximize className="w-3 h-3" /> {property.carpet_area} sqft</span>
        </div>

        {/* Rating + Compare */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-700">{property.rating?.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({property.reviews_count})</span>
          </div>
          {onCompare && (
            <button
              onClick={(e) => { e.stopPropagation(); onCompare(property); }}
              className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              <Eye className="w-3 h-3" /> Compare
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
