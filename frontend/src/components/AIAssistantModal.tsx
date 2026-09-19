import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  IndianRupee, 
  FileText, 
  Wrench, 
  CheckCircle2,
  ExternalLink,
  MapPin,
  Check
} from 'lucide-react';
import { Property } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'nora';
  text: string;
  timestamp: string;
  cardType?: 'property_matches' | 'true_cost_calc' | 'clause_explainer' | 'maintenance_action' | 'checklist';
  cardData?: any;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  onSelectProperty?: (property: Property) => void;
  properties: Property[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onSelectProperty,
  properties
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'nora',
      text: 'Namaste! I am NORA, your personal housing concierge on NESTORA. How can I help make renting transparent and effortless today?',
      timestamp: 'Just now',
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    "Find a place near my college under ₹20k",
    "What will I actually spend every month?",
    "Explain the lock-in clause in standard rental agreements",
    "My kitchen sink is leaking — what should I do?",
    "Find roommates with similar lifestyle preferences",
    "What documents do I need before moving in?"
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI reasoning simulation with structured card generation
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let noraReply: Message;

      if (lower.includes('college') || lower.includes('university') || lower.includes('under 20k') || lower.includes('20,000')) {
        noraReply = {
          id: `nora-${Date.now()}`,
          sender: 'nora',
          text: 'I analyzed verified listings near Nirma University and Gujarat University within your ₹20,000 budget constraint. Here are top verified options:',
          timestamp: 'Just now',
          cardType: 'property_matches',
          cardData: {
            title: 'Found 2 High-Synergy Verified Spaces',
            budgetMax: '₹20,000 / mo',
            distance: '≤ 15 mins to campus',
            matchesCount: 2,
            properties: properties.filter(p => p.totalEstimatedMonthly <= 22000).slice(0, 2)
          }
        };
      } else if (lower.includes('spend every month') || lower.includes('cost') || lower.includes('expense')) {
        noraReply = {
          id: `nora-${Date.now()}`,
          sender: 'nora',
          text: 'At NESTORA, we eliminate hidden-cost anxiety through TrueCost™. A standard base rent of ₹24,000 typically translates to ~₹28,600 in total monthly living expenses. Here is the realistic breakdown:',
          timestamp: 'Just now',
          cardType: 'true_cost_calc',
          cardData: {
            baseRent: 24000,
            utilities: 2800,
            maintenance: 1200,
            internet: 600,
            total: 28600,
            deposit: 48000,
            moveIn: 76600
          }
        };
      } else if (lower.includes('lock-in') || lower.includes('agreement') || lower.includes('lease') || lower.includes('clause')) {
        noraReply = {
          id: `nora-${Date.now()}`,
          sender: 'nora',
          text: 'In our LeaseLens analyzer, a Lock-in Period requires both tenant and landlord to commit to a minimum tenure (commonly 6 months) without penalty.',
          timestamp: 'Just now',
          cardType: 'clause_explainer',
          cardData: {
            clauseName: 'Clause 7.2: Lock-in Period & Penalty',
            plainEnglish: 'If you leave voluntarily before 6 months, you forfeit 1 month rent. However, verified corporate transfers and medical emergencies are protected.',
            clarificationTip: 'Always ask the owner if semester breaks or college transfer letters waive this clause.'
          }
        };
      } else if (lower.includes('sink') || lower.includes('leak') || lower.includes('broken') || lower.includes('maintenance')) {
        noraReply = {
          id: `nora-${Date.now()}`,
          sender: 'nora',
          text: 'Plumbing leaks are treated with High Urgency on NESTORA. You already have an active ticket tracked live with Rahul Services!',
          timestamp: 'Just now',
          cardType: 'maintenance_action',
          cardData: {
            ticketNumber: 'MNT-402',
            issue: 'Kitchen Sink Under-Pipe Seepage',
            status: 'Technician En Route (ETA 4:30 PM)',
            technician: 'Rahul Sharma (Plumbing Specialist)'
          }
        };
      } else if (lower.includes('documents') || lower.includes('move in') || lower.includes('moving in')) {
        noraReply = {
          id: `nora-${Date.now()}`,
          sender: 'nora',
          text: 'Here is your frictionless NESTORA Digital Move-In Checklist to guarantee 100% security deposit safety:',
          timestamp: 'Just now',
          cardType: 'checklist',
          cardData: {
            items: [
              'Government ID (Aadhaar / Passport) verified on portal',
              'LeaseLens Digital Agreement executed with e-sign',
              'Sub-meter initial reading logged with timestamped photo',
              'Key handover video & society security entry card'
            ]
          }
        };
      } else {
        noraReply = {
          id: `nora-${Date.now()}`,
          sender: 'nora',
          text: `I understand you are asking about "${textToSend}". I can help you search verified apartments, compare living costs, find lifestyle-matched flatmates, or dissect any rental agreement clause on LeaseLens. Where shall we start?`,
          timestamp: 'Just now'
        };
      }

      setMessages(prev => [...prev, noraReply]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      
      <div className="w-full max-w-lg bg-surface h-full shadow-dropdown flex flex-col animate-in slide-in-from-right duration-250 border-l border-border">
        
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-subtle">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm text-text-primary">NORA</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-text-muted">Your PropTech Housing Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none shadow-subtle'
                    : 'bg-[#F3F5F2] text-text-primary rounded-bl-none border border-border/80'
                }`}
              >
                {msg.text}
              </div>

              {/* Structured Card Renderings */}
              {msg.cardType === 'property_matches' && msg.cardData && (
                <div className="w-full max-w-[90%] mt-2.5 bg-surface border border-primary/25 rounded-2xl p-3.5 shadow-card space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-primary pb-1.5 border-b border-border">
                    <span>{msg.cardData.title}</span>
                    <span className="text-[10px] bg-primary-light px-2 py-0.5 rounded">
                      {msg.cardData.matchesCount} listings
                    </span>
                  </div>

                  <div className="space-y-2">
                    {msg.cardData.properties.map((p: Property) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (onSelectProperty) onSelectProperty(p);
                          onClose();
                        }}
                        className="flex items-center space-x-2.5 p-2 rounded-xl bg-surfaceMuted/50 hover:bg-primary-light/40 border border-border cursor-pointer transition-colors"
                      >
                        <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-xs text-text-primary truncate">{p.title}</h5>
                          <span className="text-[10px] text-text-muted">{p.neighborhood} · {p.propertyType}</span>
                          <span className="block text-xs font-extrabold text-primary">₹{p.totalEstimatedMonthly.toLocaleString('en-IN')}/mo TrueCost</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onNavigateToTab('explore');
                      onClose();
                    }}
                    className="w-full py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors text-center block"
                  >
                    View All Matching Spaces →
                  </button>
                </div>
              )}

              {msg.cardType === 'true_cost_calc' && msg.cardData && (
                <div className="w-full max-w-[90%] mt-2.5 bg-surface border border-border rounded-2xl p-3.5 shadow-card space-y-2 text-xs">
                  <div className="font-bold text-text-primary pb-1 border-b border-border flex items-center justify-between">
                    <span>Monthly TrueCost™ Breakdown</span>
                    <span className="text-primary font-black">₹{msg.cardData.total.toLocaleString('en-IN')}/mo</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-text-secondary">
                    <div className="flex justify-between">
                      <span>Base Rent:</span>
                      <span className="font-bold text-text-primary">₹{msg.cardData.baseRent.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Utilities (Power/Gas/Water):</span>
                      <span className="font-bold text-text-primary">₹{msg.cardData.utilities.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Society Maintenance:</span>
                      <span className="font-bold text-text-primary">₹{msg.cardData.maintenance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fiber Internet:</span>
                      <span className="font-bold text-text-primary">₹{msg.cardData.internet.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                    <span className="text-text-muted">Total Move-In Capital:</span>
                    <span className="font-bold text-text-primary">₹{msg.cardData.moveIn.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {msg.cardType === 'clause_explainer' && msg.cardData && (
                <div className="w-full max-w-[90%] mt-2.5 bg-surface border border-border rounded-2xl p-3.5 shadow-card space-y-2 text-xs">
                  <div className="font-bold text-text-primary pb-1 border-b border-border">
                    {msg.cardData.clauseName}
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {msg.cardData.plainEnglish}
                  </p>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-900 text-[10px]">
                    <strong>Tip:</strong> {msg.cardData.clarificationTip}
                  </div>
                  <button
                    onClick={() => {
                      onNavigateToTab('leaselens');
                      onClose();
                    }}
                    className="text-xs font-bold text-primary hover:underline block text-right pt-1"
                  >
                    Open in LeaseLens Agreement Reader →
                  </button>
                </div>
              )}

              {msg.cardType === 'maintenance_action' && msg.cardData && (
                <div className="w-full max-w-[90%] mt-2.5 bg-surface border border-border rounded-2xl p-3.5 shadow-card space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-text-primary pb-1 border-b border-border">
                    <span>Ticket #{msg.cardData.ticketNumber}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      In Progress
                    </span>
                  </div>
                  <p className="text-text-primary font-semibold">{msg.cardData.issue}</p>
                  <p className="text-[11px] text-emerald-800 font-medium">✓ {msg.cardData.status}</p>
                  <p className="text-[10px] text-text-muted">Technician: {msg.cardData.technician}</p>
                  <button
                    onClick={() => {
                      onNavigateToTab('dashboard');
                      onClose();
                    }}
                    className="w-full py-1.5 rounded-lg bg-primary text-white text-xs font-bold text-center block mt-1"
                  >
                    View Maintenance Activity Timeline →
                  </button>
                </div>
              )}

              {msg.cardType === 'checklist' && msg.cardData && (
                <div className="w-full max-w-[90%] mt-2.5 bg-surface border border-border rounded-2xl p-3.5 shadow-card space-y-2 text-xs">
                  <span className="font-bold text-text-primary block pb-1 border-b border-border">
                    Pre-Move-In Verification Steps
                  </span>
                  <div className="space-y-1.5">
                    {msg.cardData.items.map((it: string, i: number) => (
                      <div key={i} className="flex items-start space-x-2 text-[11px] text-text-secondary">
                        <Check className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span className="text-[9px] text-text-muted mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-1.5 bg-[#F3F5F2] text-text-muted p-2.5 rounded-2xl w-20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="p-3 border-t border-border bg-surfaceMuted/40 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          {quickPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary/40 transition-colors flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-border bg-surface flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputText);
            }}
            placeholder="Ask NORA anything about properties, leases, costs..."
            className="flex-1 py-2.5 px-3 rounded-xl bg-surfaceMuted/80 border border-border text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface transition-all"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
