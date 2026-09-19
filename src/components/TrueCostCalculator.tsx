import React, { useState } from 'react';
import { Calculator, IndianRupee, Loader2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '../utils/apiClient';
import { debugLog, debugError } from '../utils/debug';
import type { Property, TrueCostInput } from '../types';

interface Props { selectedProperty?: Property | null; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TrueCostReport = Record<string, any>;

const CITIES = ['ahmedabad', 'bangalore', 'mumbai', 'pune', 'delhi'];
const CORRIDORS: Record<string, Record<string, string>> = {
  ahmedabad:  { vastrapur: 'Vastrapur / IIM-A', sg_highway: 'SG Highway', prahlad_nagar: 'Prahlad Nagar', bopal_south_bopal: 'Bopal / South Bopal', gift_city_gandhinagar: 'GIFT City' },
  bangalore:  { koramangala: 'Koramangala', whitefield: 'Whitefield', hsr_layout: 'HSR Layout', indiranagar: 'Indiranagar', electronic_city: 'Electronic City' },
  mumbai:     { bandra_andheri: 'Bandra / Andheri', powai_vikhroli: 'Powai / Vikhroli', thane: 'Thane', navi_mumbai: 'Navi Mumbai', goregaon_malad: 'Goregaon / Malad' },
  pune:       { kothrud_karve_nagar: 'Kothrud', baner_balewadi: 'Baner / Balewadi', hinjewadi: 'Hinjewadi IT', viman_nagar: 'Viman Nagar', hadapsar_magarpatta: 'Hadapsar' },
  delhi:      { dwarka: 'Dwarka', noida_sector: 'Noida Sectors', gurgaon_cyber: 'Gurgaon Cyber', rohini: 'Rohini', lajpat_nagar: 'Lajpat Nagar' },
};

export const TrueCostCalculator: React.FC<Props> = ({ selectedProperty }) => {
  const [city, setCity]       = useState(selectedProperty?.city?.toLowerCase() || 'ahmedabad');
  const [corridor, setCorridor] = useState('vastrapur');
  const [bhk, setBhk]         = useState(selectedProperty?.bedrooms?.toString() ? `${selectedProperty.bedrooms}BHK` : '2BHK');
  const [rent, setRent]       = useState(selectedProperty?.base_rent?.toString() ?? '');
  const [deposit, setDeposit] = useState(selectedProperty?.deposit?.toString() ?? '');
  const [maintenance, setMaintenance] = useState('');
  const [brokerage, setBrokerage]     = useState('');
  const [commute, setCommute]         = useState('0');
  const [travelCost, setTravelCost]   = useState('0');

  const [loading, setLoading]   = useState(false);
  const [report, setReport]     = useState<TrueCostReport | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const corridorOptions = CORRIDORS[city] ?? CORRIDORS.ahmedabad;

  const handleCalculate = async () => {
    if (!rent) return;
    setLoading(true);
    setReport(null);
    setError(null);
    try {
      const payload: TrueCostInput = {
        property_name:              selectedProperty?.title ?? 'My Property',
        city,
        corridor_key:               corridor,
        bhk_type:                   bhk,
        base_rent_inr:              parseFloat(rent) || 0,
        security_deposit_inr:       parseFloat(deposit) || 0,
        society_maintenance_inr:    parseFloat(maintenance) || 0,
        parking_fee_inr:            0,
        one_time_brokerage_inr:     parseFloat(brokerage) || 0,
        tenure_months:              11,
        daily_commute_km_one_way:   parseFloat(commute) || 0,
        daily_travel_cost_inr:      parseFloat(travelCost) || 0,
        one_way_commute_minutes:    0,
      };
      const { data } = await api.post<{ success: boolean; report: TrueCostReport }>('/api/truecost/calculate', payload);
      debugLog('TrueCost result', data);
      setReport(data.report);
    } catch (err) {
      debugError('TrueCost failed', err);
      setError('Backend offline. Start FastAPI on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">💰 True Cost Calculator</h2>
        <p className="text-slate-500 text-sm mt-1">Uncover the real all-in monthly cost before you sign</p>
      </div>

      {selectedProperty && (
        <div className="bg-indigo-50 rounded-xl px-4 py-3 text-sm font-medium text-indigo-700 flex items-center gap-2">
          🏠 <span className="truncate">{selectedProperty.title}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
        {/* City + Corridor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">City</label>
            <select value={city} onChange={e => { setCity(e.target.value); setCorridor(Object.keys(CORRIDORS[e.target.value] ?? {})[0] ?? ''); }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
              {CITIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Area / Corridor</label>
            <select value={corridor} onChange={e => setCorridor(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
              {Object.entries(corridorOptions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        {/* BHK */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">BHK Type</label>
          <div className="flex gap-2">
            {['1BHK', '2BHK', '3BHK'].map(b => (
              <button key={b} onClick={() => setBhk(b)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${bhk === b ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Rent + Deposit */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Monthly Rent (₹)*', val: rent, set: setRent, hint: 'e.g. 25000' },
            { label: 'Security Deposit (₹)', val: deposit, set: setDeposit, hint: 'e.g. 50000' },
            { label: 'Society Maintenance (₹/mo)', val: maintenance, set: setMaintenance, hint: 'e.g. 2500' },
            { label: 'Brokerage / One-time (₹)', val: brokerage, set: setBrokerage, hint: 'e.g. 25000' },
            { label: 'Daily Commute (km one-way)', val: commute, set: setCommute, hint: 'e.g. 12' },
            { label: 'Daily Travel Cost (₹)', val: travelCost, set: setTravelCost, hint: 'e.g. 120' },
          ].map(({ label, val, set, hint }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                <input type="number" value={val} onChange={e => set(e.target.value)} placeholder={hint}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleCalculate} disabled={loading || !rent}
          className="w-full py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
          {loading ? 'Calculating…' : 'Calculate True Cost'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Results ── */}
      {report && (
        <div className="space-y-4">
          {/* Hero number — uses exact backend field: effective_monthly_cost */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-center text-white shadow-xl">
            <p className="text-sm opacity-80 mb-1">True Monthly Living Cost</p>
            <p className="text-5xl font-black">
              ₹{Math.round(report.effective_monthly_cost ?? 0).toLocaleString('en-IN')}
            </p>
            <p className="text-sm opacity-70 mt-1">
              vs base rent ₹{Math.round(report.base_rent ?? 0).toLocaleString('en-IN')}
              {report.hidden_overhead_pct > 0 && (
                <span className="ml-2 bg-white/20 rounded-full px-2 py-0.5 text-xs">
                  +{report.hidden_overhead_pct}% hidden overhead
                </span>
              )}
            </p>
          </div>

          {/* Breakdown — uses exact backend field: breakdown_monthly */}
          {report.breakdown_monthly && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Monthly Cost Breakdown
              </h3>
              <div className="space-y-3">
                {Object.entries(report.breakdown_monthly as Record<string, number>)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => {
                    const total = report.effective_monthly_cost ?? 1;
                    const pct   = Math.min(100, (v / total) * 100);
                    return (
                      <div key={k} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 w-44 shrink-0 capitalize">
                          {k.replace(/_/g, ' ')}
                        </span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2">
                          <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 w-24 text-right">
                          ₹{Math.round(v).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
              </div>
              <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between text-sm font-bold">
                <span className="text-slate-700">Total / month</span>
                <span className="text-indigo-700">₹{Math.round(report.effective_monthly_cost ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Corridor market position */}
          {report.corridor_analytics && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Market Position · {report.corridor_analytics.corridor_name}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-xs">Your Rent</p>
                  <p className="font-black text-slate-800 text-lg">₹{Math.round(report.base_rent ?? 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-xs">Area Benchmark</p>
                  <p className="font-black text-slate-800 text-lg">
                    ₹{Math.round(report.corridor_analytics.benchmark_avg_rent ?? 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className={`mt-3 text-center text-sm font-bold py-2 rounded-xl ${
                report.corridor_analytics.verdict === 'UNDERPRICED_DEAL'     ? 'bg-emerald-100 text-emerald-700' :
                report.corridor_analytics.verdict === 'FAIR_MARKET'          ? 'bg-blue-100 text-blue-700'    :
                report.corridor_analytics.verdict === 'MODERATE_OVERPRICED'  ? 'bg-amber-100 text-amber-700'  :
                                                                                'bg-rose-100 text-rose-700'
              }`}>
                {report.corridor_analytics.verdict_badge}
                {report.corridor_analytics.deviation_pct !== 0 && (
                  <span className="ml-2 font-normal text-xs">
                    ({report.corridor_analytics.deviation_pct > 0 ? '+' : ''}{report.corridor_analytics.deviation_pct}% vs avg)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Deposit analytics */}
          {report.deposit_analytics && report.deposit_analytics.deposit_amount > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Deposit Opportunity Cost
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-amber-700">
                <div>Deposit Locked</div>
                <div className="font-bold text-right">₹{Math.round(report.deposit_analytics.deposit_amount).toLocaleString('en-IN')}</div>
                <div>Lost Interest / mo (7.1%)</div>
                <div className="font-bold text-right">₹{Math.round(report.deposit_analytics.monthly_lost_interest).toLocaleString('en-IN')}</div>
                <div>Deposit:Rent Ratio</div>
                <div className="font-bold text-right">{report.deposit_analytics.deposit_to_rent_ratio}x</div>
              </div>
            </div>
          )}

          {/* 11-month total */}
          {report.total_tenure_cash_needed && (
            <div className="bg-slate-800 rounded-2xl p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">Total Cash Needed (11-month tenure incl. deposit)</p>
              <p className="text-white font-black text-2xl">₹{Math.round(report.total_tenure_cash_needed).toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
