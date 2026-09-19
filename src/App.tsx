import React, { useState, useMemo } from 'react';
import {
  Home, Users, FileText, BarChart3, Shield, SlidersHorizontal,
  Search, MapPin, LayoutGrid, Map, Calculator, X, Plus, Loader2,
} from 'lucide-react';

import { useProperties }  from './hooks/useProperties';
import { PropertyCard }   from './components/PropertyCard';
import { PropertyDetailModal }    from './components/PropertyDetailModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { InteractiveMap }         from './components/InteractiveMap';
import { SmartSearchFilterDrawer } from './components/SmartSearchFilterDrawer';
import { RoommateMatching }       from './components/RoommateMatching';
import { LeaseLens }              from './components/LeaseLens';
import { TrustCenter }            from './components/TrustCenter';
import { Dashboard }              from './components/Dashboard';
import { TrueCostCalculator }     from './components/TrueCostCalculator';
import { supabase }               from './utils/supabaseClient';
import { debugError }             from './utils/debug';
import type { Property }          from './types';
import type { Filters }           from './components/SmartSearchFilterDrawer';

const TABS = [
  { id: 'explore',    label: 'Explore',   icon: Home },
  { id: 'roommates',  label: 'Roommates', icon: Users },
  { id: 'leaselens',  label: 'LeaseLens', icon: FileText },
  { id: 'calculator', label: 'True Cost', icon: Calculator },
  { id: 'dashboard',  label: 'Dashboard', icon: BarChart3 },
  { id: 'trust',      label: 'Trust',     icon: Shield },
] as const;
type TabId = typeof TABS[number]['id'];

const Skeleton = () => (
  <div className="animate-pulse rounded-2xl overflow-hidden">
    <div className="aspect-[4/3] bg-slate-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-100 rounded w-1/2" />
    </div>
  </div>
);

// ── List Property form types ──────────────────────────────────────────────────
interface ListForm {
  title: string; city: string; neighborhood: string; property_type: string;
  bedrooms: string; bathrooms: string; carpet_area: string;
  base_rent: string; deposit: string; utilities_estimate: string;
  furnishing: string; tagline: string;
}
const emptyForm = (): ListForm => ({
  title: '', city: '', neighborhood: '', property_type: '2 BHK',
  bedrooms: '2', bathrooms: '1', carpet_area: '',
  base_rent: '', deposit: '', utilities_estimate: '',
  furnishing: 'Semi-Furnished', tagline: '',
});

