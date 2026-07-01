import { setSupabaseAccessToken } from './bookingRepository';
import { setSupabaseReviewAccessToken } from './reviewRepository';
import { HAS_SUPABASE_CONFIG, SUPABASE_ANON_KEY, SUPABASE_URL } from '../config/supabase';

const SESSION_KEY = 'aquabrillo_admin_session';

const authErrorMessages = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'Email not confirmed': 'El correo del usuario operativo todavía no está confirmado en Supabase.',
  'User not found': 'No existe un usuario operativo con ese correo.',
};

const authRequest = async (path, options = {}) => {
  if (!HAS_SUPABASE_CONFIG) {
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
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  setSupabaseAccessToken(session.access_token);
  setSupabaseReviewAccessToken(session.access_token);

  return session;
};

export const requestAdminPasswordReset = async ({ email }) => {
  const redirectTo = `${window.location.origin}${window.location.pathname}?admin=password-reset`;

  await authRequest(`recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });

  return {
    sent: true,
  };
};

export const getPasswordRecoveryToken = () => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = hashParams.get('access_token');
  const type = hashParams.get('type');

  if (type !== 'recovery' || !accessToken) return '';
  return accessToken;
};

export const updateAdminPassword = async ({ accessToken, password }) => {
  await authRequest('user', {
    method: 'PUT',
    accessToken,
    body: JSON.stringify({ password }),
  });

  window.history.replaceState({}, '', '#admin');

  return {
    updated: true,
  };
};

export const getAuthErrorMessage = (error) => {
  if (!HAS_SUPABASE_CONFIG) {
    return 'Supabase no está configurado. Revisa las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.';
  }

  const message = error?.payload?.msg || error?.payload?.error_description || error?.message;

  if (authErrorMessages[message]) return authErrorMessages[message];
  if (error?.status === 400 || error?.status === 401) return 'No se pudo iniciar sesión. Verifica correo, contraseña y que el usuario esté confirmado.';
  if (error?.status) return `No se pudo iniciar sesión. Supabase respondió con estado ${error.status}.`;

  return 'No se pudo iniciar sesión. Revisa tu conexión e intenta nuevamente.';
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
