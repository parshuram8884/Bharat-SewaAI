import React from 'react';
import { useOpenDataCatalogue, usePublishOpenData } from '../../../hooks/useOpenDataQuery';

export default function OpenDataDatasetListPage() {
  const { data: datasets, isLoading } = useOpenDataCatalogue();
  const pubMutation = usePublishOpenData();

  if (isLoading) return <div className="p-8">Loading catalogue...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Open Data Catalogue</h1>
      <button 
         onClick={() => openDataService.createOpenDataDatasetDraft({ title: 'New Open Data' })}
         className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded"
      >
         Create Draft (Console only for demo)
      </button>
      <div className="space-y-4">
        {datasets?.map(d => (
          <div key={d.id} className="p-4 border rounded bg-white shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{d.title}</h3>
              <p className="text-sm text-gray-600">Status: {d.publicationStatus}</p>
            </div>
            {d.publicationStatus === 'approved' && (
              <button 
                onClick={() => pubMutation.mutate(d.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Publish Demo
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

