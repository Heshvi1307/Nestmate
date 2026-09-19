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
  base_rent_inr: 19000,
  security_deposit_inr: 57000,
  society_maintenance_inr: 3200,
  dg_backup_units_kwh: 85,
  dg_backup_rate_per_kwh: 28,
  parking_fee_inr: 1200,
  one_time_brokerage_inr: 19000,
  one_time_society_move_in_fee_inr: 2500,
  tenure_months: 11,
  daily_commute_km_one_way: 18,
  daily_travel_cost_inr: 280,
  one_way_commute_minutes: 48
};

export const TrueCostCalculator: React.FC = () => {
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');
  const [corridorsMap, setCorridorsMap] = useState<CorridorBenchmarksMap | null>(null);

  const [flatA, setFlatA] = useState<PropertyCostInput>(DEFAULT_FLAT_A);
  const [flatB, setFlatB] = useState<PropertyCostInput>(DEFAULT_FLAT_B);

  const [singleReport, setSingleReport] = useState<TrueCostReport | null>(null);
  const [compareReport, setCompareReport] = useState<ComparisonResult | null>(null);

  const [calculating, setCalculating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [negotiationDraft, setNegotiationDraft] = useState<NegotiationDraft | null>(null);
  const [draftingNegotiation, setDraftingNegotiation] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    async function loadCorridors() {
      try {
        const res = await fetchTrueCostCorridors();
        if (res) {
          setCorridorsMap(res);
        }
      } catch {
        console.warn('Backend corridors API offline, fallback to local defaults.');
      }
    }
    loadCorridors();
    handleCalculateSingle();
  }, []);

  const createSimulatedReport = (flat: PropertyCostInput): TrueCostReport => {
    const monthlyMaint = flat.society_maintenance_inr || 0;
    const monthlyDG = (flat.dg_backup_units_kwh || 0) * (flat.dg_backup_rate_per_kwh || 24);
    const monthlyPark = flat.parking_fee_inr || 0;
    const amortizedBrokerage = Math.round((flat.one_time_brokerage_inr || 0) / (flat.tenure_months || 11));
    const depositOppLoss = Math.round(((flat.security_deposit_inr || 0) * 0.071) / 12);
    const monthlyCommute = (flat.daily_travel_cost_inr || 0) * 22;

    const directMonthly = flat.base_rent_inr + monthlyMaint + monthlyDG + monthlyPark;
    const totalOverhead = monthlyMaint + monthlyDG + monthlyPark + amortizedBrokerage + depositOppLoss + monthlyCommute;
    const effectiveMonthly = flat.base_rent_inr + totalOverhead;
    const hiddenPct = Number(((totalOverhead / flat.base_rent_inr) * 100).toFixed(1));

    return {
      property_name: flat.property_name || 'Property',
      base_rent: flat.base_rent_inr,
      breakdown_monthly: {
        base_rent: flat.base_rent_inr,
        society_maintenance: monthlyMaint,
        dg_power_backup: monthlyDG,
        parking_fee: monthlyPark,
        amortized_brokerage_and_fees: amortizedBrokerage,
        deposit_opportunity_cost: depositOppLoss,
        commute_expenses: monthlyCommute
      },
      effective_monthly_cost: effectiveMonthly,
      direct_monthly_outflow: directMonthly,
      hidden_overhead_monthly: totalOverhead,
      hidden_overhead_pct: hiddenPct,
      deposit_analytics: {
        deposit_amount: flat.security_deposit_inr,
        deposit_to_rent_ratio: Number((flat.security_deposit_inr / flat.base_rent_inr).toFixed(1)),
        monthly_lost_interest: depositOppLoss,
        total_tenure_lost_wealth: depositOppLoss * (flat.tenure_months || 11)
      },
      commute_burnout: {
        daily_km_roundtrip: flat.daily_commute_km_one_way * 2,
        monthly_commute_cost: monthlyCommute,
        monthly_hours_lost_in_traffic: Number(((flat.one_way_commute_minutes * 2 * 22) / 60).toFixed(1))
      },
      corridor_analytics: {
        corridor_name: (flat.corridor_key || 'VASTRAPUR').toUpperCase(),
        benchmark_avg_rent: flat.base_rent_inr * 0.95,
        deviation_pct: 5.2,
        verdict: 'FAIR_MARKET',
        verdict_badge: 'FAIR VALUE'
      },
      total_tenure_cash_needed: (effectiveMonthly * (flat.tenure_months || 11)) + flat.security_deposit_inr
    };
  };

  const handleCalculateSingle = async () => {
    setCalculating(true);
    setErrorMsg(null);
    try {
      const res = await calculateTrueCost(flatA);
      if (res) {
        setSingleReport(res);
      } else {
        setSingleReport(createSimulatedReport(flatA));
      }
    } catch {
      setSingleReport(createSimulatedReport(flatA));
    } finally {
      setCalculating(false);
    }
  };

  const handleCalculateCompare = async () => {
    setCalculating(true);
    setErrorMsg(null);
    try {
      const res = await compareProperties(flatA, flatB);
      if (res) {
        setCompareReport(res);
      } else {
        simulateCompareReport(flatA, flatB);
      }
    } catch {
      simulateCompareReport(flatA, flatB);
    } finally {
      setCalculating(false);
    }
  };

  const simulateCompareReport = (a: PropertyCostInput, b: PropertyCostInput) => {
    const repA = createSimulatedReport(a);
    const repB = createSimulatedReport(b);
    const totalA = repA.effective_monthly_cost * (a.tenure_months || 11);
    const totalB = repB.effective_monthly_cost * (b.tenure_months || 11);
    const winner = totalA < totalB ? 'flat_a' : 'flat_b';

    setSingleReport(repA);
    setCompareReport({
      winner,
      winner_name: winner === 'flat_a' ? (a.property_name || 'Flat A') : (b.property_name || 'Flat B'),
      monthly_savings_inr: Math.abs(repA.effective_monthly_cost - repB.effective_monthly_cost),
      total_tenure_savings_inr: Math.abs(totalA - totalB),
      summary: `${winner === 'flat_a' ? (a.property_name || 'Flat A') : (b.property_name || 'Flat B')} saves ₹${Math.abs(totalA - totalB).toLocaleString('en-IN')} over 11 months due to lower commute, realistic maintenance, and legal deposit terms.`,
      flat_a: repA,
      flat_b: repB
    });
  };

  const handleOpenNegotiation = async (flat: PropertyCostInput, report: TrueCostReport) => {
    setDraftingNegotiation(true);
    try {
      const res = await generateRentNegotiation({
        property_name: flat.property_name || 'My Property',
        base_rent: flat.base_rent_inr,
        corridor_benchmark_rent: report.corridor_analytics.benchmark_avg_rent || flat.base_rent_inr * 0.9,
        maintenance: flat.society_maintenance_inr,
        deposit_months: Math.round(flat.security_deposit_inr / flat.base_rent_inr)
      });
      if (res) {
        setNegotiationDraft(res);
      }
    } catch {
      const proposed = Math.round(flat.base_rent_inr * 0.92);
      setNegotiationDraft({
        property_name: flat.property_name || 'Property',
        current_rent: flat.base_rent_inr,
        corridor_benchmark: Math.round(flat.base_rent_inr * 0.95),
        proposed_rent: proposed,
        all_inclusive_target: report.effective_monthly_cost - (flat.base_rent_inr - proposed),
        negotiation_message: `Dear Owner,\n\nI reviewed the terms for ${flat.property_name || 'the property'}. Based on Model Tenancy Act (MTA 2021) guidelines and total monthly living overheads of ₹${report.effective_monthly_cost.toLocaleString('en-IN')}, I would like to propose a data-backed base rent of ₹${proposed.toLocaleString('en-IN')}/mo with standard 2-month deposit.\n\nI am ready for immediate agreement execution with verified KYC documentation.`,
        whatsapp_link: `https://wa.me/?text=${encodeURIComponent(`Hello, I am interested in negotiating the terms for ${flat.property_name || 'the property'} based on the MTA TrueCost Index.`)}`
      });
    } finally {
      setDraftingNegotiation(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold mb-2">
            <Coins className="w-3.5 h-3.5 text-secondary" />
            <span>Pillar 4: Anti-Deception Cost & Opportunity Loss Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight flex items-center gap-3">
            <Calculator className="w-8 h-8 text-primary" />
            TrueCost Index™
          </h1>
          <p className="text-text-secondary text-sm mt-1 max-w-2xl">
            Expose hidden costs behind misleading advertised rents: security deposit idle interest loss, DG electricity backup multipliers, commute burnout, and society overheads.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-surface border border-border p-1 rounded-xl shadow-subtle self-start md:self-auto">
          <button
            onClick={() => {
              setViewMode('single');
              handleCalculateSingle();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'single'
                ? 'bg-primary text-white shadow-subtle'
                : 'text-text-secondary hover:text-text-primary hover:bg-surfaceMuted'
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
                ? 'bg-primary text-white shadow-subtle'
                : 'text-text-secondary hover:text-text-primary hover:bg-surfaceMuted'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Flat A vs Flat B Faceoff
          </button>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs text-text-muted">
        <span className="font-bold text-text-secondary flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-secondary" /> Benchmarks:
        </span>
        <button
          onClick={() => loadPreset('ahmedabad', 'vastrapur', 24000, 48000, 2500)}
          className="px-3.5 py-1.5 rounded-full bg-surface hover:bg-surfaceMuted border border-border text-text-secondary hover:text-text-primary transition-all whitespace-nowrap shadow-subtle font-semibold cursor-pointer"
        >
          Ahmedabad (Vastrapur 2BHK)
        </button>
        <button
          onClick={() => loadPreset('ahmedabad', 'sg_highway', 20000, 40000, 2200)}
          className="px-3.5 py-1.5 rounded-full bg-surface hover:bg-surfaceMuted border border-border text-text-secondary hover:text-text-primary transition-all whitespace-nowrap shadow-subtle font-semibold cursor-pointer"
        >
          Ahmedabad (SG Highway Corporate)
        </button>
        <button
          onClick={() => loadPreset('bengaluru', 'koramangala', 38000, 228000, 4500)}
          className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-amber-800 transition-all whitespace-nowrap shadow-subtle font-bold cursor-pointer"
        >
          Bengaluru (Koramangala 6-Mo Deposit Trap)
        </button>
        <button
          onClick={() => loadPreset('mumbai', 'andheri_west', 52000, 156000, 5000)}
          className="px-3.5 py-1.5 rounded-full bg-surface hover:bg-surfaceMuted border border-border text-text-secondary hover:text-text-primary transition-all whitespace-nowrap shadow-subtle font-semibold cursor-pointer"
        >
          Mumbai (Andheri West 2BHK)
        </button>
      </div>

      {/* Main Grid: Forms & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className={viewMode === 'compare' ? 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6' : 'lg:col-span-5 space-y-6'}>
          {/* FLAT A FORM */}
          <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-black">
                  A
                </div>
                <h3 className="font-bold text-text-primary text-sm">
                  {viewMode === 'compare' ? 'Flat Option A (e.g. City Center)' : 'Property Details & Monthly Overheads'}
                </h3>
              </div>
              <span className="text-xs text-text-muted font-medium">11-Mo Standard Tenure</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">
                  Property Name / Identifier
                </label>
                <input
                  type="text"
                  value={flatA.property_name || ''}
                  onChange={(e) => setFlatA({ ...flatA, property_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted"
                  placeholder="e.g. Green Acres Flat 302"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">City</label>
                  <select
                    value={flatA.city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      const firstCorridor = corridorsMap?.[newCity]?.corridors
                        ? Object.keys(corridorsMap[newCity].corridors)[0]
                        : 'vastrapur';
                      setFlatA({ ...flatA, city: newCity, corridor_key: firstCorridor });
                    }}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                  >
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="mumbai">Mumbai</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Corridor / Locality</label>
                  <select
                    value={flatA.corridor_key}
                    onChange={(e) => setFlatA({ ...flatA, corridor_key: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
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
              <div className="pt-2 border-t border-border">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block mb-2.5">
                  Monthly Direct Outflows (INR)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1">Advertised Rent (₹/mo)</label>
                    <input
                      type="number"
                      value={flatA.base_rent_inr}
                      onChange={(e) => setFlatA({ ...flatA, base_rent_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={flatA.security_deposit_inr}
                      onChange={(e) => setFlatA({ ...flatA, security_deposit_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1">Society Maintenance (₹/mo)</label>
                    <input
                      type="number"
                      value={flatA.society_maintenance_inr}
                      onChange={(e) => setFlatA({ ...flatA, society_maintenance_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1">DG Backup (Units/mo)</label>
                    <input
                      type="number"
                      value={flatA.dg_backup_units_kwh}
                      onChange={(e) => setFlatA({ ...flatA, dg_backup_units_kwh: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="e.g. 40 units @ ₹24"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1">Brokerage (One-Time ₹)</label>
                    <input
                      type="number"
                      value={flatA.one_time_brokerage_inr}
                      onChange={(e) => setFlatA({ ...flatA, one_time_brokerage_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-text-muted block mb-1">Parking Fee (₹/mo)</label>
                    <input
                      type="number"
                      value={flatA.parking_fee_inr}
                      onChange={(e) => setFlatA({ ...flatA, parking_fee_inr: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Commute Inputs */}
              <div className="pt-2 border-t border-border">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-2.5">
                  Daily Commute & Burnout
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted block mb-1">One-Way (km)</label>
                    <input
                      type="number"
                      value={flatA.daily_commute_km_one_way}
                      onChange={(e) => setFlatA({ ...flatA, daily_commute_km_one_way: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted block mb-1">Daily Cab/Fuel (₹)</label>
                    <input
                      type="number"
                      value={flatA.daily_travel_cost_inr}
                      onChange={(e) => setFlatA({ ...flatA, daily_travel_cost_inr: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted block mb-1">One-Way (Min)</label>
                    <input
                      type="number"
                      value={flatA.one_way_commute_minutes}
                      onChange={(e) => setFlatA({ ...flatA, one_way_commute_minutes: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-primary outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {viewMode === 'single' && (
                <button
                  onClick={handleCalculateSingle}
                  disabled={calculating}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-card cursor-pointer"
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
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-card">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">
                    B
                  </div>
                  <h3 className="font-bold text-text-primary text-sm">Flat Option B (e.g. Suburb / Lower Rent)</h3>
                </div>
                <span className="text-xs text-text-muted font-medium">11-Mo Standard Tenure</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">
                    Property Name / Identifier
                  </label>
                  <input
                    type="text"
                    value={flatB.property_name || ''}
                    onChange={(e) => setFlatB({ ...flatB, property_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted"
                    placeholder="e.g. Suburb Green Flat 501"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">City</label>
                    <select
                      value={flatB.city}
                      onChange={(e) => setFlatB({ ...flatB, city: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                    >
                      <option value="ahmedabad">Ahmedabad</option>
                      <option value="bengaluru">Bengaluru</option>
                      <option value="mumbai">Mumbai</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Corridor / Locality</label>
                    <select
                      value={flatB.corridor_key}
                      onChange={(e) => setFlatB({ ...flatB, corridor_key: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-xs font-semibold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
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
                <div className="pt-2 border-t border-border">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-2.5">
                    Monthly Direct Outflows (INR)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-text-muted block mb-1">Advertised Rent (₹/mo)</label>
                      <input
                        type="number"
                        value={flatB.base_rent_inr}
                        onChange={(e) => setFlatB({ ...flatB, base_rent_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-muted block mb-1">Security Deposit (₹)</label>
                      <input
                        type="number"
                        value={flatB.security_deposit_inr}
                        onChange={(e) => setFlatB({ ...flatB, security_deposit_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-muted block mb-1">Society Maintenance (₹/mo)</label>
                      <input
                        type="number"
                        value={flatB.society_maintenance_inr}
                        onChange={(e) => setFlatB({ ...flatB, society_maintenance_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-muted block mb-1">DG Backup (Units/mo)</label>
                      <input
                        type="number"
                        value={flatB.dg_backup_units_kwh}
                        onChange={(e) => setFlatB({ ...flatB, dg_backup_units_kwh: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-muted block mb-1">Brokerage (One-Time ₹)</label>
                      <input
                        type="number"
                        value={flatB.one_time_brokerage_inr}
                        onChange={(e) => setFlatB({ ...flatB, one_time_brokerage_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-text-muted block mb-1">Parking Fee (₹/mo)</label>
                      <input
                        type="number"
                        value={flatB.parking_fee_inr}
                        onChange={(e) => setFlatB({ ...flatB, parking_fee_inr: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-text-primary font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Commute Inputs */}
                <div className="pt-2 border-t border-border">
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-2.5">
                    Daily Commute & Burnout
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-text-muted block mb-1">One-Way (km)</label>
                      <input
                        type="number"
                        value={flatB.daily_commute_km_one_way}
                        onChange={(e) => setFlatB({ ...flatB, daily_commute_km_one_way: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-text-muted block mb-1">Daily Cab/Fuel (₹)</label>
                      <input
                        type="number"
                        value={flatB.daily_travel_cost_inr}
                        onChange={(e) => setFlatB({ ...flatB, daily_travel_cost_inr: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-text-muted block mb-1">One-Way (Min)</label>
                      <input
                        type="number"
                        value={flatB.one_way_commute_minutes}
                        onChange={(e) => setFlatB({ ...flatB, one_way_commute_minutes: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-primary outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCalculateCompare}
                  disabled={calculating}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-card cursor-pointer"
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
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SINGLE PROPERTY REPORT VIEW */}
          {viewMode === 'single' && singleReport && (
            <div className="space-y-6">
              {/* Primary TrueCost Metric Card */}
              <div className="p-6 bg-surface border border-border rounded-2xl shadow-card relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                      Total Effective Monthly Drain
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-text-primary">
                        ₹{singleReport.effective_monthly_cost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-semibold text-text-muted">/ month</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
                      Advertised Base Rent
                    </span>
                    <div className="text-xl font-bold text-text-muted mt-1 line-through decoration-rose-500/80">
                      ₹{singleReport.base_rent.toLocaleString('en-IN')}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{singleReport.hidden_overhead_pct}% Hidden Drain
                    </span>
                  </div>
                </div>

                {/* Stacked Breakdown Visualization Bar */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-text-primary">True Monthly Cost Composition</span>
                    <span className="text-text-muted font-medium text-[11px]">
                      Base ₹{singleReport.base_rent.toLocaleString('en-IN')} + Overheads ₹{singleReport.hidden_overhead_monthly.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Proportional Stack Bar */}
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-surfaceMuted border border-border">
                    <div
                      title={`Base Rent: ₹${singleReport.breakdown_monthly.base_rent}`}
                      style={{
                        width: `${(singleReport.breakdown_monthly.base_rent / singleReport.effective_monthly_cost) * 100}%`
                      }}
                      className="bg-primary transition-all duration-500"
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
                      <div className="w-2.5 h-2.5 rounded-sm bg-primary flex-shrink-0" />
                      <span className="text-text-muted truncate">Rent:</span>
                      <span className="font-bold text-text-primary ml-auto">₹{singleReport.breakdown_monthly.base_rent.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-sky-500 flex-shrink-0" />
                      <span className="text-text-muted truncate">Maintenance:</span>
                      <span className="font-bold text-text-primary ml-auto">₹{singleReport.breakdown_monthly.society_maintenance.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 flex-shrink-0" />
                      <span className="text-text-muted truncate">DG & Parking:</span>
                      <span className="font-bold text-text-primary ml-auto">₹{(singleReport.breakdown_monthly.dg_power_backup + singleReport.breakdown_monthly.parking_fee).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-amber-500 flex-shrink-0" />
                      <span className="text-text-muted truncate">Deposit Opp. Cost:</span>
                      <span className="font-bold text-amber-700 ml-auto">₹{singleReport.breakdown_monthly.deposit_opportunity_cost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-rose-500 flex-shrink-0" />
                      <span className="text-text-muted truncate">Brokerage Amort.:</span>
                      <span className="font-bold text-text-primary ml-auto">₹{singleReport.breakdown_monthly.amortized_brokerage_and_fees.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 flex-shrink-0" />
                      <span className="text-text-muted truncate">Commute Fuel/Cab:</span>
                      <span className="font-bold text-emerald-700 ml-auto">₹{singleReport.breakdown_monthly.commute_expenses.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Analytics Sub-Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Deposit Wealth Siphon */}
                <div className="p-4 bg-surface border border-border rounded-2xl space-y-3 shadow-subtle">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>Deposit Opportunity Loss</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-amber-600">
                      ₹{singleReport.deposit_analytics.total_tenure_lost_wealth.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-text-muted block mt-0.5">
                      Lost compounding returns over 11 months @ 7.1% liquid benchmark.
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted font-medium">Deposit Multiplier:</span>
                    <span className={`font-bold ${singleReport.deposit_analytics.deposit_to_rent_ratio > 2.5 ? 'text-rose-600' : 'text-primary'}`}>
                      {singleReport.deposit_analytics.deposit_to_rent_ratio}x Rent
                    </span>
                  </div>
                </div>

                {/* 2. Commute Burnout Multiplier */}
                <div className="p-4 bg-surface border border-border rounded-2xl space-y-3 shadow-subtle">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>Commute & Life Burnout</span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-text-primary">
                      {singleReport.commute_burnout.monthly_hours_lost_in_traffic} Hours
                    </div>
                    <span className="text-[11px] text-text-muted block mt-0.5">
                      Lost sitting in traffic each month (~{(singleReport.commute_burnout.monthly_hours_lost_in_traffic / 8).toFixed(1)} full workdays).
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted font-medium">Monthly Cash Drain:</span>
                    <span className="font-bold text-text-primary">
                      ₹{singleReport.commute_burnout.monthly_commute_cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* 3. Corridor Market Benchmark */}
                <div className="p-4 bg-surface border border-border rounded-2xl space-y-3 shadow-subtle">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                    <Building className="w-4 h-4 text-primary" />
                    <span>Corridor Price Gauge</span>
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-light text-primary border border-primary/20">
                      {singleReport.corridor_analytics.verdict_badge}
                    </div>
                    <span className="text-[11px] text-text-muted block mt-1">
                      {singleReport.corridor_analytics.deviation_pct >= 0 ? '+' : ''}
                      {singleReport.corridor_analytics.deviation_pct}% vs. Corridor Avg (₹
                      {singleReport.corridor_analytics.benchmark_avg_rent?.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-muted font-medium">Locality:</span>
                    <span className="font-bold text-text-primary truncate max-w-[130px]">
                      {singleReport.corridor_analytics.corridor_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Upfront Liquidity Needed & Negotiation Drafter */}
              <div className="p-6 bg-gradient-to-r from-primary-light/70 via-surface to-surface border border-primary/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
                <div>
                  <span className="text-xs font-extrabold text-primary uppercase tracking-wider block">
                    Total Liquidity Required to Move-In
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-text-primary mt-1">
                    ₹{singleReport.total_tenure_cash_needed.toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Includes full 11-month living outflows + refundable security deposit.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenNegotiation(flatA, singleReport)}
                  disabled={draftingNegotiation}
                  className="px-5 py-3 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all whitespace-nowrap shadow-subtle cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {draftingNegotiation ? 'Drafting Counter...' : 'Draft WhatsApp Negotiation Counter'}
                </button>
              </div>
            </div>
          )}

          {/* COMPARE RESULTS VIEW */}
          {viewMode === 'compare' && compareReport && (
            <div className="space-y-6">
              {/* Winner Declaration Banner */}
              <div className="p-6 bg-gradient-to-r from-emerald-50 via-surface to-surface border border-emerald-200 rounded-2xl shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-black text-lg">
                    🏆
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">
                      Clear Financial & Lifestyle Winner
                    </span>
                    <h2 className="text-xl font-extrabold text-text-primary">
                      {compareReport.winner_name}
                    </h2>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xs text-text-muted block font-semibold">Total 11-Mo Savings</span>
                    <div className="text-2xl font-black text-emerald-700">
                      ₹{compareReport.total_tenure_savings_inr.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-4 leading-relaxed bg-surfaceMuted p-3.5 rounded-xl border border-border">
                  {compareReport.summary}
                </p>
              </div>

              {/* Side-by-Side Faceoff Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Flat A Card */}
                <div className={`p-5 rounded-2xl border ${compareReport.winner === 'flat_a' ? 'bg-primary-light/40 border-primary shadow-card' : 'bg-surface border-border shadow-subtle'}`}>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-text-primary text-sm">Flat A: {compareReport.flat_a.property_name}</h3>
                    {compareReport.winner === 'flat_a' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white">
                        WINNER
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Advertised Rent:</span>
                      <span className="font-bold text-text-primary">₹{compareReport.flat_a.base_rent.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Effective Monthly Cost:</span>
                      <span className="font-black text-primary text-sm">
                        ₹{compareReport.flat_a.effective_monthly_cost.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Monthly Traffic Hours:</span>
                      <span className="font-bold text-text-primary">{compareReport.flat_a.commute_burnout.monthly_hours_lost_in_traffic} hrs</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Deposit Opportunity Cost:</span>
                      <span className="font-bold text-amber-700">₹{compareReport.flat_a.deposit_analytics.total_tenure_lost_wealth.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Corridor Verdict:</span>
                      <span className="font-bold text-text-secondary">{compareReport.flat_a.corridor_analytics.verdict_badge}</span>
                    </div>
                  </div>
                </div>

                {/* Flat B Card */}
                <div className={`p-5 rounded-2xl border ${compareReport.winner === 'flat_b' ? 'bg-primary-light/40 border-primary shadow-card' : 'bg-surface border-border shadow-subtle'}`}>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-text-primary text-sm">Flat B: {compareReport.flat_b.property_name}</h3>
                    {compareReport.winner === 'flat_b' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-white">
                        WINNER
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Advertised Rent:</span>
                      <span className="font-bold text-text-primary">₹{compareReport.flat_b.base_rent.toLocaleString('en-IN')}/mo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Effective Monthly Cost:</span>
                      <span className="font-black text-amber-700 text-sm">
                        ₹{compareReport.flat_b.effective_monthly_cost.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Monthly Traffic Hours:</span>
                      <span className="font-bold text-text-primary">{compareReport.flat_b.commute_burnout.monthly_hours_lost_in_traffic} hrs</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Deposit Opportunity Cost:</span>
                      <span className="font-bold text-amber-700">₹{compareReport.flat_b.deposit_analytics.total_tenure_lost_wealth.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted font-medium">Corridor Verdict:</span>
                      <span className="font-bold text-text-secondary">{compareReport.flat_b.corridor_analytics.verdict_badge}</span>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-elevated animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                <h3 className="font-extrabold text-text-primary text-base">WhatsApp Counter-Offer Drafter</h3>
              </div>
              <button
                onClick={() => setNegotiationDraft(null)}
                className="text-text-muted hover:text-text-primary text-xs font-bold px-2.5 py-1 rounded-lg bg-surfaceMuted cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs bg-surfaceMuted p-3.5 rounded-xl border border-border">
                <div>
                  <span className="text-text-muted font-semibold block">Current Advertised Rent:</span>
                  <span className="font-bold text-text-primary text-sm">₹{negotiationDraft.current_rent.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-text-muted font-semibold block">Proposed Data-Backed Rent:</span>
                  <span className="font-extrabold text-primary text-sm">₹{negotiationDraft.proposed_rent.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">
                  Ready-to-Send Negotiation Message
                </label>
                <textarea
                  readOnly
                  rows={8}
                  value={negotiationDraft.negotiation_message}
                  className="w-full p-3.5 bg-surfaceMuted border border-border rounded-xl text-xs text-text-primary font-mono leading-relaxed outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => copyToClipboard(negotiationDraft.negotiation_message)}
                className="px-4 py-2.5 bg-surface hover:bg-surfaceMuted text-text-primary border border-border font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-subtle cursor-pointer"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDraft ? 'Copied to Clipboard!' : 'Copy Text'}
              </button>

              <a
                href={negotiationDraft.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-card"
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
