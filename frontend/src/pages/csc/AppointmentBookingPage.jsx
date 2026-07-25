import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBookAppointment } from '../../hooks/useAppointmentQuery';
import { useCscServices } from '../../hooks/useCscQuery';

export default function AppointmentBookingPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(useLocation().search);
  const centreId = searchParams.get('centreId');
  const { data: services } = useCscServices();
  const bookMutation = useBookAppointment();
  
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  
  const handleBook = () => {
    if (!serviceId || !date) return alert("Select service and date");
    bookMutation.mutate(
      { centreId, serviceId, date, slotId: `${date}-1000` },
      { onSuccess: () => navigate('/csc/appointments') }
    );
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service</label>
          <select className="w-full border p-2 rounded" value={serviceId} onChange={e => setServiceId(e.target.value)}>
            <option value="">Select a service</option>
            {services?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full border p-2 rounded" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <button onClick={handleBook} disabled={bookMutation.isLoading} className="w-full bg-blue-600 text-white p-2 rounded mt-4">
          {bookMutation.isLoading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </div>
    </div>
  );
}
