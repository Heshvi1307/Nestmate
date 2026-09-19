import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  Property, 
  UserRole, 
  NotificationItem, 
  MaintenanceTicket, 
  RoommateProfile, 
  LeaseClause,
  MessageThread,
  ExpenseRecord
} from '../types';
import { 
  MOCK_PROPERTIES, 
  MOCK_NOTIFICATIONS, 
  MOCK_MAINTENANCE_TICKETS, 
  MOCK_ROOMMATES, 
  MOCK_LEASE_CLAUSES,
  MOCK_MESSAGE_THREADS,
  MOCK_EXPENSE_HISTORY,
  MOCK_OWNER_PORTFOLIO
} from '../data/mockData';

export interface UserSession {
  fullName: string;
  age: number;
  phone: string;
  email: string;
  role: UserRole;
  isOnboarded: boolean;
  tenantPreferences?: {
    city: string;
    searchArea: string;
    moveInDate: string;
    budget: number;
    propertyType: string;
    bedrooms: number;
    amenities: string[];
    lifestyle: {
      sleepSchedule: string;
      cleanliness: string;
      cooking: string;
      guests: string;
      noise: string;
      social: string;
    };
  };
}

interface NestMateContextType {
  // User Session & Role
  user: UserSession;
  setUser: React.Dispatch<React.SetStateAction<UserSession>>;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnboarded: boolean;
  setIsOnboarded: (val: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (val: boolean) => void;
  showLandingPage: boolean;
  setShowLandingPage: (val: boolean) => void;
  loginAsDemoTenant: () => void;
  loginAsDemoLandlord: () => void;
  logoutToLanding: () => void;

  // Active Navigation Tab
  currentTab: string;
  setCurrentTab: (tab: string) => void;

  // Properties State
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string, e?: React.MouseEvent) => void;
  compareProperties: Property[];
  toggleCompareProperty: (property: Property, e?: React.MouseEvent) => void;
  clearCompare: () => void;
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;
  addNewProperty: (prop: Property) => void;

  // Maintenance Loop (Two-Way Sync)
  maintenanceTickets: MaintenanceTicket[];
  createMaintenanceTicket: (ticket: Partial<MaintenanceTicket>) => MaintenanceTicket;
  updateTicketStatus: (ticketId: string, status: MaintenanceTicket['status'], techInfo?: any, note?: string) => void;
  selectedTicketId: string;
  setSelectedTicketId: (id: string) => void;

  // Affordability Calculator Modal
  isAffordabilityModalOpen: boolean;
  setIsAffordabilityModalOpen: (open: boolean) => void;
  affordabilityProperty: Property | null;
  openAffordabilityCalculator: (property: Property) => void;

  // Rent Payment Simulation
  rentPaid: boolean;
  handlePayRent: () => void;
  showReceiptModal: boolean;
  setShowReceiptModal: (open: boolean) => void;

  // Modals & Panels
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isAddPropertyWizardOpen: boolean;
  setIsAddPropertyWizardOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Messaging
  messages: MessageThread[];
  sendMessage: (threadId: string, text: string) => void;

  // Roommates & LeaseLens
  roommates: RoommateProfile[];
  leaseClauses: LeaseClause[];
  expenseHistory: ExpenseRecord[];
}

const NestMateContext = createContext<NestMateContextType | undefined>(undefined);

