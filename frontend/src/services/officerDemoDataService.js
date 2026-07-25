import { demoDepartments, demoOfficers, demoApplications, demoAuditEvents } from '../data/officerDemoData';

const DEPARTMENTS_KEY = 'bharat_sewa_departments_v1';
const OFFICERS_KEY = 'bharat_sewa_officers_v1';
const APPLICATIONS_KEY = 'bharat_sewa_applications_v1';
const AUDIT_KEY = 'bharat_sewa_audit_v1';
const INITIALIZED_KEY = 'bharat_sewa_officer_demo_initialized_v1';

export const officerDemoDataService = {
  initializeDemoData() {
    try {
      const isInitialized = localStorage.getItem(INITIALIZED_KEY);
      if (isInitialized) return; // Idempotent check

      // Initialize Departments
      const existingDepts = JSON.parse(localStorage.getItem(DEPARTMENTS_KEY) || '[]');
      if (existingDepts.length === 0) {
        localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(demoDepartments));
      }

      // Initialize Officers
      const existingOfficers = JSON.parse(localStorage.getItem(OFFICERS_KEY) || '[]');
      if (existingOfficers.length === 0) {
        localStorage.setItem(OFFICERS_KEY, JSON.stringify(demoOfficers));
      }

      // Initialize Applications
      // We must merge with existing citizen applications to not overwrite them
      let existingApps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]');
      
      const newApps = demoApplications.filter(demoApp => 
        !existingApps.some(existing => existing.id === demoApp.id)
      );

      if (newApps.length > 0) {
        existingApps = [...newApps, ...existingApps];
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(existingApps));
      }

      // Initialize Audit
      let existingAudit = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
      const newAudit = demoAuditEvents.filter(demoEvent => 
        !existingAudit.some(existing => existing.id === demoEvent.id)
      );

      if (newAudit.length > 0) {
        existingAudit = [...newAudit, ...existingAudit];
        localStorage.setItem(AUDIT_KEY, JSON.stringify(existingAudit));
      }

      localStorage.setItem(INITIALIZED_KEY, 'true');
      console.log('Bharat Sewa AI: Officer demo data initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize officer demo data:', error);
    }
  },

  resetDemoData() {
    localStorage.removeItem(INITIALIZED_KEY);
    localStorage.removeItem(DEPARTMENTS_KEY);
    localStorage.removeItem(OFFICERS_KEY);
    localStorage.removeItem(AUDIT_KEY);
    // Be careful resetting applications as it deletes citizen data too.
    // In a real app we'd only delete demo ones.
  }
};
