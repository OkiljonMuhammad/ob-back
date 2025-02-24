import rateLimit from 'express-rate-limit';
import 'dotenv/config';

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    if (!req.user || !req.user.role) {
      return 1000;
    }
    return req.user.role.toLowerCase() === process.env.ADMIN_ROLE ? 5000 : 1000;
  },
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    return req.path === '/health';
  },
  handler: (req, res, next) => {
    console.warn(`Rate limit exceeded for user: ${req.user?.id || req.ip}`);
    res
      .status(429)
      .json({ message: 'Too many requests, please try again later.' });
  },
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export default rateLimiter;
