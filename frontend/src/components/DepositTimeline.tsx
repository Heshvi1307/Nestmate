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
    <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-light text-primary">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-primary">Deposit Diagnostics</h4>
            <p className="text-[11px] text-text-muted">MTA 2021 § 10 Benchmark</p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
          isExcessive
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {isExcessive ? `${depositMonths}x Months (Excessive)` : `${depositMonths}x Months (Lawful)`}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-surfaceMuted border border-border">
          <span className="text-[10px] text-text-muted uppercase font-bold block">Base Rent</span>
          <span className="text-sm font-black text-text-primary">₹{rent.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl bg-surfaceMuted border border-border">
          <span className="text-[10px] text-text-muted uppercase font-bold block">Deposit Asked</span>
          <span className="text-sm font-black text-primary">₹{deposit.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl bg-surfaceMuted border border-border col-span-2 sm:col-span-1">
          <span className="text-[10px] text-text-muted uppercase font-bold block">MTA Cap</span>
          <span className="text-sm font-black text-emerald-700">₹{(rent * 2).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="pt-2 border-t border-border">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2.5">
          Statutory Deposit Timeline (7-Day Rule)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="p-2.5 rounded-xl bg-surfaceMuted border border-border text-xs">
            <div className="flex items-center gap-1.5 font-bold text-text-primary mb-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Day 0: Handover</span>
            </div>
            <p className="text-[11px] text-text-secondary leading-snug">
              Joint physical inspection walkthrough with digital checklist.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-surfaceMuted border border-border text-xs">
            <div className="flex items-center gap-1.5 font-bold text-text-primary mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>Days 1-5: Verification</span>
            </div>
            <p className="text-[11px] text-text-secondary leading-snug">
              Final electricity sub-meter reconciliation at domestic tariff.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-700" />
              <span>Day 7: Full Refund</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-snug">
              Mandatory release of deposit balance to tenant bank account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
