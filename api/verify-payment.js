/**
 * Serverless endpoint to verify Razorpay payment signature.
 *
 * Deploy to Vercel:
 * - Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel env.
 *
 * Request body (POST JSON):
 *   {
 *     order_id: string,
 *     payment_id: string,
 *     signature: string   // razorpay_signature from checkout handler
 *   }
 *
 * Response:
 *   { verified: true } or { verified: false }
 */

const crypto = require('crypto');

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const keySecret = getEnv('RAZORPAY_KEY_SECRET');
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const orderId = body.order_id || body.orderId;
    const paymentId = body.payment_id || body.paymentId;
    const signature = body.signature || body.razorpay_signature || body.razorpaySignature;

    if (!orderId || !paymentId || !signature) {
      res.status(400).json({ error: 'Missing order_id, payment_id, or signature' });
      return;
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const verified = generatedSignature === signature;
    res.status(200).json({ verified });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Verification failed' });
  }
};

