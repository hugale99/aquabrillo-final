/* global process, Buffer */

import crypto from 'node:crypto';

const readRawBody = async (request) => new Promise((resolve, reject) => {
  const chunks = [];

  request.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
  request.on('end', () => resolve(Buffer.concat(chunks)));
  request.on('error', reject);
});

const getSignatureParts = (signatureHeader = '') => signatureHeader
  .split(',')
  .reduce((parts, item) => {
    const [key, value] = item.split('=');
    return {
      ...parts,
      [key]: value,
    };
  }, {});

const verifyStripeSignature = ({ payload, signatureHeader, webhookSecret }) => {
  const parts = getSignatureParts(signatureHeader);
  const timestamp = parts.t;
  const signature = parts.v1;

  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload.toString('utf8')}`;
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');

  return expectedBuffer.length === signatureBuffer.length
    && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};

const supabaseRequest = async ({ path, method = 'GET', body }) => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configura SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para registrar pagos de Stripe.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase ${method} ${path} failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

const registerStripePayment = async (session) => {
  const metadata = session.metadata || {};
  const folio = metadata.folio;
  const amountMxn = Number(session.amount_total || 0) / 100;

  if (!folio || !amountMxn) return;

  await supabaseRequest({
    path: 'reservation_payments',
    method: 'POST',
    body: {
      reservation_folio: folio,
      amount_mxn: amountMxn,
      method: 'stripe',
      reference: session.payment_intent || session.id,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent || null,
      notes: `Stripe Checkout ${session.id}`,
      created_by: 'stripe_webhook',
      paid_at: new Date((session.created || Date.now() / 1000) * 1000).toISOString(),
    },
  });

  const reservationRows = await supabaseRequest({
    path: `reservations?folio=eq.${encodeURIComponent(folio)}&select=estimate_price`,
    method: 'GET',
  });
  const estimatePrice = Number(reservationRows?.[0]?.estimate_price || 0);
  const nextStatus = estimatePrice > 0 && amountMxn >= estimatePrice ? 'pagado' : 'anticipo';

  await supabaseRequest({
    path: `reservations?folio=eq.${encodeURIComponent(folio)}`,
    method: 'PATCH',
    body: {
      payment_status: nextStatus,
      updated_at: new Date().toISOString(),
    },
  });
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    response.status(500).json({
      error: 'missing_stripe_webhook_secret',
      message: 'Configura STRIPE_WEBHOOK_SECRET en Vercel.',
    });
    return;
  }

  const rawBody = await readRawBody(request);
  const signatureHeader = request.headers['stripe-signature'];

  if (!verifyStripeSignature({ payload: rawBody, signatureHeader, webhookSecret })) {
    response.status(400).json({ error: 'invalid_signature' });
    return;
  }

  const event = JSON.parse(rawBody.toString('utf8'));

  try {
    if (event.type === 'checkout.session.completed') {
      await registerStripePayment(event.data.object);
    }

    response.status(200).json({ received: true });
  } catch (error) {
    response.status(500).json({
      error: 'stripe_webhook_processing_failed',
      message: error?.message || 'No fue posible procesar el webhook.',
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
