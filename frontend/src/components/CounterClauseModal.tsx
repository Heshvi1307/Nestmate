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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-teal-500/30 p-6 shadow-2xl shadow-teal-950/40 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Counter-Clause & Negotiation Drafter</h3>
              <p className="text-xs text-slate-400">Balanced revision citing {clause.statutory_reference}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-2 my-4">
          <span className="text-xs font-semibold text-slate-400">Negotiation Tone:</span>
          <button
            onClick={() => setTone('diplomatic')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              tone === 'diplomatic'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Diplomatic (Best for Landlords)
          </button>
          <button
            onClick={() => setTone('firm')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              tone === 'firm'
                ? 'bg-teal-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Firm & Statutory Reference
          </button>
        </div>

        {/* Counter Clause Draft */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Proposed Equitable Counter-Clause (Legally Sound)
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              "{clause.recommended_counter_clause}"
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/20">
            <div className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Ready-to-Send WhatsApp / Email Message to Landlord
            </div>
            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {activeMessage}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Message to Send</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
