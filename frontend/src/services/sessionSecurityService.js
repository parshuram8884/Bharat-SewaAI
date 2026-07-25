import { SessionStatusModel } from '../data/sessionStatusModel';

export const sessionSecurityService = {
  getCurrentSession() {
    return JSON.parse(localStorage.getItem('bsai_security_session_current') || 'null');
  },

  getSessionHistory() {
    return JSON.parse(localStorage.getItem('bsai_security_session_history') || '[]');
  },

  createMockSession(user) {
    const session = {
      id: `SESS-${Date.now()}`,
      userId: user.id,
      roleSnapshot: user.role,
      permissionSnapshot: user.permissions || [],
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      status: SessionStatusModel.ACTIVE
    };
    localStorage.setItem('bsai_security_session_current', JSON.stringify(session));
    this._appendToHistory(session);
    return session;
  },

  refreshMockSession() {
    const session = this.getCurrentSession();
    if (session && session.status === SessionStatusModel.ACTIVE) {
      session.lastActivityAt = new Date().toISOString();
      localStorage.setItem('bsai_security_session_current', JSON.stringify(session));
    }
  },

  expireMockSession(reason = SessionStatusModel.EXPIRED_IDLE) {
    const session = this.getCurrentSession();
    if (session) {
      session.status = reason;
      localStorage.setItem('bsai_security_session_current', JSON.stringify(session));
      this._appendToHistory(session);
    }
  },

  revokeMockSession() {
    this.expireMockSession(SessionStatusModel.REVOKED);
  },

  recordSessionActivity() {
    this.refreshMockSession();
  },

  evaluateSessionIdleTimeout() {
    const session = this.getCurrentSession();
    if (!session || session.status !== SessionStatusModel.ACTIVE) return session;

    const idleMinutes = (new Date() - new Date(session.lastActivityAt)) / 60000;
    if (idleMinutes >= 15) {
      this.expireMockSession(SessionStatusModel.EXPIRED_IDLE);
      return this.getCurrentSession();
    } else if (idleMinutes >= 10) {
      return { ...session, status: SessionStatusModel.IDLE_WARNING };
    }
    return session;
  },

  _appendToHistory(session) {
    const history = this.getSessionHistory();
    history.push(session);
    localStorage.setItem('bsai_security_session_history', JSON.stringify(history));
  }
};
