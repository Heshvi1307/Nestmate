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
  Scale, 
  Zap, 
  Building, 
  CheckCircle2, 
  Wrench, 
  Calculator, 
  ArrowRight
} from 'lucide-react';
import { Property, UserRole } from './types';
import { NestMateProvider, useNestMate } from './context/NestMateContext';

// Navigation & Layout
import { Navbar as PortalNavbar } from './components/PortalNavbar';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';

// Explore & Listings
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { AISmartSearchBar } from './components/AISmartSearchBar';
import { SmartSearchFilterDrawer, FilterState, DEFAULT_FILTERS } from './components/SmartSearchFilterDrawer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';

// AI Pillars & Interactive Engines
import { FairLeaseGuard } from './components/FairLeaseGuard';
import { LeaseLens } from './components/LeaseLens';
import { RoommateMatching } from './components/RoommateMatching';
import { HarmonyMatch } from './components/HarmonyMatch';
import { SnapFixTriage } from './components/SnapFixTriage';
import { MaintenanceHub } from './components/MaintenanceHub';
import { TrueCostCalculator } from './components/TrueCostCalculator';

// Dashboards & Trust Center
import { TenantDashboard } from './components/TenantDashboard';
import { LandlordDashboard } from './components/LandlordDashboard';
import { PropertyManagerDashboard } from './components/PropertyManagerDashboard';
import { TrustCenter } from './components/TrustCenter';
import { AIAssistantModal } from './components/AIAssistantModal';

// Pitch & Action Modals
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { AffordabilityCalculatorModal } from './components/AffordabilityCalculatorModal';
import { AddPropertyWizardModal } from './components/AddPropertyWizardModal';
import { RentPaymentModal } from './components/RentPaymentModal';

