import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Users, 
  FileText, 
  LayoutDashboard, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal, 
  List, 
  Map as MapIcon, 
  RotateCcw,
  CheckCircle2,
  Scale,
  Wrench,
  Calculator,
  Loader2
} from 'lucide-react';
import { Property, UserRole, NotificationItem, RoommateProfile } from './types';
import { MOCK_NOTIFICATIONS } from './data/mockData';
import { useProperties } from './hooks/useProperties';

// Layout & Navigation
import { Navbar as PortalNavbar } from './components/PortalNavbar';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';

// Explore & Listings Components
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { AISmartSearchBar } from './components/AISmartSearchBar';
import { SmartSearchFilterDrawer, FilterState, DEFAULT_FILTERS } from './components/SmartSearchFilterDrawer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';

// AI Engines & Core Pillars
import { FairLeaseGuard } from './components/FairLeaseGuard';
import { LeaseLens } from './components/LeaseLens';
import { RoommateMatching } from './components/RoommateMatching';
import { SnapFixTriage } from './components/SnapFixTriage';
import { TrueCostCalculator } from './components/TrueCostCalculator';

// Dashboards & Portals
import { Dashboard as SupabaseLiveDashboard } from './components/Dashboard';
import { TenantDashboard } from './components/TenantDashboard';
import { LandlordDashboard } from './components/LandlordDashboard';
import { PropertyManagerDashboard } from './components/PropertyManagerDashboard';
import { TrustCenter } from './components/TrustCenter';
import { AIAssistantModal } from './components/AIAssistantModal';

