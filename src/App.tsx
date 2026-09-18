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
  Scale
} from 'lucide-react';
import { Property, UserRole, NotificationItem } from './types';
import { MOCK_PROPERTIES, MOCK_NOTIFICATIONS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { AISmartSearchBar } from './components/AISmartSearchBar';
import { SmartSearchFilterDrawer, FilterState, DEFAULT_FILTERS } from './components/SmartSearchFilterDrawer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { RoommateMatching } from './components/RoommateMatching';
import { LeaseLens } from './components/LeaseLens';
import { TenantDashboard } from './components/TenantDashboard';
import { LandlordDashboard } from './components/LandlordDashboard';
import { PropertyManagerDashboard } from './components/PropertyManagerDashboard';
import { TrustCenter } from './components/TrustCenter';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Footer } from './components/Footer';

export function App() {
  // Navigation & Role State
  const [currentTab, setCurrentTab] = useState<string>('explore');
  const [userRole, setUserRole] = useState<UserRole>('tenant');

  // Properties State
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-1']);
  const [compareProperties, setCompareProperties] = useState<Property[]>([MOCK_PROPERTIES[0], MOCK_PROPERTIES[1]]);
  
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

    // Smooth scroll down to property listing section
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
      if (t.category === 'Policy') {
        if (t.value.includes('Pet')) newFilters.petFriendly = true;
      }
    });

    setFilters(newFilters);
  };

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.budgetMax < 50000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.furnishing.length > 0) count++;
    if (filters.parking) count++;
    if (filters.wifi) count++;
    if (filters.powerBackup) count++;
    if (filters.ac) count++;
    if (filters.laundry) count++;
    if (filters.workspace) count++;
    if (filters.petFriendly) count++;
    if (filters.maxCommuteWorkplace < 45) count++;
    if (filters.maxCommuteUniversity < 45) count++;
    return count;
  }, [filters]);

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Location filter
      if (searchLocation !== 'All Ahmedabad' && !prop.neighborhood.toLowerCase().includes(searchLocation.toLowerCase())) {
        return false;
      }
      // Budget filter (TrueCost total)
      if (prop.totalEstimatedMonthly > filters.budgetMax) {
        return false;
      }
      // Property type
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.propertyType)) {
        return false;
      }
      // Furnishing
      if (filters.furnishing.length > 0 && !filters.furnishing.includes(prop.furnishing)) {
        return false;
      }
      // Amenities
      if (filters.parking && !prop.amenities.some(a => a.toLowerCase().includes('parking'))) return false;
      if (filters.wifi && !prop.amenities.some(a => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('fiber'))) return false;
      if (filters.powerBackup && !prop.amenities.some(a => a.toLowerCase().includes('power backup'))) return false;
      if (filters.ac && !prop.amenities.some(a => a.toLowerCase().includes('ac'))) return false;
      if (filters.laundry && !prop.amenities.some(a => a.toLowerCase().includes('laundry') || a.toLowerCase().includes('washing'))) return false;
      if (filters.workspace && !prop.amenities.some(a => a.toLowerCase().includes('desk') || a.toLowerCase().includes('workspace'))) return false;
      if (filters.petFriendly && !prop.amenities.some(a => a.toLowerCase().includes('pet'))) return false;

      // Commute
      if (prop.distances.officeMinutes > filters.maxCommuteWorkplace) return false;
      if (prop.distances.universityMinutes > filters.maxCommuteUniversity) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'trueCostAsc') return a.totalEstimatedMonthly - b.totalEstimatedMonthly;
      if (sortBy === 'priceAsc') return a.baseRent - b.baseRent;
      if (sortBy === 'inspectionDesc') return b.transparencyDetails.inspectionScore - a.transparencyDetails.inspectionScore;
      return b.rating - a.rating; // recommended default
    });
  }, [properties, searchLocation, filters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F4] text-text-primary antialiased font-sans">
      
      {/* Top Navigation */}
      <Navbar
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

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* ==================================================
            TAB 1: EXPLORE (LANDING HERO + SPLIT SCREEN 40/60 DISCOVERY)
            ================================================== */}
        {currentTab === 'explore' && (
          <div className="space-y-8">
            
            {/* Landing Hero Section */}
            <HeroSection
              onSearch={handleHeroSearch}
              onOpenRoommates={() => setCurrentTab('roommates')}
              onOpenLeaseLens={() => setCurrentTab('leaselens')}
              onOpenAISearch={() => {
                const element = document.getElementById('ai-smart-search');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Split Screen Discovery Workspace Container */}
            <div id="explore-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              
              {/* AI Natural Language Search Console */}
              <div id="ai-smart-search">
                <AISmartSearchBar
                  onApplyParsedFilter={handleApplyAITokens}
                  onClear={() => setFilters(DEFAULT_FILTERS)}
                />
              </div>

              {/* Filter Bar & Mobile View Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                    Verified Spaces in Ahmedabad ({filteredProperties.length})
                  </h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    Live interactive split-view. Hovering on cards highlights map pins.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  
                  {/* Mobile View Toggle (Map vs List) */}
                  <div className="lg:hidden flex items-center bg-surface border border-border p-1 rounded-xl shadow-subtle">
                    <button
                      onClick={() => setMobileViewMode('list')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        mobileViewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>List</span>
                    </button>
                    <button
                      onClick={() => setMobileViewMode('map')}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        mobileViewMode === 'map' ? 'bg-primary text-white' : 'text-text-secondary'
                      }`}
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Map</span>
                    </button>
                  </div>

                  {/* Filter Drawer Trigger */}
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:border-primary/40 text-xs font-bold text-text-primary transition-all shadow-subtle"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Sort By Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-text-primary focus:outline-none focus:border-primary cursor-pointer shadow-subtle"
                  >
                    <option value="recommended">Sort: Recommended</option>
                    <option value="trueCostAsc">Sort: TrueCost (Low to High)</option>
                    <option value="priceAsc">Sort: Base Rent (Low to High)</option>
                    <option value="inspectionDesc">Sort: Highest Audit Score</option>
                  </select>
                </div>
              </div>

              {/* ==================================================
                  SPLIT SCREEN DISCOVERY LAYOUT (40% LIST / 60% MAP)
                  ================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* LEFT: 40% Property Cards List (5 cols on 12-col grid = ~41.6%) */}
                <div className={`lg:col-span-5 space-y-4 ${
                  mobileViewMode === 'map' ? 'hidden lg:block' : 'block'
                }`}>
                  {filteredProperties.length === 0 ? (
                    <div className="bg-surface rounded-2xl border border-border p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-surfaceMuted flex items-center justify-center mx-auto text-text-muted">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-sm text-text-primary">No spaces match all your criteria</h3>
                      <p className="text-xs text-text-muted max-w-xs mx-auto">
                        Try loosening budget thresholds or expanding commute tolerances in smart filters.
                      </p>
                      <button
                        onClick={() => {
                          setFilters(DEFAULT_FILTERS);
                          setSearchLocation('All Ahmedabad');
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    filteredProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        isHovered={hoveredPropertyId === prop.id}
                        isSelected={selectedProperty?.id === prop.id}
                        isSaved={savedPropertyIds.includes(prop.id)}
                        isInCompare={compareProperties.some(p => p.id === prop.id)}
                        onHover={(id) => setHoveredPropertyId(id)}
                        onClick={(p) => setSelectedProperty(p)}
                        onToggleSave={handleToggleSave}
                        onToggleCompare={handleToggleCompare}
                      />
                    ))
                  )}
                </div>

                {/* RIGHT: 60% Interactive Spatial Map (7 cols on 12-col grid = ~58.3%) */}
                <div className={`lg:col-span-7 sticky top-24 ${
                  mobileViewMode === 'list' ? 'hidden lg:block' : 'block'
                }`}>
                  <InteractiveMap
                    properties={filteredProperties}
                    hoveredPropertyId={hoveredPropertyId}
                    selectedPropertyId={selectedProperty?.id || null}
                    onSelectProperty={(p) => setSelectedProperty(p)}
                    onHoverProperty={(id) => setHoveredPropertyId(id)}
                    onSearchThisArea={() => {
                      // Simulated spatial area refresh
                    }}
                  />
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================
            TAB 2: ROOMMATES
            ================================================== */}
        {currentTab === 'roommates' && (
          <RoommateMatching
            onOpenMessageWithRoommate={() => {
              setCurrentTab('dashboard');
            }}
          />
        )}

        {/* ==================================================
            TAB 3: LEASELENS (AGREEMENT ANALYZER)
            ================================================== */}
        {currentTab === 'leaselens' && (
          <LeaseLens />
        )}

        {/* ==================================================
            TAB 4: ADAPTIVE DASHBOARDS BASED ON USER ROLE
            ================================================== */}
        {currentTab === 'dashboard' && (
          <>
            {userRole === 'tenant' && (
              <TenantDashboard
                onOpenLeaseLens={() => setCurrentTab('leaselens')}
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
              />
            )}
            {userRole === 'landlord' && (
              <LandlordDashboard
                onOpenLeaseLens={() => setCurrentTab('leaselens')}
                onOpenMessageWithTenant={() => {
                  // Message tenant
                }}
              />
            )}
            {userRole === 'property_manager' && (
              <PropertyManagerDashboard
                onOpenMessages={() => {
                  // Message contractor
                }}
              />
            )}
          </>
        )}

        {/* ==================================================
            TAB 5: TRUST CENTER
            ================================================== */}
        {currentTab === 'trust' && (
          <TrustCenter />
        )}

      </main>

      {/* Floating Bottom Navigation for Mobile Devices */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('explore')}
          className={`flex flex-col items-center text-[10px] font-bold ${
            currentTab === 'explore' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setCurrentTab('roommates')}
          className={`flex flex-col items-center text-[10px] font-bold ${
            currentTab === 'roommates' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Roommates</span>
        </button>

        {/* Floating AI Button in Center */}
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-11 h-11 rounded-full bg-primary text-white shadow-elevated flex items-center justify-center border-2 border-white">
            <Sparkles className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-[10px] font-bold text-primary mt-0.5">NORA</span>
        </button>

        <button
          onClick={() => setCurrentTab('leaselens')}
          className={`flex flex-col items-center text-[10px] font-bold ${
            currentTab === 'leaselens' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>LeaseLens</span>
        </button>

        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center text-[10px] font-bold ${
            currentTab === 'dashboard' ? 'text-primary' : 'text-text-muted'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Floating Compare Tray (When items selected) */}
      {compareProperties.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-35 bg-text-primary text-white px-4 py-2.5 rounded-full shadow-dropdown flex items-center space-x-3 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">
              {compareProperties.length} spaces selected for comparison
            </span>
          </div>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-1 rounded-full bg-primary hover:bg-primary-hover text-white font-extrabold text-[11px] transition-colors"
          >
            Compare Now →
          </button>

          <button
            onClick={() => setCompareProperties([])}
            className="text-zinc-400 hover:text-white text-[11px] font-semibold"
          >
            Clear
          </button>
        </div>
      )}

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onAskNoraAboutProperty={(p) => {
          setSelectedProperty(null);
          setIsAIAssistantOpen(true);
        }}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        onToggleSave={(id) => handleToggleSave(id)}
      />

      {/* Property Comparison Modal */}
      <PropertyComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        properties={compareProperties}
        onRemoveProperty={(id) => setCompareProperties(compareProperties.filter(p => p.id !== id))}
        onViewDetails={(p) => {
          setSelectedProperty(p);
          setIsCompareModalOpen(false);
        }}
      />

      {/* Smart Search Granular Filter Drawer */}
      <SmartSearchFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        activeCount={activeFilterCount}
      />

      {/* AI Assistant Modal (NORA) */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
        onSelectProperty={(p) => setSelectedProperty(p)}
        properties={properties}
      />

      {/* Global Footer */}
      <Footer onSelectTab={(tab) => setCurrentTab(tab)} />

    </div>
  );
}
export default App;
