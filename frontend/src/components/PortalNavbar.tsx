import React, { useState } from 'react';
import { 
  Compass, 
  Users, 
  FileText, 
  LayoutDashboard, 
  ShieldCheck, 
  Bell, 
  Heart, 
  Sparkles, 
  Scale, 
  Menu, 
  X, 
  ChevronDown,
  Building,
  CheckCircle2,
  Clock,
  Wrench,
  Calculator
} from 'lucide-react';
import { UserRole, NotificationItem } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  savedCount: number;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenAIAssistant: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  savedCount,
  compareCount,
  onOpenCompare,
  onOpenAIAssistant,
  notifications,
  onMarkNotificationRead
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { title: string; subtitle: string; badge: string }> = {
    tenant: { title: 'Het Patel', subtitle: 'Tenant View', badge: 'Tenant' },
    landlord: { title: 'Vikramaditya S.', subtitle: '3 Properties', badge: 'Owner' },
    property_manager: { title: 'Pooja Trivedi', subtitle: '18 Properties', badge: 'Prop Manager' }
  };

  const navLinks = [
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'lease-guard', label: 'Lease Guard', icon: FileText, badge: 'P1' },
    { id: 'harmony-match', label: 'Roommates', icon: Users, badge: 'P2' },
    { id: 'snapfix', label: 'SnapFix', icon: Wrench, badge: 'P3' },
    { id: 'truecost', label: 'TrueCost', icon: Calculator, badge: 'P4' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trust', label: 'Trust Center', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-[#F7F7F4]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setCurrentTab('explore')}
            className="flex items-center space-x-2.5 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-surface shadow-subtle group-hover:bg-primary-hover transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18V8.5L12 3.5L20 8.5V18H15V12H9V18H4Z" fill="#F7F7F4"/>
                <circle cx="12" cy="9.5" r="1.8" fill="#78A892"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-text-primary group-hover:text-primary transition-colors">
                  NESTMATE
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-primary-light text-primary border border-primary/20 rounded">
                  AI
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-text-muted uppercase tracking-widest font-semibold -mt-0.5">
                Transparent Living & Legal Guard
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 pl-3 border-l border-border">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surfaceMuted'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-surfaceMuted text-text-muted'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            disabled={compareCount === 0}
            className={`relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              compareCount > 0
                ? 'bg-surface text-primary border-primary/30 hover:border-primary shadow-subtle cursor-pointer'
                : 'bg-transparent text-text-muted border-border cursor-not-allowed opacity-60'
            }`}
            title="Compare selected properties"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </button>

          {/* AI Assistant NORA Launcher */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-light text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-subtle group"
          >
            <Sparkles className="w-3.5 h-3.5 text-secondary group-hover:text-white transition-colors" />
            <span>Ask NORA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surfaceMuted transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warning ring-2 ring-background"></span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-xl shadow-dropdown border border-border p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-text-primary">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-primary-light text-primary font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-text-muted">Live activity</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-border/60">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.actionTab) {
                          setCurrentTab(notif.actionTab);
                          setNotifDropdownOpen(false);
                        }
                      }}
                      className={`pt-2 first:pt-0 p-2 rounded-lg cursor-pointer transition-colors ${
                        notif.read ? 'hover:bg-surfaceMuted' : 'bg-primary-light/40 hover:bg-primary-light/70'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-1.5">
                          {notif.priority === 'urgent' && (
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          )}
                          <p className="text-xs font-semibold text-text-primary">{notif.title}</p>
                        </div>
                        <span className="text-[10px] text-text-muted whitespace-nowrap ml-2">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                        {notif.message}
                      </p>
                      {notif.actionLabel && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-primary hover:underline">
                          {notif.actionLabel} →
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setNotifDropdownOpen(false);
              }}
              className="flex items-center space-x-2 pl-2.5 pr-2 py-1.5 rounded-lg border border-border bg-surface hover:border-primary/40 text-left transition-all shadow-subtle focus:outline-none"
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                {userRole === 'tenant' ? 'H' : userRole === 'landlord' ? 'V' : 'P'}
              </div>
              <div className="hidden xl:block text-left pr-1 leading-none">
                <span className="text-xs font-bold text-text-primary block">
                  {roleLabels[userRole].title}
                </span>
                <span className="text-[10px] text-text-muted block mt-0.5">
                  {roleLabels[userRole].subtitle}
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-surfaceMuted text-text-secondary px-1.5 py-0.5 rounded">
                {roleLabels[userRole].badge}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            </button>

            {/* Role Dropdown Menu */}
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-xl shadow-dropdown border border-border p-2 z-50 animate-in fade-in duration-150">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Switch Persona / View
                </div>
                <div className="space-y-1">
                  {(['tenant', 'landlord', 'property_manager'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setUserRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                        userRole === role 
                          ? 'bg-primary-light text-primary font-bold' 
                          : 'text-text-primary hover:bg-surfaceMuted'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{roleLabels[role].title}</div>
                        <div className="text-[10px] text-text-muted">{roleLabels[role].subtitle}</div>
                      </div>
                      {userRole === role && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-border px-2 text-[10px] text-text-muted leading-tight">
                  NESTORA adapts dashboards and permissions dynamically based on role.
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surfaceMuted transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 pt-3 pb-5 space-y-2 shadow-card animate-in slide-in-from-top duration-200">
          <div className="text-[10px] uppercase font-bold text-text-muted tracking-wider px-2 pt-1">
            Navigation
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-secondary hover:bg-surfaceMuted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted">Active Role:</span>
            <span className="text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
              {roleLabels[userRole].title} ({roleLabels[userRole].badge})
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
