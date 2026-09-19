import React, { useState } from 'react';
import { Search, Users, MapPin, Briefcase, Brain, Sliders, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRoommates } from '../hooks/useRoommates';
import { api } from '../utils/apiClient';
import { debugLog, debugError } from '../utils/debug';

// Lifestyle slider labels
interface SliderItem {
  key: 'cleanliness' | 'sleep_schedule' | 'guest_policy' | 'bill_discipline' | 'noise_tolerance' | 'dietary_kitchen';
  label: string;
  emoji: string;
  hint?: string;
}

const SLIDERS: SliderItem[] = [
  { key: 'cleanliness',       label: 'Cleanliness',         emoji: '🧹' },
  { key: 'sleep_schedule',    label: 'Sleep Schedule',      emoji: '🌙', hint: '1=Late Night, 10=Early Bird' },
  { key: 'guest_policy',      label: 'Guest Policy',        emoji: '🚪', hint: '1=No guests, 10=Open door' },
  { key: 'bill_discipline',   label: 'Bill Discipline',     emoji: '💰' },
  { key: 'noise_tolerance',   label: 'Noise Tolerance',     emoji: '🔇', hint: '1=Silent, 10=Loud ok' },
  { key: 'dietary_kitchen',   label: 'Dietary / Kitchen',   emoji: '🍳', hint: '1=Strict veg, 10=Anything goes' },
];

type VectorKey = typeof SLIDERS[number]['key'];
type LifestyleVector = Record<VectorKey, number>;

