import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Loader2,
  Sliders,
  Flame,
  Scale,
  Send,
  Zap,
  Check,
} from 'lucide-react';
import {
  LifestyleVector,
  RoommateProfile,
  HarmonyMatchResponse,
  LivingCharter,
} from '../types/harmony';
import {
  fetchHarmonyCandidates,
  matchHarmonyProfiles,
  generateHarmonyCharter,
} from '../services/api';
import { LivingCharterModal } from './LivingCharterModal';

const DEFAULT_USER_VECTOR: LifestyleVector = {
  cleanliness: 7,
  sleep_schedule: 4,
  guest_policy: 4,
  bill_discipline: 9,
  noise_tolerance: 4,
  dietary_kitchen: 6,
};

export const HarmonyMatch: React.FC = () => {
  const [candidates, setCandidates] = useState<RoommateProfile[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('rm-1');
  const [userName, setUserName] = useState<string>('Het');
  const [userVector, setUserVector] = useState<LifestyleVector>(DEFAULT_USER_VECTOR);

  const [loadingMatch, setLoadingMatch] = useState<boolean>(false);
  const [matchResult, setMatchResult] = useState<HarmonyMatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loadingCharter, setLoadingCharter] = useState<boolean>(false);
  const [charter, setCharter] = useState<LivingCharter | null>(null);
  const [charterModalOpen, setCharterModalOpen] = useState<boolean>(false);

  // Load Candidates on mount
  useEffect(() => {
    fetchHarmonyCandidates()
      .then((data) => {
        setCandidates(data);
        if (data.length > 0) {
          const defaultCand = data[0];
          setSelectedCandidateId(defaultCand.id);
          executeMatch(userName, userVector, defaultCand.id, defaultCand.name, defaultCand.lifestyle_vector);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const executeMatch = async (
    uName: string,
    uVec: LifestyleVector,
    candId: string,
    candName?: string,
    candVec?: LifestyleVector
  ) => {
    setLoadingMatch(true);
    setError(null);
    try {
      const res = await matchHarmonyProfiles(uName, uVec, candId, candName, candVec);
      setMatchResult(res);
    } catch (err: any) {
      setError(err.message || 'Match calculation failed');
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleSliderChange = (key: keyof LifestyleVector, val: number) => {
    const updated = { ...userVector, [key]: val };
    setUserVector(updated);
  };

  const handleSelectCandidate = (cand: RoommateProfile) => {
    setSelectedCandidateId(cand.id);
    executeMatch(userName, userVector, cand.id, cand.name, cand.lifestyle_vector);
  };

  const handleManualMatch = () => {
    const selected = candidates.find((c) => c.id === selectedCandidateId);
    executeMatch(userName, userVector, selectedCandidateId, selected?.name, selected?.lifestyle_vector);
  };

  const applyPreset = (presetName: string) => {
    let presetVec: LifestyleVector;
    if (presetName === 'student') {
      presetVec = { cleanliness: 9, sleep_schedule: 2, guest_policy: 2, bill_discipline: 10, noise_tolerance: 2, dietary_kitchen: 3 };
    } else if (presetName === 'techie') {
      presetVec = { cleanliness: 7, sleep_schedule: 5, guest_policy: 4, bill_discipline: 9, noise_tolerance: 4, dietary_kitchen: 6 };
    } else {
      presetVec = { cleanliness: 5, sleep_schedule: 9, guest_policy: 8, bill_discipline: 7, noise_tolerance: 8, dietary_kitchen: 8 };
    }
    setUserVector(presetVec);
    const selected = candidates.find((c) => c.id === selectedCandidateId);
    executeMatch(userName, presetVec, selectedCandidateId, selected?.name, selected?.lifestyle_vector);
  };

  const handleGenerateCharter = async () => {
    if (!matchResult) return;
    setLoadingCharter(true);
    try {
      const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);
      const candVector = selectedCandidate?.lifestyle_vector || DEFAULT_USER_VECTOR;
      const res = await generateHarmonyCharter(
        userName,
        matchResult.candidate_name,
        userVector,
        candVector,
        matchResult.match
      );
      setCharter(res.charter);
      setCharterModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to synthesize Living Charter');
    } finally {
      setLoadingCharter(false);
    }
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);
  const score = matchResult?.match.compatibility_score || 0;
  const strokeDashoffset = 283 - (283 * score) / 100;
  const scoreColor =
    score >= 82
      ? { stroke: '#245B4A', text: 'text-primary', bg: 'bg-emerald-50', border: 'border-emerald-200' }
      : score >= 65
      ? { stroke: '#d97706', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
      : { stroke: '#e11d48', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-bold">
          <HeartHandshake className="w-3.5 h-3.5 text-secondary" />
          <span>Pillar 2: Flatmate Lifestyle Compatibility & Conflict Prevention</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary">
          HarmonyMatch: <span className="text-primary">Multi-Dimensional Fit</span>
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          Prevent co-living friction and deposit forfeiture before moving in. Matches roommates using weighted vector distance across sleep cycles, cleanliness, guest boundaries, and generates binding Roommate Charters.
        </p>
      </div>

      {/* Main Vector Config Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: User Lifestyle Vector Questionnaire */}
        <div className="lg:col-span-6 bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black text-text-primary uppercase tracking-wider">
                1. Your Lifestyle Rhythm
              </h3>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-text-muted hidden sm:inline font-bold">Quick Fill:</span>
              <button
                onClick={() => applyPreset('student')}
                className="px-2 py-0.5 rounded-lg bg-surfaceMuted hover:bg-border text-text-primary border border-border text-[10px] font-bold transition-colors"
              >
                Student
              </button>
              <button
                onClick={() => applyPreset('techie')}
                className="px-2 py-0.5 rounded-lg bg-surfaceMuted hover:bg-border text-text-primary border border-border text-[10px] font-bold transition-colors"
              >
                Tech WFH
              </button>
              <button
                onClick={() => applyPreset('creative')}
                className="px-2 py-0.5 rounded-lg bg-surfaceMuted hover:bg-border text-text-primary border border-border text-[10px] font-bold transition-colors"
              >
                Night Owl
              </button>
            </div>
          </div>

          {/* User Name input */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <label className="font-bold">Display Name / Alias:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-surface border border-border px-2.5 py-1 rounded-lg text-xs text-text-primary font-bold focus:outline-none focus:ring-1 focus:ring-primary w-36 text-right"
              placeholder="e.g. Het"
            />
          </div>

          {/* 6 Lifestyle Vector Sliders */}
          <div className="space-y-4">
            
            {/* 1. Cleanliness */}
            <div className="space-y-1.5 p-3 rounded-xl bg-surfaceMuted border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Cleanliness & Chore Threshold
                </span>
                <span className="font-mono text-primary font-extrabold">{userVector.cleanliness} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.cleanliness}
                onChange={(e) => handleSliderChange('cleanliness', Number(e.target.value))}
                className="w-full accent-[#245B4A] cursor-pointer h-1.5 bg-border rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Relaxed / Weekend pass</span>
                <span>Strict daily dishes & spotless</span>
              </div>
            </div>

            {/* 2. Sleep Schedule */}
            <div className="space-y-1.5 p-3 rounded-xl bg-surfaceMuted border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Circadian Sleep Rhythm
                </span>
                <span className="font-mono text-indigo-700 font-extrabold">{userVector.sleep_schedule} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.sleep_schedule}
                onChange={(e) => handleSliderChange('sleep_schedule', Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-border rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Early Riser (Sleep by 10 PM)</span>
                <span>Night Owl (Up past 2:30 AM)</span>
              </div>
            </div>

            {/* 3. Guest & Social Policy */}
            <div className="space-y-1.5 p-3 rounded-xl bg-surfaceMuted border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Guest & Social Hosting
                </span>
                <span className="font-mono text-amber-700 font-extrabold">{userVector.guest_policy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.guest_policy}
                onChange={(e) => handleSliderChange('guest_policy', Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-border rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Quiet Sanctuary (No parties)</span>
                <span>Open House (Frequent friends)</span>
              </div>
            </div>

            {/* 4. Expense & Bill Discipline */}
            <div className="space-y-1.5 p-3 rounded-xl bg-surfaceMuted border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Utility & Bill Splitting Style
                </span>
                <span className="font-mono text-emerald-800 font-extrabold">{userVector.bill_discipline} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.bill_discipline}
                onChange={(e) => handleSliderChange('bill_discipline', Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-border rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Casual pooling</span>
                <span>Immediate 24h UPI / Splitwise</span>
              </div>
            </div>

            {/* 5. Noise Tolerance */}
            <div className="space-y-1.5 p-3 rounded-xl bg-surfaceMuted border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Noise & Daytime Focus
                </span>
                <span className="font-mono text-purple-700 font-extrabold">{userVector.noise_tolerance} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.noise_tolerance}
                onChange={(e) => handleSliderChange('noise_tolerance', Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-border rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Library silence</span>
                <span>Lively / Music & TV friendly</span>
              </div>
            </div>

            {/* 6. Kitchen & Dietary */}
            <div className="space-y-1.5 p-3 rounded-xl bg-surfaceMuted border border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Kitchen & Cooking Synergy
                </span>
                <span className="font-mono text-rose-700 font-extrabold">{userVector.dietary_kitchen} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.dietary_kitchen}
                onChange={(e) => handleSliderChange('dietary_kitchen', Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer h-1.5 bg-border rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-text-muted">
                <span>Strict Veg / Separate</span>
                <span>Fully shared / Non-Veg welcome</span>
              </div>
            </div>

          </div>

          <button
            onClick={handleManualMatch}
            disabled={loadingMatch}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-extrabold transition-all shadow-subtle flex items-center justify-center gap-2"
          >
            {loadingMatch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Computing Cosine Vector Distance...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Recalculate Lifestyle Fit</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Candidate Profiles & Real-Time Match Radar */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Candidate Selection Cards */}
          <div className="bg-surface p-5 rounded-2xl border border-border shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-text-muted uppercase tracking-wider">
                2. Select Potential Co-Living Flatmate:
              </span>
              <span className="text-[10px] text-primary font-bold">
                {candidates.length} Profiles
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {candidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => handleSelectCandidate(cand)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCandidateId === cand.id
                      ? 'bg-primary-light/60 border-primary text-primary shadow-subtle ring-1 ring-primary/30'
                      : 'bg-surface border-border text-text-primary hover:bg-surfaceMuted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-extrabold">{cand.name}</span>
                    {selectedCandidateId === cand.id && <Check className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <span className="text-[10px] text-text-muted block line-clamp-1">{cand.occupation}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-text-muted mt-1">
                    <span>{cand.city.split('/')[0]}</span>
                    <span>•</span>
                    <span className="text-primary font-bold">{cand.budget_range_inr.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Candidate Bio Excerpt */}
            {selectedCandidate && (
              <div className="p-3 rounded-xl bg-surfaceMuted border border-border text-xs text-text-secondary italic">
                "{selectedCandidate.bio}"
              </div>
            )}
          </div>

          {/* Real-time Match Results Panel */}
          {matchResult && (
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-6">
              
              {/* Score Gauge & Verdict Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-5 border-b border-border">
                
                {/* Radial Gauge */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="40" stroke="#E8ECE9" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="56"
                      cy="56"
                      r="40"
                      stroke={scoreColor.stroke}
                      strokeWidth="8"
                      strokeDasharray="251"
                      strokeDashoffset={251 - (251 * score) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className={`text-2xl font-black tracking-tight ${scoreColor.text}`}>
                      {score}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                      Fit Index
                    </span>
                  </div>
                </div>

                {/* Match Verdict Card */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreColor.bg} ${scoreColor.text} ${scoreColor.border}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{matchResult.match.badge}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-text-primary">
                    {userName} & {matchResult.candidate_name}
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    {matchResult.match.summary}
                  </p>
                </div>

              </div>

              {/* Synergies & Friction Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                  <div className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Shared Synergies</span>
                  </div>
                  <ul className="space-y-1 text-emerald-900 text-[11px] list-disc list-inside">
                    {matchResult.match.synergies.map((s, idx) => (
                      <li key={idx} className="leading-snug">{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-2">
                  <div className="font-extrabold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Friction Watchlist</span>
                  </div>
                  <ul className="space-y-1 text-amber-900 text-[11px] list-disc list-inside">
                    {matchResult.match.friction_points.map((f, idx) => (
                      <li key={idx} className="leading-snug">{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dimension Breakdown Sliders */}
              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-xs font-extrabold text-text-muted uppercase tracking-wider block mb-2">
                  Dimension-by-Dimension Vector Overlap
                </span>
                {matchResult.match.dimension_breakdown.map((dim) => (
                  <div key={dim.dimension} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-text-primary">
                      <span>{dim.title}</span>
                      <span className="font-mono text-primary">{dim.match_pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surfaceMuted rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${dim.match_pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button: Generate Living Charter */}
              <div className="pt-2">
                <button
                  onClick={handleGenerateCharter}
                  disabled={loadingCharter}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-extrabold transition-all shadow-subtle flex items-center justify-center gap-2"
                >
                  {loadingCharter ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Co-Tenancy Pact...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-emerald-300" />
                      <span>Synthesize Binding Roommate Charter</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Living Charter Modal */}
      <LivingCharterModal
        charter={charter}
        userName={userName}
        candidateName={matchResult?.candidate_name || 'Roommate'}
        onClose={() => setCharterModalOpen(false)}
      />

    </div>
  );
};
