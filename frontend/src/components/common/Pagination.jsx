import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex items-center justify-between gap-4 py-3 text-sm ${className}`}>
      <span className="text-on-surface-variant font-medium">
        Page <span className="text-on-surface font-bold">{currentPage}</span> of <span className="text-on-surface font-bold">{totalPages}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              'px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer text-xs',
              currentPage === page
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface'
            )}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
