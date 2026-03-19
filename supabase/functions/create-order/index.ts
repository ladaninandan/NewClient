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

function base64(s: string) {
  // Deno has btoa in many runtimes; fallback if missing.
  // eslint-disable-next-line no-undef
  if (typeof btoa === 'function') return btoa(s);
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  // @ts-ignore
  return btoa(bin);
}

function getEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing secret env var: ${name}`);
  return v;
}

Deno.serve(async (req: any) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders() });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, { status: 405 });

  try {
    const raw = await req.text();
    const body = raw ? JSON.parse(raw) : {};

    const amount = Number(body.amount);
    const currency = body.currency || 'INR';
    const receipt = (body.receipt || `rcpt_${Date.now()}`).toString().substring(0, 40);

    if (!amount || amount < 100) {
      return jsonResponse({ error: 'Invalid amount (min 100 paise)' }, { status: 400 });
    }

    const keyId = getEnv('RAZORPAY_KEY_ID');
    const keySecret = getEnv('RAZORPAY_KEY_SECRET');
    const auth = `Basic ${base64(`${keyId}:${keySecret}`)}`;

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify({
        amount: Math.round(amount), // amount is already in paise from React
        currency,
        receipt,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return jsonResponse({ error: data?.error?.description || data?.error || 'Order creation failed' }, { status: 500 });
    }

    return jsonResponse({ orderId: data.id });
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Order creation failed' }, { status: 500 });
  }
});

