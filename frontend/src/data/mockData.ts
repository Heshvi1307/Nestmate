import { Property, RoommateProfile, LeaseClause, MaintenanceTicket, ExpenseRecord, NotificationItem, MessageThread } from '../types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Solitaire Terraces',
    tagline: 'Sunlit modern sanctuary with cross-ventilation and home office nook',
    neighborhood: 'Vastrapur',
    city: 'Ahmedabad',
    coordinates: { lat: 23.035, lng: 72.528, x: 42, y: 48 },
    propertyType: '2 BHK',
    bedrooms: 2,
    bathrooms: 2,
    carpetArea: 980,
    furnishing: 'Fully Furnished',
    rating: 4.8,
    reviewsCount: 34,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: true,
    baseRent: 24000,
    deposit: 48000,
    maintenanceMonthly: 1200,
    utilitiesEstimate: 2800,
    internetMonthly: 600,
    totalEstimatedMonthly: 28600,
    moveInTotalCost: 76600, // 48k deposit + 24k 1st month rent + 1.2k maint + 2.8k util + 600 agreement
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    distances: {
      officeMinutes: 12,
      metroMinutes: 6,
      groceryMinutes: 4,
      universityMinutes: 18
    },
    amenities: ['High-speed Wi-Fi', 'Power Backup (100%)', 'Dedicated Parking', 'In-unit Laundry', 'Split AC (Both Rooms)', 'Work from Home Desk', 'CCTV Security', 'Elevator', 'Modular Kitchen'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Vikramaditya Sanghavi',
      inspectionDate: '12 Feb 2026',
      inspectionScore: 98,
      inspectionChecks: { electrical: 98, plumbing: 100, structural: 96, safety: 98 },
      historicalRentStability: 'Rent unchanged for 24 months',
      maintenanceTicketsPastYear: 2,
      avgResolutionHours: 3.5,
      standardLeaseAvailable: true,
      lockInMonths: 6,
      noticePeriodDays: 30,
      depositReturnPolicy: 'Full refund within 7 business days post-moveout inspection.'
    },
    timeline: [
      { date: '10 Jan 2024', event: 'Property Listed on NESTORA', status: 'completed', notes: 'Initial listing with verified title deed' },
      { date: '14 Jan 2024', event: '48-Point Physical Inspection', status: 'completed', notes: 'Passed with 98% score; zero moisture detected' },
      { date: '12 Feb 2026', event: 'Annual Preventive Maintenance', status: 'completed', notes: 'AC gas check, electrical load testing completed' },
      { date: 'Today', event: 'Verified Vacancy Available', status: 'current', notes: 'Ready for move-in from 1st of next month' }
    ],
    availableFrom: 'Immediately',
    featured: true
  },
  {
    id: 'prop-2',
    title: 'The Bodakdev Boulevard Suite',
    tagline: 'Minimalist high-ceiling apartment overlooking green canopy',
    neighborhood: 'Bodakdev',
    city: 'Ahmedabad',
    coordinates: { lat: 23.042, lng: 72.512, x: 30, y: 38 },
    propertyType: '3 BHK',
    bedrooms: 3,
    bathrooms: 3,
    carpetArea: 1420,
    furnishing: 'Fully Furnished',
    rating: 4.9,
    reviewsCount: 42,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: true,
    baseRent: 36000,
    deposit: 72000,
    maintenanceMonthly: 2000,
    utilitiesEstimate: 3600,
    internetMonthly: 800,
    totalEstimatedMonthly: 42400,
    moveInTotalCost: 114400,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    distances: {
      officeMinutes: 8,
      metroMinutes: 9,
      groceryMinutes: 3,
      universityMinutes: 22
    },
    amenities: ['Covered Parking (2 Cars)', 'Gated Security 24x7', 'Clubhouse & Gym', 'In-unit Dishwasher', 'Balcony Garden', 'Power Backup', 'EV Charging Socket'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Dr. Meera Parekh',
      inspectionDate: '01 Mar 2026',
      inspectionScore: 96,
      inspectionChecks: { electrical: 95, plumbing: 98, structural: 96, safety: 95 },
      historicalRentStability: 'Stable (5% escalation after 22 months)',
      maintenanceTicketsPastYear: 1,
      avgResolutionHours: 2.8,
      standardLeaseAvailable: true,
      lockInMonths: 11,
      noticePeriodDays: 60,
      depositReturnPolicy: 'Guaranteed return within 10 days minus documented deductions.'
    },
    timeline: [
      { date: '01 Mar 2026', event: 'Routine Bi-Annual Audit', status: 'completed', notes: 'Society clearance verified and certified' },
      { date: 'Today', event: 'Open for Viewing', status: 'current', notes: 'Digital keys & lockbox setup' }
    ],
    availableFrom: 'In 15 Days',
    featured: true
  },
  {
    id: 'prop-3',
    title: 'Urban Pod Studio @ SG Highway',
    tagline: 'Compact, ultra-efficient studio for tech professionals and researchers',
    neighborhood: 'SG Highway',
    city: 'Ahmedabad',
    coordinates: { lat: 23.065, lng: 72.532, x: 46, y: 22 },
    propertyType: 'Studio',
    bedrooms: 1,
    bathrooms: 1,
    carpetArea: 480,
    furnishing: 'Fully Furnished',
    rating: 4.7,
    reviewsCount: 19,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: true,
    baseRent: 16500,
    deposit: 33000,
    maintenanceMonthly: 800,
    utilitiesEstimate: 1600,
    internetMonthly: 500,
    totalEstimatedMonthly: 19400,
    moveInTotalCost: 52400,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'
    ],
    distances: {
      officeMinutes: 5,
      metroMinutes: 14,
      groceryMinutes: 2,
      universityMinutes: 12
    },
    amenities: ['Ergonomic Standing Desk', 'Smart Lock Access', 'High-Speed Fiber (300 Mbps)', 'RO Water Purifier', 'Microwave & Induction', 'Pet Friendly'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Anand Varma',
      inspectionDate: '20 Jan 2026',
      inspectionScore: 99,
      inspectionChecks: { electrical: 100, plumbing: 98, structural: 99, safety: 100 },
      historicalRentStability: 'Locked fixed price for students and startups',
      maintenanceTicketsPastYear: 0,
      avgResolutionHours: 2.0,
      standardLeaseAvailable: true,
      lockInMonths: 3,
      noticePeriodDays: 30,
      depositReturnPolicy: 'Instant bank transfer on key return.'
    },
    timeline: [
      { date: '20 Jan 2026', event: 'Smart Lock Setup & Clean Audit', status: 'completed', notes: 'Digital keyless entry verified' },
      { date: 'Today', event: 'Instant Move-in Ready', status: 'current', notes: 'Furnishings deep cleaned' }
    ],
    availableFrom: 'Immediately',
    featured: false
  },
  {
    id: 'prop-4',
    title: 'Prahlad Nagar Garden Residence',
    tagline: 'Serene tree-lined community with expansive wrap-around balcony',
    neighborhood: 'Prahlad Nagar',
    city: 'Ahmedabad',
    coordinates: { lat: 23.012, lng: 72.505, x: 25, y: 68 },
    propertyType: '2 BHK',
    bedrooms: 2,
    bathrooms: 2,
    carpetArea: 1050,
    furnishing: 'Semi-Furnished',
    rating: 4.85,
    reviewsCount: 28,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: false,
    baseRent: 22000,
    deposit: 44000,
    maintenanceMonthly: 1500,
    utilitiesEstimate: 2400,
    internetMonthly: 600,
    totalEstimatedMonthly: 26500,
    moveInTotalCost: 70500,
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
    ],
    distances: {
      officeMinutes: 10,
      metroMinutes: 5,
      groceryMinutes: 3,
      universityMinutes: 25
    },
    amenities: ['Elevator', 'Dedicated Car Park', 'Gas Pipeline (Adani PNG)', 'Children Play Area', 'Gated Security', 'Jogging Track'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Rashmin Dave',
      inspectionDate: '15 Jan 2026',
      inspectionScore: 94,
      inspectionChecks: { electrical: 94, plumbing: 96, structural: 95, safety: 92 },
      historicalRentStability: 'Consistent rate for last 18 months',
      maintenanceTicketsPastYear: 3,
      avgResolutionHours: 4.2,
      standardLeaseAvailable: true,
      lockInMonths: 6,
      noticePeriodDays: 30,
      depositReturnPolicy: 'Standard 7-day NESTORA escrow release.'
    },
    timeline: [
      { date: '15 Jan 2026', event: 'Physical Assessment', status: 'completed', notes: 'Gas line safety test passed' },
      { date: 'Today', event: 'Active Listing', status: 'current', notes: 'Available for scheduling site walkthroughs' }
    ],
    availableFrom: 'Next Month',
    featured: false
  },
  {
    id: 'prop-5',
    title: 'University Green Co-Living Loft',
    tagline: 'Vibrant student & scholar shared-living suite with individual study bays',
    neighborhood: 'Navrangpura',
    city: 'Ahmedabad',
    coordinates: { lat: 23.038, lng: 72.555, x: 62, y: 44 },
    propertyType: 'Co-living Suite',
    bedrooms: 1, // private bedroom in 3BHK flat
    bathrooms: 1,
    carpetArea: 320,
    furnishing: 'Fully Furnished',
    rating: 4.9,
    reviewsCount: 56,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: true,
    baseRent: 13500,
    deposit: 27000,
    maintenanceMonthly: 600,
    utilitiesEstimate: 1400,
    internetMonthly: 400,
    totalEstimatedMonthly: 15900,
    moveInTotalCost: 42900,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80'
    ],
    distances: {
      officeMinutes: 15,
      metroMinutes: 4,
      groceryMinutes: 1,
      universityMinutes: 6 // Super close to university
    },
    amenities: ['Shared Modular Kitchen', 'Bi-weekly Housekeeping Included', 'High-Speed Wi-Fi', 'Study Room Access', 'Power Backup', 'Laundry Machine'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Prof. Hemant Shukla',
      inspectionDate: '05 Feb 2026',
      inspectionScore: 97,
      inspectionChecks: { electrical: 98, plumbing: 96, structural: 98, safety: 97 },
      historicalRentStability: 'Subsidized academic rent structure',
      maintenanceTicketsPastYear: 1,
      avgResolutionHours: 2.1,
      standardLeaseAvailable: true,
      lockInMonths: 4,
      noticePeriodDays: 30,
      depositReturnPolicy: 'Prompt return via digital mandate.'
    },
    timeline: [
      { date: '05 Feb 2026', event: 'Academic Housing Certification', status: 'completed', notes: 'Approved for research scholar tenancy' },
      { date: 'Today', event: '2 Rooms Open for Spring Term', status: 'current', notes: 'Immediate roommate matching enabled' }
    ],
    availableFrom: 'Immediately',
    featured: true
  },
  {
    id: 'prop-6',
    title: 'GIFT Horizon Sky Condo',
    tagline: 'Modern smart home near the Financial Tech hub with panoramic horizon views',
    neighborhood: 'GIFT City Corridor',
    city: 'Gandhinagar / Ahmedabad',
    coordinates: { lat: 23.165, lng: 72.685, x: 88, y: 15 },
    propertyType: '2 BHK',
    bedrooms: 2,
    bathrooms: 2,
    carpetArea: 1100,
    furnishing: 'Fully Furnished',
    rating: 4.95,
    reviewsCount: 22,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: true,
    baseRent: 31000,
    deposit: 62000,
    maintenanceMonthly: 1800,
    utilitiesEstimate: 2900,
    internetMonthly: 700,
    totalEstimatedMonthly: 36400,
    moveInTotalCost: 98400,
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    distances: {
      officeMinutes: 4,
      metroMinutes: 8,
      groceryMinutes: 5,
      universityMinutes: 16
    },
    amenities: ['Smart Lighting & Thermostat', 'Swimming Pool & Gym', 'Clubhouse', 'Concierge Service', '100% Green Energy Backed', 'High Security Access'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Neelam & Kirit Shah',
      inspectionDate: '18 Feb 2026',
      inspectionScore: 99,
      inspectionChecks: { electrical: 100, plumbing: 99, structural: 100, safety: 98 },
      historicalRentStability: 'Premium corporate lease standard',
      maintenanceTicketsPastYear: 1,
      avgResolutionHours: 1.5,
      standardLeaseAvailable: true,
      lockInMonths: 11,
      noticePeriodDays: 60,
      depositReturnPolicy: 'Escrow backed automatic 48h settlement.'
    },
    timeline: [
      { date: '18 Feb 2026', event: 'Smart Home IoT Certified', status: 'completed', notes: 'Air filtration and smart sensor diagnostics completed' },
      { date: 'Today', event: 'Executive Ready', status: 'current', notes: 'Move-in assistance package ready' }
    ],
    availableFrom: 'Immediately',
    featured: false
  },
  {
    id: 'prop-7',
    title: 'Shela Greens Modern 1BHK',
    tagline: 'Quiet suburban enclave with clubhouse amenities and pet-friendly lawns',
    neighborhood: 'Shela',
    city: 'Ahmedabad',
    coordinates: { lat: 23.005, lng: 72.465, x: 14, y: 78 },
    propertyType: '1 BHK',
    bedrooms: 1,
    bathrooms: 1,
    carpetArea: 640,
    furnishing: 'Semi-Furnished',
    rating: 4.65,
    reviewsCount: 17,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: true,
    baseRent: 15000,
    deposit: 30000,
    maintenanceMonthly: 900,
    utilitiesEstimate: 1800,
    internetMonthly: 500,
    totalEstimatedMonthly: 18200,
    moveInTotalCost: 48200,
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee152da915ba?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    distances: {
      officeMinutes: 18,
      metroMinutes: 15,
      groceryMinutes: 4,
      universityMinutes: 30
    },
    amenities: ['Pet Park Access', 'Modular Kitchen Cabinets', 'Covered Two-Wheeler Parking', 'Lift with Power Inverter', 'Security Guards 24/7'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Tanvi Joshi',
      inspectionDate: '28 Jan 2026',
      inspectionScore: 93,
      inspectionChecks: { electrical: 92, plumbing: 94, structural: 95, safety: 91 },
      historicalRentStability: 'Unchanged for past 12 months',
      maintenanceTicketsPastYear: 2,
      avgResolutionHours: 4.0,
      standardLeaseAvailable: true,
      lockInMonths: 6,
      noticePeriodDays: 30,
      depositReturnPolicy: 'Direct refund within 5 business days.'
    },
    timeline: [
      { date: '28 Jan 2026', event: 'Health & Termite Audit', status: 'completed', notes: 'Certified clear' },
      { date: 'Today', event: 'Available for Lease', status: 'current', notes: 'Open for bachelor or working couple' }
    ],
    availableFrom: 'Next Week',
    featured: false
  },
  {
    id: 'prop-8',
    title: 'Ashram Road Heritage Penthouse',
    tagline: 'Rare urban terrace apartment close to cultural centers and metro line',
    neighborhood: 'Navrangpura / Ashram Rd',
    city: 'Ahmedabad',
    coordinates: { lat: 23.032, lng: 72.570, x: 74, y: 52 },
    propertyType: '2 BHK',
    bedrooms: 2,
    bathrooms: 2,
    carpetArea: 1150,
    furnishing: 'Fully Furnished',
    rating: 4.88,
    reviewsCount: 31,
    verified: true,
    verifiedOwner: true,
    recentlyInspected: true,
    fastResponse: true,
    baseRent: 27500,
    deposit: 55000,
    maintenanceMonthly: 1600,
    utilitiesEstimate: 2600,
    internetMonthly: 700,
    totalEstimatedMonthly: 32400,
    moveInTotalCost: 87400,
    images: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
    ],
    distances: {
      officeMinutes: 14,
      metroMinutes: 3,
      groceryMinutes: 2,
      universityMinutes: 14
    },
    amenities: ['Private Open Terrace', 'Wooden Flooring', 'Dedicated Parking', 'High-Speed Wi-Fi', 'AC in all rooms', 'Modular Kitchen with Chimney'],
    transparencyDetails: {
      ownerKycVerified: true,
      ownerName: 'Nirav Zaveri',
      inspectionDate: '10 Feb 2026',
      inspectionScore: 96,
      inspectionChecks: { electrical: 97, plumbing: 96, structural: 95, safety: 96 },
      historicalRentStability: 'Long-term lease preferred with standard 5% clause',
      maintenanceTicketsPastYear: 1,
      avgResolutionHours: 3.0,
      standardLeaseAvailable: true,
      lockInMonths: 11,
      noticePeriodDays: 30,
      depositReturnPolicy: 'Safe escrow release within 7 days.'
    },
    timeline: [
      { date: '10 Feb 2026', event: 'Terrace Waterproofing & Electrical Check', status: 'completed', notes: 'Heavy rain test passed' },
      { date: 'Today', event: 'Verified Ready for Move-In', status: 'current', notes: 'Paint and polishing newly refreshed' }
    ],
    availableFrom: 'Immediately',
    featured: true
  }
];

