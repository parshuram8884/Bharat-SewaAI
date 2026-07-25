import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { environment } from '../../config/environment';

export default function DemoModeBanner() {
  const [compact, setCompact] = useState(false);

  if (!environment.isDev && environment.env !== 'production-demo') return null;

  if (compact) {
    return (
      <div 
        className="fixed bottom-4 right-4 bg-orange-600 text-white px-3 py-1.5 rounded shadow-lg cursor-pointer text-xs font-semibold z-50 flex items-center"
        onClick={() => setCompact(false)}
      >
        <Info className="w-4 h-4 mr-1" />
        Demo Mode
      </div>
    );
  }

  return (
    <div className="bg-orange-600 text-white relative z-50">
      <div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-orange-800">
              <Info className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p className="ml-3 font-medium truncate text-sm">
              <span className="md:hidden">Bharat Sewa AI — Demo Mode</span>
              <span className="hidden md:inline">
                <strong>Bharat Sewa AI — Demonstration Mode</strong>: Synthetic data only. No real government service, payment, identity, CSC, document or analytics system is connected.
              </span>
            </p>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              className="-mr-1 flex p-2 rounded-md hover:bg-orange-500 focus:outline-none sm:-mr-2 transition"
              onClick={() => setCompact(true)}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
