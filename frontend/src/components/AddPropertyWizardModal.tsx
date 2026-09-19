import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building, 
  IndianRupee, 
  Upload, 
  FileText, 
  Wrench, 
  Check, 
  Eye, 
  Sparkles, 
  ShieldCheck,
  Camera,
  MapPin
} from 'lucide-react';
import { Property } from '../types';
import { useNestMate } from '../context/NestMateContext';

interface AddPropertyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPropertyWizardModal: React.FC<AddPropertyWizardModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addNewProperty, user } = useNestMate();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1: Property Details
  const [propertyName, setPropertyName] = useState('Galaxy Enclave 302');
  const [address, setAddress] = useState('Near Vastrapur Lake, Vastrapur');
  const [area, setArea] = useState('Vastrapur');
  const [city, setCity] = useState('Ahmedabad');
  const [propertyType, setPropertyType] = useState<'1 BHK' | '2 BHK' | '3 BHK' | 'Studio'>('2 BHK');
  const [bhk, setBhk] = useState(2);
  const [propertySize, setPropertySize] = useState(1050);
  const [furnishing, setFurnishing] = useState<'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished'>('Fully Furnished');

  // STEP 2: Financial Details
  const [monthlyRent, setMonthlyRent] = useState(25000);
  const [securityDeposit, setSecurityDeposit] = useState(50000);
  const [maintenance, setMaintenance] = useState(1200);
  const [utilities, setUtilities] = useState(2600);
  const [internet, setInternet] = useState(600);

  // STEP 3: Amenities
  const [amenities, setAmenities] = useState<string[]>([
    'High-speed Wi-Fi', 'Power Backup (100%)', 'Dedicated Parking', 'In-unit Laundry', 'Split AC (Both Rooms)', 'Work from Home Desk'
  ]);

  // STEP 4: Photos
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
  ]);

  // STEP 5: Documents
  const [docsUploaded, setDocsUploaded] = useState<string[]>([
    'Property Title Deed (Index II Copy)',
    'Owner Aadhaar / PAN KYC',
    'Standard 11-Month Model Tenancy Agreement'
  ]);

  // STEP 6: Maintenance Profile
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState('10 Feb 2026');
  const [maintenanceProvider, setMaintenanceProvider] = useState('Rahul Services & Urban Company');
  const [pendingIssues, setPendingIssues] = useState('None (Full pre-occupancy inspection passed)');

  // Step 7 Publish state
  const [isPublished, setIsPublished] = useState(false);

  if (!isOpen) return null;

  const totalMonthlyCost = monthlyRent + maintenance + utilities + internet;
  const totalMoveInCost = securityDeposit + monthlyRent + maintenance + utilities + internet + 600;

  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter(a => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handlePublish = () => {
    const newProp: Property = {
      id: `prop-listed-${Date.now()}`,
      title: propertyName,
      tagline: `Spacious ${propertyType} in prime ${area} with verified true cost transparency`,
      neighborhood: area,
      city: city,
      coordinates: { lat: 23.037, lng: 72.529, x: 44, y: 47 },
      propertyType: propertyType as any,
      bedrooms: bhk,
      bathrooms: bhk,
      carpetArea: propertySize,
      furnishing: furnishing,
      rating: 5.0,
      reviewsCount: 0,
      verified: true,
      verifiedOwner: true,
      recentlyInspected: true,
      fastResponse: true,
      baseRent: monthlyRent,
      deposit: securityDeposit,
      maintenanceMonthly: maintenance,
      utilitiesEstimate: utilities,
      internetMonthly: internet,
      totalEstimatedMonthly: totalMonthlyCost,
      moveInTotalCost: totalMoveInCost,
      images: photos,
      floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      distances: {
        officeMinutes: 10,
        metroMinutes: 7,
        groceryMinutes: 4,
        universityMinutes: 16
      },
      amenities: amenities,
      transparencyDetails: {
        ownerKycVerified: true,
        ownerName: user.fullName || 'Vikramaditya Sanghavi',
        inspectionDate: lastMaintenanceDate,
        inspectionScore: 98,
        inspectionChecks: { electrical: 98, plumbing: 100, structural: 96, safety: 98 },
        historicalRentStability: 'Fresh Listing on NestMate',
        maintenanceTicketsPastYear: 0,
        avgResolutionHours: 2.0,
        standardLeaseAvailable: true,
        lockInMonths: 6,
        noticePeriodDays: 30,
        depositReturnPolicy: 'Full refund within 7 business days post-moveout inspection.'
      },
      timeline: [
        { date: 'Today', event: 'Property Listed by Owner', status: 'completed', notes: 'Title verified and registered on NestMate.' },
        { date: 'Today', event: '48-Point Audit Verified', status: 'completed', notes: 'Inspection passed with 98% score.' },
        { date: 'Upcoming', event: 'Available for Move-in', status: 'current', notes: 'Tenant scheduling enabled.' }
      ],
      availableFrom: 'Immediately',
      featured: true
    };

    addNewProperty(newProp);
    setIsPublished(true);
  };

  const stepsList = [
    'Property Details',
    'Financial Details',
    'Amenities',
    'Photos',
    'Documents',
    'Maintenance',
    'Preview & Publish'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-surface rounded-3xl shadow-dropdown border border-border overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between z-10">
          <div>
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-primary" />
              <h2 className="text-base sm:text-lg font-black text-text-primary tracking-tight">
                Add New Property Wizard
              </h2>
            </div>
            <span className="text-[11px] text-text-muted">
              Step {currentStep} of 7: <strong>{stepsList[currentStep - 1]}</strong>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-surfaceMuted h-1.5 flex">
          {stepsList.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-300 ${
                i < currentStep ? 'bg-primary' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 text-xs space-y-6">
          
          {/* STEP 1: PROPERTY DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-text-primary">Step 1: Property Details</h3>
                <p className="text-text-secondary text-[11px]">Tell tenants about your property's location and architectural specifications.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-text-primary mb-1">Property Name / Building</label>
                  <input
                    type="text"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">Full Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">Property Type & BHK</label>
                  <div className="flex gap-2">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as any)}
                      className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-surface font-semibold"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="Studio">Studio</option>
                    </select>
                    <select
                      value={bhk}
                      onChange={(e) => setBhk(Number(e.target.value))}
                      className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-surface font-semibold"
                    >
                      <option value={1}>1 Bed / 1 Bath</option>
                      <option value={2}>2 Bed / 2 Bath</option>
                      <option value={3}>3 Bed / 3 Bath</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">Carpet Size (Sq Ft) & Furnishing</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={propertySize}
                      onChange={(e) => setPropertySize(Number(e.target.value))}
                      className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-surface font-semibold"
                      placeholder="1050"
                    />
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value as any)}
                      className="w-1/2 px-2.5 py-2 rounded-xl border border-border bg-surface font-semibold"
                    >
                      <option value="Fully Furnished">Fully Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIAL DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-text-primary">Step 2: Financial Details</h3>
                <p className="text-text-secondary text-[11px]">Specify transparent rent, deposit, and utilities. NestMate calculates the TrueCost™ automatically.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1">
                  <label className="block font-bold text-text-primary">Monthly Base Rent (₹)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-bold text-sm text-primary"
                  />
                  <span className="text-[10px] text-text-muted">Net rental payable to you monthly</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1">
                  <label className="block font-bold text-text-primary">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-bold text-sm"
                  />
                  <span className="text-[10px] text-text-muted">Typically 2 months base rent (in digital escrow)</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1">
                  <label className="block font-bold text-text-primary">Society Maintenance (₹ / month)</label>
                  <input
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-bold text-sm"
                  />
                  <span className="text-[10px] text-text-muted">Society maintenance fees</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-surfaceMuted/40 border border-border space-y-1">
                  <label className="block font-bold text-text-primary">Estimated Utilities (₹ / month)</label>
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-bold text-sm"
                  />
                  <span className="text-[10px] text-text-muted">Torrent Power, Gas and Water</span>
                </div>
              </div>

              {/* TrueCost Computed Preview Box */}
              <div className="p-4 rounded-2xl bg-primary-light/40 border border-primary/20 space-y-1.5">
                <span className="text-[10px] font-black text-primary uppercase tracking-wider block">Computed TrueCost™ Display</span>
                <div className="flex justify-between font-bold text-text-primary">
                  <span>Estimated Total Monthly Living:</span>
                  <span className="text-primary text-sm font-black">₹{totalMonthlyCost.toLocaleString('en-IN')}/mo</span>
                </div>
                <div className="flex justify-between text-text-secondary text-[11px]">
                  <span>Total Move-in Capital Required:</span>
                  <span className="font-bold">₹{totalMoveInCost.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AMENITIES */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-text-primary">Step 3: Amenities & Inclusions</h3>
                <p className="text-text-secondary text-[11px]">Select all verified amenities available in the unit.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Parking', 'Wi-Fi', 'AC', 'Furniture', 'Laundry', 
                  'Power backup', 'Workspace', 'Elevator', 'CCTV Security', 
                  'Modular Kitchen', 'Geyser', 'Balcony'
                ].map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      amenities.includes(amenity)
                        ? 'bg-primary-light border-primary text-primary font-bold shadow-subtle'
                        : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                    }`}
                  >
                    <span>{amenity}</span>
                    {amenities.includes(amenity) && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PHOTOS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-text-primary">Step 4: Property Photos</h3>
                <p className="text-text-secondary text-[11px]">High-resolution, unedited photos. Photos undergo geotag verification during physical audit.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((img, idx) => (
                  <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden border border-border relative group">
                    <img src={img} alt="Property" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-semibold">
                      Photo {idx + 1}
                    </span>
                  </div>
                ))}

                <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-border bg-surface hover:border-primary/40 flex flex-col items-center justify-center text-center p-3 cursor-pointer">
                  <Camera className="w-6 h-6 text-primary mb-1" />
                  <span className="font-bold text-text-primary text-[11px]">Upload Photo</span>
                  <span className="text-[10px] text-text-muted">JPG, PNG up to 10MB</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DOCUMENTS */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-text-primary">Step 5: Verification Documents</h3>
                <p className="text-text-secondary text-[11px]">Upload property ownership papers and draft rental agreement for LeaseLens screening.</p>
              </div>

              <div className="space-y-2.5">
                {docsUploaded.map((doc, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-bold text-text-primary">{doc}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      ✓ Attached
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl border-2 border-dashed border-border text-center space-y-1 cursor-pointer hover:border-primary/40">
                <Upload className="w-5 h-5 text-secondary mx-auto" />
                <span className="font-bold text-text-primary block">Upload Additional Document</span>
                <span className="text-[10px] text-text-muted block">Society NOC, Electricity Bill, Tax Receipt</span>
              </div>
            </div>
          )}

          {/* STEP 6: MAINTENANCE PROFILE */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-text-primary">Step 6: Maintenance History</h3>
                <p className="text-text-secondary text-[11px]">Provide historical maintenance data so tenants can rent with total confidence.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-text-primary mb-1">Last Maintenance Audit Date</label>
                  <input
                    type="text"
                    value={lastMaintenanceDate}
                    onChange={(e) => setLastMaintenanceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">Designated Service Provider</label>
                  <input
                    type="text"
                    value={maintenanceProvider}
                    onChange={(e) => setMaintenanceProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-text-primary mb-1">Pending Issues or Disclosures</label>
                  <input
                    type="text"
                    value={pendingIssues}
                    onChange={(e) => setPendingIssues(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PREVIEW (Tenant View) */}
          {currentStep === 7 && !isPublished && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-text-primary">Step 7: Tenant-Facing Preview</h3>
                <p className="text-text-secondary text-[11px]">This is exactly how your property will appear to tenants in search and map discovery.</p>
              </div>

              <div className="border border-border rounded-2xl p-4 bg-surface shadow-card space-y-3">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surfaceMuted relative">
                  <img src={photos[0]} alt="preview" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white font-bold text-[10px]">
                    {propertyType} · {furnishing}
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-[10px]">
                    ✓ Physical Audit Ready
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-text-primary">{propertyName}</h4>
                  <p className="text-text-muted text-[11px]">{address}, {area}, {city}</p>
                </div>

                <div className="p-3 rounded-xl bg-primary-light/40 border border-primary/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-text-muted block">TrueCost™ Monthly Living</span>
                    <span className="text-sm font-black text-primary">₹{totalMonthlyCost.toLocaleString('en-IN')} / mo</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted block">Base Rent</span>
                    <span className="text-xs font-bold text-text-primary">₹{monthlyRent.toLocaleString('en-IN')} / mo</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {amenities.slice(0, 5).map((a, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-surfaceMuted text-text-secondary text-[10px] font-semibold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success View */}
          {isPublished && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-elevated">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-text-primary">
                Your property is ready for review!
              </h3>
              <p className="text-text-secondary text-xs max-w-sm mx-auto">
                <strong>{propertyName}</strong> has been published with TrueCost™ breakdown and added to your portfolio and live explore maps.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs shadow-card"
              >
                Back to Portfolio
              </button>
            </div>
          )}

        </div>

        {/* Sticky Footer Action Bar */}
        {!isPublished && (
          <div className="p-4 border-t border-border bg-surface flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-text-secondary hover:bg-surfaceMuted flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-extrabold hover:bg-primary-hover flex items-center space-x-1.5 shadow-subtle"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-extrabold hover:bg-primary-hover flex items-center space-x-1.5 shadow-card"
              >
                <Check className="w-4 h-4" />
                <span>Publish Property</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
