import React from 'react';
import { ShieldCheck, Heart, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-surface border-t border-border mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-border">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-surface shadow-subtle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 18V8.5L12 3.5L20 8.5V18H15V12H9V18H4Z" fill="#F7F7F4"/>
                  <circle cx="12" cy="9.5" r="1.8" fill="#78A892"/>
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-text-primary">
                NESTORA
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              <strong>“Find a space. Find your people. Live better.”</strong>
              <br />
              Next-generation real-estate and shared-living intelligence designed for first-time renters, students, young professionals, and modern property owners.
            </p>

            <div className="flex items-center space-x-3 text-xs text-text-muted">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Zero Brokerage</span>
              </span>
              <span>·</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>48-Pt Physical Audits</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider block">
              Platform
            </span>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <button onClick={() => onSelectTab('explore')} className="hover:text-primary transition-colors">
                  Explore Spaces & Map
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('roommates')} className="hover:text-primary transition-colors">
                  Lifestyle Roommate Match
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('leaselens')} className="hover:text-primary transition-colors">
                  LeaseLens Agreement Reader
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-primary transition-colors">
                  Living Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('trust')} className="hover:text-primary transition-colors">
                  Trust Center & Verification
                </button>
              </li>
            </ul>
          </div>

          {/* Ahmedabad & Gujarat Corridors */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider block">
              Verified Hubs
            </span>
            <ul className="space-y-2 text-text-secondary">
              <li>Vastrapur & IIM-A Campus</li>
              <li>Bodakdev & Judges Bungalow</li>
              <li>S.G. Highway Tech Belt</li>
              <li>Prahlad Nagar Corporate Zone</li>
              <li>Navrangpura / Gujarat University</li>
              <li>GIFT City Financial Corridor</li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3 text-xs">
            <span className="font-bold text-text-primary uppercase tracking-wider block">
              Guarantees
            </span>
            <ul className="space-y-2 text-text-secondary">
              <li>TrueCost™ Price Guarantee</li>
              <li>4-Hour Maintenance SLA</li>
              <li>7-Day Security Deposit Return</li>
              <li>Model Tenancy Act Compliance</li>
              <li>Encrypted Aadhaar KYC</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© 2026 NESTORA Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Ahmedabad, Gujarat, India</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Living</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
