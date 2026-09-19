import React from 'react';
import { 
  Building2, 
  IndianRupee, 
  Users, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Filter, 
  ShieldCheck 
} from 'lucide-react';
import { MOCK_PROPERTY_MANAGER_PORTFOLIO } from '../data/mockData';

interface PropertyManagerDashboardProps {
  onOpenMessages: () => void;
}

export const PropertyManagerDashboard: React.FC<PropertyManagerDashboardProps> = ({
  onOpenMessages
}) => {
  const pm = MOCK_PROPERTY_MANAGER_PORTFOLIO;

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
              Property Manager Console — {pm.managerName}
            </h1>
            <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
              Enterprise Portfolio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            {pm.company} · Overseeing {pm.stats.totalPropertiesManaged} properties ({pm.stats.totalUnits} residential units)
          </p>
        </div>

        <button
          onClick={onOpenMessages}
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-subtle flex items-center space-x-1.5 self-start md:self-auto"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Dispatch Contractor</span>
        </button>
      </div>

      {/* 4 Portfolio Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Occupancy Rate
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              High
            </span>
          </div>
          <div className="text-2xl font-black text-text-primary tabular-nums">
            {pm.stats.occupancyRate}%
          </div>
          <span className="text-[11px] text-text-secondary">
            39 of 42 units leased
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Monthly Managed GMV
            </span>
            <span className="text-[10px] bg-primary-light text-primary font-bold px-1.5 py-0.5 rounded">
              Portfolio
            </span>
          </div>
          <div className="text-2xl font-black text-primary tabular-nums">
            ₹4.80 Lakhs
          </div>
          <span className="text-[11px] text-text-secondary">
            Collection rate: {pm.stats.collectionRate}%
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Pending Tickets
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
              Active SLA
            </span>
          </div>
          <div className="text-2xl font-black text-text-primary tabular-nums">
            {pm.stats.pendingMaintenanceCount}
          </div>
          <span className="text-[11px] text-text-secondary">
            Avg resolution: 3.2 hours
          </span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Move-Ins This Month
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
              Upcoming
            </span>
          </div>
          <div className="text-2xl font-black text-text-primary tabular-nums">
            3 Tenants
          </div>
          <span className="text-[11px] text-text-secondary">
            Lockbox codes generated
          </span>
        </div>

      </div>

      {/* Urgent Maintenance Triage Queue */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-text-primary">
              Urgent Maintenance Triage & Dispatch Queue
            </h3>
            <p className="text-xs text-text-muted">Real-time status of open contractor tickets across Ahmedabad portfolio</p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            SLA Max Response: 4h
          </span>
        </div>

        <div className="space-y-3">
          {pm.urgentMaintenanceQueue.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surfaceMuted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                    #{item.ticket}
                  </span>
                  <span className="font-bold text-text-primary">{item.unit}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.priority === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-text-secondary mt-1 font-medium">{item.issue}</p>
              </div>

              <div className="flex items-center space-x-3 self-start sm:self-auto">
                <span className="text-emerald-800 font-semibold text-[11px]">
                  ✓ {item.status}
                </span>
                <button
                  onClick={onOpenMessages}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surfaceMuted font-bold text-text-primary transition-colors"
                >
                  Manage →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
