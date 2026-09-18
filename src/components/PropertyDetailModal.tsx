import React from 'react';
import {
  X, MapPin, Star, Shield, BedDouble, Bath, Maximize,
  Wifi, CheckCircle, Calendar, IndianRupee,
} from 'lucide-react';
import type { Property } from '../types';

interface Props {
  property: Property | null;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<Props> = ({ property, onClose }) => {
  if (!property) return null;

  const img = property.images?.[0]
    ?? `https://source.unsplash.com/800x500/?apartment,${encodeURIComponent(property.city)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Hero */}
        <div className="relative h-64">
          <img src={img} alt={property.title} className="w-full h-full object-cover rounded-t-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white rounded-full p-2 hover:bg-white/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <p className="text-white font-black text-2xl">₹{property.base_rent.toLocaleString('en-IN')}<span className="text-base font-medium">/mo</span></p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Title + badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {property.verified && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              )}
              {property.verified_owner && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Verified Owner
                </span>
              )}
              {property.recently_inspected && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Inspected
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{property.title}</h2>
            <p className="text-slate-500 text-sm">{property.tagline}</p>
            <div className="flex items-center gap-1 mt-1 text-slate-500 text-sm">
              <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.city}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BedDouble, label: 'Bedrooms', val: property.bedrooms },
              { icon: Bath, label: 'Bathrooms', val: property.bathrooms },
              { icon: Maximize, label: 'Area (sqft)', val: property.carpet_area },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <Icon className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                <p className="font-bold text-slate-800">{val}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Costs */}
          <div className="bg-indigo-50 rounded-2xl p-4 space-y-2">
            <h3 className="font-semibold text-indigo-800 flex items-center gap-2"><IndianRupee className="w-4 h-4" /> Cost Breakdown</h3>
            {[
              ['Base Rent', property.base_rent],
              ['Utilities', property.utilities_estimate],
              ['Maintenance', property.maintenance_monthly],
              ['Internet', property.internet_monthly],
              ['Total Monthly', property.total_estimated_monthly],
              ['Deposit', property.deposit],
              ['Move-in Total', property.move_in_total_cost],
            ].map(([label, val]) => (
              <div key={label as string} className="flex justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className={`font-semibold ${label === 'Total Monthly' || label === 'Move-in Total' ? 'text-indigo-700' : 'text-slate-800'}`}>
                  ₹{(val as number).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><Wifi className="w-4 h-4" /> Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a} className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Rating + available from */}
          <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{property.rating?.toFixed(1)}</span>
              <span className="text-slate-400">({property.reviews_count} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Available: {property.available_from}</span>
            </div>
          </div>

          {/* Distances */}
          {property.distances && (
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Commute Times</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(property.distances).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 rounded-xl p-2 text-center">
                    <p className="font-bold text-slate-800">{val} min</p>
                    <p className="text-xs text-slate-500 capitalize">{key.replace('Minutes', '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
