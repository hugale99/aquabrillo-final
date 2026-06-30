import { setSupabaseAccessToken } from './bookingRepository';
import { setSupabaseReviewAccessToken } from './reviewRepository';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_KEY = 'aquabrillo_admin_session';

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const authRequest = async (path, options = {}) => {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase no esta configurado.');
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = new Error(`Auth request failed: ${response.status}`);
    error.status = response.status;

    try {
      error.payload = await response.json();
    } catch {
      error.payload = null;
    }

    throw error;
  }

  if (response.status === 204) return null;

  return response.json();
};

export const getStoredAdminSession = () => {
  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    if (!rawSession) return null;

    const session = JSON.parse(rawSession);
    if (!session?.access_token) return null;

    setSupabaseAccessToken(session.access_token);
    setSupabaseReviewAccessToken(session.access_token);
    return session;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    setSupabaseAccessToken('');
    setSupabaseReviewAccessToken('');
    return null;
  }
};

export const signInAdmin = async ({ email, password }) => {
  const session = await authRequest('token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  setSupabaseAccessToken(session.access_token);
  setSupabaseReviewAccessToken(session.access_token);

  return session;
};

export const signOutAdmin = async () => {
  const session = getStoredAdminSession();

  if (session?.access_token) {
    try {
      await authRequest('logout', {
        method: 'POST',
        accessToken: session.access_token,
      });
    } catch {
      // Local logout should still succeed if the remote session is already gone.
    }
  }

  window.localStorage.removeItem(SESSION_KEY);
  setSupabaseAccessToken('');
  setSupabaseReviewAccessToken('');
};

export const getAdminUser = async () => {
  const session = getStoredAdminSession();
  if (!session?.access_token) return null;

  try {
    return await authRequest('user', {
      method: 'GET',
      accessToken: session.access_token,
    });
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    setSupabaseAccessToken('');
    setSupabaseReviewAccessToken('');
    return null;
  }
};