export const App: React.FC = () => {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('explore');
  const [userRole, setUserRole] = useState<UserRole>('tenant');
  const [leaseGuardSubTab, setLeaseGuardSubTab] = useState<'analyzer' | 'benchmarks'>('analyzer');

  // Supabase Properties Hook
  const { properties, loading: propertiesLoading } = useProperties();
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-1']);
  const [compareProperties, setCompareProperties] = useState<Property[]>([]);
  
  // Interactive Hover & Selection
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Modals & Drawers
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchLocation, setSearchLocation] = useState<string>('All Ahmedabad');
  const [sortBy, setSortBy] = useState<'recommended' | 'trueCostAsc' | 'priceAsc' | 'inspectionDesc'>('recommended');

  // Mobile Map/List View Toggle
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list');

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  // Toggle Save / Wishlist
  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedPropertyIds.includes(id)) {
      setSavedPropertyIds(savedPropertyIds.filter(item => item !== id));
    } else {
      setSavedPropertyIds([...savedPropertyIds, id]);
    }
  };

  // Toggle Compare (Max 3)
  const handleToggleCompare = (property: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = compareProperties.some(p => p.id === property.id);
    if (exists) {
      setCompareProperties(compareProperties.filter(p => p.id !== property.id));
    } else {
      if (compareProperties.length < 3) {
        setCompareProperties([...compareProperties, property]);
      } else {
        alert('You can compare up to 3 properties at a time.');
      }
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Filter application from Hero
  const handleHeroSearch = (params: { location: string; moveIn: string; budget: string; type: string }) => {
    setSearchLocation(params.location);
    if (params.budget === 'Under ₹20,000') {
      setFilters(prev => ({ ...prev, budgetMax: 20000 }));
    } else if (params.budget === 'Under ₹25,000') {
      setFilters(prev => ({ ...prev, budgetMax: 25000 }));
    } else if (params.budget === '₹25,000 - ₹35,000') {
      setFilters(prev => ({ ...prev, budgetMax: 35000 }));
    }

    if (params.type !== 'All Types') {
      setFilters(prev => ({ ...prev, propertyTypes: [params.type] }));
    }

    const element = document.getElementById('explore-listings');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Natural Language AI Filter Parser
  const handleApplyAITokens = (tokens: Array<{ category: string; value: string }>) => {
    const newFilters = { ...DEFAULT_FILTERS };

    tokens.forEach(t => {
      if (t.category === 'Budget') {
        if (t.value.includes('20,000')) newFilters.budgetMax = 20000;
        if (t.value.includes('25,000')) newFilters.budgetMax = 25000;
        if (t.value.includes('18,000')) newFilters.budgetMax = 18000;
      }
      if (t.category === 'Type') {
        if (t.value.includes('1 BHK')) newFilters.propertyTypes.push('1 BHK');
        if (t.value.includes('2 BHK')) newFilters.propertyTypes.push('2 BHK');
        if (t.value.includes('Studio')) newFilters.propertyTypes.push('Studio', 'Co-living Suite');
      }
      if (t.category === 'Furnishing') {
        newFilters.furnishing.push('Fully Furnished');
      }
      if (t.category === 'Commute') {
        newFilters.maxCommuteUniversity = 20;
      }
      if (t.category === 'Amenity') {
        if (t.value.includes('Parking')) newFilters.parking = true;
        if (t.value.includes('Power Backup')) newFilters.powerBackup = true;
      }
    });

    setFilters(newFilters);
  };

  // Filtered & Sorted Properties List
  const filteredProperties = useMemo(() => {
    return properties
      .filter(p => {
        // Location Filter
        if (searchLocation !== 'All Ahmedabad' && p.city && !p.city.toLowerCase().includes(searchLocation.toLowerCase()) && !p.neighborhood.toLowerCase().includes(searchLocation.toLowerCase())) {
          return false;
        }

        // Budget Filter
        const rent = p.baseRent ?? p.base_rent ?? 0;
        if (rent > filters.budgetMax) return false;

        // Property Type Filter
        const pType = p.propertyType || p.property_type || '';
        if (filters.propertyTypes.length > 0 && !filters.propertyTypes.some(t => pType.includes(t))) {
          return false;
        }

        // Bedroom count filter
        if (filters.bedrooms.length > 0 && p.bedrooms && !filters.bedrooms.includes(p.bedrooms)) {
          return false;
        }

        // Furnishing Filter
        if (filters.furnishing.length > 0 && p.furnishing && !filters.furnishing.includes(p.furnishing)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aRent = a.baseRent ?? a.base_rent ?? 0;
        const bRent = b.baseRent ?? b.base_rent ?? 0;
        const aTotal = a.totalEstimatedMonthly ?? a.total_estimated_monthly ?? aRent;
        const bTotal = b.totalEstimatedMonthly ?? b.total_estimated_monthly ?? bRent;

        if (sortBy === 'priceAsc') return aRent - bRent;
        if (sortBy === 'trueCostAsc') return aTotal - bTotal;
        if (sortBy === 'inspectionDesc') {
          return (b.transparencyDetails?.inspectionScore || 90) - (a.transparencyDetails?.inspectionScore || 90);
        }
        return (b.rating || 4.5) - (a.rating || 4.5);
      });
  }, [properties, filters, searchLocation, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.budgetMax < 50000) count++;
    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.bedrooms.length > 0) count += filters.bedrooms.length;
    if (filters.furnishing.length > 0) count += filters.furnishing.length;
    if (filters.parking) count++;
    if (filters.powerBackup) count++;
    if (filters.wifi) count++;
    return count;
  }, [filters]);

  const handleAskNoraAboutProperty = (prop: Property) => {
    setSelectedProperty(null);
    setIsAIAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex flex-col font-sans text-text-primary selection:bg-primary selection:text-white">
      {/* Top Universal Navbar */}
      <PortalNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        savedCount={savedPropertyIds.length}
        compareCount={compareProperties.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main Tab Routing */}
      <main className="flex-1">
        {/* TAB 1: EXPLORE (Listings + Interactive Vector Map) */}
        {currentTab === 'explore' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <HeroSection
              onSearch={handleHeroSearch}
              onOpenRoommates={() => setCurrentTab('harmony-match')}
              onOpenLeaseLens={() => setCurrentTab('lease-guard')}
              onOpenAISearch={() => {
                const element = document.getElementById('ai-search-bar');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* AI Natural Language Search Bar */}
            <div id="ai-search-bar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <AISmartSearchBar
                onApplyParsedFilter={handleApplyAITokens}
                onClear={() => setFilters(DEFAULT_FILTERS)}
              />
            </div>

            {/* Explore Section Bar */}
            <section id="explore-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                      Available Verified Homes
                    </h2>
                    {propertiesLoading ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Fetching Database...
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary">
                        {filteredProperties.length} verified listings
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Live Supabase database listings · All-in TrueCost pricing with zero deceptive charges
                  </p>
                </div>

                {/* Filter and View Toggles */}
                <div className="flex items-center flex-wrap gap-2">
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      activeFilterCount > 0
                        ? 'bg-primary text-white border-primary shadow-subtle'
                        : 'bg-surface text-text-primary border-border hover:border-primary/40'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-white text-primary text-[10px] font-black flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  >
                    <option value="recommended">Highest Trust & Rating</option>
                    <option value="trueCostAsc">Lowest Total Monthly Cost</option>
                    <option value="priceAsc">Base Rent: Low to High</option>
                    <option value="inspectionDesc">Highest Inspection Score</option>
                  </select>

                  <div className="flex items-center p-1 bg-surface border border-border rounded-xl">
                    <button
                      onClick={() => setMobileViewMode('list')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                        mobileViewMode === 'list'
                          ? 'bg-primary text-white'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                      title="Split / List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setMobileViewMode('map')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                        mobileViewMode === 'map'
                          ? 'bg-primary text-white'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                      title="Expanded Map View"
                    >
                      <MapIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Split Screen Grid & Vector Map Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Listing Cards Grid (7 cols) */}
                <div className={`lg:col-span-7 space-y-4 ${mobileViewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
                  {filteredProperties.length === 0 && !propertiesLoading ? (
                    <div className="p-12 text-center bg-surface rounded-2xl border border-border space-y-3">
                      <div className="w-12 h-12 rounded-full bg-surfaceMuted flex items-center justify-center mx-auto text-text-muted">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base text-text-primary">No matching properties found</h3>
                      <p className="text-xs text-text-muted max-w-sm mx-auto">
                        Try relaxing your budget or lifestyle filter requirements.
                      </p>
                      <button
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset all filters</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredProperties.map((prop) => (
                        <PropertyCard
                          key={prop.id}
                          property={prop}
                          isHovered={hoveredPropertyId === prop.id}
                          isSelected={selectedProperty?.id === prop.id}
                          isSaved={savedPropertyIds.includes(prop.id)}
                          isInCompare={compareProperties.some(p => p.id === prop.id)}
                          onHover={setHoveredPropertyId}
                          onClick={(p) => setSelectedProperty(p)}
                          onToggleSave={handleToggleSave}
                          onToggleCompare={handleToggleCompare}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Interactive Vector Map (5 cols) */}
                <div className={`lg:col-span-5 sticky top-24 ${mobileViewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
                  <InteractiveMap
                    properties={filteredProperties}
                    hoveredPropertyId={hoveredPropertyId}
                    selectedPropertyId={selectedProperty?.id || null}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    onHoverProperty={setHoveredPropertyId}
                    onSearchThisArea={() => {}}
                  />
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEASE GUARD (Pillar 1 - Legal Lease Analyzer & MTA Benchmarks) */}
        {currentTab === 'lease-guard' && (
          <div className="space-y-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                <button
                  onClick={() => setLeaseGuardSubTab('analyzer')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    leaseGuardSubTab === 'analyzer'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'bg-surface text-text-secondary border border-border hover:text-text-primary'
                  }`}
                >
                  FairLeaseGuard AI Engine
                </button>
                <button
                  onClick={() => setLeaseGuardSubTab('benchmarks')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    leaseGuardSubTab === 'benchmarks'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'bg-surface text-text-secondary border border-border hover:text-text-primary'
                  }`}
                >
                  Model Tenancy Act Clauses (Supabase)
                </button>
              </div>
            </div>

            {leaseGuardSubTab === 'analyzer' ? (
              <FairLeaseGuard />
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <LeaseLens />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HARMONY MATCH (Pillar 2 - Roommate Personality & Lifestyle Protocol) */}
        {currentTab === 'harmony-match' && (
          <RoommateMatching
            onOpenMessageWithRoommate={(roommate: RoommateProfile) => {
              setCurrentTab('dashboard');
            }}
          />
        )}

        {/* TAB 4: SNAPFIX (Pillar 3 - Anti-Fraud Repair Triage & Escrow) */}
        {currentTab === 'snapfix' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SnapFixTriage />
          </div>
        )}

        {/* TAB 5: TRUECOST INDEX (Pillar 4 - Anti-Deception Cost & Deception Calculator) */}
        {currentTab === 'truecost' && (
          <TrueCostCalculator />
        )}

        {/* TAB 6: DASHBOARD (Supabase Live Metrics + Role-Based Portals) */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8 py-6">
            {/* Top Live Supabase Database Metrics */}
            <SupabaseLiveDashboard
              properties={properties}
              loading={propertiesLoading}
            />

            {/* Role-Based Dashboard View */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border-t border-border pt-6">
                {userRole === 'tenant' && (
                  <TenantDashboard
                    onOpenLeaseLens={() => setCurrentTab('lease-guard')}
                    onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  />
                )}
                {userRole === 'landlord' && (
                  <LandlordDashboard
                    onOpenLeaseLens={() => setCurrentTab('lease-guard')}
                    onOpenMessageWithTenant={() => {}}
                  />
                )}
                {userRole === 'property_manager' && (
                  <PropertyManagerDashboard onOpenMessages={() => {}} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: TRUST CENTER */}
        {currentTab === 'trust' && (
          <TrustCenter />
        )}
      </main>

      {/* Global Footer */}
      <Footer onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* MODAL 1: Filter Drawer */}
      <SmartSearchFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        activeCount={activeFilterCount}
      />

      {/* MODAL 2: Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onAskNoraAboutProperty={handleAskNoraAboutProperty}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* MODAL 3: Property Comparison Modal */}
      <PropertyComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        properties={compareProperties}
        onRemoveProperty={(id) => setCompareProperties(compareProperties.filter(p => p.id !== id))}
        onViewDetails={(prop: Property) => {
          setIsCompareModalOpen(false);
          setSelectedProperty(prop);
        }}
      />

      {/* MODAL 4: Nora AI Living Assistant */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onNavigateToTab={(tab) => {
          setIsAIAssistantOpen(false);
          setCurrentTab(tab);
        }}
        onSelectProperty={(prop) => {
          setIsAIAssistantOpen(false);
          setSelectedProperty(prop);
        }}
        properties={properties}
      />
    </div>
  );
};
