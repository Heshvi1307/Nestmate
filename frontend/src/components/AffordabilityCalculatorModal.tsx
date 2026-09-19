import React, { useState, useMemo } from 'react';
import { 
  X, 
  IndianRupee, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Wallet,
  ArrowRight,
  PieChart,
  HelpCircle
} from 'lucide-react';
import { Property } from '../types';

interface AffordabilityCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onAskNora?: () => void;
  onViewComparison?: () => void;
}

export const AffordabilityCalculatorModal: React.FC<AffordabilityCalculatorModalProps> = ({
  isOpen,
  onClose,
  property,
  onAskNora,
  onViewComparison
}) => {
  // User Financial Inputs (Defaults set to realistic young tech professional / student)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(85000);
  const [foodExpense, setFoodExpense] = useState<number>(9000);
  const [transportExpense, setTransportExpense] = useState<number>(3000);
  const [otherPersonalExpense, setOtherPersonalExpense] = useState<number>(6000);

  if (!isOpen || !property) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Property housing cost components
  const baseRent = property.baseRent;
  const maintenance = property.maintenanceMonthly;
  const utilities = property.utilitiesEstimate;
  const internet = property.internetMonthly;
  
  // Total recurring essential housing cost
  const totalHousingCost = baseRent + maintenance + utilities + internet; // e.g. ₹28,600

  // Total monthly living cost including personal food + transport + other
  const totalMonthlyLivingCost = totalHousingCost + foodExpense + transportExpense + otherPersonalExpense;

  // Estimated discretionary savings remaining
  const remainingSavings = monthlyIncome - totalMonthlyLivingCost;

  // Rent-to-Income percentage
  const rentToIncomeRatio = Math.round((totalHousingCost / (monthlyIncome || 1)) * 100);

  // Move-in Capital Calculation
  const securityDeposit = property.deposit; // 2 months base rent (e.g. ₹48,000)
  const firstMonthAdvance = baseRent; // ₹24,000
  const estimatedSetup = 5000; // Moving, utility deposits, lockbox setup
  const totalMoveInCost = securityDeposit + firstMonthAdvance + estimatedSetup; // ₹77,000

  // Health assessment
  const isAffordable = rentToIncomeRatio <= 35 && remainingSavings > 15000;
  const isModerate = rentToIncomeRatio > 35 && rentToIncomeRatio <= 45;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-surface rounded-3xl shadow-dropdown border border-border overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-text-primary tracking-tight">
                Can I Actually Afford This?
              </h2>
              <span className="text-[11px] text-text-muted">
                TrueCost™ Affordability Diagnostic for <strong>{property.title}</strong> ({property.neighborhood})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7 text-xs">
          
          {/* Top Callout: Safe Rule of Thumb */}
          <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-border flex items-start space-x-3">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-text-primary block">
                Financial Transparency Standard (The 30% Rule)
              </span>
              <p className="text-text-secondary leading-relaxed text-[11px]">
                Most personal finance advisors suggest keeping total housing costs under 30%–35% of monthly net income. NestMate calculates full living costs rather than just base rent so you never face end-of-month budget shocks.
              </p>
            </div>
          </div>

          {/* User Financial Inputs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                1. Your Monthly Financial Baseline
              </span>
              <span className="text-[11px] text-text-muted">Adjust sliders or numbers to simulate</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Take-Home Net Income */}
              <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-text-primary">Monthly Take-Home Income</label>
                  <span className="font-black text-primary tabular-nums text-sm">
                    {formatCurrency(monthlyIncome)}
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="200000"
                  step="2000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="text-[10px] text-text-muted block">Post-tax in-hand salary or stipend</span>
              </div>

              {/* Monthly Food Expense */}
              <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-text-primary">Food & Groceries</label>
                  <span className="font-black text-text-primary tabular-nums text-sm">
                    {formatCurrency(foodExpense)}
                  </span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="30000"
                  step="1000"
                  value={foodExpense}
                  onChange={(e) => setFoodExpense(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="text-[10px] text-text-muted block">Groceries, tiffin, and dining out</span>
              </div>

              {/* Transport Expense */}
              <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-text-primary">Local Transport & Fuel</label>
                  <span className="font-black text-text-primary tabular-nums text-sm">
                    {formatCurrency(transportExpense)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={transportExpense}
                  onChange={(e) => setTransportExpense(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="text-[10px] text-text-muted block">Metro card, cab fare, petrol</span>
              </div>

              {/* Other Expenses */}
              <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-text-primary">Other Personal / EMIs</label>
                  <span className="font-black text-text-primary tabular-nums text-sm">
                    {formatCurrency(otherPersonalExpense)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={otherPersonalExpense}
                  onChange={(e) => setOtherPersonalExpense(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="text-[10px] text-text-muted block">Gym, subscriptions, shopping</span>
              </div>

            </div>
          </div>

          {/* Comprehensive TrueCost Breakdown Comparison (WOW MOMENT #1) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#F5F8F6] to-[#EEF3F0] border-2 border-primary/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-wider block">
                  REAL MONTHLY LIVING BREAKDOWN
                </span>
                <h3 className="font-black text-base text-text-primary mt-0.5">
                  What you will actually spend every month
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1 ${
                  isAffordable 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : isModerate 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-rose-100 text-rose-800'
                }`}>
                  {isAffordable ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      <span>Comfortably Affordable ({rentToIncomeRatio}% DTI)</span>
                    </>
                  ) : isModerate ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                      <span>Moderate Stretch ({rentToIncomeRatio}% DTI)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Tight Budget ({rentToIncomeRatio}% DTI)</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Split Comparison Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Left: Monthly Recurring Breakdown */}
              <div className="bg-surface p-4 rounded-2xl border border-border space-y-2">
                <span className="text-[11px] font-extrabold text-text-primary uppercase tracking-wider block pb-1 border-b border-border">
                  Monthly Expense Itemization
                </span>

                <div className="flex justify-between text-text-secondary pt-1">
                  <span>Base Rent</span>
                  <span className="font-bold text-text-primary tabular-nums">{formatCurrency(baseRent)}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>Society Maintenance</span>
                  <span className="font-bold text-text-primary tabular-nums">{formatCurrency(maintenance)}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>Estimated Torrent Utilities</span>
                  <span className="font-bold text-text-primary tabular-nums">{formatCurrency(utilities)}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>High-Speed WiFi (300 Mbps)</span>
                  <span className="font-bold text-text-primary tabular-nums">{formatCurrency(internet)}</span>
                </div>

                <div className="flex justify-between text-text-secondary">
                  <span>Food, Commute & Personal</span>
                  <span className="font-bold text-text-primary tabular-nums">{formatCurrency(foodExpense + transportExpense + otherPersonalExpense)}</span>
                </div>

                <div className="pt-2 border-t-2 border-primary/20 flex justify-between font-extrabold text-primary text-sm">
                  <span>Total Monthly Cost</span>
                  <span className="tabular-nums">{formatCurrency(totalMonthlyLivingCost)}</span>
                </div>
              </div>

              {/* Right: Cash Flow & Move-In Capital Outlay */}
              <div className="bg-surface p-4 rounded-2xl border border-border space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-text-primary uppercase tracking-wider block pb-1 border-b border-border">
                    Cash Flow & Capital Outlay
                  </span>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-text-secondary">
                      <span>Monthly Remaining Savings</span>
                      <span className={`font-black tabular-nums ${remainingSavings >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {formatCurrency(remainingSavings)} / mo
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border space-y-1.5 mt-2">
                      <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider block">
                        Estimated Move-In Day Outlay
                      </span>
                      <div className="flex justify-between text-[11px] text-text-secondary">
                        <span>Security Deposit (2 Mo)</span>
                        <span className="font-bold text-text-primary">{formatCurrency(securityDeposit)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-text-secondary">
                        <span>First Month Advance</span>
                        <span className="font-bold text-text-primary">{formatCurrency(firstMonthAdvance)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-text-secondary">
                        <span>Move-in Setup & Agreement</span>
                        <span className="font-bold text-text-primary">{formatCurrency(estimatedSetup)}</span>
                      </div>
                      <div className="pt-1.5 border-t border-border flex justify-between font-black text-text-primary text-xs">
                        <span>Estimated Move-In Capital</span>
                        <span className="tabular-nums text-primary">{formatCurrency(totalMoveInCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-text-muted italic">
                  *Refundable deposit returned within 7 days under LeaseLens escrow.
                </span>
              </div>

            </div>

          </div>

          {/* Legal / Financial Disclaimer Banner (Requirement 13) */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <p>
              <strong>Affordability Disclaimer:</strong> All calculations, utility projections, and remaining savings are simulated estimates based on stated preferences and local Torrent Power averages. They do not constitute guaranteed financial advice or loan commitments.
            </p>
          </div>

        </div>

        {/* Modal Bottom CTAs */}
        <div className="p-4 border-t border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onAskNora) onAskNora();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-text-primary hover:bg-surfaceMuted flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Ask NORA to Optimize Budget</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold shadow-subtle transition-all flex items-center justify-center space-x-1.5"
          >
            <span>Proceed with Confidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
