import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  Users, 
  Wrench, 
  Lock, 
  Search, 
  Check,
  Scale,
  Award,
  BadgeAlert
} from 'lucide-react';

export const TrustCenter: React.FC = () => {
  const pillars = [
    {
      title: '1. Identity & Background KYC',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Tenants and property owners must complete official Aadhaar / PAN digital verification with registered municipal land registry cross-referencing.',
      points: [
        'Zero anonymous listings permitted',
        'Official property title deed verification against state land records',
        'Optional police clearance certificate badge'
      ]
    },
    {
      title: '2. 48-Point Physical Property Audit',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Every NESTORA home undergoes an on-site physical inspection before receiving the verified badge.',
      points: [
        'Electrical load & earth leakage circuit breaker tests',
        'Plumbing pipe pressure test and drain flow inspection',
        'Moisture detector scanning for wall dampness & roof integrity',
        'Lockbox & smart security hardware inspection'
      ]
    },
    {
      title: '3. Authentic Geotagged Visuals',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'No distorted wide-angle deception or altered stock images. Photos are timestamped and GPS-stamped during the physical audit.',
      points: [
        'True-to-life lighting and color calibration',
        'LiDAR 3D floor plan layout with measured carpet area (sq ft)',
        '360° unedited video walkthroughs'
      ]
    },
    {
      title: '4. Bank-Grade Deposit Escrow',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Security deposits are registered under digital contracts with strict 7-day return timelines following key handover.',
      points: [
        'No arbitrary painting or wear-and-tear deductions',
        'Digital move-in condition report with initial photo evidence',
        'Direct automated bank settlement with zero deduction disputes'
      ]
    },
    {
      title: '5. Guaranteed Maintenance SLA',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Emergency plumbing or electrical faults must be acknowledged within 30 minutes and attended within 4 hours by certified technicians.',
      points: [
        'Real-time contractor GPS milestone tracking',
        'Transparent cost threshold (₹2,500 major structural vs ₹1,000 minor consumables)',
        'Tenant sign-off required prior to ticket closure'
      ]
    },
    {
      title: '6. Authentic Community Ledger',
      status: 'Verified',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Reviews can only be submitted by verified residents who have lived in the unit for a minimum of 60 days.',
      points: [
        'Zero paid or incentivized reviews',
        'Historical rent hike disclosure (shows if owner increases rent annually)',
        'Noise and water supply reliability ratings'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-border pb-6 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
          <span>Radical Housing Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          NESTORA Trust Center
        </h1>
        <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
          The traditional rental market relies on blind trust and verbal promises. NESTORA replaces ambiguity with verified data, enforceable timelines, and objective criteria.
        </p>
      </div>

      {/* Honest Status Legend Banner */}
      <div className="bg-surface rounded-2xl border border-border p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-text-primary">Our Verification Taxonomy:</span>
          <span className="text-text-muted">We never fabricate artificial composite scores.</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>Verified (Audited & Backed)</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-warning" />
            <span>Pending Audit</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Not Provided</span>
          </span>
        </div>
      </div>

      {/* 6 Verification Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => (
          <div
            key={idx}
            className="bg-surface rounded-2xl border border-border p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${pillar.badgeClass}`}>
                  ✓ {pillar.status}
                </span>
                <span className="text-xs font-bold text-text-muted">Pillar {idx + 1}</span>
              </div>

              <h3 className="font-bold text-base text-text-primary">
                {pillar.title}
              </h3>

              <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                {pillar.description}
              </p>

              <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                {pillar.points.map((pt, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-text-primary">
                    <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-text-muted font-medium">
              Conforms to Gujarat Tenancy Model Guidelines
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
