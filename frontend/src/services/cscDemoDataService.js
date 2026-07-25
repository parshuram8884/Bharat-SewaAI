const CURRENT_SCHEMA_VERSION = 1;
const STORAGE_KEYS = {
  VERSION: 'bsai_csc_schema_version',
  CENTRES: 'csc_centres',
  SERVICES: 'csc_services',
  APPOINTMENTS: 'csc_appointments',
  TOKENS: 'csc_tokens',
  QUEUES: 'csc_queues',
  VISITS: 'csc_visits'
};

const defaultCentres = [
  {
    id: 'BSAI-CSC-2026-100001',
    name: 'District Citizen Service Centre - Mumbai',
    type: 'District Service Centre',
    location: 'Mumbai, Maharashtra',
    capacity: 50,
    active: true,
    languages: ['en', 'hi', 'mr']
  },
  {
    id: 'BSAI-CSC-2026-100002',
    name: 'Village Digital Centre - Pune',
    type: 'Village Digital Centre',
    location: 'Pune Rural, Maharashtra',
    capacity: 20,
    active: true,
    languages: ['mr']
  }
];

const defaultServices = [
  {
    id: 'BSAI-CSCSVC-2026-100001',
    name: 'Application Submission',
    durationMinutes: 30,
    active: true
  },
  {
    id: 'BSAI-CSCSVC-2026-100002',
    name: 'Document Upload & Verification',
    durationMinutes: 15,
    active: true
  }
];

export const cscDemoDataService = {
  initializeCscStorage() {
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    
    if (!version || parseInt(version, 10) < CURRENT_SCHEMA_VERSION) {
      this.migrateCscStorage(version);
    }
  },

  migrateCscStorage(oldVersion) {
    if (!localStorage.getItem(STORAGE_KEYS.CENTRES)) {
      localStorage.setItem(STORAGE_KEYS.CENTRES, JSON.stringify(defaultCentres));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TOKENS)) {
      localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUEUES)) {
      localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VISITS)) {
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify([]));
    }
    
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_SCHEMA_VERSION.toString());
  },

  resetCscDemoData() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.initializeCscStorage();
  },

  getCentres() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CENTRES) || '[]');
  },

  getServices() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]');
  }
};