export const MOCK_ROOMMATES: RoommateProfile[] = [
  {
    id: 'rm-1',
    name: 'Aarav Patel',
    age: 24,
    profession: 'Senior UI/UX Designer',
    companyOrCollege: 'FinTech Labs (Remote)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 94,
    budgetRange: { min: 12000, max: 16000 },
    preferredLocations: ['Vastrapur', 'Bodakdev', 'Navrangpura'],
    moveInDate: 'Within 3 weeks',
    bio: 'Minimalist designer who loves good coffee, plant-filled living spaces, and deep work mornings. Quiet evenings, cook light pasta dinners, and enjoy weekend road trips.',
    lifestyleTraits: {
      sleepSchedule: 'Early riser (6 AM)',
      workStyle: 'Work from home',
      cleanliness: 'Neat freak',
      cooking: 'Cooks daily',
      social: 'Occasional friends',
      guests: 'Weekends okay',
      pets: 'Loves pets',
      smoking: 'Strict non-smoker'
    },
    matchedTraits: [
      'Similar budget (₹12k - ₹16k/mo)',
      'Early riser schedule alignment',
      'High cleanliness standard (Tidy workspace)',
      'Vegetarian/light cooking harmony'
    ],
    minorDifferences: [
      'Works from home full-time (requires quiet hours 10 AM - 5 PM)'
    ],
    verifiedId: true,
    backgroundCheck: true
  },
  {
    id: 'rm-2',
    name: 'Ananya Sharma',
    age: 23,
    profession: 'Risk Analyst',
    companyOrCollege: 'GIFT City Global Bank',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 91,
    budgetRange: { min: 14000, max: 18000 },
    preferredLocations: ['Bodakdev', 'SG Highway', 'Prahlad Nagar'],
    moveInDate: '1st of next month',
    bio: 'Finance nerd working in hybrid mode. Big fan of indie podcasts, yoga at sunrise, and splitting grocery bills fairly with zero drama.',
    lifestyleTraits: {
      sleepSchedule: 'Early riser (6 AM)',
      workStyle: 'Hybrid',
      cleanliness: 'Consistently clean',
      cooking: 'Order / Tiffin',
      social: 'Quiet & private',
      guests: 'Strict guest limit',
      pets: 'No pets',
      smoking: 'Strict non-smoker'
    },
    matchedTraits: [
      'Synchronized morning routine',
      'Zero smoking preference',
      'Organized bill splitting mentality',
      'Prefers peaceful evenings after work'
    ],
    minorDifferences: [
      'Prefers tiffin delivery over home cooking'
    ],
    verifiedId: true,
    backgroundCheck: true
  },
  {
    id: 'rm-3',
    name: 'Rohan Mehta',
    age: 26,
    profession: 'Software Engineer',
    companyOrCollege: 'SaaS Unicorn',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 88,
    budgetRange: { min: 15000, max: 20000 },
    preferredLocations: ['SG Highway', 'Vastrapur', 'Shela'],
    moveInDate: 'Immediate',
    bio: 'Full-stack dev into mechanical keyboards, chess, and gym sessions. Calm, respectful of personal boundaries, and always keeps common areas spotless.',
    lifestyleTraits: {
      sleepSchedule: 'Moderate (7-8 AM)',
      workStyle: 'Hybrid',
      cleanliness: 'Consistently clean',
      cooking: 'Cooks occasionally',
      social: 'Quiet & private',
      guests: 'Weekends okay',
      pets: 'Loves pets',
      smoking: 'Strict non-smoker'
    },
    matchedTraits: [
      'Clean common room discipline',
      'Tech-friendly work setup',
      'Shared interest in fitness & nutrition',
      'Strict non-smoker'
    ],
    minorDifferences: [
      'Slightly later bedtime (12:30 AM)'
    ],
    verifiedId: true,
    backgroundCheck: true
  },
  {
    id: 'rm-4',
    name: 'Priya Desai',
    age: 25,
    profession: 'Product Marketing Manager',
    companyOrCollege: 'Direct-to-Consumer Brand',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 85,
    budgetRange: { min: 13000, max: 17000 },
    preferredLocations: ['Navrangpura', 'Vastrapur'],
    moveInDate: 'Flexible',
    bio: 'Curator of art books, indoor plants, and baking sourdough on Sundays. Looking for a warm, cheerful flatmate who treats home like a sanctuary.',
    lifestyleTraits: {
      sleepSchedule: 'Moderate (7-8 AM)',
      workStyle: 'Office daily',
      cleanliness: 'Consistently clean',
      cooking: 'Cooks daily',
      social: 'Occasional friends',
      guests: 'Weekends okay',
      pets: 'Has pet',
      smoking: 'Strict non-smoker'
    },
    matchedTraits: [
      'Warm social harmony',
      'Loves sharing homemade food',
      'Cleanliness & aesthetic living standards',
      'Similar neighborhood preference'
    ],
    minorDifferences: [
      'Has a friendly 2-year-old rescued Indie cat (super clean & litter trained)'
    ],
    verifiedId: true,
    backgroundCheck: true
  },
  {
    id: 'rm-5',
    name: 'Kabir Vora',
    age: 22,
    profession: 'Masters Scholar in CS',
    companyOrCollege: 'Institute of Technology',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 83,
    budgetRange: { min: 10000, max: 13000 },
    preferredLocations: ['Navrangpura', 'SG Highway'],
    moveInDate: 'Before semester start',
    bio: 'Graduate student focused on machine learning research. Stays at library or campus lab most weekdays. Extremely quiet and reliable with rent dates.',
    lifestyleTraits: {
      sleepSchedule: 'Night owl (1-2 AM)',
      workStyle: 'Student',
      cleanliness: 'Relaxed',
      cooking: 'Order / Tiffin',
      social: 'Quiet & private',
      guests: 'Strict guest limit',
      pets: 'No pets',
      smoking: 'Strict non-smoker'
    },
    matchedTraits: [
      'Low interference & very respectful',
      'Zero guest traffic',
      'Campus proximity focus',
      'Punctual rent payment guarantee'
    ],
    minorDifferences: [
      'Studies late at night with desk lamp'
    ],
    verifiedId: true,
    backgroundCheck: true
  },
  {
    id: 'rm-6',
    name: 'Siddharth Iyer',
    age: 27,
    profession: 'Consultant',
    companyOrCollege: 'Global Strategy Group',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    compatibilityScore: 80,
    budgetRange: { min: 18000, max: 24000 },
    preferredLocations: ['Bodakdev', 'Prahlad Nagar'],
    moveInDate: 'Next month',
    bio: 'Travels Monday to Thursday for client projects. Home primarily on weekends to relax, read, and catch up on sleep. Clean, low-maintenance roommate.',
    lifestyleTraits: {
      sleepSchedule: 'Early riser (6 AM)',
      workStyle: 'Office daily',
      cleanliness: 'Neat freak',
      cooking: 'Order / Tiffin',
      social: 'Quiet & private',
      guests: 'Strict guest limit',
      pets: 'No pets',
      smoking: 'Strict non-smoker'
    },
    matchedTraits: [
      'Home empty 4 days a week (plenty of privacy)',
      'High budget flexibility',
      'Professional decorum and financial punctuality'
    ],
    minorDifferences: [
      'Higher budget tier than average'
    ],
    verifiedId: true,
    backgroundCheck: true
  }
];

