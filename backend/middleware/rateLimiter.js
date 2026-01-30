// Simple in-memory rate limiter
// For production, use express-rate-limit with Redis

const requestCounts = new Map();

export const createRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const max = options.max || 100; // limit each IP to 100 requests per windowMs
  const message = options.message || "Too many requests, please try again later.";

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Get or create request history for this IP
    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    const requests = requestCounts.get(key);

    // Filter out old requests outside the time window
    const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);

    // Check if limit exceeded
    if (recentRequests.length >= max) {
      return res.status(429).json({
        success: false,
        message: message,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    recentRequests.push(now);
    requestCounts.set(key, recentRequests);

    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      const cutoff = now - windowMs;
      for (const [ip, timestamps] of requestCounts.entries()) {
        const filtered = timestamps.filter(t => t > cutoff);
        if (filtered.length === 0) {
          requestCounts.delete(ip);
        } else {
          requestCounts.set(ip, filtered);
        }
      }
    }

    next();
  };
};

// Preset limiters
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: "Too many login attempts. Please try again after 15 minutes."
});

export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later."
});

export const strictLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: "Too many requests. Please slow down."
});
