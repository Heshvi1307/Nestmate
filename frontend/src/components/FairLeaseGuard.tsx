import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  ArrowRight,
  Loader2,
  FileCheck,
  Scale
} from 'lucide-react';
import { AuditResponse, SampleAgreement, AuditedClause } from '../types/lease';
import { fetchSampleAgreements, auditText, auditFile } from '../services/api';
import { RiskMeter } from './RiskMeter';
import { DepositTimeline } from './DepositTimeline';
import { ClauseCard } from './ClauseCard';
import { CounterClauseModal } from './CounterClauseModal';

export const FairLeaseGuard: React.FC = () => {
  const [samples, setSamples] = useState<SampleAgreement[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeCounterClause, setActiveCounterClause] = useState<AuditedClause | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  // Load sample agreements on mount
  useEffect(() => {
    fetchSampleAgreements()
      .then((data) => {
        setSamples(data);
        if (data.length > 0) {
          handleSelectSample(data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSelectSample = (sample: SampleAgreement) => {
    setSelectedSampleId(sample.id);
    setCustomText(sample.text);
    setUploadedFile(null);
    executeAudit(sample.text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setSelectedSampleId('');
      setCustomText('');
      
      setLoading(true);
      setError(null);
      auditFile(file)
        .then((res) => {
          setAuditResult(res);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'File audit failed');
          setLoading(false);
        });
    }
  };

  const executeAudit = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await auditText(text);
      setAuditResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to audit agreement');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAudit = () => {
    executeAudit(customText);
  };

  const filteredClauses = auditResult?.audit.audited_clauses.filter((clause) => {
    if (filterRisk === 'ALL') return true;
    return clause.status === filterRisk;
  }) || [];

  return (
    <div className="space-y-8">
      
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Pillar 1: Transparent Legal & Lease Management</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary">
          FairLease Guard: <span className="text-primary">AI Agreement Auditor</span>
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          De-obfuscate complex 15-page legal agreements in seconds. Identify predatory lock-in clauses, unlawful deposit deductions, and generate diplomatic counter-clauses.
        </p>
      </div>

      {/* Input Selection Section */}
      <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-6">
        <div>
          <span className="text-xs font-extrabold text-text-muted uppercase tracking-wider block mb-3">
            1. Try Instant Pre-Loaded Hackathon Test Leases:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {samples.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedSampleId === sample.id
                    ? 'bg-primary-light/60 border-primary text-primary shadow-subtle ring-1 ring-primary/30'
                    : 'bg-surface border-border text-text-primary hover:bg-surfaceMuted'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{sample.title}</span>
                  {selectedSampleId === sample.id && (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <p className="text-[11px] text-text-muted line-clamp-2">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Upload or Paste Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-border">
          
          {/* File Upload Dropzone */}
          <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all bg-surfaceMuted/50 group">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-3 rounded-xl bg-primary-light text-primary group-hover:scale-110 transition-transform mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-text-primary">
              {uploadedFile ? uploadedFile.name : 'Upload Rental Agreement PDF / TXT'}
            </span>
            <span className="text-[11px] text-text-muted mt-1">
              Supports scanned text, registered rent deeds, and draft agreements
            </span>
          </div>

          {/* Paste Raw Text Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-text-muted font-semibold">
              <span>Or Paste Lease Agreement Text:</span>
              <span>{customText.length} characters</span>
            </div>
            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setSelectedSampleId('');
                setUploadedFile(null);
              }}
              rows={4}
              placeholder="Paste clauses or full rental deed here..."
              className="w-full bg-surface border border-border rounded-xl p-3 text-xs text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-text-muted"
            />
            <div className="flex justify-end">
              <button
                onClick={handleManualAudit}
                disabled={loading || !customText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-extrabold transition-all shadow-subtle"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Clauses...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Run Legal Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Error Message if any */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Audit Output Section */}
      {auditResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Row: Risk Meter & Financial Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <RiskMeter audit={auditResult.audit} />
            </div>
            <div className="lg:col-span-5">
              <DepositTimeline 
                metadata={auditResult.metadata} 
                safetyScore={auditResult.audit.safety_score} 
              />
            </div>
          </div>

          {/* Clauses Filter & Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div>
              <h3 className="text-lg font-black text-text-primary tracking-tight">
                Clause-by-Clause Statutory Audit
              </h3>
              <p className="text-xs text-text-muted">
                Audited against Model Tenancy Act (MTA) 2021 & Gujarat Rent Rules
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl shadow-subtle">
              {['ALL', 'HIGH_RISK', 'CAUTION', 'SAFE'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterRisk(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterRisk === f
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {f === 'ALL' ? 'All Clauses' : f === 'HIGH_RISK' ? 'Red Flags' : f === 'CAUTION' ? 'Caution' : 'Safe'}
                </button>
              ))}
            </div>
          </div>

          {/* Clause Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClauses.map((clause, idx) => (
              <ClauseCard
                key={idx}
                clause={clause}
                onOpenCounterClause={(c) => setActiveCounterClause(c)}
              />
            ))}
          </div>

        </div>
      )}

      {/* Counter Clause Modal */}
      <CounterClauseModal
        clause={activeCounterClause}
        onClose={() => setActiveCounterClause(null)}
      />

    </div>
  );
};
