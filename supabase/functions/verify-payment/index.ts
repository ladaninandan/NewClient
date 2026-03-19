// Supabase Edge Functions run on Deno (no CRA build).
// Use `Deno.serve` directly to avoid bundler/linter issues.

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
      ...(init?.headers || {}),
    },
  });
}

function getEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing secret env var: ${name}`);
  return v;
}

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req: any) => {
  const method = String(req.method || '').toUpperCase();
  if (method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  if (method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, { status: 405 });

  try {
    const raw = await req.text();
    const body = raw ? JSON.parse(raw) : {};

    const orderId = body.order_id || body.orderId;
    const paymentId = body.payment_id || body.paymentId;
    const signature = body.signature || body.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      return jsonResponse({ error: 'Missing order_id, payment_id, or signature' }, { status: 400 });
    }

    const keySecret = getEnv('RAZORPAY_KEY_SECRET');

    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );

    const data = `${orderId}|${paymentId}`;
    const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
    const expected = toHex(sigBuf);

    const verified = expected === signature;
    // Always return 200 so the frontend can handle `{ verified: false }` gracefully.
    return jsonResponse({ verified });
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Verification failed' }, { status: 500 });
  }
});

