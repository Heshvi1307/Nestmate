import React, { useState } from 'react';
import { X, Copy, Check, FileText, Sparkles, Shield, Send, Printer } from 'lucide-react';
import { LivingCharter } from '../types/harmony';

interface LivingCharterModalProps {
  charter: LivingCharter | null;
  userName: string;
  candidateName: string;
  onClose: () => void;
}

export const LivingCharterModal: React.FC<LivingCharterModalProps> = ({
  charter,
  userName,
  candidateName,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!charter) return null;

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(charter.whatsapp_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-3xl rounded-2xl border border-border p-6 shadow-dropdown relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-light text-primary border border-primary/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-text-primary tracking-tight">
                  Roommate Living Charter
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-light text-primary border border-primary/30">
                  {charter.engine_badge || 'Living Pact'}
                </span>
              </div>
              <p className="text-xs text-text-muted">
                Actionable co-living ground rules to eliminate deposit disputes between {userName} & {candidateName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 my-4">
          <div className="text-center pb-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              {charter.title}
            </span>
          </div>

          {/* 5 Core House Rules */}
          <div className="space-y-3">
            {charter.house_rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surfaceMuted border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary-light text-primary font-mono text-[11px] font-bold flex items-center justify-center border border-primary/20">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs font-extrabold text-text-primary tracking-tight">
                    {rule.category}
                  </h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-sans pl-7 font-medium">
                  {rule.rule_text}
                </p>
              </div>
            ))}
          </div>

          {/* WhatsApp Preview Card */}
          <div className="p-4 rounded-xl bg-primary-light/40 border border-primary/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-primary">
              <span className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Ready-to-Send WhatsApp Introduction Message
              </span>
            </div>
            <p className="text-xs text-text-primary leading-relaxed font-sans whitespace-pre-line bg-surface p-3 rounded-lg border border-border font-medium">
              {charter.whatsapp_summary}
            </p>
          </div>

          {/* Mutual Sign-off Box */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-surfaceMuted border border-border text-[11px] text-text-muted text-center">
            <div>
              <span className="block text-text-muted font-mono mb-1">Roommate 1</span>
              <span className="font-extrabold text-text-primary">{userName}</span>
              <span className="block text-[10px] text-emerald-700 font-bold mt-0.5">✓ Ready to Sign</span>
            </div>
            <div>
              <span className="block text-text-muted font-mono mb-1">Roommate 2</span>
              <span className="font-extrabold text-text-primary">{candidateName}</span>
              <span className="block text-[10px] text-primary font-bold mt-0.5">Pending Review</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border hover:bg-surfaceMuted text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pact</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text-primary transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs shadow-subtle transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy WhatsApp Message</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
