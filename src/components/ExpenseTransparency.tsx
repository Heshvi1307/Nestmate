import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  PieChart, 
  Sparkles, 
  Split, 
  Info,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { MOCK_EXPENSE_HISTORY } from '../data/mockData';

export const ExpenseTransparency: React.FC = () => {
  const currentMonthRecord = MOCK_EXPENSE_HISTORY[0]; // Feb 2026: ₹31,240
  const [selectedMonth, setSelectedMonth] = useState('Feb 2026');

  // Roommate Split Calculator State
  const [roommateCount, setRoommateCount] = useState(2);
  const [splitUtilitiesOnly, setSplitUtilitiesOnly] = useState(true);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const categories = [
    { label: 'Base Rent', amount: currentMonthRecord.rent, color: 'bg-primary', percentage: 76.8 },
    { label: 'Electricity & Gas (Torrent)', amount: currentMonthRecord.utilities, color: 'bg-emerald-500', percentage: 8.9 },
    { label: 'Society Maintenance', amount: currentMonthRecord.maintenance, color: 'bg-secondary', percentage: 3.8 },
    { label: 'High-Speed Fiber (300 Mbps)', amount: currentMonthRecord.internet, color: 'bg-blue-500', percentage: 1.9 },
    { label: 'Groceries & Supplies', amount: currentMonthRecord.food, color: 'bg-amber-500', percentage: 5.8 },
    { label: 'Metro & Local Commute', amount: currentMonthRecord.transport, color: 'bg-purple-500', percentage: 2.8 },
  ];

  // Bill split calculation
  const totalShared = splitUtilitiesOnly
    ? currentMonthRecord.utilities + currentMonthRecord.maintenance + currentMonthRecord.internet
    : currentMonthRecord.total;
  
  const perPersonShare = Math.round(totalShared / roommateCount);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            FinTech Cost Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Where your money goes
          </h2>
          <p className="text-xs text-text-secondary mt-0.5 max-w-xl">
            Real-time breakdown of all housing-related outlays. No hidden society surcharges or unexplained billing deviations.
          </p>
        </div>

        {/* Current Month Callout */}
        <div className="bg-[#F3F6F3] border border-primary/20 p-4 rounded-2xl flex items-center space-x-4 self-start md:self-auto">
          <div>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">
              Total Outlay ({currentMonthRecord.month})
            </span>
            <span className="text-2xl font-black text-primary tabular-nums">
              {formatCurrency(currentMonthRecord.total)}
            </span>
          </div>

          <div className="pl-3 border-l border-border/80">
            <span className="flex items-center space-x-1 text-xs font-bold text-amber-700">
              <TrendingUp className="w-3.5 h-3.5 text-warning" />
              <span>+{formatCurrency(currentMonthRecord.vsPreviousMonthDiff)}</span>
            </span>
            <span className="text-[10px] text-text-muted block">vs last month</span>
          </div>
        </div>
      </div>

      {/* Visual Spending Allocation Bar */}
      <div className="bg-surface rounded-2xl border border-border p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            Category Allocation Overview
          </span>
          <span className="text-xs font-semibold text-text-muted">
            100% Accounted For
          </span>
        </div>

        {/* Multi-color stacked progress bar */}
        <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-surfaceMuted">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`${cat.color} transition-all duration-500`}
              style={{ width: `${cat.percentage}%` }}
              title={`${cat.label}: ${cat.percentage}%`}
            />
          ))}
        </div>

        {/* Category Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-surfaceMuted/40 border border-border text-xs">
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                <span className="text-[10px] text-text-muted font-semibold truncate">{cat.label}</span>
              </div>
              <div className="font-extrabold text-text-primary tabular-nums">
                {formatCurrency(cat.amount)}
              </div>
              <span className="text-[10px] text-text-muted">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Month-over-Month & Predictive Estimate (2 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Month-over-Month Comparison */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Recent 4-Month Spending History
            </span>
            <span className="text-[11px] text-text-muted">Flat 402 Ledgers</span>
          </div>

          <div className="space-y-3">
            {MOCK_EXPENSE_HISTORY.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surfaceMuted/40 border border-border text-xs"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-text-primary">{exp.month}</span>
                    {exp.isProjected && (
                      <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                        Estimate
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted">
                    Rent: {formatCurrency(exp.rent)} · Util: {formatCurrency(exp.utilities)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-black text-text-primary tabular-nums block">
                    {formatCurrency(exp.total)}
                  </span>
                  <span className={`text-[10px] font-semibold ${
                    exp.vsPreviousMonthDiff > 0 ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {exp.vsPreviousMonthDiff > 0 ? `+₹${exp.vsPreviousMonthDiff}` : `-₹${Math.abs(exp.vsPreviousMonthDiff)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-text-muted flex items-start space-x-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-text-muted flex-shrink-0 mt-0.5" />
            <p>
              Expected next month contains projected summer AC variance based on historic March temperatures in Vastrapur.
            </p>
          </div>
        </div>

        {/* Roommate Fair Split Calculator */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-subtle space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center space-x-2">
                <Split className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Roommate Expense Splitter
                </span>
              </div>
              <span className="text-[10px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded">
                Fair Living Tool
              </span>
            </div>

            <p className="text-xs text-text-secondary mt-3">
              Calculate exact per-person monthly obligations without awkward spreadsheet debates.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-secondary">Number of Co-Living Flatmates</span>
                <div className="flex items-center space-x-1">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setRoommateCount(num)}
                      className={`w-8 h-8 rounded-lg font-bold border transition-colors ${
                        roommateCount === num ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-muted hover:bg-surfaceMuted'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-text-secondary">Split Scope</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setSplitUtilitiesOnly(true)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                      splitUtilitiesOnly ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-muted'
                    }`}
                  >
                    Utilities & Net Only
                  </button>
                  <button
                    onClick={() => setSplitUtilitiesOnly(false)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                      !splitUtilitiesOnly ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-muted'
                    }`}
                  >
                    Full Rent + Bills
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Split Result Callout */}
          <div className="p-4 rounded-xl bg-[#F4F7F5] border border-primary/25 mt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Each Flatmate's Share
                </span>
                <span className="text-xl font-black text-primary tabular-nums">
                  {formatCurrency(perPersonShare)} / mo
                </span>
              </div>

              <button className="text-xs font-bold text-primary hover:underline flex items-center space-x-1">
                <span>Send UPI Link</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <span className="text-[10px] text-text-muted mt-1 block">
              Calculated across ₹{totalShared.toLocaleString('en-IN')} total pool for {roommateCount} flatmates
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
