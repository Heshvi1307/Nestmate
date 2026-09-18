import React, { useState } from 'react';
import { Search, Users, MapPin, Briefcase, Brain } from 'lucide-react';
import { useRoommates } from '../hooks/useRoommates';

export const RoommateMatching: React.FC = () => {
  const { roommates, loading, error } = useRoommates();
  const [search, setSearch] = useState('');

  const filtered = roommates.filter((r) =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.location.toLowerCase().includes(search.toLowerCase()) ||
    r.profession.toLowerCase().includes(search.toLowerCase()) ||
    r.mbti?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-rose-600 font-medium">❌ Failed to load roommates: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, city, profession, MBTI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
        </div>
        <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-full">
          <Users className="w-3.5 h-3.5" />
          {filtered.length} Profiles
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 border border-slate-100 space-y-3">
            {/* Avatar + name */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {r.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 truncate">{r.name}</h3>
                <p className="text-slate-500 text-xs">{r.age} yrs · {r.experience_years}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{r.location}</span>
                </div>
              </div>
            </div>

            {/* Profession */}
            <div className="flex items-center gap-1.5 text-sm text-slate-700">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{r.profession}</span>
            </div>

            {/* MBTI badge */}
            {r.mbti && (
              <div className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  MBTI: {r.mbti}
                </span>
              </div>
            )}

            {/* About me */}
            {r.about_me && (
              <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 rounded-xl p-2">{r.about_me}</p>
            )}

            {/* Interests */}
            {Array.isArray(r.interests) && r.interests.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {r.interests.slice(0, 5).map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {r.interests.length > 5 && (
                  <span className="text-xs text-slate-400 px-1">+{r.interests.length - 5}</span>
                )}
              </div>
            )}

            {/* AI Match Pending badge */}
            <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full">
                🤖 AI Match Pending
              </span>
              <button className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                Connect →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No roommates match your search.</p>
        </div>
      )}
    </div>
  );
};
