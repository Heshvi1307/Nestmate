import React, { useState, useMemo } from 'react';
import {
  Home, Users, FileText, BarChart3, Shield, SlidersHorizontal, Search,
  MapPin, LayoutGrid, Map,
} from 'lucide-react';

import { useProperties } from './hooks/useProperties';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { InteractiveMap } from './components/InteractiveMap';
import { SmartSearchFilterDrawer } from './components/SmartSearchFilterDrawer';
import { RoommateMatching } from './components/RoommateMatching';
import { LeaseLens } from './components/LeaseLens';
import { TrustCenter } from './components/TrustCenter';
import { Dashboard } from './components/Dashboard';
import type { Property } from './types';
import type { Filters } from './components/SmartSearchFilterDrawer';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'explore',   label: 'Explore',    icon: Home },
  { id: 'roommates', label: 'Roommates',  icon: Users },
  { id: 'leaselens', label: 'LeaseLens',  icon: FileText },
  { id: 'dashboard', label: 'Dashboard',  icon: BarChart3 },
  { id: 'trust',     label: 'Trust',      icon: Shield },
] as const;
type TabId = typeof TABS[number]['id'];

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const PropertySkeleton: React.FC = () => (
  <div className="animate-pulse bg-slate-200 rounded-2xl aspect-[4/3]" />
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    city: '',
    minRent: 0,
    maxRent: 200000,
    bedrooms: null,
    propertyType: '',
    furnishing: '',
    verifiedOnly: false,
  });

  const { properties, loading, error } = useProperties();

  // Unique cities for filter drawer
  const cities = useMemo(() => [...new Set(properties.map((p) => p.city))].sort(), [properties]);

  // Apply filters + search
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (filters.city && p.city !== filters.city) return false;
      if (p.base_rent < filters.minRent || p.base_rent > filters.maxRent) return false;
      if (filters.bedrooms !== null && p.bedrooms !== filters.bedrooms) return false;
      if (filters.propertyType && !p.property_type?.toLowerCase().includes(filters.propertyType.toLowerCase())) return false;
      if (filters.furnishing && !p.furnishing?.toLowerCase().includes(filters.furnishing.toLowerCase())) return false;
      if (filters.verifiedOnly && !p.verified) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !p.title?.toLowerCase().includes(q) &&
          !p.city?.toLowerCase().includes(q) &&
          !p.neighborhood?.toLowerCase().includes(q) &&
          !p.property_type?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [properties, filters, searchQuery]);

  const handleCompare = (p: Property) => {
    setCompareList((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev;
      if (prev.length >= 3) return [...prev.slice(1), p];
      return [...prev, p];
    });
    setCompareOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-800 text-xl tracking-tight">NESTORA</span>
            <span className="hidden sm:inline text-xs text-slate-400 ml-1 font-medium">PropTech</span>
          </div>
          {/* Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Explore Search Bar ── */}
      {activeTab === 'explore' && (
        <div className="sticky top-[61px] z-20 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search city, neighborhood, property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            <div className="flex gap-1 border border-slate-200 rounded-full p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-full transition ${viewMode === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* EXPLORE */}
        {activeTab === 'explore' && (
          <div className="space-y-4">
            {/* Result count */}
            {!loading && (
              <p className="text-sm text-slate-500 font-medium">
                {filtered.length.toLocaleString()} properties
                {filters.city ? ` in ${filters.city}` : ''}
              </p>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm font-medium">
                ❌ Failed to load properties: {error}
              </div>
            )}

            {viewMode === 'map' ? (
              <InteractiveMap properties={filtered} onSelect={setSelectedProperty} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {loading
                  ? [...Array(12)].map((_, i) => <PropertySkeleton key={i} />)
                  : filtered.map((p) => (
                      <PropertyCard
                        key={p.id}
                        property={p}
                        onSelect={setSelectedProperty}
                        onCompare={handleCompare}
                        selected={compareList.some((x) => x.id === p.id)}
                      />
                    ))}
              </div>
            )}

            {!loading && filtered.length === 0 && !error && (
              <div className="text-center py-16 text-slate-400">
                <Home className="w-14 h-14 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No properties match your filters</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {/* ROOMMATES */}
        {activeTab === 'roommates' && <RoommateMatching />}

        {/* LEASELENS */}
        {activeTab === 'leaselens' && <LeaseLens />}

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && <Dashboard properties={properties} loading={loading} />}

        {/* TRUST CENTER */}
        {activeTab === 'trust' && <TrustCenter />}
      </main>

      {/* ── Modals ── */}
      <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      {compareOpen && (
        <PropertyComparisonModal
          properties={compareList}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        />
      )}

      {/* ── Filter Drawer ── */}
      <SmartSearchFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        cities={cities}
      />

      {/* ── Compare FAB ── */}
      {compareList.length > 0 && !compareOpen && (
        <button
          onClick={() => setCompareOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-full shadow-xl hover:bg-indigo-700 transition flex items-center gap-2"
        >
          Compare ({compareList.length})
        </button>
      )}
    </div>
  );
}

export default App;
