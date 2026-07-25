import { TokenStatus } from '../data/tokenStatusModel';

export const tokenService = {
  getTokens() {
    return JSON.parse(localStorage.getItem('csc_tokens') || '[]');
  },

  saveTokens(tokens) {
    localStorage.setItem('csc_tokens', JSON.stringify(tokens));
  },

  generateToken(citizenId, centreId, serviceId, appointmentId = null) {
    const tokens = this.getTokens();
    const activeToken = tokens.find(t => t.citizenId === citizenId && t.centreId === centreId && [TokenStatus.GENERATED, TokenStatus.WAITING].includes(t.status));
    if (activeToken) throw new Error("Citizen already has an active token for this centre.");

    // Deterministic token number logic (mock)
    const count = tokens.filter(t => t.centreId === centreId && new Date(t.timestamp).toDateString() === new Date().toDateString()).length;
    const tokenNumber = `TKN-${count + 1}`;

    const newToken = {
      id: `BSAI-TKN-${Date.now()}`,
      tokenNumber,
      citizenId,
      centreId,
      serviceId,
      appointmentId,
      status: TokenStatus.WAITING,
      timestamp: new Date().toISOString()
    };
    tokens.push(newToken);
    this.saveTokens(tokens);
    return newToken;
  },

  callToken(tokenId, operatorId) {
    const tokens = this.getTokens();
    const token = tokens.find(t => t.id === tokenId);
    if (!token) throw new Error("Token not found");
    token.status = TokenStatus.CALLED;
    token.operatorId = operatorId;
    this.saveTokens(tokens);
    return token;
  },

  completeToken(tokenId) {
    const tokens = this.getTokens();
    const token = tokens.find(t => t.id === tokenId);
    if (!token) throw new Error("Token not found");
    token.status = TokenStatus.COMPLETED;
    this.saveTokens(tokens);
    return token;
  },

  getCentreQueue(centreId) {
    return this.getTokens().filter(t => t.centreId === centreId && [TokenStatus.WAITING, TokenStatus.CALLED, TokenStatus.SERVING].includes(t.status));
  }
};