export const MOCK_LEASE_CLAUSES: LeaseClause[] = [
  {
    id: 'clause-sec-dep',
    clauseNumber: 'Clause 4.1',
    title: 'Security Deposit & Return Conditions',
    section: 'Financial Obligations',
    category: 'Security Deposit',
    originalText: 'The Tenant shall deposit a sum of ₹48,000/- (Rupees Forty Eight Thousand only) as interest-free refundable Security Deposit with the Landlord upon signing. The said deposit shall be refunded within 7 (seven) business days following peaceful handover of the demised premises, subject to deductions only for unpaid utility bills or structural damage beyond reasonable wear and tear.',
    aiExplanation: 'This is a balanced, tenant-protective security deposit clause. The 7-day refund timeline is clear, and deductions are explicitly restricted to actual physical damage or pending utility dues rather than subjective painting penalties.',
    riskLevel: 'Safe & Standard',
    potentialHiddenCost: 'Verify that "structural damage beyond normal wear and tear" is documented with move-in photographs to prevent dispute over pre-existing scuffs.',
    whatToClarify: 'Confirm whether deep cleaning charges (usually ₹1,500 - ₹2,000) are automatically deducted or if you can leave it broom-clean yourself.'
  },
  {
    id: 'clause-rent-hike',
    clauseNumber: 'Clause 5.3',
    title: 'Annual Rent Escalation Rate',
    section: 'Rent Terms',
    category: 'Rent',
    originalText: 'The monthly rent is fixed at ₹24,000/- for the initial period of 11 (eleven) months. In the event of mutual renewal of this Tenancy Agreement, the monthly rent shall escalate by no more than 5% (five percent), bringing the renewed monthly rent to ₹25,200/-.',
    aiExplanation: 'The 5% annual escalation is favorable compared to typical local market norms (which frequently demand 7% to 10%). It locks in predictability for your long-term budget.',
    riskLevel: 'Safe & Standard',
    potentialHiddenCost: 'None. 5% is well within inflation targets.',
    whatToClarify: 'Ask if parking or maintenance fees are subject to separate escalation by the residential society.'
  },
  {
    id: 'clause-lock-in',
    clauseNumber: 'Clause 7.2',
    title: 'Lock-in Period & Early Exit Penalty',
    section: 'Tenure & Termination',
    category: 'Lock-in Period',
    originalText: 'Both the Landlord and the Tenant agree to an initial Lock-in Period of 6 (six) months from the Commencement Date. Should the Tenant vacate or seek termination prior to the completion of the 6-month lock-in period, the Tenant shall forfeit one month\'s rent from the Security Deposit as liquidated damages, except in verified cases of corporate job transfer or medical emergencies.',
    aiExplanation: 'A 6-month lock-in period prevents either party from breaking the lease early without consequence. If you must leave before month 6 for personal reasons, you would forfeit ₹24,000 (1 month rent). However, job relocations and medical issues are exempted.',
    riskLevel: 'Important Caveat',
    potentialHiddenCost: 'Up to ₹24,000 forfeiture if you relocate voluntarily within the first 180 days.',
    whatToClarify: 'If your college or job project has an unpredictable timeline, ask to reduce lock-in to 3 months or explicitly list your company transfer letters as accepted proof.'
  },
  {
    id: 'clause-notice-period',
    clauseNumber: 'Clause 8.1',
    title: 'Notice Period After Lock-in',
    section: 'Tenure & Termination',
    category: 'Notice Period',
    originalText: 'Subsequent to the expiration of the Lock-in Period, either party may terminate this agreement by providing at least 30 (thirty) days prior written notice (via registered email or NESTORA digital portal) without assigning any reason or incurring any penalty.',
    aiExplanation: 'Standard, fair 30-day notice period. Both tenant and landlord have equal rights to end tenancy with 1 month advance notice.',
    riskLevel: 'Safe & Standard',
    potentialHiddenCost: 'Ensure you serve notice in writing so the 30-day clock is officially recorded in NESTORA timestamp logs.',
    whatToClarify: 'Clarify whether the 30 days can start mid-month with prorated rent or must align with the calendar month cycle.'
  },
  {
    id: 'clause-maintenance',
    clauseNumber: 'Clause 9.4',
    title: 'Division of Maintenance Responsibilities',
    section: 'Property Upkeep',
    category: 'Maintenance',
    originalText: 'Major structural repairs, including roof waterproofing, main water pipe leaks inside walls, structural fissures, and pre-existing electrical wiring faults exceeding ₹2,500 per incident shall be borne entirely by the Landlord. Minor consumable replacements (light bulbs, tap washers, AC seasonal servicing, pest control) below ₹1,000 shall be handled by the Tenant.',
    aiExplanation: 'This provides a transparent, quantifiable threshold (₹2,500 vs ₹1,000) dividing major landlord responsibilities from minor tenant consumables. This prevents arguments over who pays for a broken water motor or wall seepage.',
    riskLevel: 'Safe & Standard',
    potentialHiddenCost: 'Routine AC filter cleaning or minor washer replacements (~₹400-₹800/yr).',
    whatToClarify: 'Request that the AC compressor and cooling coils be documented as landlord responsibility since compressor replacements exceed ₹10,000.'
  },
  {
    id: 'clause-utilities',
    clauseNumber: 'Clause 10.2',
    title: 'Utility Invoicing & Meter Readings',
    section: 'Utilities',
    category: 'Utilities',
    originalText: 'Electricity consumption shall be computed strictly on the basis of actual sub-meter readings provided by Torrent Power at official domestic tariff rates. Society monthly maintenance charges (currently ₹1,200/month) shall be paid by the Tenant directly to the society management or along with monthly rent.',
    aiExplanation: 'Eliminates flat-rate electricity markups. You pay actual Torrent Power domestic rates rather than inflated commercial rates charged by unscrupulous landlords.',
    riskLevel: 'Safe & Standard',
    potentialHiddenCost: 'Ensure Torrent Power bills are paid punctually to avoid late surcharges (~₹100/bill).',
    whatToClarify: 'Verify the sub-meter baseline reading on move-in day and log it inside NESTORA.'
  },
  {
    id: 'clause-restrictions',
    clauseNumber: 'Clause 12.1',
    title: 'Guest Policy & Quiet Hours',
    section: 'Code of Living',
    category: 'Restrictions',
    originalText: 'Guests, family members, and friends are permitted to visit and stay for up to 7 (seven) continuous days without prior permission. For extended stays exceeding one week, written intimation shall be provided to the Landlord for security registry purposes. Quiet hours shall be observed in community corridors between 11:00 PM and 07:00 AM.',
    aiExplanation: 'Reasonable and human guest policy. Prevents landlords from restricting daytime friends or imposing moral policing, while keeping society safety protocols intact.',
    riskLevel: 'Safe & Standard',
    potentialHiddenCost: 'None.',
    whatToClarify: 'Confirm if society security requires visiting friends to register on MyGate/gate register.'
  },
  {
    id: 'clause-termination',
    clauseNumber: 'Clause 14.3',
    title: 'Default, Subletting & Material Breach',
    section: 'Enforcement',
    category: 'Termination',
    originalText: 'The Tenant shall not assign, sublet, or transfer the whole or any part of the leased premises to third parties without prior written consent from the Landlord. Non-payment of rent for more than 15 consecutive days after the due date constitutes material breach, entitling the Landlord to initiate legal notice and vacate procedures.',
    aiExplanation: 'Standard protection against commercial exploitation or non-payment. If you want to replace a roommate, you must notify the landlord and update the digital agreement.',
    riskLevel: 'Important Caveat',
    potentialHiddenCost: 'Legal liability if unauthorized subletting occurs without written amendment.',
    whatToClarify: 'When sharing with roommates, use NESTORA co-tenant addendums so each person is held accountable for their share.'
  }
];

