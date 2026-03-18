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
- **Response:** `{ "orderId": "order_xxxx" }` (or `id` instead of `orderId`).

Example serverless function is in **`api/create-order.js`**. For Vercel, deploy the app and set:

- **RAZORPAY_KEY_ID** and **RAZORPAY_KEY_SECRET** in Vercel project env.
- **REACT_APP_RAZORPAY_ORDER_API** = `https://your-app.vercel.app/api/create-order`.

You can use any other backend (Node, PHP, etc.) that calls [Razorpay Orders API](https://razorpay.com/docs/api/orders/#create-an-order) and returns the order id.

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

Amount is taken from `config.strategyLayout.pricing.price` (e.g. "₹199"), so it stays in sync with the pricing section.