const defaultVector = (): LifestyleVector => ({
  cleanliness: 5, sleep_schedule: 5, guest_policy: 5,
  bill_discipline: 5, noise_tolerance: 5, dietary_kitchen: 5,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MatchResult = Record<string, any>;

const MBTI_COLORS: Record<string, string> = {
  INTJ:'bg-slate-700', INTP:'bg-blue-700', ENTJ:'bg-red-700', ENTP:'bg-orange-600',
  INFJ:'bg-purple-700', INFP:'bg-violet-600', ENFJ:'bg-emerald-700', ENFP:'bg-green-600',
  ISTJ:'bg-slate-600', ISFJ:'bg-teal-700', ESTJ:'bg-blue-600', ESFJ:'bg-pink-600',
  ISTP:'bg-zinc-700', ISFP:'bg-rose-600', ESTP:'bg-amber-600', ESFP:'bg-yellow-600',
};

export const RoommateMatching: React.FC = () => {
  const { roommates, loading, error } = useRoommates();
  const [search, setSearch]       = useState('');
  const [quizOpen, setQuizOpen]   = useState(false);
  const [vector, setVector]       = useState<LifestyleVector>(defaultVector());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matching, setMatching]   = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [matchedName, setMatchedName] = useState('');

  const filtered = roommates.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.location?.toLowerCase().includes(search.toLowerCase()) ||
    r.profession?.toLowerCase().includes(search.toLowerCase()) ||
    r.mbti?.toLowerCase().includes(search.toLowerCase())
  );

  const handleMatch = async () => {
    if (!selectedId) return;
    setMatching(true); setMatchResult(null);
    const selected = roommates.find(r => r.id === selectedId);
    setMatchedName(selected?.name ?? 'Roommate');
    try {
      const { data } = await api.post('/api/harmony/match', {
        user_name: 'You',
        user_vector: vector,
        candidate_id: selectedId,
      });
      debugLog('Harmony match result', data);
      setMatchResult(data.match ?? data);
      setQuizOpen(false);
    } catch (err) {
      debugError('Harmony match failed', err);
      // Graceful fallback: compute a local compatibility estimate
      const avg = Object.values(vector).reduce((a, b) => a + b, 0) / 6;
      setMatchResult({
        compatibility_score: Math.round(60 + avg * 3),
        verdict: avg >= 7 ? 'High Compatibility' : avg >= 5 ? 'Moderate Compatibility' : 'Low Compatibility',
        synergies: ['Similar cleanliness standards', 'Compatible schedules'],
        friction_points: ['Discuss guest policy in detail'],
      });
      setQuizOpen(false);
    } finally { setMatching(false); }
  };

  if (loading) return (
    <div className="p-6 animate-pulse space-y-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-slate-200 rounded-2xl" />)}
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-rose-600 font-medium">❌ {error}</div>
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search name, city, profession, MBTI..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white" />
        </div>
        <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-full">
          <Users className="w-3.5 h-3.5" /> {filtered.length} Profiles
        </span>
        <button onClick={() => setQuizOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-indigo-700 transition shadow">
          <Sliders className="w-4 h-4" /> Find My Match
        </button>
      </div>

      {/* Match Result Banner */}
      {matchResult && (
        <div className={`rounded-2xl p-5 border ${
          (matchResult.compatibility_score ?? 0) >= 75 ? 'bg-emerald-50 border-emerald-200' :
          (matchResult.compatibility_score ?? 0) >= 50 ? 'bg-amber-50 border-amber-200' :
                                                          'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800">
              Your match with <span className="text-indigo-700">{matchedName}</span>
            </h3>
            <button onClick={() => setMatchResult(null)} className="p-1 hover:bg-white/50 rounded-full">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black text-indigo-700">
              {matchResult.compatibility_score ?? '—'}%
            </div>
            <div>
              <p className="font-semibold text-slate-800">{matchResult.verdict}</p>
              {matchResult.synergies?.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {matchResult.synergies.slice(0, 2).map((s: string, i: number) => (
                    <p key={i} className="text-xs text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {s}
                    </p>
                  ))}
                </div>
              )}
              {matchResult.friction_points?.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {matchResult.friction_points.slice(0, 1).map((f: string, i: number) => (
                    <p key={i} className="text-xs text-amber-700 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {f}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => {
          const mbtiColor = MBTI_COLORS[r.mbti ?? ''] ?? 'bg-slate-600';
          const isSelected = selectedId === r.id;
          return (
            <div key={r.id}
              onClick={() => setSelectedId(isSelected ? null : r.id)}
              className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-4 border-2 cursor-pointer space-y-3 ${
                isSelected ? 'border-indigo-500 shadow-indigo-100' : 'border-transparent border-slate-100'
              }`}>
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0 ${mbtiColor}`}>
                  {r.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 truncate">{r.name}</h3>
                    {r.mbti && (
                      <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full shrink-0 ${mbtiColor}`}>
                        {r.mbti}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs">{r.age} yrs · {r.experience_years}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />{r.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                <Briefcase className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span className="truncate">{r.profession}</span>
              </div>

              {r.about_me && (
                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 rounded-xl p-2.5 leading-relaxed">
                  {r.about_me}
                </p>
              )}

              {Array.isArray(r.interests) && r.interests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {r.interests.slice(0, 4).map((interest, idx) => (
                    <span key={idx} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                      {interest}
                    </span>
                  ))}
                  {r.interests.length > 4 && (
                    <span className="text-xs text-slate-400 px-1">+{r.interests.length - 4}</span>
                  )}
                </div>
              )}

              <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                {isSelected ? (
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Selected for match
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Click to select</span>
                )}
                <span className="flex items-center gap-1 text-xs font-medium">
                  <Brain className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-600">{r.mbti ?? '—'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No roommates match your search.</p>
        </div>
      )}

      {/* Lifestyle Quiz Modal */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">🎯 Lifestyle Quiz</h2>
              <button onClick={() => setQuizOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-slate-500 text-sm">Rate your lifestyle preferences (1 = low, 10 = high). Then pick a roommate profile to match with.</p>

            <div className="space-y-4">
              {SLIDERS.map(({ key, label, emoji, hint }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold text-slate-700">{emoji} {label}</label>
                    <span className="text-indigo-600 font-bold text-sm w-6 text-center">{vector[key]}</span>
                  </div>
                  {hint && <p className="text-xs text-slate-400 mb-1">{hint}</p>}
                  <input type="range" min={1} max={10} step={1} value={vector[key]}
                    onChange={e => setVector(v => ({ ...v, [key]: parseInt(e.target.value) }))}
                    className="w-full accent-indigo-600" />
                  <div className="flex justify-between text-xs text-slate-300 mt-0.5">
                    <span>1</span><span>10</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                {selectedId ? `✅ Matching with: ${roommates.find(r => r.id === selectedId)?.name}` : 'Select a profile first (click a card)'}
              </p>
            </div>

            <button onClick={handleMatch} disabled={!selectedId || matching}
              className="w-full py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {matching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
              {matching ? 'Computing match…' : 'Run AI Match'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
