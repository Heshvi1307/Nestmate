import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, FileText, ArrowRight, Sparkles, Scale } from 'lucide-react';
import { AuditedClause } from '../types/lease';

interface ClauseCardProps {
  clause: AuditedClause;
  onOpenCounterClause: (clause: AuditedClause) => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause, onOpenCounterClause }) => {
  const getBadgeStyle = (status: AuditedClause['status']) => {
    switch (status) {
      case 'HIGH_RISK':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
          label: 'Predatory Red Flag'
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          label: 'Caution / Negotiate'
        };
      case 'SAFE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: 'Statutory Compliant'
        };
    }
  };

  const badge = getBadgeStyle(clause.status);

  return (
    <div className={`p-5 rounded-xl border transition-all duration-200 ${
      clause.status === 'HIGH_RISK'
        ? 'bg-slate-900/80 border-rose-500/30 hover:border-rose-500/50 shadow-lg shadow-rose-950/20'
        : clause.status === 'CAUTION'
        ? 'bg-slate-900/60 border-amber-500/20 hover:border-amber-500/40'
        : 'bg-slate-900/40 border-slate-800/80'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-teal-400" />
            {clause.statutory_reference}
          </span>
        </div>

        {clause.risk_score_impact > 0 && (
          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            -{clause.risk_score_impact} pts impact
          </span>
        )}
      </div>

      {/* Clause Title */}
      <h4 className="text-base font-bold text-white mb-2">{clause.title}</h4>

      {/* Original Clause Excerpt */}
      <div className="mb-3 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed relative">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
          <FileText className="w-3 h-3" />
          Extracted Lease Excerpt
        </div>
        <p className="line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
          "{clause.clause_text}"
        </p>
      </div>

      {/* Plain English Translation */}
      <div className="mb-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs">
        <div className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
          💡 What this means for your money & rights:
        </div>
        <p className="text-slate-200 leading-relaxed">
          {clause.plain_english_impact}
        </p>
      </div>

      {/* Action Footer */}
      {clause.status !== 'SAFE' && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 italic">
            {clause.issue_summary}
          </span>
          <button
            onClick={() => onOpenCounterClause(clause)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-teal-200 border border-teal-500/30 text-xs font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Counter-Clause</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
