import React from 'react';

const CATEGORIES = [
  'All',
  'Agriculture',
  'Education',
  'Women and Child',
  'Employment',
  'Health',
  'Housing',
  'Pension',
  'Financial Assistance'
];

export default function SchemeCategoryChips({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            type="button"
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center ${
              isSelected
                ? 'bg-secondary-container text-on-secondary-container shadow-sm ring-2 ring-secondary/30'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
            aria-pressed={isSelected}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
