import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface Filters {
  city: string;
  minRent: number;
  maxRent: number;
  bedrooms: number | null;
  propertyType: string;
  furnishing: string;
  verifiedOnly: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (filters: Filters) => void;
  cities: string[];
}

export const SmartSearchFilterDrawer: React.FC<Props> = ({ open, onClose, filters, onChange, cities }) => {
  const [local, setLocal] = useState<Filters>(filters);

  const apply = () => { onChange(local); onClose(); };
  const reset = () => setLocal({ city: '', minRent: 0, maxRent: 200000, bedrooms: null, propertyType: '', furnishing: '', verifiedOnly: false });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white h-full w-full max-w-sm shadow-2xl flex flex-col z-50">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-500" /> Filters
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
            <div className="flex flex-wrap gap-2">
              {['', ...cities.slice(0, 10)].map((c) => (
                <button
                  key={c || 'all'}
                  onClick={() => setLocal({ ...local, city: c })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    local.city === c
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {c || 'All Cities'}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bedrooms</label>
            <div className="flex flex-wrap gap-2">
              {[null, 1, 2, 3, 4, 5].map((b) => (
                <button
                  key={b ?? 'any'}
                  onClick={() => setLocal({ ...local, bedrooms: b })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    local.bedrooms === b
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {b === null ? 'Any' : `${b} BHK`}
                </button>
              ))}
            </div>
          </div>

          {/* Rent range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rent Range: ₹{local.minRent.toLocaleString('en-IN')} – ₹{local.maxRent.toLocaleString('en-IN')}
            </label>
            <input
              type="range" min={0} max={200000} step={1000} value={local.minRent}
              onChange={(e) => setLocal({ ...local, minRent: Number(e.target.value) })}
              className="w-full accent-indigo-600"
            />
            <input
              type="range" min={0} max={200000} step={1000} value={local.maxRent}
              onChange={(e) => setLocal({ ...local, maxRent: Number(e.target.value) })}
              className="w-full accent-indigo-600 mt-2"
            />
          </div>

          {/* Property type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {['', 'Apartment', 'House', 'Studio', 'Villa', 'PG'].map((t) => (
                <button
                  key={t || 'all'}
                  onClick={() => setLocal({ ...local, propertyType: t })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    local.propertyType === t
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {t || 'All Types'}
                </button>
              ))}
            </div>
          </div>

          {/* Furnishing */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Furnishing</label>
            <div className="flex flex-wrap gap-2">
              {['', 'Furnished', 'Semi-Furnished', 'Unfurnished'].map((f) => (
                <button
                  key={f || 'all'}
                  onClick={() => setLocal({ ...local, furnishing: f })}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    local.furnishing === f
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
                  }`}
                >
                  {f || 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Verified toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setLocal({ ...local, verifiedOnly: !local.verifiedOnly })}
              className={`w-10 h-6 rounded-full transition-colors relative ${local.verifiedOnly ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${local.verifiedOnly ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">Verified Properties Only</span>
          </label>
        </div>

        <div className="p-5 border-t border-slate-100 flex gap-3">
          <button onClick={reset} className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition">
            Reset
          </button>
          <button onClick={apply} className="flex-1 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export type { Filters };