function App() {
  const [activeTab, setActiveTab]   = useState<TabId>('explore');
  const [viewMode, setViewMode]     = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProp, setSelectedProp]   = useState<Property | null>(null);
  const [compareList, setCompareList]     = useState<Property[]>([]);
  const [compareOpen, setCompareOpen]     = useState(false);
  const [trueCostProp, setTrueCostProp]   = useState<Property | null>(null);
  const [listOpen, setListOpen]           = useState(false);
  const [listForm, setListForm]           = useState<ListForm>(emptyForm());
  const [listLoading, setListLoading]     = useState(false);
  const [toast, setToast]                 = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    city: '', minRent: 0, maxRent: 200000,
    bedrooms: null, propertyType: '', furnishing: '', verifiedOnly: false,
  });

  const { properties, loading, error, refetch } = useProperties();
  const cities = useMemo(() => [...new Set(properties.map(p => p.city).filter(Boolean))].sort() as string[], [properties]);

  const getBeds = (p: Property) => p.bedrooms ?? (() => {
    const m = p.title?.match(/(\d+)\s*BHK/i);
    return m ? parseInt(m[1]) : null;
  })();

  const filtered = useMemo(() => properties.filter(p => {
    if (filters.city && p.city !== filters.city) return false;
    if ((p.base_rent ?? 0) < filters.minRent || (p.base_rent ?? 0) > filters.maxRent) return false;
    if (filters.bedrooms !== null && getBeds(p) !== filters.bedrooms) return false;
    if (filters.furnishing && !p.furnishing?.toLowerCase().includes(filters.furnishing.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.title?.toLowerCase().includes(q) && !p.city?.toLowerCase().includes(q) && !p.neighborhood?.toLowerCase().includes(q)) return false;
    }
    return true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [properties, filters, searchQuery]);

  const handleCompare = (p: Property) => {
    setCompareList(prev => {
      if (prev.find(x => x.id === p.id)) return prev;
      return prev.length >= 3 ? [...prev.slice(1), p] : [...prev, p];
    });
    setCompareOpen(true);
  };

  // ── List Property submit ─────────────────────────────────────────────────────
  const handleListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listForm.title || !listForm.city || !listForm.base_rent) return;
    setListLoading(true);
    try {
      const { error: insertErr } = await supabase.from('properties').insert([{
        title:               listForm.title,
        city:                listForm.city,
        neighborhood:        listForm.neighborhood || null,
        property_type:       listForm.property_type || null,
        bedrooms:            parseInt(listForm.bedrooms) || null,
        bathrooms:           parseInt(listForm.bathrooms) || null,
        carpet_area:         parseInt(listForm.carpet_area) || null,
        base_rent:           parseFloat(listForm.base_rent),
        deposit:             parseFloat(listForm.deposit) || null,
        utilities_estimate:  parseFloat(listForm.utilities_estimate) || null,
        furnishing:          listForm.furnishing || null,
        tagline:             listForm.tagline || null,
        landlord_id:         null,
      }]);
      if (insertErr) throw insertErr;
      setToast('✅ Property listed successfully!');
      setListOpen(false);
      setListForm(emptyForm());
      await refetch();
    } catch (err) {
      debugError('List Property insert', err);
      setToast('❌ Failed to list property. Check Supabase permissions.');
    } finally {
      setListLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const field = (label: string, node: React.ReactNode) => (
    <div>
      <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wide">{label}</label>
      {node}
    </div>
  );
  const inp = (f: keyof ListForm, placeholder?: string, type = 'text') => (
    <input type={type} value={listForm[f]} onChange={e => setListForm(v => ({ ...v, [f]: e.target.value }))}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-800 text-xl tracking-tight">NESTORA</span>
          </div>
          <nav className="flex items-center gap-1 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Search bar */}
      {activeTab === 'explore' && (
        <div className="sticky top-[61px] z-20 bg-white/90 backdrop-blur border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search city, area, e.g. Bandra, Koramangala..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            <button onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition whitespace-nowrap">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {(filters.city || filters.bedrooms !== null || filters.furnishing) && (
                <span className="w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </button>
            <div className="flex gap-1 border border-slate-200 rounded-full p-0.5">
              <button onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-full transition ${viewMode === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'explore' && (
          <div className="space-y-4">
            {!loading && !error && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  <span className="font-bold text-slate-800">{filtered.length.toLocaleString()}</span> properties
                  {filters.city ? ` in ${filters.city}` : ' across India'}
                </p>
                {filtered.length !== properties.length && (
                  <button onClick={() => setFilters({ city: '', minRent: 0, maxRent: 200000, bedrooms: null, propertyType: '', furnishing: '', verifiedOnly: false })}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Clear filters</button>
                )}
              </div>
            )}
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 text-sm">❌ {error}</div>
            )}
            {viewMode === 'map' ? (
              <InteractiveMap properties={filtered} onSelect={setSelectedProp} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {loading ? [...Array(12)].map((_, i) => <Skeleton key={i} />) :
                  filtered.map(p => (
                    <PropertyCard key={p.id} property={p} onSelect={setSelectedProp}
                      onCompare={handleCompare} selected={compareList.some(x => x.id === p.id)} />
                  ))}
              </div>
            )}
            {!loading && filtered.length === 0 && !error && (
              <div className="text-center py-20 text-slate-400">
                <Home className="w-14 h-14 mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-slate-600">No properties match your search</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roommates'  && <RoommateMatching />}
        {activeTab === 'leaselens'  && <LeaseLens />}
        {activeTab === 'calculator' && <TrueCostCalculator selectedProperty={trueCostProp} />}
        {activeTab === 'dashboard'  && <Dashboard properties={properties} loading={loading} />}
        {activeTab === 'trust'      && <TrustCenter />}
      </main>

      {/* Modals */}
      {selectedProp && (
        <PropertyDetailModal property={selectedProp} onClose={() => setSelectedProp(null)}
          onCalculate={p => { setTrueCostProp(p); setSelectedProp(null); setActiveTab('calculator'); }} />
      )}
      {compareOpen && (
        <PropertyComparisonModal properties={compareList} onClose={() => setCompareOpen(false)}
          onRemove={id => setCompareList(prev => prev.filter(p => p.id !== id))} />
      )}
      <SmartSearchFilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)}
        filters={filters} onChange={setFilters} cities={cities} />

      {/* Compare FAB */}
      {compareList.length > 0 && !compareOpen && (
        <button onClick={() => setCompareOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-indigo-600 text-white font-semibold px-5 py-3 rounded-full shadow-xl hover:bg-indigo-700 transition flex items-center gap-2">
          ⚖️ Compare ({compareList.length})
        </button>
      )}

      {/* List Property FAB — Step 11 */}
      {activeTab === 'explore' && (
        <button onClick={() => setListOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-emerald-500 text-white font-semibold px-5 py-3 rounded-full shadow-xl hover:bg-emerald-600 transition flex items-center gap-2">
          <Plus className="w-5 h-5" /> List Property
        </button>
      )}

      {/* List Property Modal */}
      {listOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-lg">🏠 List a Property</h2>
              <button onClick={() => setListOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleListSubmit} className="p-5 space-y-4">
              {field('Title *', inp('title', 'e.g. 2 BHK Flat for Rent in Bandra, Mumbai'))}
              <div className="grid grid-cols-2 gap-3">
                {field('City *', inp('city', 'e.g. Mumbai'))}
                {field('Neighborhood', inp('neighborhood', 'e.g. Bandra West'))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('Property Type', (
                  <select value={listForm.property_type} onChange={e => setListForm(v => ({ ...v, property_type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    {['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Studio', 'Co-living Suite'].map(t => <option key={t}>{t}</option>)}
                  </select>
                ))}
                {field('Furnishing', (
                  <select value={listForm.furnishing} onChange={e => setListForm(v => ({ ...v, furnishing: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                    {['Furnished', 'Semi-Furnished', 'Unfurnished'].map(f => <option key={f}>{f}</option>)}
                  </select>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {field('Bedrooms', inp('bedrooms', '2', 'number'))}
                {field('Bathrooms', inp('bathrooms', '1', 'number'))}
                {field('Area (sqft)', inp('carpet_area', '900', 'number'))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field('Base Rent (₹) *', inp('base_rent', '25000', 'number'))}
                {field('Deposit (₹)', inp('deposit', '50000', 'number'))}
              </div>
              {field('Utilities estimate (₹/mo)', inp('utilities_estimate', '2000', 'number'))}
              {field('Tagline', (
                <textarea value={listForm.tagline} onChange={e => setListForm(v => ({ ...v, tagline: e.target.value }))}
                  placeholder="e.g. Fully furnished flat with sea view, 5 min from metro"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              ))}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setListOpen(false)}
                  className="flex-1 py-3 rounded-full border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={listLoading || !listForm.title || !listForm.city || !listForm.base_rent}
                  className="flex-1 py-3 rounded-full bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  {listLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  {listLoading ? 'Listing…' : 'List Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
