import React, { useState, useEffect } from 'react';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Clock,
  Coins,
  Car,
  Zap,
  Building,
  Check,
  Copy,
  Send,
  ArrowRight,
  Scale,
  RefreshCw,
  Info,
  ChevronDown
} from 'lucide-react';
import {
  PropertyCostInput,
  TrueCostReport,
  ComparisonResult,
  NegotiationDraft,
  CorridorBenchmarksMap
} from '../types/truecost';
import {
  fetchTrueCostCorridors,
  calculateTrueCost,
  compareProperties,
  generateRentNegotiation
} from '../services/api';

const DEFAULT_FLAT_A: PropertyCostInput = {
  property_name: 'Vastrapur Central 2BHK',
  city: 'ahmedabad',
  corridor_key: 'vastrapur',
  bhk_type: '2BHK',
  base_rent_inr: 24000,
  security_deposit_inr: 48000,
  society_maintenance_inr: 2500,
  dg_backup_units_kwh: 40,
  dg_backup_rate_per_kwh: 24,
  parking_fee_inr: 500,
  one_time_brokerage_inr: 12000,
  one_time_society_move_in_fee_inr: 1000,
  tenure_months: 11,
  daily_commute_km_one_way: 3,
  daily_travel_cost_inr: 30,
  one_way_commute_minutes: 12
};

const DEFAULT_FLAT_B: PropertyCostInput = {
  property_name: 'Bopal Suburb 2BHK (Cheaper Rent Trap)',
  city: 'ahmedabad',
  corridor_key: 'bopal_south_bopal',
  bhk_type: '2BHK',
  base_rent_inr: 17500,
  security_deposit_inr: 35000,
  society_maintenance_inr: 2200,
  dg_backup_units_kwh: 60,
  dg_backup_rate_per_kwh: 24,
  parking_fee_inr: 0,
  one_time_brokerage_inr: 17500,
  one_time_society_move_in_fee_inr: 2000,
  tenure_months: 11,
  daily_commute_km_one_way: 16,
  daily_travel_cost_inr: 220,
  one_way_commute_minutes: 45
};

