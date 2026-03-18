/**
 * Razorpay checkout helper.
 * Requires: REACT_APP_RAZORPAY_KEY_ID, REACT_APP_RAZORPAY_ORDER_API (backend that creates order).
 */

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export function getRazorpayKey() {
  return process.env.REACT_APP_RAZORPAY_KEY_ID || '';
}

export function getOrderApiUrl() {
  return (process.env.REACT_APP_RAZORPAY_ORDER_API || '').trim();
}

export function isRazorpayConfigured() {
  return !!getRazorpayKey() && !!getOrderApiUrl();
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
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: receipt.substring(0, 40),
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Order creation failed');
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
    order_id: opts.orderId,
    name: opts.name || 'Business Session',
    prefill: {
      name: opts.prefill?.name || '',
      email: opts.prefill?.email || '',
      contact: opts.prefill?.contact || '',
    },
    handler: opts.handler,
  };
  const rzp = new Razorpay(options);
  rzp.open();
}