export const MOCK_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'ticket-1',
    ticketNumber: 'MNT-402',
    title: 'Kitchen Sink Under-Pipe Seepage',
    category: 'Plumbing',
    unit: 'Flat 402, Green Residency',
    locationInHouse: 'Main Kitchen under-sink drainage coupling',
    description: 'Slow water drip from the PVC connector beneath the secondary kitchen sink. Causes minor water pooling inside the cabinet after running dishes for over 5 minutes.',
    priority: 'High',
    status: 'In Progress',
    reportedAt: 'Today, 09:12 AM',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    technician: {
      name: 'Rahul Sharma',
      company: 'Rahul Sanitary & Home Services (Certified NESTORA Partner)',
      rating: 4.9,
      phone: '+91 98250 44192',
      scheduledTime: 'Today · 4:30 PM',
      eta: '45 mins (On the way)',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
    },
    activityTimeline: [
      { time: '09:12 AM', title: 'Issue Reported', description: 'Tenant Het submitted ticket with photo of pipe joint drip.', actor: 'Het (Tenant)', status: 'done' },
      { time: '09:20 AM', title: 'Property Manager Notified', description: 'Automated triage routed to Vastrapur maintenance zone.', actor: 'NESTORA AI Dispatch', status: 'done' },
      { time: '09:35 AM', title: 'Technician Assigned', description: 'Certified plumber Rahul Sharma accepted the job ticket.', actor: 'Rahul Services', status: 'done' },
      { time: '02:15 PM', title: 'Replacement Part Procured', description: 'Heavy-duty 40mm flexible waste trap & silicon seal sourced.', actor: 'Rahul Sharma', status: 'done' },
      { time: '04:15 PM', title: 'Technician In Transit', description: 'En route with toolkit. Estimated arrival 04:30 PM.', actor: 'Rahul Sharma', status: 'active' },
      { time: '05:00 PM', title: 'Pressure Test & Resolution', description: 'Scheduled repair, 10-minute leak inspection and signoff.', actor: 'Pending Signoff', status: 'pending' }
    ]
  },
  {
    id: 'ticket-2',
    ticketNumber: 'MNT-389',
    title: 'Master Bedroom AC Filter Clean & Gas Top-up',
    category: 'Appliance',
    unit: 'Flat 402, Green Residency',
    locationInHouse: 'Master Bedroom Split AC (Voltas 1.5 Ton)',
    description: 'Cooling efficiency reduced by ~30% over the last week. Filter requires ultrasonic cleaning before summer peak.',
    priority: 'Medium',
    status: 'Resolved',
    reportedAt: '14 Feb 2026',
    photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    technician: {
      name: 'Pravin Solanki',
      company: 'CoolBreeze HVAC Care',
      rating: 4.85,
      phone: '+91 97123 55890',
      scheduledTime: '15 Feb 2026 · 11:00 AM',
      eta: 'Completed',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },
    activityTimeline: [
      { time: '14 Feb, 10:00 AM', title: 'Issue Reported', description: 'AC cooling sluggish notice submitted.', actor: 'Het (Tenant)', status: 'done' },
      { time: '14 Feb, 11:30 AM', title: 'Technician Dispatched', description: 'CoolBreeze technician assigned by Owner.', actor: 'Vikramaditya (Owner)', status: 'done' },
      { time: '15 Feb, 11:15 AM', title: 'Service Executed', description: 'Filters cleaned, evaporator fin wash, refrigerant topped up to 65 PSI.', actor: 'Pravin Solanki', status: 'done' },
      { time: '15 Feb, 12:00 PM', title: 'Work Approved & Closed', description: 'Temperature drop to 18°C verified. Ticket closed with 90-day guarantee.', actor: 'Het (Tenant)', status: 'done' }
    ]
  },
  {
    id: 'ticket-3',
    ticketNumber: 'MNT-395',
    title: 'Balcony Outdoor Socket Earthing Check',
    category: 'Electrical',
    unit: 'Flat 402, Green Residency',
    locationInHouse: 'Balcony washing machine plug point',
    description: 'Occasional mild static tingle on metal rim of washing machine when operating on wet floor. Requesting earthing test.',
    priority: 'High',
    status: 'Resolved',
    reportedAt: '22 Jan 2026',
    activityTimeline: [
      { time: '22 Jan, 08:30 AM', title: 'Reported', description: 'Electrical safety alert flagged.', actor: 'Het', status: 'done' },
      { time: '22 Jan, 10:00 AM', title: 'Electrician Inspected', description: 'Ground pin re-terminated with 3-core insulated earthing wire.', actor: 'Kailash Electric', status: 'done' },
      { time: '22 Jan, 11:00 AM', title: 'Voltage Test Zero Leakage', description: 'Multimeter showed 0.0V neutral-ground float. Resolved.', actor: 'Kailash Electric', status: 'done' }
    ]
  }
];

