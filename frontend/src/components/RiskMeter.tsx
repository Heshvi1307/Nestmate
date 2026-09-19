import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { AuditData } from '../types/lease';

interface RiskMeterProps {
  audit: AuditData;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ audit }) => {
  const { safety_score, verdict, verdict_summary, metrics } = audit;

  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: '#245B4A', bg: 'bg-emerald-50', text: 'text-primary', border: 'border-emerald-200' };
    if (score >= 65) return { stroke: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { stroke: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
  };

  const colors = getScoreColor(safety_score);
  const strokeDashoffset = 283 - (283 * safety_score) / 100;

  return (
    <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Radial Score Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="45"
              stroke="#E8ECE9"
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
            <span className={`text-4xl font-black tracking-tight ${colors.text}`}>
              {safety_score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Fairness Index
            </span>
          </div>
        </div>

        {/* Verdict Details & Metrics */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
              {safety_score >= 85 ? (
                <ShieldCheck className="w-4 h-4" />
              ) : safety_score >= 65 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldAlert className="w-4 h-4" />
              )}
              <span>
                {verdict === 'SAFE'
                  ? 'High Tenancy Safety'
                  : verdict === 'MODERATE_RISK'
                  ? 'Caution Required'
                  : 'Predatory Agreement Detected'}
              </span>
            </div>
            <span className="text-xs text-text-muted">Model Tenancy Act 2021 Benchmark</span>
          </div>

          <p className="text-sm font-medium text-text-primary leading-relaxed">
            {verdict_summary}
          </p>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border">
            <div className="p-2.5 rounded-xl bg-surfaceMuted border border-border text-center">
              <span className="text-[10px] text-text-muted uppercase font-bold block">Reviewed</span>
              <span className="text-sm font-extrabold text-text-primary">{metrics.total_clauses_reviewed}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[10px] text-rose-600 uppercase font-bold block">Red Flags</span>
              <span className="text-sm font-extrabold text-rose-700">{metrics.high_risk_flags}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] text-amber-600 uppercase font-bold block">Caution</span>
              <span className="text-sm font-extrabold text-amber-700">{metrics.caution_flags}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-600 uppercase font-bold block">Safe</span>
              <span className="text-sm font-extrabold text-emerald-700">{metrics.safe_clauses}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
