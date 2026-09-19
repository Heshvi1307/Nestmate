import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Upload, 
  Download, 
  Eye, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  ArrowRight,
  Check
} from 'lucide-react';
import { LeaseClause } from '../types';
import { MOCK_LEASE_CLAUSES } from '../data/mockData';
import { useLeaseClauses } from '../hooks/useLeaseClauses';

export const LeaseLens: React.FC = () => {
  const { clauses: dbClauses, loading: clausesLoading } = useLeaseClauses();
  const clauses = dbClauses.length > 0 ? dbClauses : MOCK_LEASE_CLAUSES;
  const [selectedClauseId, setSelectedClauseId] = useState<string>(MOCK_LEASE_CLAUSES[0]?.id || '1');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const activeClause = clauses.find(c => c.id === selectedClauseId) || clauses[0];

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadedFileName('Tenancy_Agreement_Ahmedabad_Verified.pdf');
    }, 1200);
  };

  const getRiskBadge = (risk: LeaseClause['riskLevel']) => {
    switch (risk) {
      case 'Safe & Standard':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>Safe & Standard</span>
          </span>
        );
      case 'Important Caveat':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            <span>Important Caveat</span>
          </span>
        );
      case 'Caution / Negotiate':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Caution / Negotiate</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold mb-3">
            <FileText className="w-3.5 h-3.5 text-secondary" />
            <span>Proprietary Agreement Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            LeaseLens™
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Never sign what you don't fully understand. Upload any residential agreement or inspect our verified standard contract with clause-by-clause AI translation.
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-surface hover:bg-primary-light text-primary text-xs font-bold transition-all shadow-subtle cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-secondary" />
            <span>{isUploading ? 'Analyzing Agreement...' : 'Upload Rental Agreement'}</span>
            <input 
              type="file" 
              accept=".pdf,.docx,.txt" 
              className="hidden" 
              onChange={handleSimulateUpload} 
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {uploadedFileName && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>
              Successfully analyzed <strong>{uploadedFileName}</strong>. Identified 8 key legal clauses.
            </span>
          </div>
          <span className="text-[10px] font-bold text-primary uppercase">Scan Complete</span>
        </div>
      )}

      {/* Main Split Interface: Agreement Reader (Left) + AI Clause Explainer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Digital Agreement Document Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-border shadow-card overflow-hidden">
          
          <div className="p-4 border-b border-border bg-[#FAFBF9] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-text-primary">
                Residential Tenancy Agreement — Model Document
              </span>
            </div>
            <span className="text-[11px] text-text-muted">Registered in Ahmedabad Jurisdiction</span>
          </div>

          <div className="p-5 sm:p-7 space-y-5 max-h-[680px] overflow-y-auto font-sans leading-relaxed text-xs">
            
            <div className="text-center pb-4 border-b border-border/80">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-text-primary">
                Model Tenancy Agreement for Residential Premises
              </h2>
              <p className="text-[11px] text-text-muted mt-1">
                Conforming to Model Tenancy Act principles & Ahmedabad Municipal Code
              </p>
            </div>

            <p className="text-text-secondary italic text-[11px]">
              Click on any highlighted clause below to inspect the AI Plain-English breakdown, risk assessment, and potential hidden costs in the right panel.
            </p>

            {/* Render Clauses */}
            <div className="space-y-4">
              {clauses.map((clause) => {
                const isSelected = clause.id === selectedClauseId;

                return (
                  <div
                    key={clause.id}
                    onClick={() => setSelectedClauseId(clause.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-light/40 border-primary ring-2 ring-primary/20 shadow-subtle'
                        : 'bg-surface hover:bg-surfaceMuted/50 border-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-text-primary text-xs flex items-center space-x-1.5">
                        <span className="text-primary font-black">{clause.clauseNumber}:</span>
                        <span>{clause.title}</span>
                      </span>
                      {getRiskBadge(clause.riskLevel)}
                    </div>

                    <p className="text-text-secondary text-[11px] leading-relaxed">
                      {clause.originalText}
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-border/50 flex items-center justify-between text-[10px]">
                      <span className="text-primary font-semibold">
                        Category: {clause.category}
                      </span>
                      <span className="text-text-muted flex items-center space-x-1 font-medium">
                        <span>Explain clause</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* RIGHT: AI Explanation Panel (5 cols) */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border-2 border-primary/30 shadow-elevated p-5 sm:p-6 space-y-5 sticky top-24">
          
          {/* Panel Header */}
          <div className="flex items-start justify-between border-b border-border pb-3">
            <div>
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-extrabold text-sm text-text-primary">
                  LeaseLens AI Explanation
                </h3>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Translating legal jargon into plain, actionable human language.
              </p>
            </div>
            {getRiskBadge(activeClause.riskLevel)}
          </div>

          {/* Clause Name & Section */}
          <div className="bg-surfaceMuted/60 p-3 rounded-xl border border-border">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Active Clause Under Analysis
            </span>
            <span className="text-xs font-black text-text-primary block mt-0.5">
              {activeClause.clauseNumber} — {activeClause.title}
            </span>
            <span className="text-[11px] text-primary font-semibold block mt-0.5">
              Section: {activeClause.section}
            </span>
          </div>

          {/* AI Plain-English Interpretation */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Plain-English Breakdown
            </span>
            <p className="text-xs text-text-secondary leading-relaxed bg-[#F7F9F7] p-3.5 rounded-xl border border-border">
              {activeClause.aiExplanation}
            </p>
          </div>

          {/* Potential Hidden Cost Warning */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block flex items-center space-x-1 text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              <span>Potential Hidden Cost or Financial Exposure</span>
            </span>
            <div className="text-xs text-amber-950 bg-amber-50/80 p-3 rounded-xl border border-amber-200 leading-relaxed">
              {activeClause.potentialHiddenCost}
            </div>
          </div>

          {/* What to Clarify with Landlord */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block flex items-center space-x-1 text-primary">
              <HelpCircle className="w-3.5 h-3.5 text-secondary" />
              <span>Recommended Clarification with Owner</span>
            </span>
            <div className="text-xs text-emerald-950 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 leading-relaxed">
              "{activeClause.whatToClarify}"
            </div>
          </div>

          {/* Required Legal Disclaimer */}
          <div className="pt-3 border-t border-border text-[11px] text-text-muted leading-relaxed flex items-start space-x-2">
            <Info className="w-4 h-4 text-text-muted flex-shrink-0 mt-0.5" />
            <p>
              <strong>Disclaimer:</strong> AI-generated explanation is for informational transparency and does not constitute formal legal advice. For contentious disputes, consult a certified advocate.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
