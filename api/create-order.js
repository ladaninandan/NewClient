/**
 * Serverless function to create a Razorpay order.
 * Deploy to Vercel: add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel env.
 * Client sets REACT_APP_RAZORPAY_ORDER_API to this URL (e.g. https://your-app.vercel.app/api/create-order).
 *
 * Request: POST JSON { amount, currency?, receipt? }
 * Response: { orderId }
 */

// For Vercel serverless: npm install razorpay (add to package.json or use dynamic require)
const Razorpay = require('razorpay');

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
    const keyId = getEnv('RAZORPAY_KEY_ID');
    const keySecret = getEnv('RAZORPAY_KEY_SECRET');
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = (body.receipt || `rcpt_${Date.now()}`).substring(0, 40);

    if (!amount || amount < 100) {
      res.status(400).json({ error: 'Invalid amount (min 100 paise)' });
      return;
    }

    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    });

    res.status(200).json({ orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Order creation failed' });
  }
};