export const TrueCostCalculator: React.FC = () => {
  // Mode: 'single' | 'compare'
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  // Corridors metadata
  const [corridorsMap, setCorridorsMap] = useState<CorridorBenchmarksMap | null>(null);
  const [loadingCorridors, setLoadingCorridors] = useState<boolean>(true);

  // Flat A & Flat B inputs
  const [flatA, setFlatA] = useState<PropertyCostInput>(DEFAULT_FLAT_A);
  const [flatB, setFlatB] = useState<PropertyCostInput>(DEFAULT_FLAT_B);

  // Results
  const [singleReport, setSingleReport] = useState<TrueCostReport | null>(null);
  const [compareReport, setCompareReport] = useState<ComparisonResult | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Negotiation Modal
  const [negotiationDraft, setNegotiationDraft] = useState<NegotiationDraft | null>(null);
  const [loadingNegotiation, setLoadingNegotiation] = useState<boolean>(false);
  const [copiedDraft, setCopiedDraft] = useState<boolean>(false);

  // Load Corridors on Mount
  useEffect(() => {
    fetchTrueCostCorridors()
      .then((data) => {
        setCorridorsMap(data);
        setLoadingCorridors(false);
      })
      .catch((err) => {
        console.error('Failed to load corridor benchmarks:', err);
        setLoadingCorridors(false);
      });
  }, []);

  // Run calculation on initial load and when flatA changes in single mode
  useEffect(() => {
    handleCalculateSingle();
  }, []);

  const handleCalculateSingle = async () => {
    setCalculating(true);
    setErrorMsg(null);
    try {
      const res = await calculateTrueCost(flatA);
      setSingleReport(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error calculating TrueCost');
    } finally {
      setCalculating(false);
    }
  };

  const handleCalculateCompare = async () => {
    setCalculating(true);
    setErrorMsg(null);
    try {
      const res = await compareProperties(flatA, flatB);
      setCompareReport(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error comparing properties');
    } finally {
      setCalculating(false);
    }
  };

  const handleOpenNegotiation = async (prop: PropertyCostInput, report: TrueCostReport) => {
    setLoadingNegotiation(true);
    try {
      const draft = await generateRentNegotiation({
        property_name: prop.property_name || 'Apartment',
        base_rent: prop.base_rent_inr,
        corridor_benchmark_rent: report.corridor_analytics.benchmark_avg_rent || prop.base_rent_inr,
        maintenance: prop.society_maintenance_inr,
        deposit_months: report.deposit_analytics.deposit_to_rent_ratio,
        landlord_name: 'Owner'
      });
      setNegotiationDraft(draft);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNegotiation(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  // Quick preset loader
  const loadPreset = (city: string, corridor: string, rent: number, dep: number, maint: number) => {
    setFlatA({
      ...flatA,
      city,
      corridor_key: corridor,
      base_rent_inr: rent,
      security_deposit_inr: dep,
      society_maintenance_inr: maint
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Pillar 4: Living Cost & Anti-Deception Rent Shield
            </span>
            <span className="text-xs text-slate-500">• Model Tenancy Act Aligned</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Calculator className="w-8 h-8 text-teal-400" />
            TrueCost Index™
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Unbundle hidden society maintenance, DG backup charges, deposit opportunity loss, and daily commute burnout. 
            Know the exact real cost of every rupee before signing.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner self-start md:self-auto">
          <button
            onClick={() => {
              setViewMode('single');
              handleCalculateSingle();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'single'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Single Flat Deep Dive
          </button>
          <button
            onClick={() => {
              setViewMode('compare');
              handleCalculateCompare();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'compare'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Flat A vs Flat B Faceoff
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs text-slate-400">
        <span className="font-semibold text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Benchmarks:
        </span>
        <button
          onClick={() => loadPreset('ahmedabad', 'vastrapur', 24000, 48000, 2500)}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all whitespace-nowrap"
        >
          Ahmedabad (Vastrapur 2BHK)
        </button>
        <button
          onClick={() => loadPreset('ahmedabad', 'sg_highway', 20000, 40000, 2200)}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all whitespace-nowrap"
        >
          Ahmedabad (SG Highway Corporate)
        </button>
        <button
          onClick={() => loadPreset('bengaluru', 'koramangala', 38000, 228000, 4500)}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400/90 hover:text-amber-300 transition-all whitespace-nowrap"
        >
          Bengaluru (Koramangala 6-Mo Deposit Trap)
        </button>
        <button
          onClick={() => loadPreset('mumbai', 'andheri_west', 52000, 156000, 5000)}
          className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all whitespace-nowrap"
        >
          Mumbai (Andheri West 2BHK)
        </button>
      </div>

      {/* Main Grid: Forms & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className={viewMode === 'compare' ? 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6' : 'lg:col-span-5 space-y-6'}>
          {/* FLAT A FORM */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <h3 className="font-bold text-white text-sm">
                  {viewMode === 'compare' ? 'Flat Option A (e.g. City Center)' : 'Property Details & Monthly Overheads'}
                </h3>
              </div>
              <span className="text-xs text-slate-500">11-Mo Tenure</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Property Label / Name</label>
                <input
                  type="text"
                  value={flatA.property_name}
                  onChange={(e) => setFlatA({ ...flatA, property_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                  placeholder="e.g. Green Acres Flat 302"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">City</label>
                  <select
                    value={flatA.city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      const firstCorridor = corridorsMap?.[newCity]?.corridors
                        ? Object.keys(corridorsMap[newCity].corridors)[0]
                        : 'vastrapur';
                      setFlatA({ ...flatA, city: newCity, corridor_key: firstCorridor });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                  >
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="mumbai">Mumbai</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Corridor / Locality</label>
                  <select
                    value={flatA.corridor_key}
                    onChange={(e) => setFlatA({ ...flatA, corridor_key: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                  >
                    {corridorsMap && corridorsMap[flatA.city]?.corridors ? (
                      Object.entries(corridorsMap[flatA.city].corridors).map(([key, item]) => (
                        <option key={key} value={key}>
                          {item.name}
                        </option>
                      ))
                    ) : (
                      <option value="vastrapur">Vastrapur / IIM-A</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="pt-2 border-t border-slate-800/60">
                <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-2.5">
                  Monthly Direct Outflows (INR)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Advertised Rent (₹/mo)</label>
                    <input
                      type="number"
                      value={flatA.base_rent_inr}
                      onChange={(e) => setFlatA({ ...flatA, base_rent_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={flatA.security_deposit_inr}
                      onChange={(e) => setFlatA({ ...flatA, security_deposit_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Society Maintenance (₹/mo)</label>
                    <input
                      type="number"
                      value={flatA.society_maintenance_inr}
                      onChange={(e) => setFlatA({ ...flatA, society_maintenance_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">DG Backup (Units/mo)</label>
                    <input
                      type="number"
                      value={flatA.dg_backup_units_kwh}
                      onChange={(e) => setFlatA({ ...flatA, dg_backup_units_kwh: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                      placeholder="e.g. 40 units @ ₹24"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Brokerage (One-Time ₹)</label>
                    <input
                      type="number"
                      value={flatA.one_time_brokerage_inr}
                      onChange={(e) => setFlatA({ ...flatA, one_time_brokerage_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Parking Fee (₹/mo)</label>
                    <input
                      type="number"
                      value={flatA.parking_fee_inr}
                      onChange={(e) => setFlatA({ ...flatA, parking_fee_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Commute Inputs */}
              <div className="pt-2 border-t border-slate-800/60">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                  Daily Commute & Burnout
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">One-Way (km)</label>
                    <input
                      type="number"
                      value={flatA.daily_commute_km_one_way}
                      onChange={(e) => setFlatA({ ...flatA, daily_commute_km_one_way: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Daily Cab/Fuel (₹)</label>
                    <input
                      type="number"
                      value={flatA.daily_travel_cost_inr}
                      onChange={(e) => setFlatA({ ...flatA, daily_travel_cost_inr: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">One-Way (Min)</label>
                    <input
                      type="number"
                      value={flatA.one_way_commute_minutes}
                      onChange={(e) => setFlatA({ ...flatA, one_way_commute_minutes: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {viewMode === 'single' && (
                <button
                  onClick={handleCalculateSingle}
                  disabled={calculating}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/10"
                >
                  {calculating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Computing TrueCost Index...
                    </>
                  ) : (
                    <>
                      <Calculator className="w-3.5 h-3.5" />
                      Compute Total Monthly TrueCost
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* FLAT B FORM (ONLY IN COMPARE MODE) */}
          {viewMode === 'compare' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                    B
                  </div>
                  <h3 className="font-bold text-white text-sm">Flat Option B (e.g. Suburb / Lower Rent)</h3>
                </div>
                <span className="text-xs text-slate-500">11-Mo Tenure</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Property Label / Name</label>
                  <input
                    type="text"
                    value={flatB.property_name}
                    onChange={(e) => setFlatB({ ...flatB, property_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                    placeholder="e.g. Suburb Green Flat 501"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">City</label>
                    <select
                      value={flatB.city}
                      onChange={(e) => setFlatB({ ...flatB, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                    >
                      <option value="ahmedabad">Ahmedabad</option>
                      <option value="bengaluru">Bengaluru</option>
                      <option value="mumbai">Mumbai</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Corridor / Locality</label>
                    <select
                      value={flatB.corridor_key}
                      onChange={(e) => setFlatB({ ...flatB, corridor_key: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                    >
                      {corridorsMap && corridorsMap[flatB.city]?.corridors ? (
                        Object.entries(corridorsMap[flatB.city].corridors).map(([key, item]) => (
                          <option key={key} value={key}>
                            {item.name}
                          </option>
                        ))
                      ) : (
                        <option value="bopal_south_bopal">Bopal / South Bopal</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Financial Inputs */}
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                    Monthly Direct Outflows (INR)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Advertised Rent (₹/mo)</label>
                      <input
                        type="number"
                        value={flatB.base_rent_inr}
                        onChange={(e) => setFlatB({ ...flatB, base_rent_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Security Deposit (₹)</label>
                      <input
                        type="number"
                        value={flatB.security_deposit_inr}
                        onChange={(e) => setFlatB({ ...flatB, security_deposit_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Society Maintenance (₹/mo)</label>
                      <input
                        type="number"
                        value={flatB.society_maintenance_inr}
                        onChange={(e) => setFlatB({ ...flatB, society_maintenance_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">DG Backup (Units/mo)</label>
                      <input
                        type="number"
                        value={flatB.dg_backup_units_kwh}
                        onChange={(e) => setFlatB({ ...flatB, dg_backup_units_kwh: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Brokerage (One-Time ₹)</label>
                      <input
                        type="number"
                        value={flatB.one_time_brokerage_inr}
                        onChange={(e) => setFlatB({ ...flatB, one_time_brokerage_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Parking Fee (₹/mo)</label>
                      <input
                        type="number"
                        value={flatB.parking_fee_inr}
                        onChange={(e) => setFlatB({ ...flatB, parking_fee_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Commute Inputs */}
                <div className="pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2.5">
                    Daily Commute & Burnout
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">One-Way (km)</label>
                      <input
                        type="number"
                        value={flatB.daily_commute_km_one_way}
                        onChange={(e) => setFlatB({ ...flatB, daily_commute_km_one_way: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Daily Cab/Fuel (₹)</label>
                      <input
                        type="number"
                        value={flatB.daily_travel_cost_inr}
                        onChange={(e) => setFlatB({ ...flatB, daily_travel_cost_inr: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">One-Way (Min)</label>
                      <input
                        type="number"
                        value={flatB.one_way_commute_minutes}
                        onChange={(e) => setFlatB({ ...flatB, one_way_commute_minutes: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCalculateCompare}
                  disabled={calculating}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10"
                >
                  {calculating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Computing TCO Faceoff...
                    </>
                  ) : (
                    <>
                      <Scale className="w-3.5 h-3.5" />
                      Compare 11-Month TCO Faceoff
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Analytics & Visualization */}
        <div className={viewMode === 'compare' ? 'lg:col-span-12 space-y-6' : 'lg:col-span-7 space-y-6'}>
          {errorMsg && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SINGLE PROPERTY REPORT VIEW */}
          {viewMode === 'single' && singleReport && (
            <div className="space-y-6">
              {/* Primary TrueCost Metric Card */}
              <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">Total Effective Monthly Drain</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        ₹{singleReport.effective_monthly_cost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400 block">Advertised Base Rent</span>
                    <div className="text-xl font-bold text-slate-300 mt-1 line-through decoration-rose-500/80">
                      ₹{singleReport.base_rent.toLocaleString('en-IN')}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 mt-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +{singleReport.hidden_overhead_pct}% Hidden Drain
                    </span>
                  </div>
                </div>

                {/* Stacked Breakdown Visualization Bar */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">True Monthly Cost Composition</span>
                    <span className="text-slate-400 text-[11px]">
                      Base ₹{singleReport.base_rent.toLocaleString('en-IN')} + Overheads ₹{singleReport.hidden_overhead_monthly.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Proportional Stack Bar */}
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
                    <div
                      title={`Base Rent: ₹${singleReport.breakdown_monthly.base_rent}`}
                      style={{
                        width: `${(singleReport.breakdown_monthly.base_rent / singleReport.effective_monthly_cost) * 100}%`
                      }}
                      className="bg-teal-500 transition-all duration-500"
                    />
                    <div
                      title={`Society Maintenance: ₹${singleReport.breakdown_monthly.society_maintenance}`}
                      style={{
                        width: `${(singleReport.breakdown_monthly.society_maintenance / singleReport.effective_monthly_cost) * 100}%`
                      }}
                      className="bg-sky-500 transition-all duration-500"
                    />
                    <div
                      title={`DG Power & Parking: ₹${singleReport.breakdown_monthly.dg_power_backup + singleReport.breakdown_monthly.parking_fee}`}
                      style={{
                        width: `${((singleReport.breakdown_monthly.dg_power_backup + singleReport.breakdown_monthly.parking_fee) / singleReport.effective_monthly_cost) * 100}%`
                      }}
                      className="bg-indigo-500 transition-all duration-500"
                    />
                    <div
                      title={`Deposit Opportunity Cost: ₹${singleReport.breakdown_monthly.deposit_opportunity_cost}`}
                      style={{
                        width: `${(singleReport.breakdown_monthly.deposit_opportunity_cost / singleReport.effective_monthly_cost) * 100}%`
                      }}
                      className="bg-amber-500 transition-all duration-500"
                    />
                    <div
                      title={`Amortized Brokerage: ₹${singleReport.breakdown_monthly.amortized_brokerage_and_fees}`}
                      style={{
                        width: `${(singleReport.breakdown_monthly.amortized_brokerage_and_fees / singleReport.effective_monthly_cost) * 100}%`
                      }}
                      className="bg-rose-500 transition-all duration-500"
                    />
                    <div
                      title={`Commute Expenses: ₹${singleReport.breakdown_monthly.commute_expenses}`}
                      style={{
                        width: `${(singleReport.breakdown_monthly.commute_expenses / singleReport.effective_monthly_cost) * 100}%`
                      }}
                      className="bg-emerald-500 transition-all duration-500"
                    />
                  </div>

                  {/* Legend Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-teal-500 flex-shrink-0" />
                      <span className="text-slate-400 truncate">Rent:</span>
                      <span className="font-semibold text-white ml-auto">₹{singleReport.breakdown_monthly.base_rent.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-sky-500 flex-shrink-0" />
                      <span className="text-slate-400 truncate">Maintenance:</span>
                      <span className="font-semibold text-white ml-auto">₹{singleReport.breakdown_monthly.society_maintenance.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 flex-shrink-0" />
                      <span className="text-slate-400 truncate">DG & Parking:</span>
                      <span className="font-semibold text-white ml-auto">₹{(singleReport.breakdown_monthly.dg_power_backup + singleReport.breakdown_monthly.parking_fee).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-amber-500 flex-shrink-0" />
                      <span className="text-slate-400 truncate">Deposit Opp. Cost:</span>
                      <span className="font-semibold text-amber-400 ml-auto">₹{singleReport.breakdown_monthly.deposit_opportunity_cost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 flex-shrink-0" />
                      <span className="text-slate-400 truncate">Brokerage Amort.:</span>
                      <span className="font-semibold text-white ml-auto">₹{singleReport.breakdown_monthly.amortized_brokerage_and_fees.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 flex-shrink-0" />
                      <span className="text-slate-400 truncate">Commute Fuel/Cab:</span>
                      <span className="font-semibold text-emerald-400 ml-auto">₹{singleReport.breakdown_monthly.commute_expenses.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Analytics Sub-Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Deposit Wealth Siphon */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>Deposit Opportunity Loss</span>
                  </div>
                  <div>
                    <div className="text-lg font-black text-amber-400">
                      ₹{singleReport.deposit_analytics.total_tenure_lost_wealth.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Lost returns over 11 months @ 7.1% liquid benchmark.
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Deposit Multiplier:</span>
                    <span className={`font-bold ${singleReport.deposit_analytics.deposit_to_rent_ratio > 2.5 ? 'text-rose-400' : 'text-teal-400'}`}>
                      {singleReport.deposit_analytics.deposit_to_rent_ratio}x Rent
                    </span>
                  </div>
                </div>

                {/* 2. Commute Burnout Multiplier */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>Commute & Life Burnout</span>
                  </div>
                  <div>
                    <div className="text-lg font-black text-white">
                      {singleReport.commute_burnout.monthly_hours_lost_in_traffic} Hours
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Lost sitting in traffic each month (~{(singleReport.commute_burnout.monthly_hours_lost_in_traffic / 8).toFixed(1)} full workdays).
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Monthly Cash Drain:</span>
                    <span className="font-bold text-white">
                      ₹{singleReport.commute_burnout.monthly_commute_cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 3. Corridor Market Benchmark */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Building className="w-4 h-4 text-teal-400" />
                    <span>Corridor Price Gauge</span>
                  </div>
                  <div>
                    <div className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-white border border-slate-700">
                      {singleReport.corridor_analytics.verdict_badge}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {singleReport.corridor_analytics.deviation_pct >= 0 ? '+' : ''}
                      {singleReport.corridor_analytics.deviation_pct}% vs. Corridor Avg (₹
                      {singleReport.corridor_analytics.benchmark_avg_rent?.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Locality:</span>
                    <span className="font-semibold text-white truncate max-w-[130px]">
                      {singleReport.corridor_analytics.corridor_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Upfront Liquidity Needed & Negotiation Drafter */}
              <div className="p-5 bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                <div>
                  <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider block">
                    Total Liquidity Required to Move-In
                  </span>
                  <div className="text-2xl font-black text-white mt-1">
                    ₹{singleReport.total_tenure_cash_needed.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Includes full 11-month living outflows + refundable security deposit.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenNegotiation(flatA, singleReport)}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all whitespace-nowrap shadow-md shadow-teal-500/10"
                >
                  <Send className="w-3.5 h-3.5" />
                  Draft WhatsApp Negotiation Counter
                </button>
              </div>
            </div>
          )}

          {/* COMPARE RESULTS VIEW */}
          {viewMode === 'compare' && compareReport && (
            <div className="space-y-6">
              {/* Winner Declaration Banner */}
              <div className="p-6 bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/40 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center font-black">
                    🏆
                  </div>
                  <div>
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                      Clear Financial & Lifestyle Winner
                    </span>
                    <h2 className="text-xl font-extrabold text-white">
                      {compareReport.winner_name}
                    </h2>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xs text-slate-400 block">Total 11-Mo Savings</span>
                    <div className="text-2xl font-black text-teal-400">
                      ₹{compareReport.total_tenure_savings_inr.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-4 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {compareReport.summary}
                </p>
              </div>

              {/* Side-by-Side Faceoff Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Flat A Card */}
                <div className={`p-5 rounded-2xl border ${compareReport.winner === 'flat_a' ? 'bg-teal-950/20 border-teal-500/40' : 'bg-slate-900/90 border-slate-800'}`}>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm">Flat A: {compareReport.flat_a.property_name}</h3>
                    {compareReport.winner === 'flat_a' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500 text-slate-950">
                        WINNER
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Advertised Rent:</span>
                      <span className="font-bold text-white">₹{compareReport.flat_a.base_rent.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Effective Monthly Cost:</span>
                      <span className="font-extrabold text-teal-400 text-sm">
                        ₹{compareReport.flat_a.effective_monthly_cost.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Monthly Traffic Hours:</span>
                      <span className="font-semibold text-white">{compareReport.flat_a.commute_burnout.monthly_hours_lost_in_traffic} hrs</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Deposit Opportunity Cost:</span>
                      <span className="font-semibold text-amber-400">₹{compareReport.flat_a.deposit_analytics.total_tenure_lost_wealth.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Corridor Verdict:</span>
                      <span className="font-semibold text-slate-300">{compareReport.flat_a.corridor_analytics.verdict_badge}</span>
                    </div>
                  </div>
                </div>

                {/* Flat B Card */}
                <div className={`p-5 rounded-2xl border ${compareReport.winner === 'flat_b' ? 'bg-teal-950/20 border-teal-500/40' : 'bg-slate-900/90 border-slate-800'}`}>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-white text-sm">Flat B: {compareReport.flat_b.property_name}</h3>
                    {compareReport.winner === 'flat_b' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500 text-slate-950">
                        WINNER
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Advertised Rent:</span>
                      <span className="font-bold text-white">₹{compareReport.flat_b.base_rent.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Effective Monthly Cost:</span>
                      <span className="font-extrabold text-amber-400 text-sm">
                        ₹{compareReport.flat_b.effective_monthly_cost.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Monthly Traffic Hours:</span>
                      <span className="font-semibold text-white">{compareReport.flat_b.commute_burnout.monthly_hours_lost_in_traffic} hrs</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Deposit Opportunity Cost:</span>
                      <span className="font-semibold text-amber-400">₹{compareReport.flat_b.deposit_analytics.total_tenure_lost_wealth.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Corridor Verdict:</span>
                      <span className="font-semibold text-slate-300">{compareReport.flat_b.corridor_analytics.verdict_badge}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Negotiation Draft Modal */}
      {negotiationDraft && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-white text-base">WhatsApp Counter-Offer Drafter</h3>
              </div>
              <button
                onClick={() => setNegotiationDraft(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Current Advertised Rent:</span>
                  <span className="font-bold text-white">₹{negotiationDraft.current_rent.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Proposed Data-Backed Rent:</span>
                  <span className="font-bold text-teal-400">₹{negotiationDraft.proposed_rent.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  Ready-to-Send Negotiation Message
                </label>
                <textarea
                  readOnly
                  rows={8}
                  value={negotiationDraft.negotiation_message}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono leading-relaxed outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => copyToClipboard(negotiationDraft.negotiation_message)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDraft ? 'Copied to Clipboard!' : 'Copy Text'}
              </button>

              <a
                href={negotiationDraft.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                Open WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
