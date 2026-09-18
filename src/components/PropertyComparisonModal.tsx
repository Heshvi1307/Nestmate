import React from 'react';
import { 
  X, 
  Scale, 
  Check, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  Building, 
  IndianRupee,
  ShieldCheck,
  Zap,
  Car,
  Trash2
} from 'lucide-react';
import { Property } from '../types';

interface PropertyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onRemoveProperty: (id: string) => void;
  onViewDetails: (property: Property) => void;
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  isOpen,
  onClose,
  properties,
  onRemoveProperty,
  onViewDetails
}) => {
  if (!isOpen || properties.length === 0) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Compute trade-offs dynamically
  const lowestMonthlyCostProp = [...properties].sort((a, b) => a.totalEstimatedMonthly - b.totalEstimatedMonthly)[0];
  const lowestMoveInCapitalProp = [...properties].sort((a, b) => a.moveInTotalCost - b.moveInTotalCost)[0];
  const shortestCommuteProp = [...properties].sort((a, b) => a.distances.officeMinutes - b.distances.officeMinutes)[0];
  const largestAreaProp = [...properties].sort((a, b) => b.carpetArea - a.carpetArea)[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-5xl bg-surface rounded-2xl shadow-elevated border border-border overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface/95 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base text-text-primary">
              Side-by-Side Property Comparison ({properties.length}/3)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Comparison Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* AI Trade-off Summary Callout */}
          <div className="bg-[#F2F6F3] border border-primary/20 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                AI Trade-Off Analysis
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              NESTORA does not declare a generic "winner". Every home balances different priorities:
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-text-primary font-medium">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>{lowestMonthlyCostProp.title}</strong> has the lowest total monthly running cost ({formatCurrency(lowestMonthlyCostProp.totalEstimatedMonthly)}/mo).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>{shortestCommuteProp.title}</strong> gives you the fastest morning commute ({shortestCommuteProp.distances.officeMinutes} mins to workplace).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                <span>
                  <strong>{lowestMoveInCapitalProp.title}</strong> requires the lowest upfront move-in capital ({formatCurrency(lowestMoveInCapitalProp.moveInTotalCost)} total).
                </span>
              </li>
              {largestAreaProp.id !== lowestMonthlyCostProp.id && (
                <li className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                  <span>
                    <strong>{largestAreaProp.title}</strong> provides the highest living volume with {largestAreaProp.carpetArea} sq ft carpet area.
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 w-1/4 font-bold text-text-muted uppercase tracking-wider">
                    Feature / Metric
                  </th>
                  {properties.map((prop) => (
                    <th key={prop.id} className="p-3 w-1/4 align-top">
                      <div className="relative">
                        <button
                          onClick={() => onRemoveProperty(prop.id)}
                          className="absolute -top-1 -right-1 p-1 rounded-md text-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-bold text-text-primary text-sm line-clamp-1">
                          {prop.title}
                        </h4>
                        <p className="text-[11px] text-text-muted">{prop.neighborhood}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {/* Monthly Base Rent */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Monthly Base Rent</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3 font-bold text-text-primary tabular-nums">
                      {formatCurrency(prop.baseRent)}
                    </td>
                  ))}
                </tr>

                {/* TrueCost Estimated Monthly */}
                <tr className="bg-primary-light/30">
                  <td className="p-3 font-bold text-primary flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    <span>TrueCost™ / Month</span>
                  </td>
                  {properties.map((prop) => {
                    const isLowest = prop.id === lowestMonthlyCostProp.id;
                    return (
                      <td key={prop.id} className="p-3 font-extrabold text-primary text-sm tabular-nums">
                        <div>{formatCurrency(prop.totalEstimatedMonthly)}</div>
                        {isLowest && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Lowest Running Cost
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Security Deposit */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Security Deposit</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3 text-text-primary tabular-nums">
                      {formatCurrency(prop.deposit)}
                    </td>
                  ))}
                </tr>

                {/* Total Move-In Outlay */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Total Move-In Outlay</td>
                  {properties.map((prop) => {
                    const isLowestCapital = prop.id === lowestMoveInCapitalProp.id;
                    return (
                      <td key={prop.id} className="p-3 font-bold text-text-primary tabular-nums">
                        <div>{formatCurrency(prop.moveInTotalCost)}</div>
                        {isLowestCapital && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                            Lowest Upfront Outlay
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Layout / Bedrooms */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Layout</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3 text-text-primary font-medium">
                      {prop.bedrooms} Bed · {prop.bathrooms} Bath
                    </td>
                  ))}
                </tr>

                {/* Carpet Area */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Carpet Living Area</td>
                  {properties.map((prop) => {
                    const isLargest = prop.id === largestAreaProp.id;
                    return (
                      <td key={prop.id} className="p-3 text-text-primary font-medium">
                        {prop.carpetArea} sq ft
                        {isLargest && (
                          <span className="block text-[10px] text-purple-700 font-bold">
                            Largest volume
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Furnishing */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Furnishing</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3 text-text-primary">
                      {prop.furnishing}
                    </td>
                  ))}
                </tr>

                {/* Office Commute */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Commute to Office</td>
                  {properties.map((prop) => {
                    const isFastest = prop.id === shortestCommuteProp.id;
                    return (
                      <td key={prop.id} className="p-3 text-text-primary">
                        {prop.distances.officeMinutes} mins
                        {isFastest && (
                          <span className="block text-[10px] text-blue-700 font-bold">
                            Shortest commute
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Metro Proximity */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Metro Proximity</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3 text-text-primary">
                      {prop.distances.metroMinutes} mins
                    </td>
                  ))}
                </tr>

                {/* Inspection Quality Score */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Physical Audit Score</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3 text-text-primary font-bold">
                      <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" />
                        <span>{prop.transparencyDetails.inspectionScore}/100</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Maintenance SLA */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Historical Maintenance</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3 text-text-muted">
                      {prop.transparencyDetails.maintenanceTicketsPastYear} tkts/yr ({prop.transparencyDetails.avgResolutionHours}h resolution)
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-3 font-semibold text-text-secondary">Action</td>
                  {properties.map((prop) => (
                    <td key={prop.id} className="p-3">
                      <button
                        onClick={() => {
                          onViewDetails(prop);
                          onClose();
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors"
                      >
                        View Space
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};
