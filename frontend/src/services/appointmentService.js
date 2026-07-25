import { AppointmentStatus } from '../data/appointmentStatusModel';

export const appointmentService = {
  getAppointments() {
    return JSON.parse(localStorage.getItem('csc_appointments') || '[]');
  },

  saveAppointments(appointments) {
    localStorage.setItem('csc_appointments', JSON.stringify(appointments));
  },

  bookAppointment(citizenId, centreId, serviceId, date, slotId) {
    const apps = this.getAppointments();
    
    // Check for existing active appointment for same citizen
    const existing = apps.find(a => a.citizenId === citizenId && [AppointmentStatus.REQUESTED, AppointmentStatus.CONFIRMED].includes(a.status));
    if (existing) throw new Error("Citizen already has an active appointment.");

    const newApp = {
      id: `BSAI-APT-${Date.now()}`,
      citizenId,
      centreId,
      serviceId,
      date,
      slotId,
      status: AppointmentStatus.CONFIRMED, // Skipping hold state for basic demo
      history: [
        { status: AppointmentStatus.CONFIRMED, timestamp: new Date().toISOString(), note: 'Booked by citizen' }
      ]
    };
    apps.push(newApp);
    this.saveAppointments(apps);
    return newApp;
  },

  getCitizenAppointments(citizenId) {
    return this.getAppointments().filter(a => a.citizenId === citizenId);
  },

  cancelAppointment(citizenId, appointmentId) {
    const apps = this.getAppointments();
    const app = apps.find(a => a.id === appointmentId);
    if (!app) throw new Error("Not found");
    if (app.citizenId !== citizenId) throw new Error("Unauthorized");
    
    app.status = AppointmentStatus.CANCELLED;
    app.history.push({ status: AppointmentStatus.CANCELLED, timestamp: new Date().toISOString(), note: 'Cancelled by citizen' });
    this.saveAppointments(apps);
    return app;
  },

  checkIn(citizenId, appointmentId) {
    const apps = this.getAppointments();
    const app = apps.find(a => a.id === appointmentId);
    if (!app) throw new Error("Not found");
    if (app.citizenId !== citizenId) throw new Error("Unauthorized");
    if (app.status !== AppointmentStatus.CONFIRMED) throw new Error("Invalid status for check-in");

    app.status = AppointmentStatus.CHECKED_IN;
    app.history.push({ status: AppointmentStatus.CHECKED_IN, timestamp: new Date().toISOString(), note: 'Checked in at centre' });
    this.saveAppointments(apps);
    return app;
  }
};
