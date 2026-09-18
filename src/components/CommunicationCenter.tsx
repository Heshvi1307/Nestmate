import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Wrench, 
  FileText, 
  User, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { MessageThread } from '../types';
import { MOCK_MESSAGE_THREADS } from '../data/mockData';

export const CommunicationCenter: React.FC = () => {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(MOCK_MESSAGE_THREADS[0].id);
  const [newReply, setNewReply] = useState('');

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMessage: newReply,
          timestamp: 'Just now',
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'user' as const,
              text: newReply,
              timestamp: 'Just now'
            }
          ]
        };
      }
      return t;
    });

    setThreads(updatedThreads);
    setNewReply('');
  };

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden flex flex-col md:flex-row h-[680px]">
      
      {/* Left Column: Thread List (4 cols) */}
      <div className="w-full md:w-80 border-r border-border flex flex-col bg-surface">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-text-primary">Communication Center</h3>
          </div>
          <span className="text-[10px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded-full">
            {threads.length} Channels
          </span>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {threads.map((thread) => {
            const isSelected = thread.id === activeThreadId;

            return (
              <div
                key={thread.id}
                onClick={() => setActiveThreadId(thread.id)}
                className={`p-3.5 transition-colors cursor-pointer flex items-start space-x-3 ${
                  isSelected ? 'bg-primary-light/50 border-l-4 border-primary' : 'hover:bg-surfaceMuted/50'
                }`}
              >
                <img
                  src={thread.avatar}
                  alt={thread.recipientName}
                  className="w-10 h-10 rounded-full object-cover border border-border flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-text-primary truncate">
                      {thread.recipientName}
                    </h4>
                    <span className="text-[10px] text-text-muted">{thread.timestamp}</span>
                  </div>
                  <span className="text-[10px] text-primary font-semibold block truncate">
                    {thread.recipientRole}
                  </span>
                  <p className="text-[11px] text-text-secondary truncate mt-0.5">
                    {thread.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Chat Stream & Embedded Workstream Context */}
      <div className="flex-1 flex flex-col bg-[#FAFBF9]">
        
        {/* Chat Header */}
        <div className="p-3.5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={activeThread.avatar}
              alt={activeThread.recipientName}
              className="w-9 h-9 rounded-full object-cover border border-border"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-xs text-text-primary">
                  {activeThread.recipientName}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[10px] text-text-muted">{activeThread.recipientRole}</span>
            </div>
          </div>

          <div className="text-[11px] text-text-muted">
            Direct Encrypted Line
          </div>
        </div>

        {/* Embedded Workstream Context Card (e.g. Maintenance Ticket or Lease) */}
        {activeThread.contextData && (
          <div className="m-3 p-3 bg-surface rounded-xl border border-primary/20 shadow-subtle flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                {activeThread.contextType === 'maintenance' ? (
                  <Wrench className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Contextual Reference
                </span>
                <span className="text-xs font-bold text-text-primary block">
                  {activeThread.contextData.title}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold block">
                  Status: {activeThread.contextData.status}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-1 rounded-md">
              Linked Ticket
            </span>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeThread.messages.map((m) => {
            const isUser = m.sender === 'user';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-primary text-white rounded-br-none shadow-subtle'
                      : 'bg-surface text-text-primary border border-border/80 rounded-bl-none shadow-subtle'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-text-muted mt-1 px-1">{m.timestamp}</span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendReply} className="p-3 bg-surface border-t border-border flex items-center space-x-2">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder={`Message ${activeThread.recipientName}...`}
            className="flex-1 py-2 px-3 rounded-xl bg-surfaceMuted/60 border border-border text-xs text-text-primary focus:outline-none focus:border-primary focus:bg-surface transition-all"
          />

          <button
            type="submit"
            disabled={!newReply.trim()}
            className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
