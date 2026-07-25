export const rateLimitService = {
  checkRateLimit(actionKey, userId, limit = 5, windowMs = 60000) {
    const storeKey = 'bsai_security_rate_limits';
    const limits = JSON.parse(localStorage.getItem(storeKey) || '{}');
    
    const key = `${actionKey}:${userId}`;
    const now = Date.now();
    const record = limits[key] || { windowStartedAt: now, attemptCount: 0 };
    
    if (now - record.windowStartedAt > windowMs) {
      record.windowStartedAt = now;
      record.attemptCount = 0;
    }
    
    record.attemptCount += 1;
    limits[key] = record;
    localStorage.setItem(storeKey, JSON.stringify(limits));
    
    if (record.attemptCount > limit) {
      return { status: 'blocked-demo', retryAfter: windowMs - (now - record.windowStartedAt) };
    }
    if (record.attemptCount === limit) {
      return { status: 'warning', remaining: 0 };
    }
    return { status: 'allowed', remaining: limit - record.attemptCount };
  }
};
