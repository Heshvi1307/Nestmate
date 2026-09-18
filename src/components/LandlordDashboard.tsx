import React, { useState } from 'react';
import { 
  Building, 
  IndianRupee, 
  Users, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  MessageSquare, 
  Plus, 
  Calendar,
  AlertTriangle,
  Download,
  ShieldCheck
} from 'lucide-react';
import { MOCK_OWNER_PORTFOLIO } from '../data/mockData';

interface LandlordDashboardProps {
  onOpenLeaseLens: () => void;
  onOpenMessageWithTenant: (tenantName: string) => void;
}

export const LandlordDashboard: React.FC<LandlordDashboardProps> = ({
  onOpenLeaseLens,
  onOpenMessageWithTenant
}) => {
  const portfolio = MOCK_OWNER_PORTFOLIO;
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(portfolio.properties[0].id);

  const selectedProp = portfolio.properties.find(p => p.id === selectedPropertyId) || portfolio.properties[0];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Landlord Portal — Vikramaditya Sanghavi
            </h1>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified Owner
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Managing 3 prime residential units in Vastrapur, Prahlad Nagar, and Navrangpura.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-subtle flex items-center space-x-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>List New Property</span>
          </button>
        </div>
      </div>

      {/* 4 Owner KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Portfolio Occupancy
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Optimal
            </span>
          </div>
          <div className="text-2xl font-black text-text-primary tabular-nums">
            {portfolio.portfolioSummary.occupancyRate}%
          </div>
          <span className="text-[11px] text-text-secondary">
            {portfolio.portfolioSummary.totalUnits}/{portfolio.portfolioSummary.totalUnits} Units Occupied
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Monthly Rental Yield
            </span>
            <span className="text-[10px] bg-primary-light text-primary font-bold px-1.5 py-0.5 rounded">
              Direct Bank
            </span>
          </div>
          <div className="text-2xl font-black text-primary tabular-nums">
            {formatCurrency(portfolio.portfolioSummary.monthlyGrossRevenue)}
          </div>
          <span className="text-[11px] text-text-secondary">
            Next settlement 1st March
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              On-Time Collection
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Zero Defaults
            </span>
          </div>
          <div className="text-2xl font-black text-text-primary tabular-nums">
            {portfolio.portfolioSummary.onTimeCollectionRate}%
          </div>
          <span className="text-[11px] text-text-secondary">
            All 3 tenants paid punctually
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Open Maintenance
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded animate-pulse">
              1 Scheduled
            </span>
          </div>
          <div className="text-2xl font-black text-text-primary tabular-nums">
            1 Ticket
          </div>
          <span className="text-[11px] text-text-secondary">
            Rahul Services dispatched
          </span>
        </div>

      </div>

      {/* Unit Selector Strip */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
          Select Unit for Ledger & Tenancy Details
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolio.properties.map((p) => {
            const isSelected = p.id === selectedPropertyId;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPropertyId(p.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-surface border-primary ring-2 ring-primary/20 shadow-card' 
                    : 'bg-surface hover:bg-surfaceMuted/60 border-border shadow-subtle'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-primary truncate">{p.title}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Occupied
                  </span>
                </div>
                <div className="text-xs font-semibold text-primary mt-1">
                  {formatCurrency(p.rent)} / month
                </div>
                <div className="text-[11px] text-text-muted mt-2 pt-2 border-t border-border flex justify-between">
                  <span>Tenant: {p.tenantName}</span>
                  <span>{p.neighborhood}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          OWNER PROPERTY PAGE - DETAILED UNIT VIEW
          ================================================== */}
      <div className="bg-surface rounded-2xl border border-border shadow-card p-6 space-y-6">
        
        {/* Unit Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Selected Property Audit
            </span>
            <h3 className="text-xl font-extrabold text-text-primary mt-0.5">
              {selectedProp.title}
            </h3>
            <span className="text-xs text-text-muted">
              Lease Tenure: {selectedProp.leaseStatus} · Security Deposit Held: {formatCurrency(selectedProp.depositHeld)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenMessageWithTenant(selectedProp.tenantName)}
              className="px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-text-primary hover:bg-surfaceMuted flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <span>Message Tenant</span>
            </button>
            <button
              onClick={onOpenLeaseLens}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover flex items-center space-x-1.5 shadow-subtle"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Agreement</span>
            </button>
          </div>
        </div>

        {/* Tenant Profile & Rent Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-4 rounded-xl bg-surfaceMuted/50 border border-border space-y-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Active Tenant Details
            </span>
            <div className="flex items-center space-x-3">
              <img
                src={selectedProp.tenantAvatar}
                alt={selectedProp.tenantName}
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <span className="text-sm font-bold text-text-primary block">
                  {selectedProp.tenantName}
                </span>
                <span className="text-xs text-text-muted block">Aadhaar & Police KYC Verified</span>
                <span className="text-xs font-semibold text-emerald-700 block mt-0.5">
                  ✓ Digital Tenancy Pass Active
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surfaceMuted/50 border border-border space-y-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Escrow & Maintenance Status
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Security Deposit in Escrow:</span>
                <span className="font-bold text-text-primary tabular-nums">{formatCurrency(selectedProp.depositHeld)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Next Rent Invoicing:</span>
                <span className="font-bold text-text-primary">{selectedProp.nextRentDue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Active Maintenance:</span>
                <span className="font-bold text-amber-800">{selectedProp.maintenanceState}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Payment History Ledger */}
        <div>
          <span className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-3">
            Recent Payment Ledger (Instant Bank Clearance)
          </span>
          <div className="space-y-2">
            {selectedProp.paymentHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border text-xs"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <div>
                    <span className="font-bold text-text-primary block">{item.month} Rent</span>
                    <span className="text-[10px] text-text-muted">Cleared via NESTORA Automated Mandate</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-text-primary tabular-nums block">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-[10px] text-emerald-800 font-semibold">{item.status} ({item.date})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
