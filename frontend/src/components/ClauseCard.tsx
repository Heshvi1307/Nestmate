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
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
          label: 'Predatory Red Flag'
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          label: 'Caution / Negotiate'
        };
      case 'SAFE':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          label: 'Statutory Compliant'
        };
    }
  };

  const badge = getBadgeStyle(clause.status);

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 ${
      clause.status === 'HIGH_RISK'
        ? 'bg-surface border-rose-200 shadow-subtle hover:border-rose-300'
        : clause.status === 'CAUTION'
        ? 'bg-surface border-amber-200 shadow-subtle hover:border-amber-300'
        : 'bg-surface border-border shadow-subtle hover:border-primary/30'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
          <span className="text-xs font-mono text-text-muted flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-primary" />
            {clause.statutory_reference}
          </span>
        </div>

        {clause.risk_score_impact > 0 && (
          <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            -{clause.risk_score_impact} pts impact
          </span>
        )}
      </div>

      {/* Clause Title */}
      <h4 className="text-base font-extrabold text-text-primary mb-2">{clause.title}</h4>

      {/* Original Clause Excerpt */}
      <div className="mb-3 p-3 rounded-xl bg-surfaceMuted border border-border text-xs text-text-secondary font-mono leading-relaxed relative">
        <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1 flex items-center gap-1">
          <FileText className="w-3 h-3 text-primary" />
          Extracted Lease Excerpt
        </div>
        <p className="line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
          "{clause.clause_text}"
        </p>
      </div>

      {/* Plain English Translation */}
      <div className="mb-4 p-3 rounded-xl bg-primary-light/40 border border-primary/20 text-xs">
        <div className="text-[11px] font-extrabold text-primary uppercase tracking-wider mb-1">
          💡 What this means for your money & rights:
        </div>
        <p className="text-text-primary font-medium leading-relaxed">
          {clause.plain_english_impact}
        </p>
      </div>

      {/* Action Footer */}
      {clause.status !== 'SAFE' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 border-t border-border">
          <span className="text-[11px] text-text-muted italic">
            {clause.issue_summary}
          </span>
          <button
            onClick={() => onOpenCounterClause(clause)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Counter-Clause</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