export const MOCK_EXPENSE_HISTORY: ExpenseRecord[] = [
  {
    id: 'exp-1',
    month: 'Feb 2026',
    rent: 24000,
    utilities: 2780,
    internet: 600,
    maintenance: 1200,
    food: 1800,
    transport: 860,
    other: 0,
    total: 31240,
    vsPreviousMonthDiff: 420,
    isProjected: false
  },
  {
    id: 'exp-2',
    month: 'Jan 2026',
    rent: 24000,
    utilities: 2360,
    internet: 600,
    maintenance: 1200,
    food: 1750,
    transport: 910,
    other: 0,
    total: 30820,
    vsPreviousMonthDiff: -340,
    isProjected: false
  },
  {
    id: 'exp-3',
    month: 'Dec 2025',
    rent: 24000,
    utilities: 2700,
    internet: 600,
    maintenance: 1200,
    food: 1820,
    transport: 840,
    other: 0,
    total: 31160,
    vsPreviousMonthDiff: 110,
    isProjected: false
  },
  {
    id: 'exp-4',
    month: 'Mar 2026 (Est.)',
    rent: 24000,
    utilities: 3100, // summer AC usage starting
    internet: 600,
    maintenance: 1200,
    food: 1800,
    transport: 900,
    other: 0,
    total: 31600,
    vsPreviousMonthDiff: 360,
    isProjected: true
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Upcoming Rent Payment Due in 5 Days',
    message: 'February rent of ₹24,000 for Green Residency Flat 402 is due on 1st March. 0% convenience fee via UPI.',
    type: 'rent',
    priority: 'urgent',
    timestamp: '2 hours ago',
    read: false,
    actionLabel: 'Pay Rent Now',
    actionTab: 'rent'
  },
  {
    id: 'notif-2',
    title: 'Technician En Route: Kitchen Sink Pipe',
    message: 'Rahul Sharma is on the way for Ticket #MNT-402. Estimated arrival at 4:30 PM.',
    type: 'maintenance',
    priority: 'important',
    timestamp: '25 mins ago',
    read: false,
    actionLabel: 'View Ticket Timeline',
    actionTab: 'maintenance'
  },
  {
    id: 'notif-3',
    title: 'New High Compatibility Roommate Match (94%)',
    message: 'Aarav Patel (Senior UI/UX Designer) matches your budget, early sleep schedule, and Vastrapur preference.',
    type: 'match',
    priority: 'info',
    timestamp: 'Yesterday',
    read: true,
    actionLabel: 'Review Profile',
    actionTab: 'roommates'
  },
  {
    id: 'notif-4',
    title: 'Digital Agreement Active in LeaseLens',
    message: 'Your tenancy agreement is verified with digital signatures and stamp certificate #GJ-AHM-2026-8941.',
    type: 'lease',
    priority: 'info',
    timestamp: '3 days ago',
    read: true,
    actionLabel: 'Examine Clauses',
    actionTab: 'leaselens'
  }
];

