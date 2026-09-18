import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AuditData } from '../types/lease';

interface RiskMeterProps {
  audit: AuditData;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ audit }) => {
  const { safety_score, verdict, verdict_summary, metrics } = audit;

  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
    if (score >= 65) return { stroke: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' };
    return { stroke: '#f43f5e', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' };
  };

  const colors = getScoreColor(safety_score);
  const strokeDashoffset = 283 - (283 * safety_score) / 100;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Radial Score Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke={colors.stroke}
              strokeWidth="10"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold tracking-tight ${colors.text}`}>
              {safety_score}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Fairness Index
            </span>
          </div>
        </div>

        {/* Verdict Details & Metrics */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm"
               style={{ backgroundColor: `${colors.stroke}15`, borderColor: `${colors.stroke}40`, color: colors.stroke }}>
            {safety_score >= 85 ? (
              <ShieldCheck className="w-4 h-4" />
            ) : safety_score >= 65 ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
            <span>{verdict.replace(/_/g, ' ')}</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {safety_score >= 85 ? 'Statutory Model Tenancy Compliant' : safety_score >= 65 ? 'Caution: Several Disproportionate Clauses' : 'Critical Warning: Highly Predatory Lease'}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {verdict_summary}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
              <span className="text-lg font-bold text-rose-400">{metrics.high_risk_flags}</span>
              <span className="text-[11px] text-slate-400">Predatory Flags</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
              <span className="text-lg font-bold text-amber-400">{metrics.caution_flags}</span>
              <span className="text-[11px] text-slate-400">Caution Warnings</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col">
              <span className="text-lg font-bold text-emerald-400">{metrics.safe_clauses}</span>
              <span className="text-[11px] text-slate-400">Standard Safe Terms</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
