import React, { useState } from 'react';
import { 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  MapPin, 
  Star, 
  Scale, 
  ArrowRight,
  Sparkles,
  Train,
  Briefcase,
  ShoppingCart,
  GraduationCap
} from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isHovered: boolean;
  isSelected: boolean;
  isSaved: boolean;
  isInCompare: boolean;
  onHover: (id: string | null) => void;
  onClick: (property: Property) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onToggleCompare: (property: Property, e: React.MouseEvent) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isHovered,
  isSelected,
  isSaved,
  isInCompare,
  onHover,
  onClick,
  onToggleSave,
  onToggleCompare
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <article
      onMouseEnter={() => onHover(property.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(property)}
      className={`group relative bg-surface rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-elevated -translate-y-1'
          : isHovered
            ? 'border-primary/50 shadow-card -translate-y-0.5'
            : 'border-border shadow-subtle hover:border-border-dark'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surfaceMuted">
        <img
          src={property.images[activeImageIndex] || property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Subtle Dark Gradient Overlay on Top for badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Controls */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          
          {/* Verified Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-text-primary text-[11px] font-bold shadow-subtle border border-white/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-success fill-success/10" />
            <span>Verified 48-Pt</span>
          </div>

          {/* Action Icons: Compare & Heart */}
          <div className="flex items-center space-x-1.5">
            {/* Compare Checkbox Button */}
            <button
              type="button"
              onClick={(e) => onToggleCompare(property, e)}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isInCompare
                  ? 'bg-primary text-white shadow-subtle'
                  : 'bg-surface/80 text-text-primary hover:bg-surface border border-white/40'
              }`}
              title={isInCompare ? 'Remove from compare' : 'Compare property'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Save / Wishlist Heart */}
            <button
              type="button"
              onClick={(e) => onToggleSave(property.id, e)}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 shadow-subtle'
                  : 'bg-surface/80 text-text-secondary hover:text-rose-500 hover:bg-surface border border-white/40'
              }`}
              title={isSaved ? 'Saved to favorites' : 'Save property'}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1 z-10">
            {property.images.slice(0, 4).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom Tag on Image: Property Specs */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[11px] font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">
            {property.propertyType} · {property.furnishing}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 space-y-3">
        
        {/* Title, Neighborhood & Rating */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center space-x-1.5 text-xs text-text-muted mt-0.5">
              <MapPin className="w-3 h-3 text-text-muted" />
              <span>{property.neighborhood}, {property.city}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-surfaceMuted border border-border text-xs font-bold text-text-primary">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{property.rating}</span>
            <span className="text-[10px] text-text-muted font-normal">({property.reviewsCount})</span>
          </div>
        </div>

        {/* Specifications */}
        <div className="text-xs font-semibold text-text-secondary flex items-center space-x-2">
          <span>{property.bedrooms} Bed</span>
          <span>·</span>
          <span>{property.bathrooms} Bath</span>
          <span>·</span>
          <span>{property.carpetArea} sq ft carpet</span>
        </div>

        {/* TrueCost Breakdown Box */}
        <div className="p-2.5 rounded-xl bg-[#F4F6F3] border border-border/80 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-text-muted">Monthly Base Rent</span>
            <span className="text-sm font-bold text-text-primary tabular-nums">
              {formatCurrency(property.baseRent)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span>Deposit: {formatCurrency(property.deposit)}</span>
            <span>~{formatCurrency(property.utilitiesEstimate)} utilities</span>
          </div>

          {/* Prominent Estimated Monthly Total */}
          <div className="pt-1 border-t border-border/70 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-secondary" />
              <span>Estimated monthly cost:</span>
            </span>
            <span className="text-sm font-extrabold text-primary tabular-nums">
              {formatCurrency(property.totalEstimatedMonthly)}
            </span>
          </div>
        </div>

        {/* Commute Indicators */}
        <div className="grid grid-cols-3 gap-1 text-[11px] font-medium text-text-secondary pt-0.5">
          <div className="flex items-center space-x-1" title="Commute to tech park / office">
            <Briefcase className="w-3 h-3 text-text-muted flex-shrink-0" />
            <span className="truncate">{property.distances.officeMinutes}m office</span>
          </div>

          <div className="flex items-center space-x-1" title="Distance to metro station">
            <Train className="w-3 h-3 text-text-muted flex-shrink-0" />
            <span className="truncate">{property.distances.metroMinutes}m metro</span>
          </div>

          <div className="flex items-center space-x-1" title="Distance to fresh grocery & mart">
            <ShoppingCart className="w-3 h-3 text-text-muted flex-shrink-0" />
            <span className="truncate">{property.distances.groceryMinutes}m mart</span>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {property.verifiedOwner && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Owner
            </span>
          )}
          {property.recentlyInspected && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              Recently Inspected
            </span>
          )}
          {property.fastResponse && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Fast Response
            </span>
          )}
        </div>

      </div>
    </article>
  );
};
