import React from 'react';
import { X, BedDouble, Bath, Maximize, IndianRupee } from 'lucide-react';
import type { Property } from '../types';

interface Props {
  properties: Property[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

function getImage(id: string) {
  return `https://picsum.photos/seed/${id.slice(0, 8)}/400/250`;
}

const Col: React.FC<{ property: Property; onRemove: (id: string) => void }> = ({ property, onRemove }) => {
  const beds = property.bedrooms ?? (() => {
    const m = property.title?.match(/(\d+)\s*BHK/i);
    return m ? parseInt(m[1]) : null;
  })();

  return (
    <div className="flex-1 min-w-[200px]">
      <div className="relative h-36 rounded-xl overflow-hidden">
        <img src={getImage(property.id)} alt={property.title}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button onClick={() => onRemove(property.id)}
          className="absolute top-2 right-2 bg-white/20 backdrop-blur rounded-full p-1 hover:bg-white/50">
          <X className="w-3.5 h-3.5 text-white" />
        </button>
        <p className="absolute bottom-2 left-2 text-white font-black text-base drop-shadow">
          ₹{(property.base_rent ?? 0).toLocaleString('en-IN')}
        </p>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <p className="font-bold text-slate-800 line-clamp-2 text-xs leading-tight">{property.title}</p>
        <p className="text-slate-500 text-xs">{property.neighborhood}, {property.city}</p>

        <div className="space-y-1.5 text-xs text-slate-600">
          {beds !== null && <div className="flex items-center gap-2"><BedDouble className="w-3.5 h-3.5 text-indigo-400" />{beds} Bedrooms</div>}
          {property.bathrooms && <div className="flex items-center gap-2"><Bath className="w-3.5 h-3.5 text-indigo-400" />{property.bathrooms} Bathrooms</div>}
          {property.carpet_area && <div className="flex items-center gap-2"><Maximize className="w-3.5 h-3.5 text-indigo-400" />{property.carpet_area} sqft</div>}
        </div>

        {property.furnishing && (
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {property.furnishing}
          </span>
        )}

        <div className="bg-indigo-50 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
            <IndianRupee className="w-3 h-3" /> Costs
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Rent</span>
            <span className="font-semibold text-slate-700">₹{(property.base_rent ?? 0).toLocaleString('en-IN')}</span>
          </div>
          {property.deposit && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Deposit</span>
              <span className="font-semibold text-slate-700">₹{property.deposit.toLocaleString('en-IN')}</span>
            </div>
          )}
          {property.total_estimated_monthly && (
            <div className="flex justify-between text-xs border-t border-indigo-100 pt-1 mt-1">
              <span className="text-indigo-600 font-semibold">Total/mo</span>
              <span className="font-bold text-indigo-700">₹{property.total_estimated_monthly.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PropertyComparisonModal: React.FC<Props> = ({ properties, onClose, onRemove }) => {
  if (!properties.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg">⚖️ Compare Properties</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-5 flex gap-4 overflow-x-auto">
          {properties.map(p => <Col key={p.id} property={p} onRemove={onRemove} />)}
          {properties.length < 3 && (
            <div className="flex-1 min-w-[180px] border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs p-4 text-center">
              Click <strong className="mx-1">Compare</strong> on a card to add
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