export const MOCK_MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'thread-1',
    recipientName: 'Rahul Sharma',
    recipientRole: 'Service Technician (Plumbing)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'I have procured the 40mm replacement trap. Arriving at Flat 402 around 4:30 PM.',
    timestamp: '04:15 PM',
    unreadCount: 1,
    contextType: 'maintenance',
    contextData: {
      title: 'Ticket #MNT-402: Kitchen Sink Under-Pipe Seepage',
      status: 'In Progress · ETA 4:30 PM',
      id: 'ticket-1'
    },
    messages: [
      { id: 'm1', sender: 'recipient', text: 'Namaste Het ji, I have accepted your sink repair ticket.', timestamp: '09:40 AM' },
      { id: 'm2', sender: 'user', text: 'Hi Rahul! Yes, the water leaks from the white connector when dishwashing. Thank you for taking it quickly.', timestamp: '09:45 AM' },
      { id: 'm3', sender: 'recipient', text: 'I am in Vastrapur market picking up a reinforced seal. Is 4:30 PM convenient for you to let me in?', timestamp: '02:30 PM' },
      { id: 'm4', sender: 'user', text: 'Yes, I am working from home so 4:30 PM is perfect.', timestamp: '02:32 PM' },
      { id: 'm5', sender: 'recipient', text: 'I have procured the 40mm replacement trap. Arriving at Flat 402 around 4:30 PM.', timestamp: '04:15 PM' }
    ]
  },
  {
    id: 'thread-2',
    recipientName: 'Vikramaditya Sanghavi',
    recipientRole: 'Property Owner (Green Residency)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Glad the AC service was smooth last week. Let me know if any other support is needed.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    contextType: 'property',
    contextData: {
      title: 'Green Residency, Flat 402 · Active Lease',
      status: 'Rent Due 1st March',
      id: 'prop-1'
    },
    messages: [
      { id: 'v1', sender: 'user', text: 'Hi Vikramaditya ji, just wanted to let you know the technician completed the AC servicing smoothly.', timestamp: '15 Feb, 01:00 PM' },
      { id: 'v2', sender: 'recipient', text: 'Glad the AC service was smooth last week. Let me know if any other support is needed. Have a good week!', timestamp: '15 Feb, 02:30 PM' }
    ]
  },
  {
    id: 'thread-3',
    recipientName: 'Aarav Patel',
    recipientRole: 'Potential Roommate (94% Match)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Hey Het! Saw our compatibility profile on NESTORA. I also work remote in tech and love Vastrapur area.',
    timestamp: '2 days ago',
    unreadCount: 0,
    contextType: 'roommate',
    contextData: {
      title: 'Lifestyle Match: 94% Compatibility',
      status: 'Early Riser · WFH · Neat Standard',
      id: 'rm-1'
    },
    messages: [
      { id: 'a1', sender: 'recipient', text: 'Hey Het! Saw our compatibility profile on NESTORA. I also work remote in tech and love Vastrapur area.', timestamp: '2 days ago' },
      { id: 'a2', sender: 'user', text: 'Hey Aarav! Awesome to connect. I was looking at The Solitaire Terraces 2BHK — it has two equal master rooms and high-speed fiber.', timestamp: '2 days ago' }
    ]
  }
];

