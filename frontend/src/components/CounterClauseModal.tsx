import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Sparkles, Scale, Send } from 'lucide-react';
import { AuditedClause } from '../types/lease';

interface CounterClauseModalProps {
  clause: AuditedClause | null;
  onClose: () => void;
}

export const CounterClauseModal: React.FC<CounterClauseModalProps> = ({ clause, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState<'diplomatic' | 'firm'>('diplomatic');

  if (!clause) return null;

  const diplomaticMsg = `Hi, I was reviewing the draft tenancy agreement. Regarding the ${clause.category.replace('_', ' ')} provision, standard Model Tenancy guidelines recommend the following balanced wording:\n\n"${clause.recommended_counter_clause}"\n\nCould we kindly include this version in our final agreement so both parties remain protected? Thank you!`;

  const firmMsg = `Dear Landlord,\n\nPlease note that the proposed clause regarding ${clause.category.replace('_', ' ')} conflicts with statutory protections under the ${clause.statutory_reference}. We request updating it to the legally aligned standard:\n\n"${clause.recommended_counter_clause}"\n\nPlease let us know once revised.`;

  const activeMessage = tone === 'diplomatic' ? diplomaticMsg : firmMsg;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-2xl rounded-2xl border border-border p-6 shadow-dropdown relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-light text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-primary">AI Counter-Clause & Drafter</h3>
              <p className="text-xs text-text-muted">Balanced revision citing {clause.statutory_reference}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-2 my-4">
          <span className="text-xs font-bold text-text-muted">Tone:</span>
          <button
            onClick={() => setTone('diplomatic')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              tone === 'diplomatic'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-surface border border-border text-text-muted hover:text-text-primary'
            }`}
          >
            Diplomatic (Recommended)
          </button>
          <button
            onClick={() => setTone('firm')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              tone === 'firm'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-surface border border-border text-text-muted hover:text-text-primary'
            }`}
          >
            Firm & Statutory
          </button>
        </div>

        {/* Counter Clause Draft */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surfaceMuted border border-border">
            <div className="text-[11px] font-extrabold text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Proposed Equitable Counter-Clause (Legally Sound)
            </div>
            <p className="text-xs text-text-primary leading-relaxed font-mono font-medium">
              "{clause.recommended_counter_clause}"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-primary-light/40 border border-primary/20">
            <div className="text-[11px] font-extrabold text-primary uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Ready-to-Send WhatsApp / Email Message to Landlord
            </div>
            <p className="text-xs text-text-primary whitespace-pre-line leading-relaxed font-sans font-medium">
              {activeMessage}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border hover:bg-surfaceMuted text-text-primary text-xs font-bold transition-all shadow-subtle"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-text-muted" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Message'}</span>
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(activeMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold transition-all shadow-subtle"
          >
            <Send className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};
