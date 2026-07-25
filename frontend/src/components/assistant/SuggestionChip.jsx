import React from 'react';

export default function SuggestionChip({ label, onClick, icon: Icon }) {
  return (
    <button
      onClick={() => onClick(label)}
      type="button"
      className="flex-shrink-0 px-3 py-1.5 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant rounded-full text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/40 transition-all active:scale-95"
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-primary" />}
      <span>{label}</span>
    </button>
  );
}
