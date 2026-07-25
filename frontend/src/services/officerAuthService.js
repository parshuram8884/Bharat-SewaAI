import { demoOfficers } from '../data/officerDemoData';

const SESSION_KEY = 'bharat_sewa_officer_session_v1';

export const officerAuthService = {
  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const officer = demoOfficers.find(o => o.email === email);
        if (!officer) {
          reject(new Error('Invalid credentials or officer not found.'));
          return;
        }
        if (officer.status !== 'active') {
          reject(new Error('This account has been suspended or deactivated.'));
          return;
        }

        const session = {
          ...officer,
          lastLoginAt: new Date().toISOString()
        };
        
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        resolve({ success: true, user: session });
      }, 500); // Mock delay
    });
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
    return Promise.resolve();
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};
