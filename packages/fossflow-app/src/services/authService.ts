export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly createdAt: string | null;
}

export interface AuthResponse {
  readonly user: AuthUser;
}

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
  readonly name?: string;
}

const AUTH_ENDPOINT_BASE = '/auth';

function getBackendBaseUrl(): string {
  const isDevelopment =
    window.location.hostname === 'localhost' &&
    window.location.port === '3000';

  return isDevelopment ? 'http://localhost:3001' : '';
}

async function handleAuthResponse(
  response: Response
): Promise<AuthResponse> {
  if (response.status === 503) {
    throw new Error('Authentication is disabled on this server');
  }

  if (!response.ok) {
    let message = 'Authentication request failed';

    try {
      const data = (await response.json()) as { readonly error?: string };
      if (data.error) {
        message = data.error;
      }
    } catch {
      // Ignore JSON parsing errors and fall back to default message
    }

    throw new Error(message);
  }

  const data = (await response.json()) as { readonly user: AuthUser };

  return { user: data.user };
}

export async function signup(
  credentials: AuthCredentials
): Promise<AuthUser> {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}${AUTH_ENDPOINT_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(credentials)
  });

  const { user } = await handleAuthResponse(response);
  return user;
}

export async function login(
  credentials: AuthCredentials
): Promise<AuthUser> {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}${AUTH_ENDPOINT_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  });

  const { user } = await handleAuthResponse(response);
  return user;
}

export async function logout(): Promise<void> {
  const baseUrl = getBackendBaseUrl();
  await fetch(`${baseUrl}${AUTH_ENDPOINT_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  }).catch(() => {
    // Ignore logout errors on client; session cookie will eventually expire
  });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const baseUrl = getBackendBaseUrl();
  const response = await fetch(`${baseUrl}${AUTH_ENDPOINT_BASE}/me`, {
    method: 'GET',
    credentials: 'include'
  });

  if (response.status === 401) {
    return null;
  }

  const { user } = await handleAuthResponse(response);
  return user;
}


