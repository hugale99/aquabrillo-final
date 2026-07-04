/* global process */

const STRIPE_CHECKOUT_URL = 'https://api.stripe.com/v1/checkout/sessions';

const parseBody = (request) => {
  if (!request.body) return {};
  if (typeof request.body === 'object') return request.body;

  try {
    return JSON.parse(request.body);
  } catch {
    return {};
  }
};

const getSiteUrl = (request) => {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, '');

  const protocol = request.headers['x-forwarded-proto'] || 'https';
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  return `${protocol}://${host}`;
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    response.status(500).json({
      error: 'missing_stripe_secret_key',
      message: 'Configura STRIPE_SECRET_KEY en Vercel.',
    });
    return;
  }

  const body = parseBody(request);
  const amountMxn = Number(body.amountMxn || 0);
  const folio = String(body.folio || '').trim();

  if (!folio || !amountMxn || amountMxn <= 0) {
    response.status(400).json({
      error: 'invalid_checkout_payload',
      message: 'Folio y monto son obligatorios para crear el cobro.',
    });
    return;
  }

  const siteUrl = getSiteUrl(request);
  const serviceLabel = String(body.serviceLabel || 'Servicio AQUABRILLO').slice(0, 180);
  const customerName = String(body.customerName || 'Cliente AQUABRILLO').slice(0, 120);
  const customerPhone = String(body.customerPhone || '').slice(0, 30);
  const amountCents = Math.round(amountMxn * 100);
  const params = new URLSearchParams();

  params.set('mode', 'payment');
  params.set('success_url', `${siteUrl}/?stripe=success&folio=${encodeURIComponent(folio)}#admin`);
  params.set('cancel_url', `${siteUrl}/?stripe=cancel&folio=${encodeURIComponent(folio)}#admin`);
  params.set('submit_type', 'pay');
  params.set('payment_method_types[0]', 'card');
  params.set('line_items[0][quantity]', '1');
  params.set('line_items[0][price_data][currency]', 'mxn');
  params.set('line_items[0][price_data][unit_amount]', String(amountCents));
  params.set('line_items[0][price_data][product_data][name]', `AQUABRILLO | ${serviceLabel}`);
  params.set('line_items[0][price_data][product_data][description]', `Folio ${folio} | ${customerName}`);
  params.set('metadata[folio]', folio);
  params.set('metadata[customer_name]', customerName);
  params.set('metadata[customer_phone]', customerPhone);
  params.set('metadata[service_label]', serviceLabel);
  params.set('metadata[amount_mxn]', String(amountMxn));

  try {
    const stripeResponse = await fetch(STRIPE_CHECKOUT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const payload = await stripeResponse.json();

    if (!stripeResponse.ok) {
      response.status(stripeResponse.status).json({
        error: 'stripe_checkout_failed',
        message: payload?.error?.message || 'Stripe no pudo crear el cobro.',
      });
      return;
    }

    response.status(200).json({
      id: payload.id,
      url: payload.url,
    });
  } catch (error) {
    response.status(502).json({
      error: 'stripe_unavailable',
      message: error?.message || 'No fue posible conectar con Stripe.',
    });
  }
}
