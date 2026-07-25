import React from 'react';
import { getStatusConfig } from '../../data/applicationStatusModel';
import { 
  FileEdit, Send, Inbox, Search, FileWarning, MessageCircleWarning,
  MapPin, CheckCircle, XCircle, Lock, ArrowLeftCircle, Slash, Clock
} from 'lucide-react';

export const TrackingSkeletons = {
  Timeline: () => (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-low shrink-0" />
          <div className="flex-1 space-y-2 py-2">
            <div className="h-4 bg-surface-container-low rounded w-1/3" />
            <div className="h-3 bg-surface-container-lowest rounded w-1/4" />
            <div className="h-16 bg-surface-container-lowest rounded-xl w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  ),
  Card: () => (
    <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant animate-pulse h-40" />
  )
};

const IconMap = {
  'file-edit': FileEdit,
  'send': Send,
  'inbox': Inbox,
  'search': Search,
  'file-warning': FileWarning,
  'message-circle-warning': MessageCircleWarning,
  'map-pin': MapPin,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'lock': Lock,
  'arrow-left-circle': ArrowLeftCircle,
  'slash': Slash
};

export const StatusBadge = ({ statusKey, className = '' }) => {
  const config = getStatusConfig(statusKey);
  const Icon = IconMap[config.icon] || Clock;

  const colorStyles = {
    neutral: 'bg-neutral-900/50 text-neutral-400 border-neutral-700',
    primary: 'bg-primary/10 text-primary border-primary/20',
    amber: 'bg-amber-950/50 text-amber-400 border-amber-500/20',
    red: 'bg-red-950/50 text-red-400 border-red-500/20',
    emerald: 'bg-emerald-950/50 text-emerald-400 border-emerald-500/20'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colorStyles[config.colorToken]} ${className}`}
      aria-label={`Status: ${config.label}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
