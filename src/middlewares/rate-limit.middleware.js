
import { rateLimit } from "express-rate-limit";

const rateLimitMessage = {
  success: false,
  message: "Too many requests. Please try again later.",
};

// Limit login requests.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,                 // Maximum 10 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});

// Limit registration requests.
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,                 // Maximum 10 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitMessage,
});
