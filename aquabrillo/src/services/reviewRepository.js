const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const REVIEWS_TABLE = 'customer_reviews';

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
let supabaseReviewAccessToken = '';

export const setSupabaseReviewAccessToken = (accessToken = '') => {
  supabaseReviewAccessToken = accessToken;
};

const supabaseRequest = async (path, options = {}) => {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase no esta configurado.');
  }

  const { prefer, headers: customHeaders, ...requestOptions } = options;
  const resolvedPrefer = prefer ?? (requestOptions.method && requestOptions.method !== 'GET' ? 'return=representation' : '');
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${supabaseReviewAccessToken || SUPABASE_ANON_KEY}`,
    ...(requestOptions.body ? { 'Content-Type': 'application/json' } : {}),
    ...(resolvedPrefer ? { Prefer: resolvedPrefer } : {}),
    ...(customHeaders || {}),
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = new Error(`Supabase request failed: ${response.status}`);
    error.status = response.status;

    try {
      error.payload = await response.json();
    } catch {
      error.payload = null;
    }

    throw error;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const fromReviewPayload = (review) => ({
  id: review.id,
  name: review.customer_name,
  email: review.customer_email,
  vehicle: review.vehicle,
  service: review.service,
  rating: review.rating,
  text: review.comment,
  publicationConsent: review.publication_consent,
  status: review.status,
  source: review.source,
  createdAt: review.created_at,
  updatedAt: review.updated_at,
});

const toReviewPayload = (formData) => {
  const publicationConsent = String(formData.publicacion || '').trim().toLowerCase().startsWith('s');

  return {
    customer_name: formData.nombre?.trim(),
    customer_email: formData.correo?.trim() || null,
    vehicle: formData.vehiculo?.trim() || null,
    service: formData.servicio?.trim(),
    rating: Number(formData.calificacion || 5),
    comment: formData.comentarios?.trim(),
    publication_consent: publicationConsent,
    status: 'pending',
    source: 'web_review_form',
  };
};

export const createCustomerReview = async (formData) => {
  const payload = toReviewPayload(formData);

  if (!hasSupabaseConfig) {
    return {
      storage: 'local',
      review: payload,
    };
  }

  await supabaseRequest(REVIEWS_TABLE, {
    method: 'POST',
    prefer: 'return=minimal',
    body: JSON.stringify(payload),
  });

  return {
    storage: 'supabase',
    review: payload,
  };
};

export const listApprovedReviews = async () => {
  if (!hasSupabaseConfig) {
    return {
      storage: 'local',
      reviews: [],
    };
  }

  try {
    const rows = await supabaseRequest(
      `${REVIEWS_TABLE}?select=*&status=eq.approved&publication_consent=eq.true&order=created_at.desc&limit=12`,
      {
        method: 'GET',
      }
    );

    return {
      storage: 'supabase',
      reviews: rows.map(fromReviewPayload),
    };
  } catch (error) {
    return {
      storage: 'local_fallback',
      error,
      reviews: [],
    };
  }
};

export const listAdminReviews = async () => {
  if (!hasSupabaseConfig) {
    return {
      storage: 'local',
      reviews: [],
    };
  }

  try {
    const rows = await supabaseRequest(`${REVIEWS_TABLE}?select=*&order=created_at.desc&limit=50`, {
      method: 'GET',
    });

    return {
      storage: 'supabase',
      reviews: rows.map(fromReviewPayload),
    };
  } catch (error) {
    return {
      storage: 'local_fallback',
      error,
      reviews: [],
    };
  }
};

export const updateReviewStatus = async ({ id, status }) => {
  if (!hasSupabaseConfig) {
    return {
      storage: 'local',
      review: null,
    };
  }

  const [review] = await supabaseRequest(`${REVIEWS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      updated_at: new Date().toISOString(),
    }),
  });

  return {
    storage: 'supabase',
    review: fromReviewPayload(review),
  };
};
