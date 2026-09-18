import React, { useState } from 'react';
import { 
  X, 
  Filter, 
  RotateCcw, 
  Check, 
  SlidersHorizontal,
  IndianRupee,
  Clock,
  Car,
  Wifi,
  Zap,
  Wind,
  Shirt,
  Briefcase,
  Utensils,
  PawPrint,
  GraduationCap
} from 'lucide-react';

export interface FilterState {
  budgetMax: number;
  propertyTypes: string[];
  bedrooms: number[];
  furnishing: string[];
  depositMax: number;
  moveInDate: string;
  petFriendly: boolean;
  parking: boolean;
  wifi: boolean;
  powerBackup: boolean;
  ac: boolean;
  laundry: boolean;
  workspace: boolean;
  foodIncluded: boolean;
  genderPreference: string;
  maxCommuteWorkplace: number;
  maxCommuteUniversity: number;
}

export const DEFAULT_FILTERS: FilterState = {
  budgetMax: 50000,
  propertyTypes: [],
  bedrooms: [],
  furnishing: [],
  depositMax: 100000,
  moveInDate: 'any',
  petFriendly: false,
  parking: false,
  wifi: false,
  powerBackup: false,
  ac: false,
  laundry: false,
  workspace: false,
  foodIncluded: false,
  genderPreference: 'any',
  maxCommuteWorkplace: 45,
  maxCommuteUniversity: 45,
};

interface SmartSearchFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  activeCount: number;
}

export const SmartSearchFilterDrawer: React.FC<SmartSearchFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
  activeCount
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  if (!isOpen) return null;

  const toggleArrayItem = <T,>(arr: T[], item: T) => {
    return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(DEFAULT_FILTERS);
    onResetFilters();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      
      {/* Slide-over Container */}
      <div className="w-full max-w-md bg-surface h-full shadow-dropdown flex flex-col animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-base text-text-primary">Smart Filters</h3>
            {activeCount > 0 && (
              <span className="text-xs bg-primary text-white font-bold px-2 py-0.5 rounded-full">
                {activeCount} active
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Monthly Budget Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Max Monthly Budget
              </label>
              <span className="text-sm font-extrabold text-primary tabular-nums">
                ₹{localFilters.budgetMax.toLocaleString('en-IN')} / mo
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="60000"
              step="2000"
              value={localFilters.budgetMax}
              onChange={(e) => setLocalFilters({ ...localFilters, budgetMax: Number(e.target.value) })}
              className="w-full accent-primary h-1.5 bg-surfaceMuted rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-1 font-semibold">
              <span>₹10,000</span>
              <span>₹35,000</span>
              <span>₹60,000+</span>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5">
              Property Configuration
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['1 BHK', '2 BHK', '3 BHK', 'Studio', 'Co-living Suite'].map((type) => {
                const isSelected = localFilters.propertyTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLocalFilters({
                      ...localFilters,
                      propertyTypes: toggleArrayItem(localFilters.propertyTypes, type)
                    })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-subtle'
                        : 'bg-surfaceMuted/50 text-text-secondary border-border hover:bg-surfaceMuted'
                    }`}
                  >
                    <span>{type}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Furnishing Status */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5">
              Furnishing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Fully Furnished', 'Semi-Furnished', 'Unfurnished'].map((opt) => {
                const isSelected = localFilters.furnishing.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLocalFilters({
                      ...localFilters,
                      furnishing: toggleArrayItem(localFilters.furnishing, opt)
                    })}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-subtle'
                        : 'bg-surfaceMuted/50 text-text-secondary border-border hover:bg-surfaceMuted'
                    }`}
                  >
                    {opt.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commute Limits */}
          <div className="space-y-3 p-3.5 rounded-xl bg-surfaceMuted/50 border border-border">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Commute Time Tolerances
            </span>

            {/* University Commute */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-text-secondary mb-1">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <span>Max to University / College</span>
                </span>
                <span className="text-primary font-bold">{localFilters.maxCommuteUniversity} mins</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="5"
                value={localFilters.maxCommuteUniversity}
                onChange={(e) => setLocalFilters({ ...localFilters, maxCommuteUniversity: Number(e.target.value) })}
                className="w-full accent-primary h-1 bg-border rounded-lg cursor-pointer"
              />
            </div>

            {/* Workplace Commute */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-text-secondary mb-1">
                <span className="flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Max to Tech Park / Office</span>
                </span>
                <span className="text-primary font-bold">{localFilters.maxCommuteWorkplace} mins</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="5"
                value={localFilters.maxCommuteWorkplace}
                onChange={(e) => setLocalFilters({ ...localFilters, maxCommuteWorkplace: Number(e.target.value) })}
                className="w-full accent-primary h-1 bg-border rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Lifestyle & Amenities Toggles */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2.5">
              Essential Amenities & Living Policies
            </label>
            <div className="grid grid-cols-2 gap-2">
              
              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, parking: !localFilters.parking })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.parking ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Dedicated Parking</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, wifi: !localFilters.wifi })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.wifi ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                <span>High-speed Wi-Fi</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, powerBackup: !localFilters.powerBackup })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.powerBackup ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>100% Power Backup</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, ac: !localFilters.ac })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.ac ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Air Conditioning</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, laundry: !localFilters.laundry })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.laundry ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>In-unit Laundry</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, workspace: !localFilters.workspace })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.workspace ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Dedicated Desk</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, petFriendly: !localFilters.petFriendly })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.petFriendly ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <PawPrint className="w-3.5 h-3.5" />
                <span>Pet Friendly</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalFilters({ ...localFilters, foodIncluded: !localFilters.foodIncluded })}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  localFilters.foodIncluded ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Food / Mess Option</span>
              </button>

            </div>
          </div>

          {/* Gender Preference for Shared Living */}
          <div>
            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
              Gender Preference (Shared Living)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'No Preference' },
                { id: 'female', label: 'Female Only' },
                { id: 'male', label: 'Male Only' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, genderPreference: item.id })}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    localFilters.genderPreference === item.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border flex items-center justify-between gap-3 bg-surface">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-card transition-all text-center"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};
