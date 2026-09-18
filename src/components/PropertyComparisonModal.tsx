import React from 'react';
import { X, Star, Shield, BedDouble, Bath, Maximize, IndianRupee } from 'lucide-react';
import type { Property } from '../types';

interface Props {
  properties: Property[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const Col: React.FC<{ property: Property; onRemove: (id: string) => void }> = ({ property, onRemove }) => {
  const img = property.images?.[0]
    ?? `https://source.unsplash.com/400x250/?apartment,${encodeURIComponent(property.city)}`;

  return (
    <div className="flex-1 min-w-0">
      <div className="relative h-40">
        <img src={img} alt={property.title} className="w-full h-full object-cover rounded-xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
        <button
          onClick={() => onRemove(property.id)}
          className="absolute top-2 right-2 bg-white/20 backdrop-blur rounded-full p-1 hover:bg-white/50"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <p className="absolute bottom-2 left-2 text-white font-black text-lg drop-shadow">
          ₹{property.base_rent.toLocaleString('en-IN')}
        </p>
      </div>
      <div className="mt-3 space-y-2 text-sm">
        <p className="font-bold text-slate-800 line-clamp-2">{property.title}</p>
        <p className="text-slate-500 text-xs">{property.neighborhood}, {property.city}</p>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-semibold">{property.rating?.toFixed(1)}</span>
          <span className="text-slate-400 text-xs">({property.reviews_count})</span>
        </div>

        {/* Specs */}
        {(
          [
            [BedDouble, `${property.bedrooms} Bedrooms`],
            [Bath, `${property.bathrooms} Bathrooms`],
            [Maximize, `${property.carpet_area} sqft`],
          ] as [React.ElementType, string][]
        ).map(([Icon, label]) => (
          <div key={label} className="flex items-center gap-2 text-slate-600">
            <Icon className="w-4 h-4 text-indigo-400" />
            {label}
          </div>
        ))}

        {/* Cost breakdown */}
        <div className="bg-indigo-50 rounded-xl p-3 space-y-1 mt-2">
          <p className="font-semibold text-indigo-700 flex items-center gap-1 text-xs">
            <IndianRupee className="w-3 h-3" /> Monthly Costs
          </p>
          {[
            ['Base Rent', property.base_rent],
            ['Utilities', property.utilities_estimate],
            ['Maintenance', property.maintenance_monthly],
            ['Total', property.total_estimated_monthly],
          ].map(([label, val]) => (
            <div key={label as string} className="flex justify-between text-xs">
              <span className="text-slate-500">{label}</span>
              <span className={`font-semibold ${label === 'Total' ? 'text-indigo-700' : 'text-slate-700'}`}>
                ₹{(val as number).toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-1 pt-1">
          {property.verified && (
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const PropertyComparisonModal: React.FC<Props> = ({ properties, onClose, onRemove }) => {
  if (properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg">Compare Properties</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="p-5 flex gap-4 overflow-x-auto">
          {properties.map((p) => (
            <Col key={p.id} property={p} onRemove={onRemove} />
          ))}
          {properties.length < 3 && (
            <div className="flex-1 min-w-[180px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm p-4 text-center">
              Click "Compare" on a property to add it here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
