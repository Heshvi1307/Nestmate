import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FairLeaseGuard } from './components/FairLeaseGuard';
import { HarmonyMatch } from './components/HarmonyMatch';
import { SnapFixTriage } from './components/SnapFixTriage';
import { Users, Wrench, Calculator, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('lease-guard');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'lease-guard' && <FairLeaseGuard />}
        {activeTab === 'harmony-match' && <HarmonyMatch />}

        {activeTab === 'snapfix' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SnapFixTriage />
          </div>
        )}

        {activeTab === 'truecost' && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mx-auto flex items-center justify-center">
              <Calculator className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Pillar 4 Architecture Ready</span>
              <h2 className="text-3xl font-extrabold text-white">TrueCost Index: Living Cost & Fair Value</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm">
                Calculates total actual monthly living cost (Base Rent + Maintenance + Power/Water + Deposit opportunity cost) and benchmarks against city corridor indices.
              </p>
            </div>
            <div className="p-6 glass-panel rounded-2xl border border-slate-800 text-left max-w-lg mx-auto space-y-3">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Next on 24-hour Roadmap:</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Interactive TrueCost stack breakdown bar</li>
                <li>Flat A vs Flat B side-by-side total cost comparator</li>
                <li>Corridor fair-market price gauge</li>
              </ul>
              <button
                onClick={() => setActiveTab('lease-guard')}
                className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Back to Active Feature (Lease Guard)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Hackathon Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-400">RentFair AI</span>
            <span>— Built for CodeCraft '26 @ Nirma University</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Track: PropTech</span>
            <span>•</span>
            <span>Model Tenancy Act Compliant</span>
            <span>•</span>
            <span className="text-teal-400 font-semibold">24-Hour Hackathon Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
