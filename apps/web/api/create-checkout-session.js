import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cart, shippingCost, customerEmail, customerName, customerPhone, customerAddress, successUrl, cancelUrl } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  try {
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Gastos de envío' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const orderSummary = cart.map(i => `${i.name} x${i.quantity}`).join(', ');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: 'es',
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ['ES'],
      },
      custom_text: {
        submit: {
          message: 'Tu pedido se prepara artesanalmente en Mataró. ¡Gracias por confiar en Valookie! 🍪',
        },
      },
      metadata: {
        customer_name: customerName || '',
        customer_phone: customerPhone || '',
        customer_address: customerAddress || '',
        order_summary: orderSummary.slice(0, 500),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Error al crear la sesión de pago' });
  }
}
