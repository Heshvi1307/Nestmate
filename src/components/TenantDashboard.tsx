import React, { useState } from 'react';
import { 
  Home, 
  IndianRupee, 
  Wrench, 
  FileText, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Settings, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  Download,
  CreditCard,
  Building,
  ShieldCheck,
  ChevronRight,
  Split
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MaintenanceHub } from './MaintenanceHub';
import { ExpenseTransparency } from './ExpenseTransparency';
import { LeaseLens } from './LeaseLens';
import { CommunicationCenter } from './CommunicationCenter';
import { RoommateMatching } from './RoommateMatching';

interface TenantDashboardProps {
  onOpenLeaseLens: () => void;
  onOpenAIAssistant: () => void;
}

export const TenantDashboard: React.FC<TenantDashboardProps> = ({
  onOpenLeaseLens,
  onOpenAIAssistant
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'maintenance' | 'expenses' | 'documents' | 'messages' | 'roommates'>('overview');
  const [rentPaid, setRentPaid] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePayRent = () => {
    setRentPaid(true);
    setShowReceiptModal(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'maintenance', label: 'Maintenance (1)', icon: Wrench },
    { id: 'expenses', label: 'Expenses & Split', icon: TrendingUp },
    { id: 'documents', label: 'LeaseLens & Docs', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'roommates', label: 'Roommates', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Good morning, Het 👋
            </h1>
            <span className="text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
              Verified Tenant Pass
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Your home at: <strong>The Solitaire Terraces · Flat 402</strong>, Vastrapur, Ahmedabad
          </p>
        </div>

        {/* Quick Help & Lease Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-text-muted block">Digital Agreement Status</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active · Valid until Oct 2026
            </span>
          </div>

          <button
            onClick={onOpenAIAssistant}
            className="px-3.5 py-2 rounded-xl bg-primary-light text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold flex items-center space-x-1.5 shadow-subtle"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>NORA Concierge</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout: Sidebar (3 cols) + Workspace (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider px-3 mb-2">
            Tenant Portal
          </div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSubTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveSubTab(link.id as any)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-primary text-white shadow-subtle'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surfaceMuted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* Quick Property Manager Info Box */}
          <div className="p-3.5 rounded-xl bg-surface border border-border mt-6 space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Assigned Property Manager
            </span>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                PT
              </div>
              <div>
                <span className="text-xs font-bold text-text-primary block">Pooja Trivedi</span>
                <span className="text-[10px] text-text-muted block">Aether Residential Mgmt</span>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab('messages')}
              className="w-full text-center text-[11px] font-bold text-primary hover:underline pt-1 block"
            >
              Direct Message →
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* OVERVIEW SUB-VIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 4 Main KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Next Rent Card */}
                <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Next Rent
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      rentPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rentPaid ? 'Paid' : 'Due in 5 days'}
                    </span>
                  </div>
                  <div className="text-xl font-black text-text-primary tabular-nums">
                    ₹24,000
                  </div>
                  {rentPaid ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Receipt Generated</span>
                    </span>
                  ) : (
                    <button
                      onClick={handlePayRent}
                      className="w-full py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-subtle flex items-center justify-center space-x-1"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Rent (0% UPI)</span>
                    </button>
                  )}
                </div>

                {/* Open Maintenance Card */}
                <div 
                  onClick={() => setActiveSubTab('maintenance')}
                  className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Open Maintenance
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded animate-pulse">
                      In Progress
                    </span>
                  </div>
                  <div className="text-xl font-black text-text-primary tabular-nums">
                    1 Active
                  </div>
                  <span className="text-[11px] text-text-secondary block truncate">
                    Sink Leak · Rahul en route
                  </span>
                </div>

                {/* Agreement Status */}
                <div 
                  onClick={() => setActiveSubTab('documents')}
                  className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Agreement
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <div className="text-xl font-black text-text-primary tabular-nums">
                    Verified
                  </div>
                  <span className="text-[11px] text-text-secondary block">
                    7 months remaining
                  </span>
                </div>

                {/* Monthly Spending */}
                <div 
                  onClick={() => setActiveSubTab('expenses')}
                  className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                      Total Living
                    </span>
                    <span className="text-[10px] bg-primary-light text-primary font-bold px-1.5 py-0.5 rounded">
                      TrueCost™
                    </span>
                  </div>
                  <div className="text-xl font-black text-primary tabular-nums">
                    ₹28,600
                  </div>
                  <span className="text-[11px] text-text-secondary block">
                    All utilities included
                  </span>
                </div>

              </div>

              {/* Living Overview & Spending Breakdown */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-card space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      Living Overview & Utility Tracking
                    </h3>
                    <p className="text-xs text-text-muted">Flat 402, Green Residency · Torrent Power Submeter #TR-99214</p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('expenses')}
                    className="text-xs font-bold text-primary hover:underline flex items-center space-x-1"
                  >
                    <span>Detailed Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border">
                    <span className="text-[10px] text-text-muted block">Base Rent</span>
                    <span className="font-extrabold text-text-primary block mt-0.5">₹24,000</span>
                    <span className="text-[10px] text-emerald-700">Fixed rate</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border">
                    <span className="text-[10px] text-text-muted block">Utilities</span>
                    <span className="font-extrabold text-text-primary block mt-0.5">₹2,780</span>
                    <span className="text-[10px] text-text-muted">Torrent Power</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border">
                    <span className="text-[10px] text-text-muted block">Maintenance</span>
                    <span className="font-extrabold text-text-primary block mt-0.5">₹1,200</span>
                    <span className="text-[10px] text-emerald-700">Society billed</span>
                  </div>

                  <div className="p-3 rounded-xl bg-surfaceMuted/50 border border-border">
                    <span className="text-[10px] text-text-muted block">Fiber Internet</span>
                    <span className="font-extrabold text-text-primary block mt-0.5">₹600</span>
                    <span className="text-[10px] text-text-muted">300 Mbps</span>
                  </div>

                  <div className="p-3 rounded-xl bg-primary-light/60 border border-primary/20">
                    <span className="text-[10px] text-primary font-bold block">Total Outlay</span>
                    <span className="font-black text-primary block mt-0.5">₹28,580</span>
                    <span className="text-[10px] text-primary">All verified</span>
                  </div>
                </div>
              </div>

              {/* Maintenance Snapshot Banner */}
              <div className="bg-[#F8FAF7] border border-border p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      Live Technician Status
                    </span>
                    <h4 className="text-sm font-bold text-text-primary">
                      Kitchen Sink Under-Pipe Seepage (Ticket #MNT-402)
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Technician Rahul Sharma is en route with replacement trap. Estimated arrival 4:30 PM.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveSubTab('maintenance')}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors self-start sm:self-auto flex-shrink-0"
                >
                  View Live Timeline →
                </button>
              </div>

            </div>
          )}

          {/* MAINTENANCE TAB */}
          {activeSubTab === 'maintenance' && (
            <MaintenanceHub onOpenMessageWithTechnician={() => setActiveSubTab('messages')} />
          )}

          {/* EXPENSES TAB */}
          {activeSubTab === 'expenses' && (
            <ExpenseTransparency />
          )}

          {/* DOCUMENTS / LEASELENS TAB */}
          {activeSubTab === 'documents' && (
            <LeaseLens />
          )}

          {/* MESSAGES TAB */}
          {activeSubTab === 'messages' && (
            <CommunicationCenter />
          )}

          {/* ROOMMATES TAB */}
          {activeSubTab === 'roommates' && (
            <RoommateMatching onOpenMessageWithRoommate={() => setActiveSubTab('messages')} />
          )}

        </div>

      </div>

      {/* Rent Payment Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-elevated border border-border p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-text-primary">
                Rent Payment Successful!
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Transaction ID: #NST-UPI-20260228-89214
              </p>
            </div>

            <div className="bg-surfaceMuted/60 p-4 rounded-xl border border-border text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Amount Paid:</span>
                <span className="font-extrabold text-text-primary">₹24,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Recipient:</span>
                <span className="font-semibold text-text-primary">Vikramaditya Sanghavi (Owner)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Property:</span>
                <span className="font-semibold text-text-primary">Flat 402, Green Residency</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Period:</span>
                <span className="font-semibold text-text-primary">March 2026 Tenancy</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-secondary hover:bg-surfaceMuted"
              >
                Close
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HRA Tax Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
