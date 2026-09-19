import React, { useRef, useState } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, ChevronDown, Loader2, RefreshCw, Cpu } from 'lucide-react';
import { useLeaseClauses } from '../hooks/useLeaseClauses';
import { api } from '../utils/apiClient';
import { debugLog, debugError } from '../utils/debug';
import type { LeaseAuditResult, SampleAgreement } from '../types';

const RISK: Record<string, { bg: string; text: string; border: string }> = {
  'Safe & Standard':     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Important Caveat':    { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
  'Caution / Negotiate': { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200'    },
};

const VERDICT: Record<string, { bg: string; text: string }> = {
  PREDATORY:  { bg: 'bg-rose-100',    text: 'text-rose-700'    },
  CAUTION:    { bg: 'bg-amber-100',   text: 'text-amber-700'   },
  ACCEPTABLE: { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  SAFE:       { bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

const SafetyGauge: React.FC<{ score: number }> = ({ score }) => {
  const pct  = Math.max(0, Math.min(100, score));
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative w-36 h-36">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-800">{pct}</span>
          <span className="text-xs text-slate-500 font-medium">Safety Score</span>
        </div>
      </div>
    </div>
  );
};

export const LeaseLens: React.FC = () => {
  const { clauses, loading: clausesLoading } = useLeaseClauses();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading]         = useState(false);
  const [result, setResult]               = useState<LeaseAuditResult | null>(null);
  const [toast, setToast]                 = useState<string | null>(null);
  const [samples, setSamples]             = useState<SampleAgreement[]>([]);
  const [samplesOpen, setSamplesOpen]     = useState(false);
  const [loadingSamples, setLoadingSamples] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true); setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post<LeaseAuditResult>('/api/audit/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      debugLog('LeaseLens upload', data);
      setResult(data);
    } catch (err) {
      debugError('Lease audit failed', err);
      setToast('Backend offline — start FastAPI on port 8000 first.');
    } finally { setUploading(false); }
  };

  const auditSample = async (sample: SampleAgreement) => {
    setSamplesOpen(false); setUploading(true); setResult(null);
    try {
      const { data } = await api.post<LeaseAuditResult>('/api/audit/text', { raw_text: sample.text });
      debugLog('Sample audit', data);
      setResult({ ...data, filename: sample.title });
    } catch (err) {
      debugError('Sample audit failed', err);
      setToast('Backend offline — start FastAPI on port 8000 first.');
    } finally { setUploading(false); }
  };

  const fetchSamples = async () => {
    if (samples.length) { setSamplesOpen(v => !v); return; }
    setLoadingSamples(true);
    try {
      const { data } = await api.get<{ success: boolean; samples: SampleAgreement[] }>('/api/samples');
      setSamples(data.samples ?? []);
      setSamplesOpen(true);
    } catch (err) {
      debugError('Fetch samples failed', err);
      setToast('Backend offline — start FastAPI on port 8000 first.');
    } finally { setLoadingSamples(false); }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">🔍 LeaseLens</h2>
        <p className="text-slate-500 text-sm mt-1">AI-powered lease analysis — know what you're signing</p>
      </div>

      {/* Upload card */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-8 text-center space-y-4">
        <div className="relative inline-block">
          <button onClick={fetchSamples} disabled={loadingSamples}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 bg-indigo-50 rounded-full px-4 py-1.5 transition">
            {loadingSamples ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            Try a Sample Lease <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {samplesOpen && samples.length > 0 && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-slate-100 shadow-2xl rounded-2xl p-1.5 z-20 min-w-[300px] text-left">
              {samples.map(s => (
                <button key={s.id} onClick={() => auditSample(s)}
                  className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 rounded-xl transition text-sm">
                  <p className="font-semibold text-slate-800">{s.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{s.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-slate-400 text-xs font-medium">— or upload your lease —</p>

        {uploading ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-slate-600 font-semibold">Analyzing lease with AI…</p>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-indigo-200 mx-auto" />
            <div>
              <p className="font-semibold text-slate-700">Drop your PDF or TXT file here</p>
              <p className="text-slate-400 text-xs mt-0.5">Max 10 MB · PDF or plain text</p>
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-indigo-700 transition shadow-md">
              Choose File
            </button>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.text"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
              className="hidden" />
          </>
        )}
      </div>

      {/* Audit Result */}
      {result?.audit && (
        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Audit Results</h3>
              {result.filename && <p className="text-xs text-slate-400 mt-0.5">{result.filename}</p>}
            </div>
            <div className="flex items-center gap-2">
              {/* Step 13: show engine badge */}
              {(result.audit as Record<string, unknown>).engine_used != null && (
                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  <Cpu className="w-3 h-3" />
                  {String((result.audit as Record<string, unknown>).engine_used)}
                </span>
              )}
              <button onClick={() => setResult(null)} className="p-2 hover:bg-slate-100 rounded-full transition">
                <RefreshCw className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <SafetyGauge score={result.audit.safety_score ?? 0} />

          <div className="px-5 pb-4 text-center">
            <p className="font-black text-2xl text-slate-800">{result.audit.verdict}</p>
            <p className="text-slate-500 text-sm mt-1">{result.audit.verdict_summary}</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs font-semibold">
              {result.audit.predatory_count != null && (
                <span className="text-rose-600">🚨 {result.audit.predatory_count} Predatory</span>
              )}
              {result.audit.caution_count != null && (
                <span className="text-amber-600">⚠️ {result.audit.caution_count} Caution</span>
              )}
              {result.audit.total_clauses_analyzed != null && (
                <span className="text-slate-500">{result.audit.total_clauses_analyzed} Clauses Checked</span>
              )}
            </div>
          </div>

          {/* Clause results — Step 13: validate audited_clauses */}
          {!result.audit.audited_clauses?.length ? (
            <div className="px-5 pb-5 text-center text-slate-500 text-sm bg-slate-50 mx-5 mb-5 rounded-xl py-4">
              AI couldn't detect specific clauses in this document. Try a longer lease PDF or use one of our sample leases.
            </div>
          ) : (
            <div className="px-5 pb-5 space-y-3">
              <h4 className="font-semibold text-slate-700">Clause-by-Clause Breakdown</h4>
              {result.audit.audited_clauses.map((c, i) => {
                const vs = VERDICT[c.verdict] ?? VERDICT.ACCEPTABLE;
                return (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-slate-800 text-sm">{c.title ?? c.category}</p>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${vs.bg} ${vs.text}`}>
                        {c.verdict}
                      </span>
                    </div>
                    {c.issue && <p className="text-xs text-slate-600">{c.issue}</p>}
                    {c.mta_position && (
                      <p className="text-xs text-indigo-600 font-medium">📖 MTA: {c.mta_position}</p>
                    )}
                    {c.recommended_action && (
                      <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-1.5">
                        ✅ {c.recommended_action}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Clause Guide from Supabase — STEP 5 FIX: clause_number already contains "Clause X.X" */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-lg">📋 Standard Lease Clause Guide</h3>
        <p className="text-sm text-slate-500">10 benchmark clauses from the Model Tenancy Act — live from database</p>

        {clausesLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : clauses.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No clauses found in database.</div>
        ) : (
          clauses.map(c => {
            const rc = RISK[c.risk_level] ?? RISK['Safe & Standard'];
            return (
              <div key={c.id} className={`rounded-2xl border p-5 space-y-3 ${rc.bg} ${rc.border}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {/* FIX: clause_number is already "Clause 7.2" — no prefix needed */}
                    <p className="text-xs text-slate-400 font-medium">{c.clause_number} · {c.section}</p>
                    <h4 className="font-bold text-slate-800 mt-0.5">{c.title}</h4>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 border ${rc.bg} ${rc.text} ${rc.border}`}>
                    {c.risk_level}
                  </span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">{c.ai_explanation}</p>

                {c.potential_hidden_cost && c.potential_hidden_cost !== 'None.' && c.potential_hidden_cost !== 'None' && (
                  <div className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50/80 rounded-xl px-3 py-2.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>Hidden Cost:</strong> {c.potential_hidden_cost}</span>
                  </div>
                )}

                {/* Step 14: removed "Ask landlord:" — use subtle italic tip instead */}
                {c.what_to_clarify && (
                  <p className="text-xs text-slate-500 italic flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                    {c.what_to_clarify}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-sm">{toast}</p>
          <button onClick={() => setToast(null)} className="ml-auto text-white/60 hover:text-white text-xl leading-none">×</button>
        </div>
      )}
    </div>
  );
};
