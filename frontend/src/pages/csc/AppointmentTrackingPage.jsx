import React from 'react';
import { useCitizenAppointments, useCheckInAppointment } from '../../hooks/useAppointmentQuery';

export default function AppointmentTrackingPage() {
  const { data: appointments, isLoading } = useCitizenAppointments();
  const checkInMutation = useCheckInAppointment();

  if (isLoading) return <div className="p-8">Loading appointments...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
      <div className="space-y-4">
        {appointments?.length === 0 ? <p>No appointments found.</p> : appointments?.map(a => (
          <div key={a.id} className="p-4 border rounded shadow bg-white flex justify-between items-center">
            <div>
              <div className="font-semibold">{a.id} - {a.date}</div>
              <div className="text-sm text-gray-600">Status: <span className="font-medium text-blue-600">{a.status}</span></div>
            </div>
            {a.status === 'confirmed' && (
              <button 
                onClick={() => checkInMutation.mutate(a.id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Check-in
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
