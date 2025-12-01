import bcrypt from 'bcrypt';

const usersByEmail = new Map();

export async function createUser(params) {
  const { email, password, name } = params;

  const normalizedEmail = normalizeEmail(email);

  if (usersByEmail.has(normalizedEmail)) {
    throw new Error('USER_ALREADY_EXISTS');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const nowIso = new Date().toISOString();

  const user = {
    id: normalizedEmail,
    email: normalizedEmail,
    passwordHash,
    name: name || null,
    createdAt: nowIso
  };

  usersByEmail.set(normalizedEmail, user);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };
}

export function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const user = usersByEmail.get(normalizedEmail);

  if (!user) {
    return null;
  }

  return user;
}

export async function validateUserCredentials(email, password) {
  const user = findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}