export const NestMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session State: Starts NOT onboarded so users see the First Screen Login/Onboarding or Landing Page!
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  const [user, setUser] = useState<UserSession>({
    fullName: 'Het Patel',
    age: 24,
    phone: '+91 98250 12345',
    email: 'het.patel@nirma.edu.in',
    role: 'tenant',
    isOnboarded: false
  });

  const [currentTab, setCurrentTab] = useState<string>('explore');
  const [userRole, setUserRole] = useState<UserRole>('tenant');

  // Properties State
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(['prop-1']);
  const [compareProperties, setCompareProperties] = useState<Property[]>([MOCK_PROPERTIES[0], MOCK_PROPERTIES[1]]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // Maintenance Tickets State (Shared between Tenant & Landlord)
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(MOCK_MAINTENANCE_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(MOCK_MAINTENANCE_TICKETS[0].id);

  // Affordability Calculator Modal
  const [isAffordabilityModalOpen, setIsAffordabilityModalOpen] = useState(false);
  const [affordabilityProperty, setAffordabilityProperty] = useState<Property | null>(null);

  // Rent Payment Simulation
  const [rentPaid, setRentPaid] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Other Modals
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isAddPropertyWizardOpen, setIsAddPropertyWizardOpen] = useState(false);

  // Notifications & Messages
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [messages, setMessages] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);

  // Static/Mock References
  const roommates = MOCK_ROOMMATES;
  const leaseClauses = MOCK_LEASE_CLAUSES;
  const expenseHistory = MOCK_EXPENSE_HISTORY;

  // Add Notification Helper
  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Toggle Save Property
  const toggleSaveProperty = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPropertyIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle Compare Property (Max 3)
  const toggleCompareProperty = (property: Property, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const exists = compareProperties.some(p => p.id === property.id);
    if (exists) {
      setCompareProperties(prev => prev.filter(p => p.id !== property.id));
    } else {
      if (compareProperties.length < 3) {
        setCompareProperties(prev => [...prev, property]);
      } else {
        alert('You can compare up to 3 properties at a time.');
      }
    }
  };

  const clearCompare = () => {
    setCompareProperties([]);
  };

  // Open Affordability Calculator
  const openAffordabilityCalculator = (property: Property) => {
    setAffordabilityProperty(property);
    setIsAffordabilityModalOpen(true);
  };

  // Add New Property (from Landlord Wizard)
  const addNewProperty = (prop: Property) => {
    setProperties(prev => [prop, ...prev]);
    addNotification({
      title: 'Property Published Successfully',
      message: `${prop.title} is now live and discoverable on the NestMate map!`,
      type: 'system',
      priority: 'important',
      actionTab: 'explore'
    });
  };

  // Create Maintenance Ticket (Tenant Action)
  const createMaintenanceTicket = (ticketData: Partial<MaintenanceTicket>): MaintenanceTicket => {
    const newTicket: MaintenanceTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `MNT-${Math.floor(400 + Math.random() * 50)}`,
      title: ticketData.title || 'Maintenance Request',
      category: ticketData.category || 'Plumbing',
      unit: ticketData.unit || 'Flat 402, The Solitaire Terraces',
      locationInHouse: ticketData.locationInHouse || 'Main Bathroom / Sink Area',
      description: ticketData.description || 'Reported maintenance issue.',
      priority: ticketData.priority || 'High',
      status: 'Reported',
      reportedAt: 'Just now',
      photoUrl: ticketData.photoUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      technician: {
        name: 'Rahul Sharma',
        company: 'Rahul Sanitary & Home Services (Certified NestMate Partner)',
        rating: 4.9,
        phone: '+91 98250 44192',
        scheduledTime: 'Today · Pending Landlord SLA Confirmation',
        eta: 'Standby for dispatch',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
      },
      activityTimeline: [
        { time: 'Just now', title: 'Issue Reported', description: 'Tenant Het submitted issue via digital portal.', actor: 'Het (Tenant)', status: 'done' },
        { time: 'In 5m', title: 'Landlord & Property Manager Notified', description: 'Priority SLA ticket routed to Vastrapur zone.', actor: 'NestMate AI Dispatch', status: 'active' },
        { time: 'Upcoming', title: 'Technician Assignment', description: 'Contractor dispatch pending owner sign-off.', actor: 'Field Dispatch', status: 'pending' }
      ]
    };

    setMaintenanceTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);

    // Notify landlord
    addNotification({
      title: `New Maintenance Ticket: ${newTicket.title}`,
      message: `${newTicket.unit} reported ${newTicket.category} issue (${newTicket.priority} Priority).`,
      type: 'maintenance',
      priority: 'urgent',
      actionTab: 'dashboard'
    });

    return newTicket;
  };

  // Update Ticket Status (Landlord Action - updates live for tenant too!)
  const updateTicketStatus = (
    ticketId: string, 
    newStatus: MaintenanceTicket['status'], 
    techInfo?: any, 
    note?: string
  ) => {
    setMaintenanceTickets(prev => prev.map(ticket => {
      if (ticket.id !== ticketId) return ticket;

      const updatedTimeline = [...ticket.activityTimeline];
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (newStatus === 'Assigned') {
        updatedTimeline.push({
          time: nowTime,
          title: 'Technician Assigned by Landlord',
          description: `Assigned to ${techInfo?.name || 'Rahul Sharma (Rahul Services)'}. Dispatch scheduled.`,
          actor: 'Vikramaditya (Landlord)',
          status: 'done'
        });
      } else if (newStatus === 'Technician Scheduled') {
        updatedTimeline.push({
          time: nowTime,
          title: 'Appointment Scheduled',
          description: note || 'Technician confirmed arrival slot for Today 4:30 PM.',
          actor: 'Rahul Sharma',
          status: 'done'
        });
      } else if (newStatus === 'In Progress') {
        updatedTimeline.push({
          time: nowTime,
          title: 'Technician On Site',
          description: 'Technician arrived and began diagnostic/replacement work.',
          actor: 'Rahul Sharma',
          status: 'active'
        });
      } else if (newStatus === 'Resolved') {
        updatedTimeline.push({
          time: nowTime,
          title: 'Work Completed & Verified',
          description: note || 'All seals replaced, pressure tested at 4.2 bar. Zero leaks.',
          actor: 'Rahul Sharma (Certified)',
          status: 'done'
        });
      }

      return {
        ...ticket,
        status: newStatus,
        technician: techInfo ? { ...ticket.technician, ...techInfo } : ticket.technician,
        activityTimeline: updatedTimeline
      };
    }));

    // Send push notification
    addNotification({
      title: `Maintenance Update: ${newStatus}`,
      message: `Ticket #${ticketId.slice(-4)} updated to "${newStatus}".`,
      type: 'maintenance',
      priority: newStatus === 'Resolved' ? 'info' : 'important',
      actionTab: 'dashboard'
    });
  };

  // Pay Rent Action (Simulated)
  const handlePayRent = () => {
    setRentPaid(true);
    setShowReceiptModal(true);
    addNotification({
      title: 'Rent Cleared (0% Fee UPI)',
      message: '₹24,000 sent to Vikramaditya Sanghavi. Tax receipt #NMR-2026-09 logged.',
      type: 'rent',
      priority: 'important',
      actionTab: 'dashboard'
    });
  };

  // Mark notification read
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Send message
  const sendMessage = (threadId: string, text: string) => {
    if (!text.trim()) return;
    setMessages(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        lastMessage: text,
        timestamp: 'Just now',
        messages: [
          ...t.messages,
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            text,
            timestamp: 'Just now'
          }
        ]
      };
    }));
  };

  // 1-Click Demo Journey Presets for Judges
  const loginAsDemoTenant = () => {
    setUser({
      fullName: 'Het Patel',
      age: 24,
      phone: '+91 98250 12345',
      email: 'het.patel@nirma.edu.in',
      role: 'tenant',
      isOnboarded: true,
      tenantPreferences: {
        city: 'Ahmedabad',
        searchArea: 'Vastrapur',
        moveInDate: '1st of Next Month',
        budget: 30000,
        propertyType: '2 BHK',
        bedrooms: 2,
        amenities: ['High-speed Wi-Fi', 'Parking', 'AC', 'Power Backup'],
        lifestyle: {
          sleepSchedule: 'Early riser (6 AM)',
          cleanliness: 'Consistently clean',
          cooking: 'Cooks occasionally',
          guests: 'Weekends okay',
          noise: 'Quiet study hours',
          social: 'Balanced'
        }
      }
    });
    setUserRole('tenant');
    setIsOnboarded(true);
    setShowLandingPage(false);
    setShowOnboardingModal(false);
    setCurrentTab('explore');
  };

  const loginAsDemoLandlord = () => {
    setUser({
      fullName: 'Vikramaditya Sanghavi',
      age: 48,
      phone: '+91 98795 67890',
      email: 'vikram.sanghavi@apexrealty.in',
      role: 'landlord',
      isOnboarded: true
    });
    setUserRole('landlord');
    setIsOnboarded(true);
    setShowLandingPage(false);
    setShowOnboardingModal(false);
    setCurrentTab('dashboard');
  };

  const logoutToLanding = () => {
    setIsOnboarded(false);
    setShowLandingPage(true);
    setShowOnboardingModal(false);
  };

  return (
    <NestMateContext.Provider
      value={{
        user,
        setUser,
        userRole,
        setUserRole,
        isOnboarded,
        setIsOnboarded,
        showOnboardingModal,
        setShowOnboardingModal,
        showLandingPage,
        setShowLandingPage,
        loginAsDemoTenant,
        loginAsDemoLandlord,
        logoutToLanding,

        currentTab,
        setCurrentTab,

        properties,
        setProperties,
        savedPropertyIds,
        toggleSaveProperty,
        compareProperties,
        toggleCompareProperty,
        clearCompare,
        selectedProperty,
        setSelectedProperty,
        hoveredPropertyId,
        setHoveredPropertyId,
        addNewProperty,

        maintenanceTickets,
        createMaintenanceTicket,
        updateTicketStatus,
        selectedTicketId,
        setSelectedTicketId,

        isAffordabilityModalOpen,
        setIsAffordabilityModalOpen,
        affordabilityProperty,
        openAffordabilityCalculator,

        rentPaid,
        handlePayRent,
        showReceiptModal,
        setShowReceiptModal,

        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isAddPropertyWizardOpen,
        setIsAddPropertyWizardOpen,

        notifications,
        markNotificationRead,
        addNotification,

        messages,
        sendMessage,

        roommates,
        leaseClauses,
        expenseHistory
      }}
    >
      {children}
    </NestMateContext.Provider>
  );
};

export const useNestMate = () => {
  const context = useContext(NestMateContext);
  if (!context) {
    throw new Error('useNestMate must be used within a NestMateProvider');
  }
  return context;
};
