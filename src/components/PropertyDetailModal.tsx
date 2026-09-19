import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Star, 
  Sparkles, 
  IndianRupee, 
  Calendar, 
  Train, 
  Briefcase, 
  ShoppingCart, 
  GraduationCap,
  FileText,
  Wrench,
  Heart,
  Share2,
  Clock,
  ChevronRight,
  Info,
  Check,
  Building,
  Layers,
  Camera,
  PlaySquare,
  Compass
} from 'lucide-react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onAskNoraAboutProperty: (property: Property) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenAffordabilityCalculator?: (property: Property) => void;
  onToggleCompare?: (property: Property) => void;
  isInCompare?: boolean;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onAskNoraAboutProperty,
  isSaved,
  onToggleSave,
  onOpenAffordabilityCalculator,
  onToggleCompare,
  isInCompare = false
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video' | 'floorplan' | 'map'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [bookVisitSuccess, setBookVisitSuccess] = useState(false);

  if (!property) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleBookVisit = () => {
    setBookVisitSuccess(true);
    setTimeout(() => setBookVisitSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-5xl bg-surface rounded-2xl shadow-elevated border border-border overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Sticky Top Action Bar */}
        <div className="p-4 border-b border-border bg-surface/95 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded-md">
              {property.propertyType} · {property.furnishing}
            </span>
            {property.verified && (
              <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>48-Pt Physical Audit Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Heart Save */}
            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
              }`}
              title="Save to favorites"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Ask NORA */}
            <button
              onClick={() => onAskNoraAboutProperty(property)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-primary-light text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask NORA</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Header Info */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  {property.title}
                </h1>
                <p className="text-sm text-text-secondary mt-1 max-w-2xl">
                  {property.tagline}
                </p>
                <div className="flex items-center space-x-3 text-xs text-text-muted mt-2">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{property.neighborhood}, {property.city}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1 font-semibold text-text-primary">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>{property.rating} ({property.reviewsCount} verified reviews)</span>
                  </span>
                </div>
              </div>

              {/* Price Callout */}
              <div className="bg-[#F3F5F2] border border-border p-3.5 rounded-2xl text-left md:text-right min-w-[200px]">
                <span className="text-xs text-text-muted font-semibold block">Monthly Base Rent</span>
                <span className="text-2xl font-black text-text-primary tabular-nums">
                  {formatCurrency(property.baseRent)}
                </span>
                <span className="text-[11px] text-text-muted font-medium block">
                  + ~₹{property.utilitiesEstimate} util & maint
                </span>
              </div>
            </div>
          </div>

          {/* Media Showcase: Photos, 3D Tour, Floor Plan, Transit Map */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-border pb-2">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMediaTab === 'photos'
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-surfaceMuted'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photos ({property.images.length})</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('video')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMediaTab === 'video'
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-surfaceMuted'
                }`}
              >
                <PlaySquare className="w-3.5 h-3.5" />
                <span>360° Virtual Walkthrough</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('floorplan')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeMediaTab === 'floorplan'
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-surfaceMuted'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Floor Plan Layout</span>
              </button>
            </div>

            {/* Media Content Display */}
            {activeMediaTab === 'photos' && (
              <div>
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surfaceMuted border border-border relative">
                  <img
                    src={property.images[selectedPhotoIndex] || property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {selectedPhotoIndex + 1} of {property.images.length}
                  </div>
                </div>

                {/* Thumbnails row */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhotoIndex === idx ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMediaTab === 'video' && (
              <div className="aspect-[16/9] w-full rounded-2xl bg-zinc-900 flex flex-col items-center justify-center text-white p-6 text-center relative overflow-hidden border border-border">
                <img 
                  src={property.images[0]} 
                  alt="bg" 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" 
                />
                <div className="relative z-10 max-w-md space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center mx-auto text-white shadow-elevated">
                    <PlaySquare className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-base text-white">Interactive 3D Spatial Walkthrough</h4>
                  <p className="text-xs text-zinc-300">
                    High-definition LiDAR scanned interior for {property.title}. Explore every room, measure dimensions, and examine sunlight orientation.
                  </p>
                  <span className="inline-block text-[11px] bg-white/20 px-3 py-1 rounded-full text-emerald-300 font-semibold">
                    ✓ Verified Unedited Walkthrough
                  </span>
                </div>
              </div>
            )}

            {activeMediaTab === 'floorplan' && (
              <div className="aspect-[16/9] w-full rounded-2xl bg-[#F4F6F3] border border-border p-6 flex flex-col items-center justify-center text-center">
                <img
                  src={property.floorPlanUrl || property.images[0]}
                  alt="Floor Plan Schematic"
                  className="max-h-80 object-contain rounded-xl shadow-subtle border border-border"
                />
                <div className="mt-3 text-xs font-semibold text-text-secondary">
                  Architectural Schematic · Carpet Area: {property.carpetArea} sq ft · {property.bedrooms} Bedrooms · {property.bathrooms} Baths
                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              TRUE COST BREAKDOWN - HIGHLIGHTED FINTECH SECTION
              ================================================== */}
          <section className="bg-gradient-to-br from-[#F5F8F6] to-[#EEF3F0] rounded-2xl border-2 border-primary/30 p-5 sm:p-7 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <h2 className="text-lg font-black text-text-primary tracking-tight">
                    TRUE COST BREAKDOWN™
                  </h2>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Eliminating hidden-cost anxiety. Full transparency into recurring monthly living expenses and one-time move-in costs.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg self-start">
                Zero Brokerage Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              
              {/* Monthly Running Costs Table */}
              <div className="bg-surface rounded-xl p-4 border border-border space-y-3">
                <div className="text-xs font-bold text-text-primary uppercase tracking-wider pb-2 border-b border-border flex items-center justify-between">
                  <span>Recurring Monthly Living Costs</span>
                  <span className="text-[10px] text-text-muted font-normal">Paid Monthly</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-text-secondary">
                    <span>Monthly Base Rent</span>
                    <span className="font-bold text-text-primary tabular-nums">{formatCurrency(property.baseRent)}</span>
                  </div>

                  <div className="flex justify-between items-center text-text-secondary">
                    <span>Estimated Utilities (Torrent Power + Gas + Water)</span>
                    <span className="font-bold text-text-primary tabular-nums">~{formatCurrency(property.utilitiesEstimate)}</span>
                  </div>

                  <div className="flex justify-between items-center text-text-secondary">
                    <span>Society Maintenance & Common Upkeep</span>
                    <span className="font-bold text-text-primary tabular-nums">{formatCurrency(property.maintenanceMonthly)}</span>
                  </div>

                  <div className="flex justify-between items-center text-text-secondary">
                    <span>High-Speed Fiber Internet (300 Mbps)</span>
                    <span className="font-bold text-text-primary tabular-nums">{formatCurrency(property.internetMonthly)}</span>
                  </div>
                </div>

                {/* Big Monthly Total */}
                <div className="pt-3 border-t-2 border-primary/20 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-primary block">
                      Estimated Monthly Living Cost
                    </span>
                    <span className="text-[10px] text-text-muted">All essential expenses included</span>
                  </div>
                  <span className="text-xl font-black text-primary tabular-nums">
                    {formatCurrency(property.totalEstimatedMonthly)}
                  </span>
                </div>
              </div>

              {/* One-Time Move-In Capital Table */}
              <div className="bg-surface rounded-xl p-4 border border-border space-y-3 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-text-primary uppercase tracking-wider pb-2 border-b border-border flex items-center justify-between">
                    <span>One-Time Capital Outlay</span>
                    <span className="text-[10px] text-text-muted font-normal">Due on Move-In</span>
                  </div>

                  <div className="space-y-2 text-xs mt-3">
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Refundable Security Deposit (2 months)</span>
                      <span className="font-bold text-text-primary tabular-nums">{formatCurrency(property.deposit)}</span>
                    </div>

                    <div className="flex justify-between items-center text-text-secondary">
                      <span>First Month Living Cost Advance</span>
                      <span className="font-bold text-text-primary tabular-nums">{formatCurrency(property.totalEstimatedMonthly)}</span>
                    </div>

                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Stamp Duty & LeaseLens Digital Registration</span>
                      <span className="font-bold text-text-primary tabular-nums">₹600</span>
                    </div>

                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Brokerage / Agent Commission</span>
                      <span className="font-extrabold text-success">₹0 (Zero)</span>
                    </div>
                  </div>
                </div>

                {/* Big Total Move-In Cost */}
                <div className="pt-3 border-t-2 border-border flex items-center justify-between bg-surfaceMuted/40 p-2.5 rounded-lg mt-2">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      Total Move-In Cost
                    </span>
                    <span className="text-[10px] text-text-muted">No surprise gate fees</span>
                  </div>
                  <span className="text-xl font-black text-text-primary tabular-nums">
                    {formatCurrency(property.moveInTotalCost)}
                  </span>
                </div>
              </div>

            </div>

            {/* True Cost Primary CTAs (Section 12 & 13) */}
            <div className="mt-5 pt-4 border-t border-primary/20 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAffordabilityCalculator) onOpenAffordabilityCalculator(property);
                }}
                className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-black shadow-card transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Can I actually afford this?</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2">
                {onToggleCompare && (
                  <button
                    type="button"
                    onClick={() => onToggleCompare(property)}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      isInCompare
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface border-border text-text-primary hover:bg-surfaceMuted'
                    }`}
                  >
                    <span>{isInCompare ? '✓ In Compare' : '+ Compare'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onToggleSave(property.id)}
                  className="px-3.5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surfaceMuted text-xs font-bold text-text-primary flex items-center space-x-1.5 transition-all"
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onAskNoraAboutProperty(property)}
                  className="px-3.5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surfaceMuted text-xs font-bold text-text-primary flex items-center space-x-1.5 transition-all"
                >
                  <Building className="w-3.5 h-3.5 text-primary" />
                  <span>Contact Landlord</span>
                </button>
              </div>
            </div>
          </section>

          {/* ==================================================
              PROPERTY TRANSPARENCY PANEL - "KNOW BEFORE YOU MOVE" (Section 14)
              ================================================== */}
          <section className="bg-surface rounded-2xl border border-border p-5 sm:p-7 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-text-primary">
                    KNOW BEFORE YOU MOVE
                  </h2>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Full transparency disclosure based on physical audit and recorded tenancy history.
                </p>
              </div>

              {/* Visibly Labeled Demo Data Tag (Section 14) */}
              <span className="text-[11px] font-bold text-text-muted bg-surfaceMuted border border-border px-2.5 py-1 rounded-md self-start">
                Demo data · Sample verified profile
              </span>
            </div>

            {/* 6 Transparency Verification Checks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">Owner KYC Verified</span>
                  <span className="text-[11px] text-text-muted">Aadhaar & Land Title deed verified</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">Property Physical Audit</span>
                  <span className="text-[11px] text-text-muted">Score: {property.transparencyDetails.inspectionScore}/100</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">Photos Geotagged</span>
                  <span className="text-[11px] text-text-muted">100% authentic unedited lenses</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">Rent Stability History</span>
                  <span className="text-[11px] text-text-muted">{property.transparencyDetails.historicalRentStability}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">Maintenance Record</span>
                  <span className="text-[11px] text-text-muted">{property.transparencyDetails.maintenanceTicketsPastYear} tickets/yr · {property.transparencyDetails.avgResolutionHours}h avg fix</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">Standard Agreement</span>
                  <span className="text-[11px] text-text-muted">Pre-screened on LeaseLens</span>
                </div>
              </div>

            </div>

            {/* Inspection Breakdown Progress Bars */}
            <div className="p-4 rounded-xl bg-[#F7F9F7] border border-border/80">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-3">
                48-Point Physical Inspection Breakdown (Conducted {property.transparencyDetails.inspectionDate})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text-secondary">Electrical Load</span>
                    <span className="text-primary font-bold">{property.transparencyDetails.inspectionChecks.electrical}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${property.transparencyDetails.inspectionChecks.electrical}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text-secondary">Plumbing & Drains</span>
                    <span className="text-primary font-bold">{property.transparencyDetails.inspectionChecks.plumbing}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${property.transparencyDetails.inspectionChecks.plumbing}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text-secondary">Structural Integrity</span>
                    <span className="text-primary font-bold">{property.transparencyDetails.inspectionChecks.structural}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${property.transparencyDetails.inspectionChecks.structural}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-text-secondary">Safety & Locks</span>
                    <span className="text-primary font-bold">{property.transparencyDetails.inspectionChecks.safety}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${property.transparencyDetails.inspectionChecks.safety}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency Timeline */}
            <div>
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-3">
                Property Transparency Timeline
              </span>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {property.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      item.status === 'completed' ? 'bg-success' : item.status === 'current' ? 'bg-primary animate-pulse ring-2 ring-primary/30' : 'bg-border'
                    }`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                      <span className="font-bold text-text-primary">{item.event}</span>
                      <span className="text-[11px] text-text-muted">{item.date}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5">{item.notes}</p>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* Commute Indicators */}
          <section className="bg-surface rounded-2xl border border-border p-5 shadow-subtle space-y-3">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Transit & Daily Commute Proximity
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-center space-x-2.5">
                <Briefcase className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">{property.distances.officeMinutes} mins</span>
                  <span className="text-[10px] text-text-muted">To Tech Park / Office</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-center space-x-2.5">
                <Train className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">{property.distances.metroMinutes} mins</span>
                  <span className="text-[10px] text-text-muted">To Metro Station</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-center space-x-2.5">
                <ShoppingCart className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">{property.distances.groceryMinutes} mins</span>
                  <span className="text-[10px] text-text-muted">To Grocery / Supermarket</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border flex items-center space-x-2.5">
                <GraduationCap className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">{property.distances.universityMinutes} mins</span>
                  <span className="text-[10px] text-text-muted">To University Hub</span>
                </div>
              </div>
            </div>
          </section>

          {/* Amenities Grid */}
          <section className="bg-surface rounded-2xl border border-border p-5 shadow-subtle space-y-3">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Amenities & Household Inclusions
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {property.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-text-secondary p-2 rounded-lg bg-surfaceMuted/30">
                  <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Bottom Booking Bar */}
        <div className="p-4 border-t border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-text-muted block">TrueCost™ Monthly Living</span>
            <span className="text-xl font-extrabold text-primary tabular-nums">
              {formatCurrency(property.totalEstimatedMonthly)}
              <span className="text-xs font-normal text-text-muted"> / mo total</span>
            </span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            {onOpenAffordabilityCalculator && (
              <button
                type="button"
                onClick={() => onOpenAffordabilityCalculator(property)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary-light text-primary border border-primary/30 text-xs font-extrabold hover:bg-primary hover:text-white transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span>Can I afford this?</span>
              </button>
            )}

            <button
              onClick={() => onAskNoraAboutProperty(property)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-border text-xs font-bold text-text-primary hover:bg-surfaceMuted transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Ask NORA</span>
            </button>

            <button
              onClick={handleBookVisit}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-card transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Verified Visit</span>
            </button>
          </div>
        </div>

        {/* Booking Confirmation Toast */}
        {bookVisitSuccess && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-text-primary text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-dropdown flex items-center space-x-2 animate-in fade-in duration-200 z-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified visit request sent to {property.transparencyDetails.ownerName}! Lockbox code will be issued.</span>
          </div>
        )}

      </div>
    </div>
  );
};
