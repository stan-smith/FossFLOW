import { AUTH_ENABLED, AUTH_COOKIE_NAME } from './authConfig.js';
import { verifyUserToken } from './authJwt.js';

export function authRequired(req, res, next) {
  if (!AUTH_ENABLED) {
    return next();
  }

  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user = verifyUserToken(token);
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

export function attachUserIfPresent(req, res, next) {
  if (!AUTH_ENABLED) {
    return next();
  }

  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return next();
  }

  try {
    const user = verifyUserToken(token);
    req.user = user;
  } catch {
    // Ignore errors here; user will simply not be attached
  }

  return next();
}


