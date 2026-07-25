import React from 'react';

export default function DynamicApplicationField({ field, value, onChange, error }) {
  const { id, type, label, required, placeholder, options, value: readOnlyVal } = field;

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="text-xs font-bold text-primary flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-600">*</span>}
        </span>
      </label>

      {type === 'text' && (
        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[44px] px-3 py-2 bg-surface-container rounded-xl border border-outline-variant text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        />
      )}

      {type === 'number' && (
        <input
          id={id}
          type="number"
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          className="w-full min-h-[44px] px-3 py-2 bg-surface-container rounded-xl border border-outline-variant text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        />
      )}

      {type === 'single-select' && (
        <select
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[44px] px-3 py-2 bg-surface-container rounded-xl border border-outline-variant text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">Select an option</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'yes-no' && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`flex-1 min-h-[44px] rounded-xl font-bold text-xs border transition-all ${
              value === true
                ? 'bg-secondary-container text-on-secondary-container border-secondary ring-1 ring-secondary'
                : 'bg-surface-container border-outline-variant text-on-surface'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={`flex-1 min-h-[44px] rounded-xl font-bold text-xs border transition-all ${
              value === false
                ? 'bg-secondary-container text-on-secondary-container border-secondary ring-1 ring-secondary'
                : 'bg-surface-container border-outline-variant text-on-surface'
            }`}
          >
            No
          </button>
        </div>
      )}

      {type === 'radio' && (
        <div className="flex gap-3 flex-wrap">
          {options?.map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 min-w-[120px] min-h-[44px] px-3 py-2 rounded-xl border font-bold text-xs flex items-center justify-center cursor-pointer transition-all ${
                value === opt.value
                  ? 'bg-secondary-container text-on-secondary-container border-secondary'
                  : 'bg-surface-container border-outline-variant text-on-surface'
              }`}
            >
              <input
                type="radio"
                name={id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {type === 'checkbox' && (
        <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-surface-container rounded-xl border border-outline-variant">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded text-primary mt-0.5"
          />
          <span className="text-xs font-semibold text-on-surface leading-relaxed">{label}</span>
        </label>
      )}

      {type === 'date' && (
        <input
          id={id}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[44px] px-3 py-2 bg-surface-container rounded-xl border border-outline-variant text-xs md:text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        />
      )}

      {type === 'masked-identifier' && (
        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'XXXX-XXXX-1234'}
          className="w-full min-h-[44px] px-3 py-2 bg-surface-container rounded-xl border border-outline-variant text-xs md:text-sm font-mono font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
        />
      )}

      {type === 'profile-confirm' && (
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant flex items-center justify-between">
          <span className="text-xs font-semibold text-primary">Pre-verified from Citizen Profile</span>
          <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold uppercase">Verified</span>
        </div>
      )}

      {type === 'read-only' && (
        <div className="p-3 bg-surface-container rounded-xl border border-outline-variant font-mono text-xs text-primary font-bold">
          {readOnlyVal || value}
        </div>
      )}

      {error && <p className="text-[11px] font-bold text-red-600 mt-1">{error}</p>}
    </div>
  );
}
