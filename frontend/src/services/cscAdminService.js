import { cscService } from './cscService';
import { appointmentService } from './appointmentService';
import { tokenService } from './tokenService';

export const cscAdminService = {
  getCentreAnalytics(centreId) {
    const apps = appointmentService.getAppointments().filter(a => a.centreId === centreId);
    const tokens = tokenService.getTokens().filter(t => t.centreId === centreId);

    const completed = tokens.filter(t => t.status === 'completed').length;
    const waiting = tokens.filter(t => t.status === 'waiting').length;

    return {
      totalAppointments: apps.length,
      completedVisits: completed,
      waitingQueue: waiting,
      averageWaitTimeMins: completed > 0 ? Math.floor(Math.random() * 20) + 5 : 0
    };
  },

  getAllCentresAnalytics() {
    const centres = cscService.getCentres();
    const analytics = centres.map(c => ({
      ...c,
      analytics: this.getCentreAnalytics(c.id)
    }));
    
    return {
      totalCentres: centres.length,
      activeCentres: centres.filter(c => c.active).length,
      centreBreakdown: analytics
    };
  }
};
