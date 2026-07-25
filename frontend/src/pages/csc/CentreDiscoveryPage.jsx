import React from 'react';
import { useCscCentres } from '../../hooks/useCscQuery';
import { Link } from 'react-router-dom';

export default function CentreDiscoveryPage() {
  const { data: centres, isLoading } = useCscCentres();

  if (isLoading) return <div className="p-8">Loading centres...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Discover Nearby CSC Centres</h1>
      <div className="grid gap-4">
        {centres?.map(c => (
          <div key={c.id} className="p-4 border rounded shadow flex justify-between items-center bg-white">
            <div>
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-sm text-gray-600">{c.location} | {c.type}</p>
            </div>
            <Link to={`/csc/book?centreId=${c.id}`} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Book
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
