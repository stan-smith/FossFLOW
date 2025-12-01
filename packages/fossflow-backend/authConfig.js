import dotenv from 'dotenv';

dotenv.config();

export const AUTH_ENABLED = process.env.AUTH_ENABLED === 'true';

export const JWT_SECRET =
  process.env.JWT_SECRET && process.env.JWT_SECRET.length > 0
    ? process.env.JWT_SECRET
    : null;

export const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN && process.env.JWT_EXPIRES_IN.length > 0
    ? process.env.JWT_EXPIRES_IN
    : '1h';

export const AUTH_COOKIE_NAME =
  process.env.AUTH_COOKIE_NAME && process.env.AUTH_COOKIE_NAME.length > 0
    ? process.env.AUTH_COOKIE_NAME
    : 'fossflow_auth';

export const AUTH_COOKIE_SECURE =
  process.env.AUTH_COOKIE_SECURE === 'true' ||
  process.env.NODE_ENV === 'production';

export const AUTH_CORS_ORIGIN =
  process.env.AUTH_CORS_ORIGIN && process.env.AUTH_CORS_ORIGIN.length > 0
    ? process.env.AUTH_CORS_ORIGIN
    : undefined;


