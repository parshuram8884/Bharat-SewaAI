export const securityEventService = {
  recordEvent(eventDetails) {
    const storeKey = 'bsai_security_events';
    const events = JSON.parse(localStorage.getItem(storeKey) || '[]');
    
    const newEvent = {
      ...eventDetails,
      id: `SEC-EVT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    events.push(newEvent);
    localStorage.setItem(storeKey, JSON.stringify(events));
    return newEvent;
  },

  getEvents() {
    const storeKey = 'bsai_security_events';
    return JSON.parse(localStorage.getItem(storeKey) || '[]');
  }
};
