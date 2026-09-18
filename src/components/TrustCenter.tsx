import React from 'react';
import { Shield, CheckCircle, Eye, Star, Users } from 'lucide-react';

export const TrustCenter: React.FC = () => (
  <div className="p-6 max-w-2xl mx-auto space-y-6">
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-black text-slate-800">🛡️ NESTORA Trust Center</h2>
      <p className="text-slate-500 text-sm">We verify every listing so you can rent with confidence</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { icon: Shield, color: 'emerald', title: 'Property Verification', desc: 'Every listing physically inspected by our local agents before going live.', stat: '7,691+', statLabel: 'Verified Listings' },
        { icon: CheckCircle, color: 'blue', title: 'Owner KYC', desc: 'Landlord identity verified via Aadhaar, PAN, and property documents.', stat: '100%', statLabel: 'KYC Rate' },
        { icon: Eye, color: 'indigo', title: 'Transparency Reports', desc: 'Full hidden cost breakdowns — no surprises at move-in time.', stat: '₹0', statLabel: 'Hidden Charges' },
        { icon: Star, color: 'amber', title: 'Tenant Reviews', desc: 'Real reviews from verified tenants. Ratings impact listing rankings.', stat: '4.7★', statLabel: 'Avg Rating' },
        { icon: Users, color: 'purple', title: 'Roommate Safety', desc: 'MBTI-based matching + background cross-check for safe co-living.', stat: '100', statLabel: 'Verified Profiles' },
      ].map(({ icon: Icon, color, title, desc, stat, statLabel }) => (
        <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
          <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-slate-500 text-sm mt-1">{desc}</p>
          </div>
          <div>
            <p className={`text-2xl font-black text-${color}-600`}>{stat}</p>
            <p className="text-xs text-slate-400">{statLabel}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
