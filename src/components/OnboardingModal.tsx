import React, { useState } from 'react';
import { 
  Home, 
  Building, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Check, 
  X,
  MapPin,
  IndianRupee,
  Calendar,
  Users,
  Briefcase,
  Zap,
  Lock
} from 'lucide-react';
import { useNestMate } from '../context/NestMateContext';
import { UserRole } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'tenant'
}) => {
  const { 
    setUser, 
    setUserRole, 
    setIsOnboarded, 
    setShowLandingPage, 
    setCurrentTab, 
    addNewProperty,
    loginAsDemoTenant,
    loginAsDemoLandlord
  } = useNestMate();

  // Multi-step flow:
  // step 1: Role Selection & Basic Info (Full Name, Age, Phone, Email, Role)
  // step 2: Role-specific wizard:
  //         - if tenant: "Tell us what you're looking for."
  //         - if landlord: "Let's get your property online."
  // step 3: Confirmation / Welcome state
  const [step, setStep] = useState<'auth' | 'tenant_preferences' | 'landlord_property' | 'landlord_success'>('auth');

  // Step 1 Form Fields
  const [fullName, setFullName] = useState('Het Patel');
  const [age, setAge] = useState<number>(24);
  const [phone, setPhone] = useState('+91 98250 12345');
  const [email, setEmail] = useState('het.patel@nirma.edu.in');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Tenant Preferences (Section 7)
  const [preferredCity, setPreferredCity] = useState('Ahmedabad');
  const [searchArea, setSearchArea] = useState('Vastrapur');
  const [moveInDate, setMoveInDate] = useState('1st of Next Month');
  const [monthlyBudget, setMonthlyBudget] = useState(30000);
  const [propertyType, setPropertyType] = useState('2 BHK');
  const [bedrooms, setBedrooms] = useState(2);
  const [workplaceLocation, setWorkplaceLocation] = useState('GIFT City / SG Highway');
  const [maxCommute, setMaxCommute] = useState(25);
  const [genderPreference, setGenderPreference] = useState('Any');

  // Tenant Amenities checklist
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Furnished', 'Parking', 'Wi-Fi', 'AC', 'Power backup', 'Laundry', 'Workspace'
  ]);

  // Tenant Lifestyle Preferences
  const [sleepSchedule, setSleepSchedule] = useState('Early riser (6 AM)');
  const [cleanliness, setCleanliness] = useState('Consistently clean');
  const [cooking, setCooking] = useState('Cooks occasionally');
  const [guests, setGuests] = useState('Weekends okay');
  const [noise, setNoise] = useState('Quiet study hours');
  const [social, setSocial] = useState('Balanced');

  // Landlord Property Setup (Section 8)
  const [landlordPropName, setLandlordPropName] = useState('Shivalik Greens 401');
  const [landlordAddress, setLandlordAddress] = useState('Near Vastrapur Lake, Vastrapur');
  const [landlordArea, setLandlordArea] = useState('Vastrapur');
  const [landlordCity, setLandlordCity] = useState('Ahmedabad');
  const [landlordPropType, setLandlordPropType] = useState<'1 BHK' | '2 BHK' | '3 BHK' | 'Studio'>('2 BHK');
  const [landlordBhk, setLandlordBhk] = useState(2);
  const [landlordSize, setLandlordSize] = useState(1100);
  const [landlordFurnished, setLandlordFurnished] = useState<'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Fully Furnished');
  const [landlordRent, setLandlordRent] = useState(26000);
  const [landlordDeposit, setLandlordDeposit] = useState(52000);
  const [landlordMaintenance, setLandlordMaintenance] = useState(1500);
  const [landlordUtilities, setLandlordUtilities] = useState(2500);
  const [landlordAvailableFrom, setLandlordAvailableFrom] = useState('Immediately');
  const [landlordProvider, setLandlordProvider] = useState('Ahmedabad Pro Repairs');
  const [landlordAmenities, setLandlordAmenities] = useState<string[]>([
    'Parking', 'Wi-Fi', 'AC', 'Furniture', 'Laundry', 'Power backup', 'Workspace'
  ]);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [docsUploaded, setDocsUploaded] = useState(true);

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const toggleLandlordAmenity = (item: string) => {
    if (landlordAmenities.includes(item)) {
      setLandlordAmenities(landlordAmenities.filter(a => a !== item));
    } else {
      setLandlordAmenities([...landlordAmenities, item]);
    }
  };

  // Handle Step 1 Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError('Please fill in all identity fields to continue.');
      return;
    }
    setFormError(null);

    if (selectedRole === 'tenant') {
      setStep('tenant_preferences');
    } else {
      setStep('landlord_property');
    }
  };

  // Complete Tenant Onboarding
  const handleTenantComplete = () => {
    setUser({
      fullName,
      age: Number(age) || 24,
      phone,
      email,
      role: 'tenant',
      isOnboarded: true,
      tenantPreferences: {
        city: preferredCity,
        searchArea,
        moveInDate,
        budget: monthlyBudget,
        propertyType,
        bedrooms,
        amenities: selectedAmenities,
        lifestyle: {
          sleepSchedule,
          cleanliness,
          cooking,
          guests,
          noise,
          social
        }
      }
    });

    setUserRole('tenant');
    setIsOnboarded(true);
    setShowLandingPage(false);
    setCurrentTab('explore');
    onClose();
  };

  // Complete Landlord Onboarding
  const handleLandlordComplete = () => {
    // Register the newly created property into global properties
    const newPropId = `prop-owner-${Date.now()}`;
    const newProperty = {
      id: newPropId,
      title: landlordPropName,
      tagline: `Sunlit ${landlordPropType} in prime ${landlordArea} with modern amenities`,
      neighborhood: landlordArea,
      city: landlordCity,
      coordinates: { lat: 23.036, lng: 72.531, x: 45, y: 46 },
      propertyType: landlordPropType as any,
      bedrooms: landlordBhk,
      bathrooms: landlordBhk,
      carpetArea: landlordSize,
      furnishing: landlordFurnished,
      rating: 5.0,
      reviewsCount: 1,
      verified: true,
      verifiedOwner: true,
      recentlyInspected: true,
      fastResponse: true,
      baseRent: landlordRent,
      deposit: landlordDeposit,
      maintenanceMonthly: landlordMaintenance,
      utilitiesEstimate: landlordUtilities,
      internetMonthly: 600,
      totalEstimatedMonthly: landlordRent + landlordMaintenance + landlordUtilities + 600,
      moveInTotalCost: landlordDeposit + landlordRent + landlordMaintenance + landlordUtilities + 600 + 600,
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
      ],
      floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      distances: {
        officeMinutes: 10,
        metroMinutes: 8,
        groceryMinutes: 3,
        universityMinutes: 15
      },
      amenities: landlordAmenities,
      transparencyDetails: {
        ownerKycVerified: true,
        ownerName: fullName,
        inspectionDate: 'Recently Listed',
        inspectionScore: 97,
        inspectionChecks: { electrical: 98, plumbing: 96, structural: 98, safety: 97 },
        historicalRentStability: 'Newly Listed on NestMate',
        maintenanceTicketsPastYear: 0,
        avgResolutionHours: 2.5,
        standardLeaseAvailable: true,
        lockInMonths: 6,
        noticePeriodDays: 30,
        depositReturnPolicy: 'Guaranteed 7-day bank escrow release upon inspection.'
      },
      timeline: [
        { date: 'Today', event: 'Property Listed on NestMate', status: 'completed' as const, notes: 'Owner KYC and Title Deed verified' },
        { date: 'Today', event: 'Physical Audit Verified', status: 'completed' as const, notes: 'Passed 48-pt inspection' },
        { date: 'Upcoming', event: 'Ready for Tenant Booking', status: 'current' as const, notes: 'Move-in available immediately' }
      ],
      availableFrom: landlordAvailableFrom,
      featured: true
    };

    addNewProperty(newProperty);

    setUser({
      fullName,
      age: Number(age) || 45,
      phone,
      email,
      role: 'landlord',
      isOnboarded: true
    });

    setUserRole('landlord');
    setStep('landlord_success');
  };

  const handleFinishLandlordSuccess = () => {
    setIsOnboarded(true);
    setShowLandingPage(false);
    setCurrentTab('dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-dropdown border border-border overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Quick Demo Shortcuts Banner for Hackathon Judges */}
        <div className="bg-[#171A18] text-zinc-300 px-5 py-2.5 flex flex-wrap items-center justify-between text-[11px] font-semibold gap-2 border-b border-white/10">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
            <span>Judge Demo Shortcuts:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                loginAsDemoTenant();
                onClose();
              }}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
            >
              ⚡ Quick Tenant Journey
            </button>
            <button
              onClick={() => {
                loginAsDemoLandlord();
                onClose();
              }}
              className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 font-bold transition-colors border border-emerald-500/30"
            >
              🏢 Quick Landlord Journey
            </button>
          </div>
        </div>

        {/* Modal Top Header with Logo */}
        <div className="p-6 pb-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
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
              <span className="block text-[10px] text-text-muted font-medium -mt-0.5">
                Find your space. Find your people. Live better.
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: AUTHENTICATION & ROLE SELECTION (Section 6) */}
        {step === 'auth' && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Headline & Supporting copy */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                Your next home should fit your life.
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                “Discover spaces, understand the real cost, find compatible people and manage your home from one place.”
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-6">
              
              {/* Identity Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Het Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    placeholder="24"
                    min="18"
                    max="99"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98250 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="het.patel@nirma.edu.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* SECTION: How are you using NestMate? (Two Large Interactive Cards) */}
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-extrabold text-text-primary">
                  How are you using NestMate?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* CARD 1: TENANT */}
                  <div
                    onClick={() => setSelectedRole('tenant')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedRole === 'tenant'
                        ? 'border-primary bg-primary-light/40 ring-4 ring-primary/10 shadow-card'
                        : 'border-border bg-surface hover:bg-surfaceMuted/50 hover:border-primary/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🏠</span>
                        {selectedRole === 'tenant' && (
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-text-primary">
                        I'm looking for a home
                      </h3>
                      <span className="inline-block text-[11px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                        Tenant Experience
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed pt-1">
                        “Discover spaces, compare costs and find compatible roommates.”
                      </p>
                    </div>
                  </div>

                  {/* CARD 2: LANDLORD */}
                  <div
                    onClick={() => setSelectedRole('landlord')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedRole === 'landlord'
                        ? 'border-primary bg-primary-light/40 ring-4 ring-primary/10 shadow-card'
                        : 'border-border bg-surface hover:bg-surfaceMuted/50 hover:border-primary/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🏢</span>
                        {selectedRole === 'landlord' && (
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-text-primary">
                        I own or manage a property
                      </h3>
                      <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Landlord Experience
                      </span>
                      <p className="text-xs text-text-secondary leading-relaxed pt-1">
                        “List properties, manage tenants and simplify property management.”
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Terms & Privacy checkbox */}
              <div className="flex items-center space-x-2 pt-1 text-xs text-text-muted">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="terms">
                  I agree to NestMate's <span className="text-primary underline cursor-pointer">Terms of Service</span> and <span className="text-primary underline cursor-pointer">Privacy Policy</span>.
                </label>
              </div>

              {/* Continue CTA */}
              <button
                type="submit"
                disabled={!agreeTerms}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-extrabold shadow-card transition-all flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>
        )}

        {/* STEP 2A: TENANT ONBOARDING (Section 7) */}
        {step === 'tenant_preferences' && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="inline-flex items-center space-x-1 text-xs text-text-muted hover:text-primary font-bold mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Account</span>
                </button>
                <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                  Tell us what you're looking for.
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Set your preferences so we can find your ideal home and compatible people.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              
              {/* Core Search Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Preferred City
                  </label>
                  <select
                    value={preferredCity}
                    onChange={(e) => setPreferredCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Gandhinagar">Gandhinagar</option>
                    <option value="GIFT City">GIFT City</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Search Area / Neighborhood
                  </label>
                  <input
                    type="text"
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    placeholder="e.g. Vastrapur, Navrangpura, Bodakdev"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Target Move-In Date
                  </label>
                  <input
                    type="text"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    placeholder="Immediate / 1st Next Month"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Max Monthly Budget (₹{monthlyBudget.toLocaleString('en-IN')})
                  </label>
                  <input
                    type="range"
                    min="12000"
                    max="60000"
                    step="1000"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="w-full accent-primary mt-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="Studio / Co-living">Studio / Co-living Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Bedrooms
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary"
                  >
                    <option value={1}>1 Bedroom</option>
                    <option value={2}>2 Bedrooms</option>
                    <option value={3}>3 Bedrooms</option>
                    <option value={4}>4+ Bedrooms</option>
                  </select>
                </div>
              </div>

              {/* Optional Preferences & Amenities */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Key Inclusions & Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                  {[
                    'Furnished', 'Parking', 'Wi-Fi', 'AC', 'Power backup', 
                    'Laundry', 'Workspace', 'Food included', 'Pet friendly'
                  ].map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-primary-light border-primary text-primary font-bold'
                          : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {selectedAmenities.includes(amenity) && (
                        <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lifestyle Preferences (for Roommate compatibility matching) */}
              <div className="p-4 rounded-2xl bg-surfaceMuted/40 border border-border space-y-3">
                <span className="text-xs font-extrabold text-text-primary uppercase tracking-wider block">
                  Lifestyle Compatibility Indicators
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Sleep Schedule</label>
                    <select
                      value={sleepSchedule}
                      onChange={(e) => setSleepSchedule(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface font-medium"
                    >
                      <option value="Early riser (6 AM)">Early riser (6 AM)</option>
                      <option value="Moderate (7-8 AM)">Moderate (7-8 AM)</option>
                      <option value="Night owl (1-2 AM)">Night owl (1-2 AM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Cleanliness</label>
                    <select
                      value={cleanliness}
                      onChange={(e) => setCleanliness(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface font-medium"
                    >
                      <option value="Consistently clean">Consistently clean</option>
                      <option value="Neat freak">Neat freak</option>
                      <option value="Relaxed">Relaxed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Cooking</label>
                    <select
                      value={cooking}
                      onChange={(e) => setCooking(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface font-medium"
                    >
                      <option value="Cooks occasionally">Cooks occasionally</option>
                      <option value="Cooks daily">Cooks daily</option>
                      <option value="Order / Tiffin">Order / Tiffin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface font-medium"
                    >
                      <option value="Weekends okay">Weekends okay</option>
                      <option value="Strict guest limit">Strict guest limit</option>
                      <option value="Open">Open</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Noise</label>
                    <select
                      value={noise}
                      onChange={(e) => setNoise(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface font-medium"
                    >
                      <option value="Quiet study hours">Quiet study hours</option>
                      <option value="Normal">Normal</option>
                      <option value="Lively">Lively</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Social Style</label>
                    <select
                      value={social}
                      onChange={(e) => setSocial(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border bg-surface font-medium"
                    >
                      <option value="Balanced">Balanced</option>
                      <option value="Quiet & private">Quiet & private</option>
                      <option value="Loves social gatherings">Loves social gatherings</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Start Exploring CTA */}
              <button
                type="button"
                onClick={handleTenantComplete}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-extrabold shadow-card transition-all flex items-center justify-center space-x-2"
              >
                <span>Start exploring</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

        {/* STEP 2B: LANDLORD ONBOARDING (Section 8) */}
        {step === 'landlord_property' && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="inline-flex items-center space-x-1 text-xs text-text-muted hover:text-primary font-bold mb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Account</span>
                </button>
                <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
                  Let's get your property online.
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Publish verified listings with TrueCost™ and digital lease management.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              
              {/* Property Details */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                  1. Property Specifications
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Property Name</label>
                    <input
                      type="text"
                      value={landlordPropName}
                      onChange={(e) => setLandlordPropName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Full Address</label>
                    <input
                      type="text"
                      value={landlordAddress}
                      onChange={(e) => setLandlordAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Area / Neighborhood</label>
                    <input
                      type="text"
                      value={landlordArea}
                      onChange={(e) => setLandlordArea(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">City</label>
                    <input
                      type="text"
                      value={landlordCity}
                      onChange={(e) => setLandlordCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Property Type & BHK</label>
                    <div className="flex gap-2">
                      <select
                        value={landlordPropType}
                        onChange={(e) => setLandlordPropType(e.target.value as any)}
                        className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-surface text-xs font-semibold"
                      >
                        <option value="1 BHK">1 BHK</option>
                        <option value="2 BHK">2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="Studio">Studio</option>
                      </select>
                      <input
                        type="number"
                        value={landlordSize}
                        onChange={(e) => setLandlordSize(Number(e.target.value))}
                        placeholder="Sq ft"
                        className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-surface text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Furnished Status</label>
                    <select
                      value={landlordFurnished}
                      onChange={(e) => setLandlordFurnished(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold"
                    >
                      <option value="Fully Furnished">Fully Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Financial Inclusions */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                  2. Financial Structure (TrueCost™ Transparency)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={landlordRent}
                      onChange={(e) => setLandlordRent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-bold text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={landlordDeposit}
                      onChange={(e) => setLandlordDeposit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Maintenance (₹/mo)</label>
                    <input
                      type="number"
                      value={landlordMaintenance}
                      onChange={(e) => setLandlordMaintenance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Estimated Utilities</label>
                    <input
                      type="number"
                      value={landlordUtilities}
                      onChange={(e) => setLandlordUtilities(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Photos & Documents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border-2 border-dashed border-border bg-surface hover:border-primary/40 text-center space-y-1.5 cursor-pointer">
                  <Upload className="w-5 h-5 text-primary mx-auto" />
                  <span className="text-xs font-bold text-text-primary block">Property Images</span>
                  <span className="text-[11px] text-text-muted block">2 high-res photos pre-loaded</span>
                  <span className="text-[10px] font-bold text-success">✓ Geotag ready</span>
                </div>

                <div className="p-3.5 rounded-xl border-2 border-dashed border-border bg-surface hover:border-primary/40 text-center space-y-1.5 cursor-pointer">
                  <FileText className="w-5 h-5 text-secondary mx-auto" />
                  <span className="text-xs font-bold text-text-primary block">Title Deed & NOC</span>
                  <span className="text-[11px] text-text-muted block">Uploaded for KYC audit</span>
                  <span className="text-[10px] font-bold text-success">✓ Encrypted Escrow</span>
                </div>
              </div>

              {/* Maintenance History & Provider */}
              <div className="p-3.5 rounded-xl bg-surfaceMuted/50 border border-border space-y-2">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider block">
                  3. Maintenance Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Preferred Maintenance Partner</label>
                    <input
                      type="text"
                      value={landlordProvider}
                      onChange={(e) => setLandlordProvider(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-text-muted mb-1">Last Maintenance Audit</label>
                    <input
                      type="text"
                      defaultValue="15 Jan 2026 (Passed)"
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Add Property CTA */}
              <button
                type="button"
                onClick={handleLandlordComplete}
                className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-extrabold shadow-card transition-all flex items-center justify-center space-x-2"
              >
                <span>Add property</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

        {/* STEP 3: LANDLORD SUCCESS CONFIRMATION (Section 8) */}
        {step === 'landlord_success' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-elevated">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text-primary">
                Your property is ready for review.
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
                <strong>{landlordPropName}</strong> in {landlordArea}, Ahmedabad has been configured with TrueCost™ transparency and added to your portfolio.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surfaceMuted/60 border border-border max-w-sm mx-auto text-xs text-left space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Monthly Base Rent:</span>
                <span className="text-primary font-bold">₹{landlordRent.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Estimated Move-In Total:</span>
                <span className="text-text-primary font-bold">₹{(landlordDeposit + landlordRent + 2000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-text-muted">Verification Status:</span>
                <span className="text-emerald-700 font-bold">✓ 48-Pt Physical Audit Scheduled</span>
              </div>
            </div>

            <button
              onClick={handleFinishLandlordSuccess}
              className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-extrabold shadow-elevated transition-all inline-flex items-center space-x-2"
            >
              <span>Open Landlord Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
