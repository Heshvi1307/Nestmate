import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { FairLeaseGuard } from './components/FairLeaseGuard';
import { HarmonyMatch } from './components/HarmonyMatch';
import { SnapFixTriage } from './components/SnapFixTriage';
import { TrueCostCalculator } from './components/TrueCostCalculator';
import { ShieldCheck } from 'lucide-react';

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

        {activeTab === 'truecost' && <TrueCostCalculator />}
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
