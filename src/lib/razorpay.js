/**
 * Razorpay checkout helper.
 * Requires: REACT_APP_RAZORPAY_KEY_ID, REACT_APP_RAZORPAY_ORDER_API (backend that creates order).
 */

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function getSupabaseAnonKey() {
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
  if (!key) {
    throw new Error('REACT_APP_SUPABASE_ANON_KEY is completely missing in the React app. If you just added it to .env, you MUST restart your dev server (stop npm start and start it again). Also ensure it is set in Vercel environment variables.');
  }
  return key;
}

function getSupabaseFunctionHeaders(url) {
  // Supabase Edge Functions typically require the `apikey` header when called via fetch.
  if (typeof url === 'string' && url.includes('/functions/v1/')) {
    const apikey = getSupabaseAnonKey();
    if (apikey) return { apikey, Authorization: `Bearer ${apikey}` };
  }
  return {};
}

export function getRazorpayKey() {
  return process.env.REACT_APP_RAZORPAY_KEY_ID || '';
}

export function getOrderApiUrl() {
  return (process.env.REACT_APP_RAZORPAY_ORDER_API || '').trim();
}

export function getVerifyApiUrl() {
  return (process.env.REACT_APP_RAZORPAY_VERIFY_API || '').trim();
}

export function isRazorpayConfigured() {
  const keyOk = !!getRazorpayKey();
  const orderUrl = getOrderApiUrl();
  // Treat placeholders as "not configured" so the form can fall back to Supabase insert.
  const orderOk = !!orderUrl && !orderUrl.includes('your-api.com');
  return keyOk && orderOk;
}

export function isRazorpayVerificationConfigured() {
  const url = getVerifyApiUrl();
  return !!url && !url.includes('your-api.com');
}

function loadScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Not in browser'));
      return;
    }
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      const check = () => (window.Razorpay ? resolve(window.Razorpay) : setTimeout(check, 50));
      check();
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
}

/**
 * Create order via your backend. Backend should POST to Razorpay Orders API and return { orderId } or { id }.
 * @param {number} amountPaise - Amount in paise (e.g. 19900 for ₹199)
 * @param {string} [receipt] - Receipt id (optional)
 * @returns {Promise<{ orderId: string }>}
 */
export async function createOrder(amountPaise, receipt = `rcpt_${Date.now()}`) {
  const url = getOrderApiUrl();
  if (!url) throw new Error('Razorpay order API URL not configured');
  if (url.includes('your-api.com')) {
    throw new Error(
      'REACT_APP_RAZORPAY_ORDER_API is still a placeholder (https://your-api.com/create-order). ' +
      'Update it to your deployed endpoint for `api/create-order.js` (e.g. https://<project>.vercel.app/api/create-order).',
    );
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getSupabaseFunctionHeaders(url) },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: receipt.substring(0, 40),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Order creation failed (${res.status}) from ${url}. ${err || ''}`.trim());
  }
  const data = await res.json();
  const orderId = data.orderId || data.order_id || data.id;
  if (!orderId) throw new Error('Order API did not return orderId');
  return { orderId };
}

/**
 * Open Razorpay checkout.
 * @param {Object} opts - { orderId, amount, currency, key, prefill: { name, email, contact }, handler }
 */
export async function openCheckout(opts) {
  const Razorpay = await loadScript();
  const options = {
    key: opts.key || getRazorpayKey(),
    amount: opts.amount,
    currency: opts.currency || 'INR',
    name: opts.name || 'Business Session',
    prefill: {
      name: opts.prefill?.name || '',
      email: opts.prefill?.email || '',
      contact: opts.prefill?.contact || '',
    },
    handler: opts.handler,
  };
  
  if (opts.orderId) {
    options.order_id = opts.orderId;
  }
  
  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('Razorpay payment failed:', response.error);
    });
    rzp.open();
  } catch (err) {
    console.error('Fatal sync error in Razorpay checkout module:', err);
    alert('Payment gateway could not load correctly. Please disable your ad blocker or try another browser.');
  }
}

/**
 * Verify Razorpay signature via backend.
 * If verification API is not configured, returns { verified: true, skipped: true }.
 */
export async function verifyPayment({ orderId, paymentId, signature }) {
  const url = getVerifyApiUrl();
  if (!url || url.includes('your-api.com')) {
    throw new Error(
      'REACT_APP_RAZORPAY_VERIFY_API is not configured. ' +
      'Set it to your deployed verify-payment endpoint so payments are verified before saving.',
    );
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getSupabaseFunctionHeaders(url) },
    body: JSON.stringify({
      order_id: orderId,
      payment_id: paymentId,
      signature,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || 'Payment verification failed');
  }

  const data = await res.json();
  return { verified: !!data.verified, skipped: false };
}
