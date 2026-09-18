import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Check, Search } from 'lucide-react';

interface ParsedToken {
  category: string;
  value: string;
}

interface AISmartSearchBarProps {
  onApplyParsedFilter: (tokens: ParsedToken[]) => void;
  onClear: () => void;
}

export const AISmartSearchBar: React.FC<AISmartSearchBarProps> = ({
  onApplyParsedFilter,
  onClear
}) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTokens, setActiveTokens] = useState<ParsedToken[] | null>(null);

  const sampleQueries = [
    "Find me a furnished 1BHK under ₹20,000 within 20 minutes of my college with parking",
    "2BHK under ₹25,000 near Vastrapur metro with power backup and fast Wi-Fi",
    "Studio or Co-living under ₹18,000 with workspace and pet friendly policy"
  ];

  const handleInterpretQuery = (textToParse: string) => {
    if (!textToParse.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const lower = textToParse.toLowerCase();
      const tokens: ParsedToken[] = [];

      // Budget extraction
      if (lower.includes('20,000') || lower.includes('20k')) {
        tokens.push({ category: 'Budget', value: '≤ ₹20,000 / mo' });
      } else if (lower.includes('25,000') || lower.includes('25k')) {
        tokens.push({ category: 'Budget', value: '≤ ₹25,000 / mo' });
      } else if (lower.includes('18,000') || lower.includes('18k')) {
        tokens.push({ category: 'Budget', value: '≤ ₹18,000 / mo' });
      } else {
        tokens.push({ category: 'Budget', value: '≤ ₹30,000 / mo' });
      }

      // Property type / Bedrooms
      if (lower.includes('1bhk') || lower.includes('1 bhk')) {
        tokens.push({ category: 'Type', value: '1 BHK' });
      } else if (lower.includes('2bhk') || lower.includes('2 bhk')) {
        tokens.push({ category: 'Type', value: '2 BHK' });
      } else if (lower.includes('studio') || lower.includes('co-living') || lower.includes('coliving')) {
        tokens.push({ category: 'Type', value: 'Studio / Co-Living' });
      }

      // Furnishing
      if (lower.includes('furnished')) {
        tokens.push({ category: 'Furnishing', value: 'Furnished' });
      }

      // Commute
      if (lower.includes('college') || lower.includes('university')) {
        tokens.push({ category: 'Commute', value: '≤ 20 min to College' });
      } else if (lower.includes('metro')) {
        tokens.push({ category: 'Transit', value: '≤ 10 min to Metro' });
      }

      // Amenities
      if (lower.includes('parking')) {
        tokens.push({ category: 'Amenity', value: 'Dedicated Parking' });
      }
      if (lower.includes('power backup') || lower.includes('backup')) {
        tokens.push({ category: 'Amenity', value: '100% Power Backup' });
      }
      if (lower.includes('pet')) {
        tokens.push({ category: 'Policy', value: 'Pet Friendly' });
      }
      if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet')) {
        tokens.push({ category: 'Tech', value: 'High-speed Fiber' });
      }

      setActiveTokens(tokens);
      setIsProcessing(false);
      onApplyParsedFilter(tokens);
    }, 450);
  };

  const handleClearTokens = () => {
    setActiveTokens(null);
    setQuery('');
    onClear();
  };

  return (
    <div className="bg-surface rounded-2xl border border-primary/25 shadow-card p-3 sm:p-4 mb-6 transition-all hover:border-primary/40">
      
      {/* Header with AI Badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-primary-light flex items-center justify-center text-primary">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
          </div>
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
            AI Smart Search
          </span>
          <span className="text-[11px] text-text-muted hidden sm:inline">
            Describe your ideal space in natural language
          </span>
        </div>

        {activeTokens && (
          <button
            onClick={handleClearTokens}
            className="text-xs font-semibold text-text-muted hover:text-rose-600 flex items-center space-x-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset AI Filters</span>
          </button>
        )}
      </div>

      {/* Input Field */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleInterpretQuery(query);
          }}
          placeholder="e.g. Find me a furnished 1BHK under ₹20,000 within 20 minutes of my college with parking..."
          className="w-full pl-3 pr-24 py-2.5 rounded-xl bg-surfaceMuted/80 border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-surface transition-all"
        />

        <button
          onClick={() => handleInterpretQuery(query)}
          disabled={!query.trim() || isProcessing}
          className="absolute right-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-subtle"
        >
          {isProcessing ? (
            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Parse</span>
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {/* Sample clickable suggestion chips */}
      {!activeTokens && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-text-muted font-semibold">Try:</span>
          {sampleQueries.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(sample);
                handleInterpretQuery(sample);
              }}
              className="text-[11px] text-text-secondary hover:text-primary bg-[#F0F2EF] hover:bg-primary-light px-2.5 py-1 rounded-lg transition-colors truncate max-w-xs sm:max-w-md text-left"
            >
              "{sample}"
            </button>
          ))}
        </div>
      )}

      {/* Live AI Query Interpretation Card */}
      {activeTokens && (
        <div className="mt-3 pt-3 border-t border-border/80 animate-in fade-in duration-200">
          <div className="flex items-center space-x-1.5 text-xs text-primary font-bold mb-2">
            <Check className="w-3.5 h-3.5 text-success" />
            <span>AI extracted {activeTokens.length} structured search constraints:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeTokens.map((token, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary text-white shadow-subtle"
              >
                <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-normal">
                  {token.category}:
                </span>
                <span>{token.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