export const MOCK_OWNER_PORTFOLIO = {
  ownerName: 'Vikramaditya Sanghavi',
  portfolioSummary: {
    totalProperties: 3,
    totalUnits: 4,
    occupancyRate: 100,
    monthlyGrossRevenue: 76000,
    onTimeCollectionRate: 98,
    openMaintenanceTickets: 1
  },
  properties: [
    {
      id: 'prop-1',
      title: 'The Solitaire Terraces, Flat 402',
      neighborhood: 'Vastrapur',
      tenantName: 'Het Patel',
      tenantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rent: 24000,
      depositHeld: 48000,
      leaseStatus: 'Active (Expires Oct 2026)',
      nextRentDue: '1st March 2026',
      maintenanceState: '1 Active Ticket (In Progress)',
      paymentHistory: [
        { month: 'Feb 2026', amount: 24000, status: 'Paid On Time', date: '01 Feb 2026' },
        { month: 'Jan 2026', amount: 24000, status: 'Paid On Time', date: '01 Jan 2026' },
        { month: 'Dec 2025', amount: 24000, status: 'Paid On Time', date: '02 Dec 2025' }
      ]
    },
    {
      id: 'prop-4',
      title: 'Prahlad Nagar Garden Residence, Flat 102',
      neighborhood: 'Prahlad Nagar',
      tenantName: 'Sanjay & Ritu Shah',
      tenantAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      rent: 22000,
      depositHeld: 44000,
      leaseStatus: 'Active (Expires Dec 2026)',
      nextRentDue: '1st March 2026',
      maintenanceState: 'All Clear',
      paymentHistory: [
        { month: 'Feb 2026', amount: 22000, status: 'Paid On Time', date: '02 Feb 2026' },
        { month: 'Jan 2026', amount: 22000, status: 'Paid On Time', date: '01 Jan 2026' }
      ]
    },
    {
      id: 'prop-8',
      title: 'Ashram Road Heritage Penthouse, Unit 601',
      neighborhood: 'Navrangpura',
      tenantName: 'Aditya Mathur',
      tenantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      rent: 30000,
      depositHeld: 60000,
      leaseStatus: 'Active (Expires Aug 2026)',
      nextRentDue: '1st March 2026',
      maintenanceState: 'All Clear',
      paymentHistory: [
        { month: 'Feb 2026', amount: 30000, status: 'Paid On Time', date: '01 Feb 2026' }
      ]
    }
  ]
};

export const MOCK_PROPERTY_MANAGER_PORTFOLIO = {
  managerName: 'Pooja Trivedi',
  company: 'Aether Residential Management LLP',
  stats: {
    totalPropertiesManaged: 18,
    totalUnits: 42,
    occupancyRate: 92.8,
    monthlyGrossRevenue: 480000, // ₹4.8 Lakhs
    collectionRate: 96.4,
    pendingMaintenanceCount: 7,
    activeLeasesCount: 39,
    upcomingMoveInsThisMonth: 3
  },
  urgentMaintenanceQueue: [
    { id: 't-1', ticket: 'MNT-402', unit: 'Green Residency #402', issue: 'Kitchen Sink Drainage Pipe', priority: 'High', status: 'Technician En Route' },
    { id: 't-2', ticket: 'MNT-405', unit: 'Boulevard Suite #3B', issue: 'MCB Trip on Geyser Load', priority: 'Emergency', status: 'Technician Dispatched' },
    { id: 't-3', ticket: 'MNT-408', unit: 'Navrangpura Loft #201', issue: 'Wi-Fi Fiber Line Splice', priority: 'Medium', status: 'Scheduled Tomorrow' }
  ]
};
