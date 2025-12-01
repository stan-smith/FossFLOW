import jwt from 'jsonwebtoken';
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_SECURE,
  JWT_EXPIRES_IN,
  JWT_SECRET
} from './authConfig.js';

export function signUserToken(user) {
  if (!JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not configured. Set JWT_SECRET when AUTH_ENABLED=true.'
    );
  }

  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name ?? undefined
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

export function verifyUserToken(token) {
  if (!JWT_SECRET) {
    throw new Error(
      'JWT_SECRET is not configured. Set JWT_SECRET when AUTH_ENABLED=true.'
    );
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  return {
    id: decoded.sub,
    email: decoded.email,
    name: decoded.name ?? null
  };
}

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: AUTH_COOKIE_SECURE,
    sameSite: 'lax'
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: AUTH_COOKIE_SECURE,
    sameSite: 'lax'
  });
}


