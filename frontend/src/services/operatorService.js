import { VisitStatus } from '../data/visitStatusModel';
import { tokenService } from './tokenService';

export const operatorService = {
  getVisits() {
    return JSON.parse(localStorage.getItem('csc_visits') || '[]');
  },

  saveVisits(visits) {
    localStorage.setItem('csc_visits', JSON.stringify(visits));
  },

  startVisit(operatorId, tokenId, citizenId, centreId) {
    const visits = this.getVisits();
    
    // Update token to serving
    const tokens = tokenService.getTokens();
    const token = tokens.find(t => t.id === tokenId);
    if (token) {
      token.status = 'serving';
      tokenService.saveTokens(tokens);
    }

    const newVisit = {
      id: `BSAI-VST-${Date.now()}`,
      operatorId,
      citizenId,
      centreId,
      tokenId,
      status: VisitStatus.IN_PROGRESS,
      startTime: new Date().toISOString(),
      consents: [],
      assistedActions: [],
      summary: ''
    };
    visits.push(newVisit);
    this.saveVisits(visits);
    return newVisit;
  },

  recordConsent(visitId, scope, signature) {
    const visits = this.getVisits();
    const visit = visits.find(v => v.id === visitId);
    if (!visit) throw new Error("Visit not found");
    visit.consents.push({ scope, signature, timestamp: new Date().toISOString() });
    this.saveVisits(visits);
    return visit;
  },

  addAssistedAction(visitId, actionType, details) {
    const visits = this.getVisits();
    const visit = visits.find(v => v.id === visitId);
    if (!visit) throw new Error("Visit not found");
    visit.assistedActions.push({ actionType, details, timestamp: new Date().toISOString() });
    this.saveVisits(visits);
    return visit;
  },

  completeVisit(visitId, summary) {
    const visits = this.getVisits();
    const visit = visits.find(v => v.id === visitId);
    if (!visit) throw new Error("Visit not found");
    visit.status = VisitStatus.COMPLETED;
    visit.endTime = new Date().toISOString();
    visit.summary = summary;
    this.saveVisits(visits);

    // Complete token
    if (visit.tokenId) {
      tokenService.completeToken(visit.tokenId);
    }
    return visit;
  },

  getVisit(visitId) {
    return this.getVisits().find(v => v.id === visitId);
  },
  
  getCitizenVisits(citizenId) {
     return this.getVisits().filter(v => v.citizenId === citizenId);
  }
};
