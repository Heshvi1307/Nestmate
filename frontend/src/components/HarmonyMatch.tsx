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
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('priya_sde');
  const [userName, setUserName] = useState<string>('You');
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
          // Run initial match for instant wow factor!
          executeMatch(userName, userVector, defaultCand.id);
        }
      })
      .catch((err) => {
        console.warn('Backend candidates unavailable, using local fallback', err);
      });
  }, []);

  const executeMatch = async (name: string, vector: LifestyleVector, candId: string) => {
    setLoadingMatch(true);
    setError(null);
    try {
      const res = await matchHarmonyProfiles(name, vector, candId);
      setMatchResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate compatibility');
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
    executeMatch(userName, userVector, cand.id);
  };

  const handleManualMatch = () => {
    executeMatch(userName, userVector, selectedCandidateId);
  };

  const applyPreset = (presetName: string) => {
    let presetVec: LifestyleVector;
    if (presetName === 'student') {
      presetVec = { cleanliness: 9, sleep_schedule: 2, guest_policy: 2, bill_discipline: 10, noise_tolerance: 2, dietary_kitchen: 3 };
    } else if (presetName === 'techie') {
      presetVec = { cleanliness: 7, sleep_schedule: 5, guest_policy: 4, bill_discipline: 9, noise_tolerance: 4, dietary_kitchen: 6 };
    } else {
      // creative night owl
      presetVec = { cleanliness: 5, sleep_schedule: 9, guest_policy: 8, bill_discipline: 7, noise_tolerance: 8, dietary_kitchen: 8 };
    }
    setUserVector(presetVec);
    executeMatch(userName, presetVec, selectedCandidateId);
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
      ? { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
      : score >= 65
      ? { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' }
      : { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Pillar 2: Flatmate Lifestyle Compatibility & Conflict Prevention</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          HarmonyMatch: <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">Multi-Dimensional Housemate Fit</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Prevent co-living friction and deposit forfeiture before moving in. Matches roommates using weighted cosine vector distance across sleep cycles, cleanliness, guest boundaries, and generates binding Roommate Charters.
        </p>
      </div>

      {/* Main Vector Config Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: User Lifestyle Vector Questionnaire */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Your Lifestyle Habits & Rhythm
              </h3>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 hidden sm:inline">Quick Fill:</span>
              <button
                onClick={() => applyPreset('student')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px]"
              >
                Student
              </button>
              <button
                onClick={() => applyPreset('techie')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px]"
              >
                Tech WFH
              </button>
              <button
                onClick={() => applyPreset('creative')}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px]"
              >
                Night Owl
              </button>
            </div>
          </div>

          {/* User Name input */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="font-semibold">Display Name / Alias:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500/50 w-36 text-right"
              placeholder="e.g. Alex"
            />
          </div>

          {/* 6 Lifestyle Vector Sliders */}
          <div className="space-y-4">
            
            {/* 1. Cleanliness */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  Cleanliness & Chore Threshold
                </span>
                <span className="font-mono text-teal-400 font-bold">{userVector.cleanliness} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.cleanliness}
                onChange={(e) => handleSliderChange('cleanliness', Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Relaxed / Weekend pass</span>
                <span>Strict daily dishes & spotless</span>
              </div>
            </div>

            {/* 2. Sleep Schedule */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  Circadian Sleep Rhythm
                </span>
                <span className="font-mono text-indigo-400 font-bold">{userVector.sleep_schedule} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.sleep_schedule}
                onChange={(e) => handleSliderChange('sleep_schedule', Number(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Early Riser (Sleep by 10 PM)</span>
                <span>Night Owl (Up past 2:30 AM)</span>
              </div>
            </div>

            {/* 3. Guest & Social Policy */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Guest & Social Hosting
                </span>
                <span className="font-mono text-amber-400 font-bold">{userVector.guest_policy} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.guest_policy}
                onChange={(e) => handleSliderChange('guest_policy', Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Quiet Sanctuary (No parties)</span>
                <span>Open House (Frequent friends)</span>
              </div>
            </div>

            {/* 4. Expense & Bill Discipline */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Utility & Bill Splitting Style
                </span>
                <span className="font-mono text-emerald-400 font-bold">{userVector.bill_discipline} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.bill_discipline}
                onChange={(e) => handleSliderChange('bill_discipline', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Casual month-end pooling</span>
                <span>Immediate 24h UPI / Splitwise</span>
              </div>
            </div>

            {/* 5. Noise Tolerance */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Noise & Daytime Focus
                </span>
                <span className="font-mono text-purple-400 font-bold">{userVector.noise_tolerance} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.noise_tolerance}
                onChange={(e) => handleSliderChange('noise_tolerance', Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Library silence / Headphones</span>
                <span>Lively / Speaker & TV friendly</span>
              </div>
            </div>

            {/* 6. Kitchen & Dietary */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-900">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Kitchen & Cooking Synergy
                </span>
                <span className="font-mono text-rose-400 font-bold">{userVector.dietary_kitchen} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={userVector.dietary_kitchen}
                onChange={(e) => handleSliderChange('dietary_kitchen', Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Separate cookware / Strict Veg</span>
                <span>Fully shared / Non-Veg welcome</span>
              </div>
            </div>

          </div>

          <button
            onClick={handleManualMatch}
            disabled={loadingMatch}
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2"
          >
            {loadingMatch ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Computing Cosine Vector Distance...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recalculate Lifestyle Fit</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Candidate Profiles & Real-Time Match Radar */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Candidate Selection Cards */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Select Potential Co-Living Flatmate:
              </span>
              <span className="text-[10px] text-teal-400 font-semibold">
                {candidates.length} Verified Profiles
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {candidates.map((cand) => (
                <button
                  key={cand.id}
                  onClick={() => handleSelectCandidate(cand)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCandidateId === cand.id
                      ? 'bg-teal-950/40 border-teal-500 text-teal-200 ring-1 ring-teal-500/40 shadow-md shadow-teal-950/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{cand.name}</span>
                    {selectedCandidateId === cand.id && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">{cand.occupation}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
                    <span>{cand.city.split('/')[0]}</span>
                    <span>•</span>
                    <span className="text-teal-400/80">{cand.budget_range_inr.split(' ')[0]}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Candidate Bio Excerpt */}
            {selectedCandidate && (
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 italic">
                "{selectedCandidate.bio}"
              </div>
            )}
          </div>

          {/* Real-time Match Results Panel */}
          {matchResult && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              
              {/* Score Gauge & Verdict Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-5 border-b border-slate-800/80">
                
                {/* Radial Gauge */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
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
                    <span className={`text-2xl font-extrabold tracking-tight ${scoreColor.text}`}>
                      {score}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                      Fit Index
                    </span>
                  </div>
                </div>

                {/* Verdict Info */}
                <div className="space-y-1.5 text-center sm:text-left flex-1">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${scoreColor.bg} ${scoreColor.border} ${scoreColor.text}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{matchResult.match.badge}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {userName} & {matchResult.candidate_name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {matchResult.match.summary}
                  </p>
                </div>
              </div>

              {/* Multi-Dimensional Vector Comparison Bars */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Vector Dimension Alignment (You vs {matchResult.candidate_name})
                </span>
                <div className="space-y-2.5">
                  {matchResult.match.dimension_breakdown.map((dim) => (
                    <div key={dim.dimension} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium">{dim.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">
                            You: <strong className="text-teal-300">{dim.user_val}</strong> | Flatmate: <strong className="text-slate-300">{dim.candidate_val}</strong>
                          </span>
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                              dim.diff >= 4
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {dim.match_pct}% match
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${dim.match_pct}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            dim.diff >= 4 ? 'bg-rose-500' : dim.diff >= 2 ? 'bg-amber-400' : 'bg-teal-400'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Friction Alerts & Synergies */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                {matchResult.match.friction_points.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Potential Friction Warnings
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {matchResult.match.friction_points.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {matchResult.match.synergies.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Shared Lifestyle Synergies
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {matchResult.match.synergies.map((syn, idx) => (
                        <li key={idx}>{syn}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA: Generate Roommate Living Charter */}
              <div className="pt-2">
                <button
                  onClick={handleGenerateCharter}
                  disabled={loadingCharter}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  {loadingCharter ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Co-Living Ground Rules...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Generate Roommate Living Charter (Pact)</span>
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
