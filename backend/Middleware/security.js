const attempts = new Map();
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key);
  }
}, 15 * 60 * 1000);
cleanup.unref();

export const securityHeaders = (_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
};

export const loginRateLimit = (req, res, next) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const key = req.ip;
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  current.count += 1;
  if (current.count > 10) {
    res.set("Retry-After", Math.ceil((current.resetAt - now) / 1000));
    return res.status(429).json({ message: "Too many login attempts. Try again later." });
  }

  next();
};

export const resetLoginRateLimit = (ip) => attempts.delete(ip);
