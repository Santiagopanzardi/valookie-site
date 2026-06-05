import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: { bodyParser: false },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function getPbAdminToken() {
  const res = await fetch(`${process.env.POCKETBASE_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: process.env.PB_ADMIN_EMAIL,
      password: process.env.PB_ADMIN_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`PocketBase auth failed: ${res.status}`);
  }

  const data = await res.json();
  return data.token;
}

async function createOrder(token, orderData) {
  const res = await fetch(`${process.env.POCKETBASE_URL}/api/collections/orders/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PocketBase create order failed: ${res.status} - ${err}`);
  }

  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const metadata = fullSession.metadata || {};
      const shippingDetails = fullSession.shipping_details || fullSession.customer_details || {};

      let items = [];
      try {
        items = JSON.parse(metadata.items || '[]');
      } catch {
        items = fullSession.line_items?.data?.map(li => ({
          name: li.description,
          quantity: li.quantity,
          price: li.amount_total / 100,
        })) || [];
      }

      const subtotal = parseFloat(metadata.subtotal || '0');
      const shippingCost = parseFloat(metadata.shipping_cost || '0');
      const total = fullSession.amount_total / 100;

      const shippingAddress = {
        name: metadata.customer_name || shippingDetails.name || '',
        address: metadata.customer_address || '',
        phone: metadata.customer_phone || fullSession.customer_details?.phone || '',
      };

      const orderData = {
        userId: metadata.user_id || '',
        items: items,
        subtotal: subtotal || (total - shippingCost),
        shippingCost: shippingCost,
        total: total,
        status: 'pending',
        shippingAddress: shippingAddress,
        postalCode: shippingDetails.address?.postal_code || metadata.postal_code || '',
        stripeSessionId: session.id,
        customerEmail: fullSession.customer_details?.email || metadata.customer_email || '',
        customerName: metadata.customer_name || shippingDetails.name || '',
        customerPhone: metadata.customer_phone || fullSession.customer_details?.phone || '',
      };

      const token = await getPbAdminToken();
      await createOrder(token, orderData);

      console.log('Order created for session:', session.id);
    } catch (err) {
      console.error('Error creating order:', err.message);
      return res.status(500).json({ error: 'Failed to create order' });
    }
  }

  res.status(200).json({ received: true });
}
