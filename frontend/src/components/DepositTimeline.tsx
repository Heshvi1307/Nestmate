import React from 'react';
import { IndianRupee, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { LeaseMetadata } from '../types/lease';

interface DepositTimelineProps {
  metadata: LeaseMetadata;
  safetyScore: number;
}

export const DepositTimeline: React.FC<DepositTimelineProps> = ({ metadata, safetyScore }) => {
  const rent = metadata.monthly_rent_inr || 25000;
  const deposit = metadata.security_deposit_inr || 75000;
  const depositMonths = Math.round((deposit / rent) * 10) / 10;
  const isExcessive = depositMonths > 2.0;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Deposit Lock-In & Clawback Diagnostics</h4>
            <p className="text-[11px] text-slate-400">Model Tenancy Act (Sec 11) Benchmark</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
          isExcessive
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        }`}>
          {isExcessive ? `${depositMonths}x Months Rent (Excessive)` : `${depositMonths}x Months Rent (Lawful)`}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Identified Monthly Rent</span>
          <span className="text-base font-bold text-white">₹{rent.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Total Deposit Required</span>
          <span className="text-base font-bold text-teal-300">₹{deposit.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 block">Statutory Max Allowed</span>
          <span className="text-base font-bold text-emerald-400">₹{(rent * 2).toLocaleString('en-IN')} (2 Mo)</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="pt-2 border-t border-slate-800/80">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Statutory Deposit Clawback Timeline
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              Day 0: Handover
            </div>
            <p className="text-slate-400 text-[11px]">
              Keys surrendered. Joint physical walkthrough with photos logged in app.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              Day 1 – 15: Invoices
            </div>
            <p className="text-slate-400 text-[11px]">
              Landlord must furnish verified contractor bills for any claimable wear.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Day 30: Statutory Refund
            </div>
            <p className="text-slate-400 text-[11px]">
              Full balance refunded. Failure triggers statutory interest claims under MTA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
