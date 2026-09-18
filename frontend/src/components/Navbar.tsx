import React from 'react';
import { ShieldCheck, Users, Wrench, Calculator, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-teal-200 bg-clip-text text-transparent">
                RentFair AI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-full">
                CodeCraft '26
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Next-Gen PropTech & Living Space Platform</p>
          </div>
        </div>

        {/* Pillar Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('lease-guard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'lease-guard'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lease Guard</span>
          </button>

          <button
            onClick={() => setActiveTab('harmony-match')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'harmony-match'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>HarmonyMatch</span>
            <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-800 text-slate-400 rounded">Pillar 2</span>
          </button>

          <button
            onClick={() => setActiveTab('snapfix')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'snapfix'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>SnapFix Triage</span>
            <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-800 text-slate-400 rounded">Pillar 3</span>
          </button>

          <button
            onClick={() => setActiveTab('truecost')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'truecost'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>TrueCost Index</span>
            <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-800 text-slate-400 rounded">Pillar 4</span>
          </button>
        </nav>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MTA Compliant</span>
          </div>
        </div>

      </div>
    </header>
  );
};
