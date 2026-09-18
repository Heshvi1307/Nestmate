import React, { useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, ShieldAlert, ArrowRight, Loader2, Check } from 'lucide-react';
import { RiskMeter } from './RiskMeter';
import { ClauseCard } from './ClauseCard';
import { DepositTimeline } from './DepositTimeline';
import { CounterClauseModal } from './CounterClauseModal';
import { AuditResponse, AuditedClause, SampleAgreement } from '../types/lease';
import { auditText, auditFile, fetchSampleAgreements } from '../services/api';

export const FairLeaseGuard: React.FC = () => {
  const [samples, setSamples] = useState<SampleAgreement[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResponse | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [activeCounterClause, setActiveCounterClause] = useState<AuditedClause | null>(null);

  useEffect(() => {
    fetchSampleAgreements().then((data) => {
      setSamples(data);
      // Auto-load predatory sample for instant visual wow-factor on initial mount!
      if (data.length > 0) {
        const defaultSample = data[0];
        setSelectedSampleId(defaultSample.id);
        setCustomText(defaultSample.text);
        runAuditOnText(defaultSample.text);
      }
    });
  }, []);

  const runAuditOnText = async (textToAudit: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await auditText(textToAudit);
      setAuditResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze agreement');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sample: SampleAgreement) => {
    setSelectedSampleId(sample.id);
    setCustomText(sample.text);
    setUploadedFile(null);
    runAuditOnText(sample.text);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setSelectedSampleId('');
    setLoading(true);
    setError(null);
    try {
      const res = await auditFile(file);
      setAuditResult(res);
    } catch (err: any) {
      setError(err.message || 'File processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAudit = () => {
    if (!customText.trim()) return;
    runAuditOnText(customText);
  };

  const filteredClauses = auditResult?.audit.audited_clauses.filter((c) => {
    if (filterRisk === 'ALL') return true;
    return c.status === filterRisk;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pillar 1: Transparent Legal & Lease Management</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          FairLease Guard: <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">AI Lease Agreement Auditor</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          De-obfuscate complex 15-page legal agreements in seconds. Identify predatory lock-in clauses, unlawful deposit deductions, and generate diplomatic counter-clauses.
        </p>
      </div>

      {/* Input Selection Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            1. Try Instant Pre-Loaded Hackathon Test Leases:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {samples.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedSampleId === sample.id
                    ? 'bg-teal-950/40 border-teal-500 text-teal-200 shadow-md shadow-teal-950/40 ring-1 ring-teal-500/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{sample.title}</span>
                  {selectedSampleId === sample.id && (
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Upload or Paste Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          
          {/* File Upload Dropzone */}
          <div className="relative border-2 border-dashed border-slate-800 hover:border-teal-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all bg-slate-950/40 group">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-3 rounded-full bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">
              {uploadedFile ? uploadedFile.name : 'Upload Rental Agreement PDF / TXT'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Supports scanned text, registered rent deeds, and draft agreements
            </span>
          </div>

          {/* Paste Raw Text Box */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold">Or Paste Lease Agreement Text:</span>
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
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500/50 resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleManualAudit}
                disabled={loading || !customText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Clauses...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
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
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Clause-by-Clause Statutory Audit
              </h3>
              <p className="text-xs text-slate-400">
                Audited against Model Tenancy Act (MTA) & Indian Tenancy Jurisprudence
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
              {['ALL', 'HIGH_RISK', 'CAUTION', 'SAFE'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterRisk(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filterRisk === f
                      ? 'bg-teal-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
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
