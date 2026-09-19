import React from 'react';
import { 
  Compass, 
  Users, 
  FileText, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  TrendingUp, 
  Eye, 
  Zap, 
  Clock, 
  Check,
  Search,
  Building
} from 'lucide-react';
import { useNestMate } from '../context/NestMateContext';

interface LandingPageProps {
  onOpenAuth: () => void;
  onExploreSpaces: () => void;
  onFindMatch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onExploreSpaces,
  onFindMatch
}) => {
  const { 
    properties, 
    loginAsDemoTenant, 
    loginAsDemoLandlord 
  } = useNestMate();

  const previewProperty = properties[0];

  return (
    <div className="bg-[#F7F7F4] text-text-primary min-h-screen">
      
      {/* Top Marketing Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-[#F7F7F4]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-surface shadow-subtle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18V8.5L12 3.5L20 8.5V18H15V12H9V18H4Z" fill="#F7F7F4"/>
                <circle cx="12" cy="9.5" r="1.8" fill="#78A892"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-text-primary">
                Nest<span className="text-primary font-black">Mate</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-text-secondary">
            <button 
              onClick={onExploreSpaces}
              className="hover:text-primary transition-colors"
            >
              Explore
            </button>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How it works
            </a>
            <button 
              onClick={() => {
                loginAsDemoTenant();
              }}
              className="hover:text-primary transition-colors"
            >
              For Tenants
            </button>
            <button 
              onClick={() => {
                loginAsDemoLandlord();
              }}
              className="hover:text-primary transition-colors"
            >
              For Landlords
            </button>
            <a href="#trust" className="hover:text-primary transition-colors">
              Resources
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs font-bold text-text-primary hover:text-primary transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold shadow-subtle transition-all"
            >
              Get Started
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/70">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#171A18 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient warm lighting blur */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          {/* Category Tag */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-subtle animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-text-primary tracking-wide">
              Next-Gen PropTech & Shared Living Platform
            </span>
            <span className="text-text-muted text-xs">·</span>
            <span className="text-xs font-bold text-primary">Ahmedabad & GIFT Corridor</span>
          </div>

          {/* Large Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.1] max-w-4xl mx-auto text-balance">
            Your next home should <span className="text-primary underline decoration-secondary/60 decoration-wavy decoration-2 underline-offset-8">fit your life</span>.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-normal text-balance">
            “Discover spaces, understand the real cost, find compatible people and manage your home — all in one place.”
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onExploreSpaces}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-sm font-extrabold shadow-elevated transition-all flex items-center justify-center space-x-2 group"
            >
              <Compass className="w-4 h-4 text-emerald-300 group-hover:rotate-45 transition-transform" />
              <span>Explore spaces</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onFindMatch}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-surface hover:bg-surfaceMuted border border-border text-text-primary text-sm font-extrabold shadow-subtle transition-all flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4 text-primary" />
              <span>Find my match</span>
            </button>
          </div>

          {/* 1-Click Judge Experience Fast-Tracks */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-text-muted">
            <span>Judge Fast-Track:</span>
            <button
              onClick={loginAsDemoTenant}
              className="px-3 py-1 rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white transition-all font-bold"
            >
              ⚡ Full Tenant Demo Journey
            </button>
            <button
              onClick={loginAsDemoLandlord}
              className="px-3 py-1 rounded-lg bg-surface border border-border text-text-primary hover:border-primary transition-all font-bold"
            >
              🏢 Full Landlord Demo Journey
            </button>
          </div>

        </div>

      </section>

      {/* SECTION: RENTING SHOULDN'T FEEL LIKE A GUESSING GAME (4 Problems) */}
      <section className="py-16 md:py-24 border-b border-border/70 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-rose-700 uppercase tracking-widest bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            The Traditional Rental Nightmare
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Renting shouldn't feel like a guessing game.
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Every renter knows the anxiety of bait-and-switch listings, legal jargon, bad roommate matches, and unresponsive landlords.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Problem 1 */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              ₹
            </div>
            <h3 className="font-extrabold text-base text-text-primary">
              Hidden Costs
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Base rent says ₹24,000, but society maintenance, arbitrary utility markups, and unquoted move-in deposits surprise you on day one.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-text-primary">
              Unclear Agreements
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Dense legal contracts loaded with 11-month lock-in traps, arbitrary forfeit clauses, and ambiguous painting deduction terms.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-text-primary">
              Wrong Roommates
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Moving in with strangers based on budget alone, only to discover completely clashing sleep schedules, cleanliness habits, and guest policies.
            </p>
          </div>

          {/* Problem 4 */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-text-primary">
              Slow Maintenance
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Leaking pipes or failed air conditioning take weeks of back-and-forth WhatsApp arguments with zero accountability or status tracking.
            </p>
          </div>

        </div>

      </section>

      {/* SECTION: NESTMATE TURNS UNCERTAINTY INTO CLARITY (4 Solutions) */}
      <section id="how-it-works" className="py-16 md:py-24 border-b border-border/70 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-primary-light px-3 py-1 rounded-full">
            The Connected Ecosystem
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            NestMate turns uncertainty into clarity.
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            One transparent platform uniting tenants and landlords across every milestone of the rental journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Solution 1: TrueCost */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">PropTech Innovation #1</span>
                <h3 className="font-extrabold text-lg text-text-primary">Know the Cost (TrueCost™)</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Every home displays the complete, realistic monthly living cost — base rent, society maintenance, estimated Torrent Power utilities, and high-speed fiber internet. Zero surprise brokerage.
            </p>
            <div className="p-4 rounded-xl bg-surfaceMuted/60 border border-border text-xs space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Example: 2BHK Vastrapur Base Rent</span>
                <span className="text-text-primary">₹24,000 / mo</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Society Maintenance + Utilities + WiFi</span>
                <span className="text-text-primary">+₹4,600 / mo</span>
              </div>
              <div className="flex justify-between font-extrabold text-primary border-t border-border pt-1.5">
                <span>TrueCost™ Total Living Expense</span>
                <span>₹28,600 / mo</span>
              </div>
            </div>
          </div>

          {/* Solution 2: LeaseLens */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">PropTech Innovation #2</span>
                <h3 className="font-extrabold text-lg text-text-primary">Understand the Agreement (LeaseLens™)</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Upload any rental agreement or inspect our verified standard document. Our AI translates legal jargon into plain-English caveats, identifies hidden penalty risks, and advises questions to clarify.
            </p>
            <div className="p-4 rounded-xl bg-surfaceMuted/60 border border-border text-xs space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                <Check className="w-4 h-4 text-success" />
                <span>Clause 7.2 Plain English: 30-Day Notice after 6 Month Lock-in</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span>Clarification Tip: Verify sub-meter baseline reading on move-in day</span>
              </div>
            </div>
          </div>

          {/* Solution 3: Roommate Matching */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">PropTech Innovation #3</span>
                <h3 className="font-extrabold text-lg text-text-primary">Find Compatible People</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Match with roommates based on stated lifestyle habits — sleep schedules, work from home habits, cleanliness standards, cooking preferences, and social comfort levels.
            </p>
            <div className="p-4 rounded-xl bg-surfaceMuted/60 border border-border text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-text-primary">Aarav Patel · 24 · Designer</span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">94% Compatible</span>
              </div>
              <p className="text-[11px] text-text-muted">
                ✓ Similar budget (₹12k–₹16k) · ✓ Early riser (6 AM) · ✓ Consistently clean
              </p>
            </div>
          </div>

          {/* Solution 4: Connected Maintenance */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-card space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">PropTech Innovation #4</span>
                <h3 className="font-extrabold text-lg text-text-primary">Track Every Issue (Connected Maintenance Loop)</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              When a tenant reports an issue, the landlord gets instant triage. Certified contractors are dispatched, milestones are logged, and sign-offs are transparently verified.
            </p>
            <div className="p-4 rounded-xl bg-surfaceMuted/60 border border-border text-xs space-y-1.5">
              <div className="flex items-center space-x-2 text-text-primary font-semibold">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>09:12 Issue Reported → 09:35 Technician Assigned (Rahul Services) → Resolved</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* PRODUCT PREVIEW SHOWCASE */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        <div className="space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-primary uppercase tracking-widest bg-primary-light px-3 py-1 rounded-full">
            Product Walkthrough
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            See NestMate in action.
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary">
            Explore 40/60 map-first property discovery, instant affordability intelligence, and automated landlord management.
          </p>
        </div>

        {/* Interactive Preview Card Container */}
        <div className="bg-surface rounded-3xl border-2 border-border shadow-dropdown p-4 sm:p-8 max-w-5xl mx-auto text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Featured Verified Home</span>
              <h3 className="text-xl sm:text-2xl font-black text-text-primary mt-0.5">
                {previewProperty.title} · {previewProperty.neighborhood}, {previewProperty.city}
              </h3>
            </div>

            <button
              onClick={onExploreSpaces}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-surfaceMuted relative">
              <img
                src={previewProperty.images[0]}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                {previewProperty.propertyType} · {previewProperty.furnishing}
              </span>
              <span className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>48-Pt Physical Audit Verified</span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F5F8F6] to-[#EEF3F0] border border-primary/20 space-y-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-wider block">
                  TRUE COST BREAKDOWN™
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-secondary">Base Rent:</span>
                  <span className="font-bold text-text-primary">₹{previewProperty.baseRent.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-text-secondary">Maintenance + Utilities + WiFi:</span>
                  <span className="font-bold text-text-primary">₹{(previewProperty.maintenanceMonthly + previewProperty.utilitiesEstimate + previewProperty.internetMonthly).toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="pt-2 border-t border-primary/20 flex justify-between items-center">
                  <span className="text-xs font-bold text-primary">Total Monthly Living:</span>
                  <span className="text-lg font-black text-primary">₹{previewProperty.totalEstimatedMonthly.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-text-secondary">
                <div className="p-2.5 rounded-xl bg-surfaceMuted/50 border border-border flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{previewProperty.distances.officeMinutes} mins to Tech Hub</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surfaceMuted/50 border border-border flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Zero Brokerage</span>
                </div>
              </div>

              <button
                onClick={onOpenAuth}
                className="w-full py-3 rounded-xl bg-primary text-white text-xs font-extrabold hover:bg-primary-hover transition-all shadow-subtle text-center"
              >
                Sign In to Inspect Lease & Book Verified Visit
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* FINAL CALL TO ACTION FOOTER BANNER */}
      <section className="bg-primary text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Find your space. Find your people. Live better.
          </h2>
          <p className="text-sm sm:text-base text-zinc-200 max-w-xl mx-auto">
            Join thousands of transparent renters and proactive landlords transforming the Indian rental experience today.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAuth}
              className="px-8 py-4 rounded-2xl bg-white text-primary hover:bg-zinc-100 text-sm font-black shadow-elevated transition-all"
            >
              Get Started with NestMate
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
