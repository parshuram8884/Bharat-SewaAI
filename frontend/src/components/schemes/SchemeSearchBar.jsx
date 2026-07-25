import React from 'react';
import { Search, X } from 'lucide-react';

export default function SchemeSearchBar({ value, onChange, onClear, placeholder = 'Search schemes, benefits or departments' }) {
  return (
    <div className="relative w-full">
      <label htmlFor="scheme-search-input" className="sr-only">
        Search schemes
      </label>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
      <input
        id="scheme-search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[44px] pl-10 pr-9 py-2.5 bg-surface-container rounded-xl text-sm font-normal text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary border-none shadow-inner transition-all"
      />
      {value && (
        <button
          onClick={onClear}
          type="button"
          aria-label="Clear search query"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-primary rounded-full min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
