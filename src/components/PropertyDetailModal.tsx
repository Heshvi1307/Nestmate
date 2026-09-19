import React, { useState } from 'react';
import {
  X, MapPin, BedDouble, Bath, Maximize,
  Wifi, CheckCircle, IndianRupee, Calculator,
} from 'lucide-react';
import type { Property } from '../types';

interface Props {
  property: Property | null;
  onClose: () => void;
  onCalculate?: (p: Property) => void;
}

function getPropertyImage(property: Property): string {
  const seed = property.id?.slice(0, 8) ?? 'home';
  return `https://picsum.photos/seed/${seed}/800/400`;
}

export const PropertyDetailModal: React.FC<Props> = ({ property, onClose, onCalculate }) => {
  const [imgError, setImgError] = useState(false);
  if (!property) return null;

  const img = imgError
    ? `https://picsum.photos/seed/fallback/800/400`
    : getPropertyImage(property);

  const beds = property.bedrooms ?? (() => {
    const m = property.title?.match(/(\d+)\s*BHK/i);
    return m ? parseInt(m[1]) : null;
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Hero */}
        <div className="relative h-56 sm:h-72">
          <img
            src={img}
            alt={property.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-t-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-3xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white rounded-full p-2 hover:bg-white/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <div className="flex items-baseline gap-1">
              <IndianRupee className="w-5 h-5 text-white" />
              <span className="text-white font-black text-3xl">{(property.base_rent ?? 0).toLocaleString('en-IN')}</span>
              <span className="text-white/80 text-base font-medium">/mo</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Title + location */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 leading-snug">{property.title}</h2>
            {(property.neighborhood || property.city) && (
              <div className="flex items-center gap-1 mt-1 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400" />
                {property.neighborhood}{property.city ? `, ${property.city}` : ''}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BedDouble, label: 'Bedrooms',  val: beds ?? '–' },
              { icon: Bath,      label: 'Bathrooms', val: property.bathrooms ?? '–' },
              { icon: Maximize,  label: 'sqft',      val: property.carpet_area ?? '–' },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <Icon className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                <p className="font-bold text-slate-800">{val}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Furnishing */}
          <div className="flex flex-wrap gap-2">
            {property.furnishing && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> {property.furnishing}
              </span>
            )}
          </div>

          {/* Cost breakdown */}
          <div className="bg-indigo-50 rounded-2xl p-4 space-y-2">
            <h3 className="font-semibold text-indigo-800 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" /> Cost Breakdown
            </h3>
            {[
              ['Base Rent',       property.base_rent],
              ['Deposit',         property.deposit],
              ['Utilities Est.',  property.utilities_estimate],
              ['Total Monthly',   property.total_estimated_monthly],
            ].filter(([, v]) => v != null).map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className={`font-semibold ${label === 'Total Monthly' ? 'text-indigo-700' : 'text-slate-800'}`}>
                  ₹{(val as number).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Wifi className="w-4 h-4" /> Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map(a => (
                  <span key={a} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Close
            </button>
            {onCalculate && (
              <button
                onClick={() => onCalculate(property)}
                className="flex-1 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" /> True Cost
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
