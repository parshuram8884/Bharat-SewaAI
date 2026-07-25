import { demoGrievances, demoRequests, demoResolutions } from '../data/grievanceDemoRecords';

const GRIEVANCES_KEY = 'bharat_sewa_grievances_v1';
const REQUESTS_KEY = 'bharat_sewa_grievance_requests_v1';
const RESOLUTIONS_KEY = 'bharat_sewa_grievance_resolutions_v1';
const AUDIT_KEY = 'bharat_sewa_grievance_audit_v1';

export const grievanceDemoDataService = {
  initializeDemoData() {
    // Only initialize if completely empty, to prevent overwriting citizen drafts/actions
    const grievances = localStorage.getItem(GRIEVANCES_KEY);
    if (!grievances || JSON.parse(grievances).length === 0) {
      localStorage.setItem(GRIEVANCES_KEY, JSON.stringify(demoGrievances));
    }
    
    const requests = localStorage.getItem(REQUESTS_KEY);
    if (!requests || JSON.parse(requests).length === 0) {
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(demoRequests));
    }
    
    const resolutions = localStorage.getItem(RESOLUTIONS_KEY);
    if (!resolutions || JSON.parse(resolutions).length === 0) {
      localStorage.setItem(RESOLUTIONS_KEY, JSON.stringify(demoResolutions));
    }
    
    const audit = localStorage.getItem(AUDIT_KEY);
    if (!audit) {
      localStorage.setItem(AUDIT_KEY, JSON.stringify([]));
    }
  },
  
  resetDemoData() {
    // Force reset - useful for testing
    localStorage.setItem(GRIEVANCES_KEY, JSON.stringify(demoGrievances));
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(demoRequests));
    localStorage.setItem(RESOLUTIONS_KEY, JSON.stringify(demoResolutions));
    localStorage.setItem(AUDIT_KEY, JSON.stringify([]));
  }
};
