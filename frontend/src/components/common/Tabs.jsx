import React from 'react';
import { clsx } from 'clsx';

export function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex items-center gap-2 border-b border-outline-variant/40 overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === (tab.id || tab.value || tab.label);
        const tabValue = tab.id || tab.value || tab.label;
        return (
          <button
            key={tabValue}
            onClick={() => onChange(tabValue)}
            className={clsx(
              'px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] cursor-pointer flex items-center gap-2',
              isActive
                ? 'border-primary text-primary font-bold bg-primary-fixed/20 rounded-t-lg'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50 rounded-t-lg'
            )}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            <span>{tab.label || tab}</span>
            {tab.count !== undefined && (
              <span className={clsx('px-2 py-0.5 rounded-full text-xs font-bold', isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant')}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
