import React, { useState } from 'react';
import { 
  Users, 
  Check, 
  Sparkles, 
  Send, 
  Sliders, 
  Moon, 
  Sun, 
  Coffee, 
  Briefcase, 
  Home, 
  ShieldCheck, 
  Clock, 
  UserCheck,
  Scale,
  X,
  MessageSquare
} from 'lucide-react';
import { RoommateProfile } from '../types';
import { MOCK_ROOMMATES } from '../data/mockData';

interface RoommateMatchingProps {
  onOpenMessageWithRoommate: (roommate: RoommateProfile) => void;
}

export const RoommateMatching: React.FC<RoommateMatchingProps> = ({
  onOpenMessageWithRoommate
}) => {
  const [roommates, setRoommates] = useState<RoommateProfile[]>(MOCK_ROOMMATES);
  const [selectedProfile, setSelectedProfile] = useState<RoommateProfile | null>(null);
  const [compareProfile, setCompareProfile] = useState<RoommateProfile | null>(null);
  const [requestSentIds, setRequestSentIds] = useState<string[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);

  // User's own lifestyle preferences (Het's profile)
  const [myPreferences, setMyPreferences] = useState({
    sleep: 'Early riser (6 AM)',
    work: 'Work from home',
    cleanliness: 'Neat freak',
    cooking: 'Cooks daily',
    social: 'Quiet & private',
    budgetMin: 12000,
    budgetMax: 18000
  });

  const handleSendRequest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!requestSentIds.includes(id)) {
      setRequestSentIds([...requestSentIds, id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5 text-secondary" />
            <span>Harmonious Co-Living Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Find someone who fits your lifestyle.
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl">
            Living together shouldn't be a gamble. We analyze sleep rhythm, work styles, cleanliness habits, and home boundaries to suggest high-synergy flatmates.
          </p>
        </div>

        {/* Retake/Edit Lifestyle Quiz Button */}
        <button
          onClick={() => setQuizOpen(!quizOpen)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-surface hover:bg-primary-light text-primary text-xs font-bold transition-all shadow-subtle self-start"
        >
          <Sliders className="w-3.5 h-3.5 text-secondary" />
          <span>{quizOpen ? 'Hide Lifestyle Survey' : 'Adjust My Lifestyle Profile'}</span>
        </button>
      </div>

      {/* Interactive Lifestyle Survey Drawer / Form */}
      {quizOpen && (
        <div className="bg-surface rounded-2xl border-2 border-primary/20 p-5 sm:p-7 shadow-card space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-text-primary">
                Your Personal Living Preferences (Het Patel)
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                These settings update your lifestyle compatibility estimates in real-time.
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-md">
              Self Profile: 100% Complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            {/* Sleep Schedule */}
            <div className="p-3 rounded-xl bg-surfaceMuted/60 border border-border">
              <label className="font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                Sleep Schedule
              </label>
              <select
                value={myPreferences.sleep}
                onChange={(e) => setMyPreferences({ ...myPreferences, sleep: e.target.value })}
                className="w-full bg-transparent font-semibold text-text-primary focus:outline-none"
              >
                <option value="Early riser (6 AM)">Early riser (6 AM)</option>
                <option value="Moderate (7-8 AM)">Moderate (7-8 AM)</option>
                <option value="Night owl (1-2 AM)">Night owl (1-2 AM)</option>
              </select>
            </div>

            {/* Work Style */}
            <div className="p-3 rounded-xl bg-surfaceMuted/60 border border-border">
              <label className="font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                Work / Study Style
              </label>
              <select
                value={myPreferences.work}
                onChange={(e) => setMyPreferences({ ...myPreferences, work: e.target.value })}
                className="w-full bg-transparent font-semibold text-text-primary focus:outline-none"
              >
                <option value="Work from home">Work from home (Quiet daytime)</option>
                <option value="Hybrid">Hybrid (2-3 days office)</option>
                <option value="Office daily">Office / Lab daily</option>
                <option value="Student">Student (Library hours)</option>
              </select>
            </div>

            {/* Cleanliness */}
            <div className="p-3 rounded-xl bg-surfaceMuted/60 border border-border">
              <label className="font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                Cleanliness Standard
              </label>
              <select
                value={myPreferences.cleanliness}
                onChange={(e) => setMyPreferences({ ...myPreferences, cleanliness: e.target.value })}
                className="w-full bg-transparent font-semibold text-text-primary focus:outline-none"
              >
                <option value="Neat freak">Neat freak (Broom-clean daily)</option>
                <option value="Consistently clean">Consistently clean</option>
                <option value="Relaxed">Relaxed</option>
              </select>
            </div>

            {/* Social / Guests */}
            <div className="p-3 rounded-xl bg-surfaceMuted/60 border border-border">
              <label className="font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                Social Vibe at Home
              </label>
              <select
                value={myPreferences.social}
                onChange={(e) => setMyPreferences({ ...myPreferences, social: e.target.value })}
                className="w-full bg-transparent font-semibold text-text-primary focus:outline-none"
              >
                <option value="Quiet & private">Quiet sanctuary (Recharge)</option>
                <option value="Occasional friends">Occasional friends over</option>
                <option value="Loves social gatherings">Social & weekend dinners</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* Roommate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roommates.map((person) => {
          const isRequested = requestSentIds.includes(person.id);

          return (
            <div
              key={person.id}
              onClick={() => setSelectedProfile(person)}
              className="bg-surface rounded-2xl border border-border hover:border-primary/40 shadow-subtle hover:shadow-card transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                
                {/* Top Row: Avatar, Name, Compatibility Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                      />
                      {person.verifiedId && (
                        <div className="absolute -bottom-1 -right-1 bg-surface p-0.5 rounded-full" title="Aadhaar ID Verified">
                          <Check className="w-3.5 h-3.5 text-white bg-success rounded-full p-0.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-text-primary group-hover:text-primary transition-colors">
                        {person.name}, {person.age}
                      </h3>
                      <p className="text-xs text-text-secondary">{person.profession}</p>
                      <p className="text-[11px] text-text-muted">{person.companyOrCollege}</p>
                    </div>
                  </div>

                  {/* Lifestyle Compatibility Estimate Badge */}
                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-primary text-white text-xs font-black shadow-subtle">
                      <Sparkles className="w-3 h-3 text-emerald-300" />
                      <span>{person.compatibilityScore}%</span>
                    </div>
                    <span className="block text-[9px] text-text-muted mt-1 uppercase font-semibold tracking-wider">
                      Compatibility
                    </span>
                  </div>
                </div>

                {/* Target Budget & Area */}
                <div className="mt-4 p-2.5 rounded-xl bg-surfaceMuted/50 border border-border/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-text-muted block">Budget Range</span>
                    <span className="font-bold text-text-primary">
                      ₹{person.budgetRange.min.toLocaleString('en-IN')} - ₹{person.budgetRange.max.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted block">Preferred Area</span>
                    <span className="font-semibold text-text-primary">
                      {person.preferredLocations[0]}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="mt-3 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                  "{person.bio}"
                </p>

                {/* Matched Lifestyle Traits */}
                <div className="mt-4 space-y-1.5 border-t border-border/60 pt-3">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">
                    Lifestyle Compatibility Breakdown
                  </span>
                  {person.matchedTraits.slice(0, 3).map((trait, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-xs text-emerald-900 font-medium">
                      <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      <span className="truncate">{trait}</span>
                    </div>
                  ))}
                </div>

                {/* Minor Differences (Honest Disclosure) */}
                {person.minorDifferences.length > 0 && (
                  <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/70 px-2 py-1 rounded-lg">
                    <span>Note: {person.minorDifferences[0]}</span>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-border flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCompareProfile(person);
                  }}
                  className="flex-1 py-2 rounded-xl border border-border text-xs font-bold text-text-primary hover:bg-surfaceMuted transition-colors flex items-center justify-center space-x-1"
                >
                  <Scale className="w-3 h-3 text-text-muted" />
                  <span>Compare</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSendRequest(person.id, e)}
                  disabled={isRequested}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                    isRequested
                      ? 'bg-emerald-50 text-success border border-emerald-200 cursor-default'
                      : 'bg-primary text-white hover:bg-primary-hover shadow-subtle'
                  }`}
                >
                  {isRequested ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Trait Comparison Modal */}
      {compareProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-elevated border border-border p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-text-primary">
                  Lifestyle Comparison: You (Het) vs {compareProfile.name}
                </h3>
              </div>
              <button
                onClick={() => setCompareProfile(null)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center bg-[#F4F6F3] p-3 rounded-xl border border-border">
              <span className="text-xs text-text-muted block">Overall Lifestyle Compatibility</span>
              <span className="text-2xl font-black text-primary">
                {compareProfile.compatibilityScore}% Synergy Estimate
              </span>
            </div>

            {/* Side by side rows */}
            <div className="space-y-3 text-xs divide-y divide-border/60">
              
              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-text-muted w-1/3">Sleep Schedule</span>
                <span className="text-text-primary w-1/3 font-semibold">{myPreferences.sleep}</span>
                <span className="text-primary w-1/3 text-right font-semibold">{compareProfile.lifestyleTraits.sleepSchedule}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-text-muted w-1/3">Work Style</span>
                <span className="text-text-primary w-1/3 font-semibold">{myPreferences.work}</span>
                <span className="text-primary w-1/3 text-right font-semibold">{compareProfile.lifestyleTraits.workStyle}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-text-muted w-1/3">Cleanliness</span>
                <span className="text-text-primary w-1/3 font-semibold">{myPreferences.cleanliness}</span>
                <span className="text-primary w-1/3 text-right font-semibold">{compareProfile.lifestyleTraits.cleanliness}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-text-muted w-1/3">Cooking Habit</span>
                <span className="text-text-primary w-1/3 font-semibold">{myPreferences.cooking}</span>
                <span className="text-primary w-1/3 text-right font-semibold">{compareProfile.lifestyleTraits.cooking}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-text-muted w-1/3">Social Vibe</span>
                <span className="text-text-primary w-1/3 font-semibold">{myPreferences.social}</span>
                <span className="text-primary w-1/3 text-right font-semibold">{compareProfile.lifestyleTraits.social}</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-text-muted w-1/3">Pet Policy</span>
                <span className="text-text-primary w-1/3 font-semibold">Pet Friendly</span>
                <span className="text-primary w-1/3 text-right font-semibold">{compareProfile.lifestyleTraits.pets}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-border">
              <button
                onClick={() => setCompareProfile(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:bg-surfaceMuted"
              >
                Close
              </button>
              <button
                onClick={(e) => {
                  handleSendRequest(compareProfile.id, e);
                  setCompareProfile(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-subtle"
              >
                Send Roommate Request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
