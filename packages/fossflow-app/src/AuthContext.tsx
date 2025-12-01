import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import type { ReactNode } from 'react';
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest,
  type AuthCredentials,
  type AuthUser
} from './services/authService';

interface AuthContextValue {
  readonly user: AuthUser | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly login: (credentials: AuthCredentials) => Promise<void>;
  readonly signup: (credentials: AuthCredentials) => Promise<void>;
  readonly logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (hydrateError) {
        if (!cancelled) {
          // Silent failure is fine here – auth may be disabled or not configured.
          // eslint-disable-next-line no-console
          console.warn('[Auth] Failed to hydrate current user:', hydrateError);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAuthError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Authentication failed');
    }
  }, []);

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      setError(null);
      try {
        const authenticatedUser = await loginRequest(credentials);
        setUser(authenticatedUser);
      } catch (err) {
        handleAuthError(err);
        throw err;
      }
    },
    [handleAuthError]
  );

  const signup = useCallback(
    async (credentials: AuthCredentials) => {
      setError(null);
      try {
        const authenticatedUser = await signupRequest(credentials);
        setUser(authenticatedUser);
      } catch (err) {
        handleAuthError(err);
        throw err;
      }
    },
    [handleAuthError]
  );

  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}