function NestMateMainContent() {
  const {
    user,
    userRole,
    setUserRole,
    currentTab,
    setCurrentTab,
    showLandingPage,
    setShowLandingPage,
    showOnboardingModal,
    setShowOnboardingModal,
    loginAsDemoTenant,
    loginAsDemoLandlord,
    properties,
    savedPropertyIds,
    toggleSaveProperty,
    compareProperties,
    toggleCompareProperty,
    clearCompare,
    selectedProperty,
    setSelectedProperty,
    hoveredPropertyId,
    setHoveredPropertyId,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    isCompareModalOpen,
    setIsCompareModalOpen,
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    isAddPropertyWizardOpen,
    setIsAddPropertyWizardOpen,
    isAffordabilityModalOpen,
    setIsAffordabilityModalOpen,
    affordabilityProperty,
    openAffordabilityCalculator,
    showReceiptModal,
    setShowReceiptModal,
    handlePayRent,
    notifications,
    markNotificationRead
  } = useNestMate();

  // Local Filters State for Explore Tab
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchLocation, setSearchLocation] = useState<string>('All Ahmedabad');
  const [sortBy, setSortBy] = useState<'recommended' | 'trueCostAsc' | 'priceAsc' | 'inspectionDesc'>('recommended');
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'map'>('list');

  // Sub-tabs for AI Pillars
  const [leaseSubTab, setLeaseSubTab] = useState<'analyzer' | 'benchmarks'>('analyzer');
  const [roommateSubTab, setRoommateSubTab] = useState<'profiles' | 'harmony'>('profiles');
  const [snapfixSubTab, setSnapfixSubTab] = useState<'ai_triage' | 'hub'>('ai_triage');

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
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (searchLocation !== 'All Ahmedabad' && searchLocation !== 'All Ahmedabad & GIFT') {
        const matchLoc = 
          prop.neighborhood.toLowerCase().includes(searchLocation.toLowerCase()) ||
          prop.city.toLowerCase().includes(searchLocation.toLowerCase());
        if (!matchLoc) return false;
      }
      if (prop.baseRent > filters.budgetMax) return false;
      if (filters.depositMax && prop.deposit > filters.depositMax) return false;
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(prop.propertyType)) return false;
      if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(prop.bedrooms)) return false;
      if (filters.furnishing.length > 0 && !filters.furnishing.includes(prop.furnishing)) return false;
      if (filters.parking && !prop.amenities.some(a => a.toLowerCase().includes('parking'))) return false;
      if (filters.wifi && !prop.amenities.some(a => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('wifi') || a.toLowerCase().includes('internet'))) return false;
      if (filters.powerBackup && !prop.amenities.some(a => a.toLowerCase().includes('power backup') || a.toLowerCase().includes('backup'))) return false;
      if (filters.ac && !prop.amenities.some(a => a.toLowerCase().includes('ac') || a.toLowerCase().includes('air conditioning'))) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'trueCostAsc') return a.totalEstimatedMonthly - b.totalEstimatedMonthly;
      if (sortBy === 'priceAsc') return a.baseRent - b.baseRent;
      if (sortBy === 'inspectionDesc') return b.transparencyDetails.inspectionScore - a.transparencyDetails.inspectionScore;
      return b.rating - a.rating;
    });
  }, [properties, searchLocation, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.budgetMax !== DEFAULT_FILTERS.budgetMax) count++;
    if (filters.depositMax !== DEFAULT_FILTERS.depositMax) count++;
    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.bedrooms.length > 0) count += filters.bedrooms.length;
    if (filters.furnishing.length > 0) count += filters.furnishing.length;
    if (filters.parking) count++;
    if (filters.wifi) count++;
    if (filters.powerBackup) count++;
    if (filters.ac) count++;
    if (filters.petFriendly) count++;
    return count;
  }, [filters]);

  // If Marketing Pitch / Landing Page is active, render full-page Landing Page
  if (showLandingPage) {
    return (
      <div className="min-h-screen bg-[#F7F7F4] text-text-primary">
        <LandingPage
          onOpenAuth={() => setShowOnboardingModal(true)}
          onExploreSpaces={() => setShowLandingPage(false)}
          onFindMatch={() => {
            setShowLandingPage(false);
            setCurrentTab('harmony-match');
          }}
        />

        {/* Global Modals on Landing Page */}
        <OnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
        />
        <AIAssistantModal
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          onNavigateToTab={(tab) => {
            setShowLandingPage(false);
            setCurrentTab(tab);
          }}
          onSelectProperty={(p) => {
            setShowLandingPage(false);
            setSelectedProperty(p);
          }}
          properties={properties}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary antialiased selection:bg-primary selection:text-white">
      
      {/* Unified Top Navigation */}
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
        onMarkNotificationRead={markNotificationRead}
        onOpenLandingPage={() => setShowLandingPage(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
      />

      <main className="flex-1 pb-16">
        
        {/* ==================================================
            TAB 1: EXPLORE & PROPERTIES
            ================================================== */}
        {currentTab === 'explore' && (
          <div className="space-y-8">
            <HeroSection
              onSearch={handleHeroSearch}
              onOpenRoommates={() => setCurrentTab('harmony-match')}
              onOpenLeaseLens={() => setCurrentTab('lease-guard')}
              onOpenAISearch={() => setIsAIAssistantOpen(true)}
              onOpenMyHome={() => setCurrentTab('dashboard')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Natural Language AI Search Bar */}
              <AISmartSearchBar
                onApplyParsedFilter={(tokens) => {
                  tokens.forEach((t) => {
                    if (t.category === 'Budget') {
                      const num = parseInt(t.value.replace(/[^0-9]/g, ''));
                      if (num) setFilters(prev => ({ ...prev, budgetMax: num }));
                    }
                  });
                }}
                onClear={() => setFilters(DEFAULT_FILTERS)}
              />

              {/* Action Bar: Count, Sort, Filter Drawer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-text-primary">
                    {filteredProperties.length} verified spaces available
                  </span>
                  {searchLocation !== 'All Ahmedabad' && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted">
                      in {searchLocation}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surfaceMuted text-xs font-semibold text-text-primary transition-all shadow-subtle"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-subtle"
                  >
                    <option value="recommended">Sort: Recommended</option>
                    <option value="trueCostAsc">Lowest TrueCost™</option>
                    <option value="priceAsc">Lowest Base Rent</option>
                    <option value="inspectionDesc">Highest Inspection Score</option>
                  </select>

                  {/* Mobile Toggle */}
                  <div className="lg:hidden flex items-center bg-surface border border-border rounded-lg p-0.5">
                    <button
                      onClick={() => setMobileViewMode('list')}
                      className={`p-1.5 rounded-md ${mobileViewMode === 'list' ? 'bg-primary text-white' : 'text-text-muted'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setMobileViewMode('map')}
                      className={`p-1.5 rounded-md ${mobileViewMode === 'map' ? 'bg-primary text-white' : 'text-text-muted'}`}
                    >
                      <MapIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Split Layout: Cards Grid (Left) + Interactive Vector Map (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className={`lg:col-span-7 space-y-4 ${mobileViewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
                  {filteredProperties.length === 0 ? (
                    <div className="bg-surface rounded-2xl border border-border p-12 text-center space-y-3">
                      <ShieldCheck className="w-10 h-10 text-text-muted mx-auto" />
                      <h3 className="font-bold text-text-primary">No matching spaces found</h3>
                      <p className="text-xs text-text-muted max-w-sm mx-auto">
                        Try resetting your price or neighborhood filters to explore all verified Ahmedabad listings.
                      </p>
                      <button
                        onClick={() => {
                          setFilters(DEFAULT_FILTERS);
                          setSearchLocation('All Ahmedabad');
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          isSelected={selectedProperty?.id === property.id}
                          isHovered={hoveredPropertyId === property.id}
                          isSaved={savedPropertyIds.includes(property.id)}
                          isInCompare={compareProperties.some(p => p.id === property.id)}
                          onHover={(id) => setHoveredPropertyId(id)}
                          onClick={(prop) => setSelectedProperty(prop)}
                          onToggleSave={(id, e) => toggleSaveProperty(id, e)}
                          onToggleCompare={(prop, e) => toggleCompareProperty(prop, e)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className={`lg:col-span-5 sticky top-20 ${mobileViewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
                  <InteractiveMap
                    properties={filteredProperties}
                    selectedPropertyId={selectedProperty?.id || null}
                    hoveredPropertyId={hoveredPropertyId}
                    onSelectProperty={(prop) => setSelectedProperty(prop)}
                    onHoverProperty={(id) => setHoveredPropertyId(id)}
                    onSearchThisArea={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 2: LEASE GUARD (Pillar 1 - Model Tenancy Act AI Engine)
            ================================================== */}
        {(currentTab === 'lease-guard' || currentTab === 'leaselens') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Sub-navigation pill toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Pillar 1 · Legal Safeguard</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Lease Guard AI & Agreement Intelligence
                </h1>
                <p className="text-xs text-text-muted mt-1">
                  Full compliance audit under Model Tenancy Act 2021, Gujarat Rent Rules, and unfair clause counter-drafting.
                </p>
              </div>

              <div className="inline-flex bg-surface border border-border p-1 rounded-xl shadow-subtle self-start sm:self-auto">
                <button
                  onClick={() => setLeaseSubTab('analyzer')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    leaseSubTab === 'analyzer'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  AI Agreement Analyzer
                </button>
                <button
                  onClick={() => setLeaseSubTab('benchmarks')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    leaseSubTab === 'benchmarks'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Standard Benchmark Clauses
                </button>
              </div>
            </div>

            {leaseSubTab === 'analyzer' ? (
              <FairLeaseGuard />
            ) : (
              <LeaseLens />
            )}
          </div>
        )}

        {/* ==================================================
            TAB 3: ROOMMATES & HARMONYMATCH (Pillar 2)
            ================================================== */}
        {(currentTab === 'harmony-match' || currentTab === 'roommates') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Sub-navigation pill toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Pillar 2 · Co-Living Intelligence</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  Roommate Matching & HarmonyMatch™
                </h1>
                <p className="text-xs text-text-muted mt-1">
                  Connect with verified students and young professionals across Nirma, CEPT, IIM-A, and GIFT City tech corridors.
                </p>
              </div>

              <div className="inline-flex bg-surface border border-border p-1 rounded-xl shadow-subtle self-start sm:self-auto">
                <button
                  onClick={() => setRoommateSubTab('profiles')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    roommateSubTab === 'profiles'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Browse Campus Profiles (21)
                </button>
                <button
                  onClick={() => setRoommateSubTab('harmony')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    roommateSubTab === 'harmony'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  AI Vector Matcher & Living Charter
                </button>
              </div>
            </div>

            {roommateSubTab === 'profiles' ? (
              <RoommateMatching
                onOpenMessageWithRoommate={() => {
                  setCurrentTab('dashboard');
                }}
              />
            ) : (
              <HarmonyMatch />
            )}
          </div>
        )}

        {/* ==================================================
            TAB 4: SNAPFIX (Pillar 3 - Anti-Fraud Repair Triage)
            ================================================== */}
        {currentTab === 'snapfix' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Sub-navigation pill toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-primary tracking-wider uppercase">Pillar 3 · Operations & Forensic Triage</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                  SnapFix™ Maintenance & Anti-Fraud Triage
                </h1>
                <p className="text-xs text-text-muted mt-1">
                  Cryptographic photo verification, AI severity assessment, vendor dispatch, and Model Tenancy Act liability assignment.
                </p>
              </div>

              <div className="inline-flex bg-surface border border-border p-1 rounded-xl shadow-subtle self-start sm:self-auto">
                <button
                  onClick={() => setSnapfixSubTab('ai_triage')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    snapfixSubTab === 'ai_triage'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  AI Forensic Photo Diagnosis
                </button>
                <button
                  onClick={() => setSnapfixSubTab('hub')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    snapfixSubTab === 'hub'
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  Live Maintenance Tracker
                </button>
              </div>
            </div>

            {snapfixSubTab === 'ai_triage' ? (
              <SnapFixTriage />
            ) : (
              <MaintenanceHub onOpenMessageWithTechnician={() => setCurrentTab('dashboard')} />
            )}
          </div>
        )}

        {/* ==================================================
            TAB 5: TRUECOST INDEX (Pillar 4 - Anti-Deception Cost Engine)
            ================================================== */}
        {currentTab === 'truecost' && (
          <TrueCostCalculator />
        )}

        {/* ==================================================
            TAB 6: ADAPTIVE DASHBOARDS BASED ON USER ROLE
            ================================================== */}
        {currentTab === 'dashboard' && (
          <div className="py-6">
            {userRole === 'tenant' && (
              <TenantDashboard
                onOpenLeaseLens={() => setCurrentTab('lease-guard')}
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
              />
            )}
            {userRole === 'landlord' && (
              <LandlordDashboard
                onOpenLeaseLens={() => setCurrentTab('lease-guard')}
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
          </div>
        )}

        {/* ==================================================
            TAB 7: TRUST CENTER
            ================================================== */}
        {currentTab === 'trust' && (
          <TrustCenter />
        )}

      </main>

      {/* Floating Compare Tray (When 1+ properties selected) */}
      {compareProperties.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-text-primary text-white px-4 py-2.5 rounded-full shadow-dropdown flex items-center space-x-3 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center space-x-1.5">
            <Scale className="w-4 h-4 text-secondary" />
            <span className="font-bold">
              {compareProperties.length} spaces in comparison
            </span>
          </div>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-1 rounded-full bg-primary hover:bg-primary-hover text-white font-extrabold text-[11px] transition-colors"
          >
            Compare Now →
          </button>

          <button
            onClick={clearCompare}
            className="text-text-muted hover:text-white text-[11px] font-semibold"
          >
            Clear
          </button>
        </div>
      )}

      {/* Global Modals */}

      {/* 1. Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onAskNoraAboutProperty={() => {
          setSelectedProperty(null);
          setIsAIAssistantOpen(true);
        }}
        isSaved={selectedProperty ? savedPropertyIds.includes(selectedProperty.id) : false}
        onToggleSave={(id) => toggleSaveProperty(id)}
        onOpenAffordabilityCalculator={(prop) => openAffordabilityCalculator(prop)}
        onToggleCompare={(prop) => toggleCompareProperty(prop)}
        isInCompare={selectedProperty ? compareProperties.some(p => p.id === selectedProperty.id) : false}
      />

      {/* 2. Property Comparison Modal */}
      <PropertyComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        properties={compareProperties}
        onRemoveProperty={(id) => {
          const propToRemove = compareProperties.find(p => p.id === id);
          if (propToRemove) toggleCompareProperty(propToRemove);
        }}
        onViewDetails={(p) => {
          setSelectedProperty(p);
          setIsCompareModalOpen(false);
        }}
      />

      {/* 3. Smart Search Filter Drawer */}
      <SmartSearchFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
        onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        activeCount={activeFilterCount}
      />

      {/* 4. AI Concierge NORA Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
        onSelectProperty={(p) => setSelectedProperty(p)}
        properties={properties}
      />

      {/* 5. Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />

      {/* 6. Affordability Calculator Modal */}
      <AffordabilityCalculatorModal
        isOpen={isAffordabilityModalOpen}
        onClose={() => setIsAffordabilityModalOpen(false)}
        property={affordabilityProperty}
        onAskNora={() => {
          setIsAffordabilityModalOpen(false);
          setIsAIAssistantOpen(true);
        }}
        onViewComparison={() => {
          setIsAffordabilityModalOpen(false);
          setIsCompareModalOpen(true);
        }}
      />

      {/* 7. Add Property 7-Step Wizard Modal */}
      <AddPropertyWizardModal
        isOpen={isAddPropertyWizardOpen}
        onClose={() => setIsAddPropertyWizardOpen(false)}
      />

      {/* 8. Rent Payment Modal */}
      <RentPaymentModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        onPaymentSuccess={handlePayRent}
        amount={24000}
        unit="Flat 402, The Solitaire Terraces, Vastrapur"
        landlordName="Vikramaditya Sanghavi"
      />

      {/* Global Footer */}
      <Footer onSelectTab={(tab) => setCurrentTab(tab)} />

    </div>
  );
}

export function App() {
  return (
    <NestMateProvider>
      <NestMateMainContent />
    </NestMateProvider>
  );
}

export default App;
