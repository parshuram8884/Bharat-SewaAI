export const idempotencyService = {
  reserveAction(actionKey) {
    const storeKey = 'bsai_security_idempotency';
    const reservations = JSON.parse(localStorage.getItem(storeKey) || '{}');
    
    if (reservations[actionKey]) {
      const isExpired = (Date.now() - new Date(reservations[actionKey].reservedAt).getTime()) > 60000;
      if (!isExpired) {
        return false; // Action is blocked (already reserved)
      }
    }
    
    reservations[actionKey] = { reservedAt: new Date().toISOString(), status: 'reserved' };
    localStorage.setItem(storeKey, JSON.stringify(reservations));
    return true;
  },

  completeAction(actionKey) {
    const storeKey = 'bsai_security_idempotency';
    const reservations = JSON.parse(localStorage.getItem(storeKey) || '{}');
    if (reservations[actionKey]) {
      reservations[actionKey].status = 'completed';
      localStorage.setItem(storeKey, JSON.stringify(reservations));
    }
  }
};
