import React from 'react';

export function PageLoadingState() {
  return (
    <div className="p-8 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function PageEmptyState({ message = "No data available." }) {
  return (
    <div className="p-12 text-center text-gray-500 bg-gray-50 rounded border border-gray-200">
      <p>{message}</p>
    </div>
  );
}

export function PageErrorState({ error }) {
  return (
    <div className="p-6 bg-red-50 text-red-700 rounded border border-red-200">
      <h3 className="font-bold mb-2">Error Loading Data</h3>
      <p>{error?.message || 'An unknown error occurred.'}</p>
    </div>
  );
}

export function AccessDeniedState() {
  return (
    <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
      <p className="text-gray-600">You do not have the required permissions to view this module.</p>
    </div>
  );
}

export function FeatureDisabledState({ featureName }) {
  return (
    <div className="p-12 text-center bg-yellow-50 border border-yellow-200 rounded">
      <h2 className="text-xl font-bold text-yellow-800 mb-2">Feature Disabled</h2>
      <p className="text-yellow-700">The feature '{featureName}' is currently disabled in this environment.</p>
    </div>
  );
}
