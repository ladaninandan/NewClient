# Razorpay payment integration

When the form is filled and the user clicks **Reserve My Spot**, the app can open Razorpay checkout and pass the form values (name, email, phone) as prefill. After successful payment, the registration is saved with the payment IDs.

## 1. Environment variables

In `.env` add:

- **REACT_APP_RAZORPAY_KEY_ID** – Your Razorpay key ID (Dashboard → API Keys).
- **REACT_APP_RAZORPAY_ORDER_API** – URL of your backend that creates a Razorpay order (see below).

If these are not set, the form skips payment and submits only to Supabase (current behaviour).

## 2. Backend: create order

Razorpay requires creating an **order** on your server before opening checkout.

- **Request:** `POST` to your URL with JSON body:  
  `{ "amount": 19900, "currency": "INR", "receipt": "rcpt_123" }`  
  (`amount` is in paise, e.g. 19900 = ₹199.)
- **Response:** `{ "orderId": "order_xxxx" }` (or `{ "id": "order_xxxx" }`).

### Using Supabase Edge Functions (recommended: no separate Node server)
We use these Edge Functions:
- `supabase/functions/create-order/index.ts` (calls Razorpay Orders API)
- `supabase/functions/verify-payment/index.ts` (verifies Razorpay HMAC signature)

Set these in your React `.env`:
- `REACT_APP_RAZORPAY_ORDER_API=https://<your-supabase-ref>.supabase.co/functions/v1/create-order`
- `REACT_APP_RAZORPAY_VERIFY_API=https://<your-supabase-ref>.supabase.co/functions/v1/verify-payment`

Also set secrets in Supabase Edge Functions:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`


## 3. Supabase: registrations table

Add two columns so payment IDs are stored with each registration:

- **payment_id** (text, nullable)
- **razorpay_order_id** (text, nullable)

In Supabase: Table Editor → `registrations` → add column.

## 4. Flow

1. User fills name, email, phone and clicks **Reserve My Spot**.
2. Form is validated and duplicate email is checked.
3. Your order API is called with amount (from **Site Settings → Pricing → price**, e.g. ₹199 → 19900 paise).
4. Razorpay checkout opens with **prefill** (name, email, contact) and the order amount.
5. User pays; on success the app saves to Supabase: name, email, phone, **payment_id**, **razorpay_order_id**.
6. Success message is shown.

Amount is taken from `config.strategyLayout.stickyBar.price` when the sticky bar is enabled (fallback to `config.strategyLayout.pricing.price`), so it stays in sync with the amount shown to the user.
