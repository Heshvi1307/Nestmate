import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, ChevronDown, Loader2 } from 'lucide-react';
import { useLeaseClauses } from '../hooks/useLeaseClauses';
import { api } from '../utils/apiClient';
import { debugLog, debugError } from '../utils/debug';
import type { LeaseAuditResult, SampleLease } from '../types';

// ─── Risk badge colours ────────────────────────────────────────────────────────
const RISK_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  'Safe & Standard':       { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Safe & Standard' },
  'Important Caveat':      { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Important Caveat' },
  'Caution / Negotiate':   { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    label: 'Caution / Negotiate' },
};

// Audit clause status colours
const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  HIGH_RISK: { bg: 'bg-rose-100',    text: 'text-rose-700' },
  CAUTION:   { bg: 'bg-amber-100',   text: 'text-amber-700' },
  SAFE:      { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

// Gauge colour by verdict_color
const GAUGE_COLORS: Record<string, string> = {
  emerald: '#10b981',
  amber:   '#f59e0b',
  rose:    '#f43f5e',
};

// ─── Radial Gauge ─────────────────────────────────────────────────────────────
const SafetyGauge: React.FC<{ score: number; color: string }> = ({ score, color }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center my-6">
      <div className="relative w-36 h-36">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={r}
            fill="none" stroke={GAUGE_COLORS[color] ?? '#10b981'}
            strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800">{pct}</span>
          <span className="text-xs text-slate-500 font-medium">Safety Score</span>
        </div>
      </div>
    </div>
  );
};

// ─── Toast ─────────────────────────────────────────────────────────────────────
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 bg-rose-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-sm">
    <AlertTriangle className="w-5 h-5 shrink-0" />
    <p className="text-sm font-medium">{message}</p>
    <button onClick={onClose} className="ml-auto text-white/80 hover:text-white text-lg leading-none">×</button>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export const LeaseLens: React.FC = () => {
  const { clauses, loading: clausesLoading } = useLeaseClauses();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [auditResult, setAuditResult] = useState<LeaseAuditResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [samples, setSamples] = useState<SampleLease[]>([]);
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);

  // ── Upload handler ───────────────────────────────────────────────────────────
  const handleUpload = async (file: File) => {
    setUploading(true);
    setAuditResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<LeaseAuditResult>('/api/audit/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      debugLog('LeaseLens upload', data);
      setAuditResult(data);
    } catch (err) {
      debugError('Lease audit failed', err);
      setToast('Backend offline. Start the FastAPI server on port 8000.');
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  // ── Try a Sample ─────────────────────────────────────────────────────────────
  const fetchSamples = async () => {
    if (samples.length > 0) { setSamplesOpen(true); return; }
    setLoadingSamples(true);
    try {
      const { data } = await api.get<SampleLease[]>('/api/samples');
      debugLog('LeaseLens samples', data);
      setSamples(data);
      setSamplesOpen(true);
    } catch (err) {
      debugError('Fetch samples failed', err);
      setToast('Backend offline. Start the FastAPI server on port 8000.');
    } finally {
      setLoadingSamples(false);
    }
  };

  const auditSample = async (sample: SampleLease) => {
    setSamplesOpen(false);
    setUploading(true);
    setAuditResult(null);
    try {
      const { data } = await api.post<LeaseAuditResult>(`/api/audit/sample/${sample.id}`);
      debugLog('LeaseLens sample audit', data);
      setAuditResult(data);
    } catch (err) {
      debugError('Sample audit failed', err);
      setToast('Backend offline. Start the FastAPI server on port 8000.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-slate-800">🔍 LeaseLens</h2>
        <p className="text-slate-500 text-sm">AI-powered lease analysis — know what you're signing</p>
      </div>

      {/* Upload area + Try a Sample */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-8 text-center space-y-4">
        {/* Try a Sample dropdown */}
        <div className="relative inline-block">
          <button
            onClick={fetchSamples}
            disabled={loadingSamples}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 rounded-full px-4 py-1.5 transition"
          >
            {loadingSamples ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            Try a Sample <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {samplesOpen && samples.length > 0 && (
            <div className="absolute top-full mt-2 left-0 bg-white border border-slate-100 shadow-xl rounded-xl p-1 z-20 min-w-[220px]">
              {samples.map((s) => (
                <button
                  key={s.id}
                  onClick={() => auditSample(s)}
                  className="w-full text-left text-sm px-3 py-2 hover:bg-indigo-50 rounded-lg text-slate-700 font-medium transition-colors"
                >
                  {s.name}
                  {s.description && <p className="text-xs text-slate-400 font-normal">{s.description}</p>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-slate-400 text-xs">or</div>

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-600 font-medium">Analyzing lease with AI...</p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-indigo-300 mx-auto" />
            <div>
              <p className="font-semibold text-slate-700">Upload your lease PDF</p>
              <p className="text-slate-400 text-sm">Click below or drag & drop</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow"
            >
              Choose PDF
            </button>
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={onFileChange} className="hidden" />
          </>
        )}
      </div>

      {/* Audit Result */}
      {auditResult?.audit && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg">Audit Results: <span className="text-slate-500 font-normal text-base">{auditResult.filename}</span></h3>
          </div>

          <SafetyGauge score={auditResult.audit.safety_score} color={auditResult.audit.verdict_color} />

          <div className="px-5 pb-4 text-center space-y-1">
            <p className={`font-black text-xl ${auditResult.audit.verdict_color === 'emerald' ? 'text-emerald-600' : auditResult.audit.verdict_color === 'amber' ? 'text-amber-600' : 'text-rose-600'}`}>
              {auditResult.audit.verdict}
            </p>
            <p className="text-slate-600 text-sm">{auditResult.audit.verdict_summary}</p>
          </div>

          {/* Audited clauses */}
          <div className="p-5 space-y-3">
            <h4 className="font-semibold text-slate-700">Clause-by-Clause Analysis</h4>
            {auditResult.audit.audited_clauses.map((clause, idx) => {
              const sc = STATUS_CONFIG[clause.status] ?? STATUS_CONFIG.SAFE;
              return (
                <div key={idx} className="border border-slate-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-800 text-sm">{clause.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
                      {clause.status.replace('_', ' ')}
                    </span>
                  </div>
                  {clause.statutory_reference && (
                    <p className="text-xs text-indigo-600 font-medium">📖 {clause.statutory_reference}</p>
                  )}
                  <p className="text-xs text-slate-600">{clause.issue_summary}</p>
                  <p className="text-xs text-slate-500 italic">{clause.plain_english_impact}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lease Clauses from Supabase */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-lg">📋 Standard Lease Clauses Guide</h3>
        {clausesLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-slate-200 rounded-2xl" />)}
          </div>
        ) : (
          clauses.map((clause) => {
            const rc = RISK_CONFIG[clause.risk_level] ?? RISK_CONFIG['Safe & Standard'];
            return (
              <div key={clause.id} className={`rounded-2xl border p-4 space-y-2 ${rc.bg} ${rc.border}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Clause {clause.clause_number} · {clause.section}</p>
                    <h4 className="font-bold text-slate-800">{clause.title}</h4>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${rc.bg} ${rc.text} border ${rc.border}`}>
                    {rc.label}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{clause.ai_explanation}</p>
                {clause.potential_hidden_cost && (
                  <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>Hidden Cost:</strong> {clause.potential_hidden_cost}</span>
                  </div>
                )}
                {clause.what_to_clarify && (
                  <div className="flex items-start gap-1.5 text-xs text-blue-700 bg-blue-50 rounded-lg p-2">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>Ask landlord:</strong> {clause.what_to_clarify}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};
