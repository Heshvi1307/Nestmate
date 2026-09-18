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
  propertyType: '1 BHK' | '2 BHK' | '3 BHK' | 'Studio' | 'Co-living Suite';
  bedrooms: number;
  bathrooms: number;
  carpetArea: number; // sq ft
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
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
    sleepSchedule: 'Early riser (6 AM)' | 'Moderate (7-8 AM)' | 'Night owl (1-2 AM)';
    workStyle: 'Work from home' | 'Hybrid' | 'Office daily' | 'Student';
    cleanliness: 'Neat freak' | 'Consistently clean' | 'Relaxed';
    cooking: 'Cooks daily' | 'Cooks occasionally' | 'Order / Tiffin';
    social: 'Quiet & private' | 'Occasional friends' | 'Loves social gatherings';
    guests: 'Strict guest limit' | 'Weekends okay' | 'Open';
    pets: 'No pets' | 'Loves pets' | 'Has pet';
    smoking: 'Strict non-smoker' | 'Balcony only' | 'Social smoker';
  };
  matchedTraits: string[];
  minorDifferences: string[];
  verifiedId: boolean;
  backgroundCheck: boolean;
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
  category: 'Security Deposit' | 'Rent' | 'Lock-in Period' | 'Notice Period' | 'Maintenance' | 'Utilities' | 'Termination' | 'Restrictions';
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
