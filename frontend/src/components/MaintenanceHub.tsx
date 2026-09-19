import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  MessageSquare, 
  Phone, 
  ChevronRight, 
  X, 
  Camera, 
  ShieldCheck, 
  Check, 
  Calendar 
} from 'lucide-react';
import { MaintenanceTicket } from '../types';
import { useNestMate } from '../context/NestMateContext';

interface MaintenanceHubProps {
  onOpenMessageWithTechnician: () => void;
}

export const MaintenanceHub: React.FC<MaintenanceHubProps> = ({
  onOpenMessageWithTechnician
}) => {
  const { 
    maintenanceTickets: tickets, 
    createMaintenanceTicket, 
    selectedTicketId, 
    setSelectedTicketId 
  } = useNestMate();
  const [modalOpen, setModalOpen] = useState(false);

  // New ticket state
  const [category, setCategory] = useState<MaintenanceTicket['category']>('Plumbing');
  const [title, setTitle] = useState('');
  const [locationInHouse, setLocationInHouse] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('Medium');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || {
    id: 't-default',
    ticketNumber: 'MNT-402',
    title: 'Kitchen Sink Leak',
    category: 'Plumbing',
    unit: 'Flat 402, Green Residency',
    locationInHouse: 'Kitchen Sink Under-Pipe',
    description: 'Pipe joint seal has micro-fissure causing water seepage into modular cabinet.',
    priority: 'High',
    status: 'Reported',
    reportedAt: '09:12 AM',
    activityTimeline: []
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const created = createMaintenanceTicket({
      title,
      category,
      unit: 'Flat 402, The Solitaire Terraces, Vastrapur',
      locationInHouse: locationInHouse || 'Kitchen / Main Living Quarters',
      description,
      priority,
      photoUrl: photoPreview || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80'
    });

    setSelectedTicketId(created.id);
    setModalOpen(false);

    // Reset
    setTitle('');
    setLocationInHouse('');
    setDescription('');
    setPhotoPreview(null);
  };

  const getStatusStepIndex = (status: MaintenanceTicket['status']): number => {
    switch (status) {
      case 'Reported': return 0;
      case 'Assigned': return 1;
      case 'Technician Scheduled': return 2;
      case 'In Progress': return 3;
      case 'Resolved': return 4;
      default: return 0;
    }
  };

  const statusSteps = [
    'Reported',
    'Assigned',
    'Technician Scheduled',
    'In Progress',
    'Resolved'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-[#1B473A] text-white p-6 rounded-2xl shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
            Guaranteed Maintenance SLA (Max 4-Hour Response)
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">
            Something broken? We'll track it until it's fixed.
          </h2>
          <p className="text-xs text-zinc-200 mt-1 max-w-xl">
            No endless follow-ups or evasive owners. Every maintenance request is registered with verified timelines, contractor milestones, and sign-off accountability.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white text-primary hover:bg-zinc-100 font-extrabold text-xs shadow-elevated transition-all self-start sm:self-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* Main Split: Ticket List (Left) & Active Ticket Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tickets Queue (4 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
              Tickets for Flat 402 ({tickets.length})
            </span>
            <span className="text-[11px] text-text-muted">
              {tickets.filter(t => t.status !== 'Resolved').length} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {tickets.map((t) => {
              const isSelected = t.id === selectedTicketId;
              const isResolved = t.status === 'Resolved';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-surface border-primary ring-2 ring-primary/20 shadow-card'
                      : 'bg-surface hover:bg-surfaceMuted/60 border-border shadow-subtle'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                        #{t.ticketNumber} · {t.category}
                      </span>
                      <h4 className="font-bold text-xs text-text-primary mt-0.5 line-clamp-1">
                        {t.title}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isResolved 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary mt-1 line-clamp-1">
                    {t.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-text-muted">
                    <span>Reported: {t.reportedAt}</span>
                    <span className="font-semibold text-primary">View timeline →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Ticket Tracker & Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-border shadow-card p-5 sm:p-6 space-y-6">
          
          {/* Ticket Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-primary bg-primary-light px-2 py-0.5 rounded">
                  #{selectedTicket.ticketNumber}
                </span>
                <span className="text-xs font-semibold text-text-muted">
                  {selectedTicket.category} · Priority: {selectedTicket.priority}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mt-1">
                {selectedTicket.title}
              </h3>
              <span className="text-xs text-text-muted block mt-0.5">
                Location: {selectedTicket.locationInHouse} ({selectedTicket.unit})
              </span>
            </div>

            <button
              onClick={onOpenMessageWithTechnician}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold self-start sm:self-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message Technician</span>
            </button>
          </div>

          {/* 5-Step Visual State Machine Pipeline */}
          <div>
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-3">
              Resolution Pipeline
            </span>
            <div className="grid grid-cols-5 gap-1 text-center">
              {statusSteps.map((step, idx) => {
                const currentIdx = getStatusStepIndex(selectedTicket.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-all ${
                        isPassed
                          ? 'bg-primary text-white shadow-subtle'
                          : 'bg-surfaceMuted text-text-muted border border-border'
                      } ${isCurrent && !isPassed ? 'ring-2 ring-primary/30 animate-pulse' : ''}`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] leading-tight font-medium ${
                      isPassed ? 'text-primary font-bold' : 'text-text-muted'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technician Profile Card */}
          {selectedTicket.technician && (
            <div className="p-3.5 rounded-xl bg-[#F6F8F5] border border-border flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedTicket.technician.avatar}
                  alt={selectedTicket.technician.name}
                  className="w-12 h-12 rounded-full object-cover border border-border"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-text-primary">
                      {selectedTicket.technician.name}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      ⭐ {selectedTicket.technician.rating}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted block">
                    {selectedTicket.technician.company}
                  </span>
                  <span className="text-[11px] text-primary font-semibold block mt-0.5">
                    Scheduled: {selectedTicket.technician.scheduledTime} · ETA: {selectedTicket.technician.eta}
                  </span>
                </div>
              </div>

              <a
                href={`tel:${selectedTicket.technician.phone}`}
                className="p-2.5 rounded-xl bg-surface border border-border hover:bg-surfaceMuted text-text-primary text-xs font-bold flex items-center space-x-1 transition-colors"
                title="Call technician"
              >
                <Phone className="w-3.5 h-3.5 text-primary" />
              </a>
            </div>
          )}

          {/* Description & Photo Evidence */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Issue Diagnosis & Log
            </span>
            <p className="text-xs text-text-secondary leading-relaxed bg-surfaceMuted/40 p-3 rounded-xl border border-border">
              {selectedTicket.description}
            </p>
          </div>

          {/* ==================================================
              VISUAL ACTIVITY TIMELINE (TIMESTAMPED AUDIT LOG)
              ================================================== */}
          <div>
            <span className="text-xs font-bold text-text-primary uppercase tracking-wider block mb-3">
              Verified Real-Time Activity Log
            </span>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {selectedTicket.activityTimeline.map((log, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    log.status === 'done'
                      ? 'bg-success'
                      : log.status === 'active'
                        ? 'bg-primary ring-2 ring-primary/40 animate-pulse'
                        : 'bg-border'
                  }`} />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-primary">{log.title}</span>
                    <span className="text-[11px] text-text-muted font-mono">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5">{log.description}</p>
                  <span className="text-[10px] text-text-muted italic block mt-0.5">By {log.actor}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Report An Issue Modal Wizard */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-elevated border border-border p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-base text-text-primary">
                  Report a Maintenance Issue
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              
              {/* Category selector */}
              <div>
                <label className="font-bold text-text-muted uppercase tracking-wider block mb-1.5">
                  Select Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Plumbing', 'Electrical', 'Appliance', 'Internet', 'Furniture', 'Other'] as MaintenanceTicket['category'][]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-2 rounded-xl font-semibold border text-center transition-all ${
                        category === cat ? 'bg-primary text-white border-primary shadow-subtle' : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master bathroom geyser not heating water"
                  className="w-full p-2.5 rounded-xl border border-border bg-surfaceMuted/40 text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Location in House */}
              <div>
                <label className="font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Specific Location
                </label>
                <input
                  type="text"
                  value={locationInHouse}
                  onChange={(e) => setLocationInHouse(e.target.value)}
                  placeholder="e.g. Master Bedroom Attached Bathroom"
                  className="w-full p-2.5 rounded-xl border border-border bg-surfaceMuted/40 text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe when it happens, noises, or visual leaks..."
                  className="w-full p-2.5 rounded-xl border border-border bg-surfaceMuted/40 text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="font-bold text-text-muted uppercase tracking-wider block mb-1">
                  Priority Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Low', 'Medium', 'High', 'Emergency'] as MaintenanceTicket['priority'][]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`p-2 rounded-xl font-bold border text-center transition-all ${
                        priority === p ? 'bg-primary text-white border-primary shadow-subtle' : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-secondary hover:bg-surfaceMuted font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold shadow-card"
                >
                  Submit Maintenance Ticket
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
