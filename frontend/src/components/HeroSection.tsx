import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Home, 
  Sparkles, 
  CheckCircle2, 
  Shield, 
  FileCheck, 
  Wrench,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

import { useNestMate } from '../context/NestMateContext';

interface HeroSectionProps {
  onSearch: (params: { location: string; moveIn: string; budget: string; type: string }) => void;
  onOpenRoommates: () => void;
  onOpenLeaseLens: () => void;
  onOpenAISearch: () => void;
  onOpenMyHome?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenRoommates,
  onOpenLeaseLens,
  onOpenAISearch,
  onOpenMyHome
}) => {
  const { user, userRole, rentPaid, maintenanceTickets } = useNestMate();

  const [location, setLocation] = useState('All Ahmedabad');
  const [moveIn, setMoveIn] = useState('Immediate / 1st Next Month');
  const [budget, setBudget] = useState('Under ₹25,000');
  const [propertyType, setPropertyType] = useState('All Types');
  const [quickSearchInput, setQuickSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ 
      location: quickSearchInput || location, 
      moveIn, 
      budget, 
      type: propertyType 
    });
  };

  const handleQuickPillClick = (cityName: string) => {
    setQuickSearchInput(cityName);
    setLocation(cityName);
    onSearch({ location: cityName, moveIn, budget, type: propertyType });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 border-b border-border/70">
      {/* Subtle architectural grid pattern background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#171A18 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Subtle organic ambient gradient blur */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        {/* Section 9: Personal Greeting when logged in */}
        {user.fullName && (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-surface border border-border shadow-subtle animate-in fade-in duration-300">
            <span className="text-xs font-black text-text-primary">
              Good morning, {user.fullName.split(' ')[0]} 👋
            </span>
            <span className="text-text-muted text-xs">·</span>
            <span className="text-xs font-bold text-primary">
              {userRole === 'tenant' ? 'Tenant Explorer' : 'Property Owner View'}
            </span>
          </div>
        )}

        {/* If tenant has an active home, show Section 9 My Home status bar */}
        {userRole === 'tenant' && (
          <div className="max-w-3xl mx-auto bg-surface/90 backdrop-blur-md p-3.5 rounded-2xl border border-primary/20 shadow-subtle flex flex-wrap items-center justify-between gap-3 text-xs text-left">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-text-primary block">My Home: The Solitaire Terraces (Flat 402)</span>
                <span className="text-[11px] text-text-muted">Vastrapur, Ahmedabad</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <span className="text-[10px] text-text-muted block">Rent Status</span>
                <span className={`font-black ${rentPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {rentPaid ? '✓ Paid' : '₹24,000 (Due in 5d)'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Maintenance</span>
                <span className="font-black text-primary">
                  {maintenanceTickets.filter(t => t.status !== 'Resolved').length > 0 ? '1 In Progress' : 'All Clear'}
                </span>
              </div>
              {onOpenMyHome && (
                <button
                  type="button"
                  onClick={onOpenMyHome}
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  Dashboard →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Large Editorial Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-[1.12] max-w-4xl mx-auto text-balance">
          Where do you want to <span className="text-primary underline decoration-secondary/60 decoration-wavy decoration-2 underline-offset-8">live</span>?
        </h1>

        {/* Supporting Editorial Copy */}
        <p className="text-xs sm:text-base text-text-secondary max-w-2xl mx-auto font-normal text-balance">
          Discover verified spaces, understand the real cost, find compatible roommates, and manage your home from one transparent place.
        </p>

        {/* Quick Search City / Landmark Pills (Section 9) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider mr-1">Popular:</span>
          {['Ahmedabad', 'Vastrapur', 'Navrangpura', 'Gandhinagar', 'GIFT City', 'Vadodara'].map((cityPill) => (
            <button
              key={cityPill}
              type="button"
              onClick={() => handleQuickPillClick(cityPill)}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border hover:border-primary hover:text-primary transition-all shadow-subtle"
            >
              {cityPill}
            </button>
          ))}
        </div>

        {/* Interactive Search Console */}
        <div className="max-w-4xl mx-auto bg-surface rounded-2xl shadow-elevated border border-border p-3 sm:p-4 text-left transition-all hover:border-primary/30">
          
          <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-border/60">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Where do you want to live?
            </span>

            {/* AI Natural Language Prompt Link */}
            <button
              type="button"
              onClick={onOpenAISearch}
              className="text-xs font-medium text-primary hover:text-primary-hover flex items-center space-x-1.5 group bg-primary-light px-2.5 py-1 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary group-hover:rotate-12 transition-transform" />
              <span>Try AI Natural Search</span>
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            
            {/* Location Selector */}
            <div className="p-2.5 rounded-xl bg-surfaceMuted/60 hover:bg-surfaceMuted transition-colors border border-border/40">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="All Ahmedabad">All Ahmedabad & GIFT</option>
                <option value="Vastrapur">Vastrapur (Near Lake & IIM-A)</option>
                <option value="Bodakdev">Bodakdev (Boulevard)</option>
                <option value="SG Highway">SG Highway Tech Corridor</option>
                <option value="Prahlad Nagar">Prahlad Nagar</option>
                <option value="Navrangpura">Navrangpura (Colleges & Metro)</option>
                <option value="Shela">Shela / South Bopal</option>
                <option value="GIFT City Corridor">GIFT City Corridor</option>
              </select>
            </div>

            {/* Move-in Date */}
            <div className="p-2.5 rounded-xl bg-surfaceMuted/60 hover:bg-surfaceMuted transition-colors border border-border/40">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Move-in Date
              </label>
              <select
                value={moveIn}
                onChange={(e) => setMoveIn(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="Immediate / 1st Next Month">Immediate / 1st Next Month</option>
                <option value="Within 2 Weeks">Within 2 Weeks</option>
                <option value="Next Month (1st onwards)">Next Month (1st onwards)</option>
                <option value="Flexible (Exploring)">Flexible (Exploring)</option>
              </select>
            </div>

            {/* Budget */}
            <div className="p-2.5 rounded-xl bg-surfaceMuted/60 hover:bg-surfaceMuted transition-colors border border-border/40">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Target Monthly Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="Under ₹20,000">Under ₹20,000 / mo</option>
                <option value="Under ₹25,000">Under ₹25,000 / mo</option>
                <option value="₹25,000 - ₹35,000">₹25,000 - ₹35,000 / mo</option>
                <option value="₹35,000+">₹35,000+ (Executive)</option>
                <option value="Any Budget">Any Budget</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="p-2.5 rounded-xl bg-surfaceMuted/60 hover:bg-surfaceMuted transition-colors border border-border/40">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none cursor-pointer"
              >
                <option value="All Types">All Types</option>
                <option value="1 BHK">1 BHK Apartment</option>
                <option value="2 BHK">2 BHK Apartment</option>
                <option value="3 BHK">3 BHK Luxury</option>
                <option value="Studio">Private Studio Pod</option>
                <option value="Co-living Suite">Co-Living Private Suite</option>
              </select>
            </div>

            {/* Submit & Secondary CTAs */}
            <div className="sm:col-span-2 lg:col-span-4 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Includes all estimated utilities & maintenance</span>
              </div>

              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOpenRoommates}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-text-primary bg-surfaceMuted hover:bg-border transition-colors border border-border"
                >
                  Find my match
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-card hover:shadow-elevated transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Explore spaces</span>
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Small Trust Strip */}
        <div className="mt-10 pt-8 border-t border-border/70 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-xs font-medium text-text-secondary">
                Verified listings (48-pt audit)
              </span>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <IndianRupee className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-xs font-medium text-text-secondary">
                Transparent TrueCost™
              </span>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <FileCheck className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-xs font-medium text-text-secondary">
                Secure LeaseLens agreements
              </span>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <Wrench className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-xs font-medium text-text-secondary">
                Real maintenance tracking
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
