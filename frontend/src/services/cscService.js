import { permissionService } from './permissionService';

export const cscService = {
  getCentres() {
    return JSON.parse(localStorage.getItem('csc_centres') || '[]');
  },

  getCentre(centreId) {
    return this.getCentres().find(c => c.id === centreId);
  },

  getServices() {
    return JSON.parse(localStorage.getItem('csc_services') || '[]');
  },

  getService(serviceId) {
    return this.getServices().find(s => s.id === serviceId);
  },

  checkAvailability(centreId, serviceId, date) {
    // Mock availability logic
    const centre = this.getCentre(centreId);
    if (!centre || !centre.active) throw new Error("Centre inactive");
    const service = this.getService(serviceId);
    if (!service || !service.active) throw new Error("Service inactive");
    
    return [
      { slotId: `${date}-1000`, time: '10:00 AM', capacity: 5, booked: 0 },
      { slotId: `${date}-1100`, time: '11:00 AM', capacity: 5, booked: 5 }, // Full
      { slotId: `${date}-1400`, time: '02:00 PM', capacity: 5, booked: 2 }
    ];
  }
};
