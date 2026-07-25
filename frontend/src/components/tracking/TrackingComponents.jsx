import React from 'react';
import { getStatusConfig } from '../../data/applicationStatusModel';
import { Check, Circle, Clock } from 'lucide-react';
import { StatusBadge } from './TrackingSkeletons';

export const StatusProgress = ({ currentStatus }) => {
  const steps = [
    { key: 'submitted', label: 'Submitted' },
    { key: 'under-review', label: 'Reviewing' },
    { key: 'field-verification', label: 'Verifying' },
    { key: 'approved', label: 'Completed' }
  ];

  let activeIndex = 0;
  if (['received', 'under-review', 'documents-requested', 'clarification-requested'].includes(currentStatus)) activeIndex = 1;
  else if (currentStatus === 'field-verification') activeIndex = 2;
  else if (['approved', 'rejected', 'closed', 'withdrawn', 'cancelled'].includes(currentStatus)) activeIndex = 3;

  return (
    <div className="flex items-center justify-between relative w-full max-w-lg mx-auto">
      <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-container-low -z-10" />
      <div 
        className="absolute top-4 left-4 h-0.5 bg-primary -z-10 transition-all duration-500" 
        style={{ width: `calc(${(activeIndex / (steps.length - 1)) * 100}% - 2rem)` }} 
      />

      {steps.map((step, idx) => {
        const isCompleted = idx < activeIndex || (idx === activeIndex && currentStatus === 'approved');
        const isActive = idx === activeIndex && currentStatus !== 'approved' && currentStatus !== 'rejected';
        const isError = idx === activeIndex && currentStatus === 'rejected';

        return (
          <div key={step.key} className="flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-background ${
              isCompleted ? 'border-primary text-primary' : 
              isActive ? 'border-primary text-primary ring-4 ring-primary/20' : 
              isError ? 'border-red-500 text-red-500' : 'border-outline text-on-surface-variant'
            }`}>
              {isCompleted ? <Check className="w-4 h-4" /> : 
               isActive ? <Circle className="w-2.5 h-2.5 fill-current" /> : 
               isError ? <Clock className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive || isCompleted ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const TimelineItem = ({ item, isLast }) => {
  const isCitizen = item.actorType === 'citizen';
  
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
          isCitizen ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-container-low border-outline-variant text-on-surface-variant'
        }`}>
          {isCitizen ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-surface-container-low my-2" />}
      </div>
      
      <div className="flex-1 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
          <span className="text-xs text-on-surface-variant">
            {new Date(item.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{item.description}</p>
        
        {item.status && item.status !== 'draft' && (
          <StatusBadge statusKey={item.status} className="scale-90 origin-left" />
        )}
      </div>
    </div>
  );
};
