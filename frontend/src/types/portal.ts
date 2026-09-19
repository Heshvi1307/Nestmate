export type UserRole = 'tenant' | 'landlord' | 'property_manager';

export interface Property {
  id: string;
  title: string;
  tagline: string;
  neighborhood: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // percentage on custom interactive vector map (0-100)
    y: number; // percentage on custom interactive vector map (0-100)
  };
  propertyType: '1 BHK' | '2 BHK' | '3 BHK' | 'Studio' | 'Co-living Suite' | string;
  bedrooms: number;
  bathrooms: number;
  carpetArea: number; // sq ft
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished' | string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  verifiedOwner: boolean;
  recentlyInspected: boolean;
  fastResponse: boolean;
  
  // Fintech Cost Transparency
  baseRent: number;
  deposit: number;
  maintenanceMonthly: number;
  utilitiesEstimate: number;
  internetMonthly: number;
  totalEstimatedMonthly: number;
  moveInTotalCost: number;

  images: string[];
  floorPlanUrl?: string;
  distances: {
    officeMinutes: number;
    metroMinutes: number;
    groceryMinutes: number;
    universityMinutes: number;
  };
  amenities: string[];
  
  transparencyDetails: {
    ownerKycVerified: boolean;
    ownerName: string;
    inspectionDate: string;
    inspectionScore: number;
    inspectionChecks: {
      electrical: number;
      plumbing: number;
      structural: number;
      safety: number;
    };
    historicalRentStability: string;
    maintenanceTicketsPastYear: number;
    avgResolutionHours: number;
    standardLeaseAvailable: boolean;
    lockInMonths: number;
    noticePeriodDays: number;
    depositReturnPolicy: string;
  };
  
  timeline: Array<{
    date: string;
    event: string;
    status: 'completed' | 'current' | 'upcoming';
    notes: string;
  }>;
  availableFrom: string;
  featured?: boolean;

  // Supabase PostgreSQL schema aliases
  base_rent?: number;
  carpet_area?: number | null;
  total_estimated_monthly?: number | null;
  property_type?: string | null;
  reviews_count?: number | null;
  verified_owner?: boolean;
  recently_inspected?: boolean;
  fast_response?: boolean;
  maintenance_monthly?: number | null;
  utilities_estimate?: number | null;
  internet_monthly?: number | null;
  move_in_total_cost?: number | null;
  landlord_id?: string | null;
  created_at?: string;
}

export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  profession: string;
  companyOrCollege: string;
  avatar: string;
  compatibilityScore: number;
  budgetRange: { min: number; max: number };
  preferredLocations: string[];
  moveInDate: string;
  bio: string;
  lifestyleTraits: {
    sleepSchedule: 'Early riser (6 AM)' | 'Moderate (7-8 AM)' | 'Night owl (1-2 AM)' | string;
    workStyle: 'Work from home' | 'Hybrid' | 'Office daily' | 'Student' | string;
    cleanliness: 'Neat freak' | 'Consistently clean' | 'Relaxed' | string;
    cooking: 'Cooks daily' | 'Cooks occasionally' | 'Order / Tiffin' | string;
    social: 'Quiet & private' | 'Occasional friends' | 'Loves social gatherings' | string;
    guests: 'Strict guest limit' | 'Weekends okay' | 'Open' | string;
    pets: 'No pets' | 'Loves pets' | 'Has pet' | string;
    smoking: 'Strict non-smoker' | 'Balcony only' | 'Social smoker' | string;
  };
  matchedTraits: string[];
  minorDifferences: string[];
  verifiedId: boolean;
  backgroundCheck: boolean;

  // Supabase DB aliases
  location?: string;
  about_me?: string;
  mbti?: string;
  interests?: string[];
  experience_years?: string;
  professional_summary?: string;
  created_at?: string;
}

export interface LeaseClause {
  id: string;
  title: string;
  clauseNumber: string;
  section: string;
  originalText: string;
  aiExplanation: string;
  riskLevel: 'Safe & Standard' | 'Important Caveat' | 'Caution / Negotiate';
  potentialHiddenCost: string;
  whatToClarify: string;
  category: string;

  // Supabase DB aliases
  clause_number?: number;
  original_text?: string;
  ai_explanation?: string;
  risk_level?: 'Safe & Standard' | 'Important Caveat' | 'Caution / Negotiate';
  potential_hidden_cost?: string;
  what_to_clarify?: string;
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Appliance' | 'Internet' | 'Furniture' | 'Other';
  unit: string;
  locationInHouse: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Reported' | 'Assigned' | 'Technician Scheduled' | 'In Progress' | 'Resolved';
  reportedAt: string;
  photoUrl?: string;
  technician?: {
    name: string;
    company: string;
    rating: number;
    phone: string;
    scheduledTime: string;
    eta: string;
    avatar: string;
  };
  activityTimeline: Array<{
    time: string;
    title: string;
    description: string;
    actor: string;
    status: 'done' | 'active' | 'pending';
  }>;
}

export interface ExpenseRecord {
  id: string;
  month: string;
  rent: number;
  utilities: number;
  internet: number;
  maintenance: number;
  food: number;
  transport: number;
  other: number;
  total: number;
  vsPreviousMonthDiff: number;
  isProjected?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'rent' | 'maintenance' | 'match' | 'lease' | 'price' | 'system';
  priority: 'urgent' | 'important' | 'info';
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionTab?: string;
}

export interface MessageThread {
  id: string;
  recipientName: string;
  recipientRole: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  contextType?: 'maintenance' | 'property' | 'roommate' | 'lease';
  contextData?: {
    title: string;
    status: string;
    id: string;
  };
  messages: Array<{
    id: string;
    sender: 'user' | 'recipient';
    text: string;
    timestamp: string;
    hasContextCard?: boolean;
  }>;
}
