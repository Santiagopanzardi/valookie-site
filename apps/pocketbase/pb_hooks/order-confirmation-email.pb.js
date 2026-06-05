/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const order = e.record;
    const customerEmail = order.get("customerEmail");

    if (!customerEmail) return e.next();

    const items = order.get("items") || [];
    const total = order.get("total") || 0;
    const shippingCost = order.get("shippingCost") || 0;
    const customerName = order.get("customerName") || "";

    let itemsHtml = "";
    if (Array.isArray(items)) {
      items.forEach((item) => {
        itemsHtml += '<tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">' + (item.name || "Producto") +
          '</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">' + (item.quantity || 1) +
          '</td><td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">€' + ((item.price || 0) * (item.quantity || 1)).toFixed(2) + '</td></tr>';
      });
    }

    const html = '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fff;">' +
      '<div style="text-align:center;margin-bottom:30px;">' +
      '<h1 style="color:#E8927C;margin:0;">Valookie</h1>' +
      '</div>' +
      '<h2 style="color:#333;">¡Gracias por tu pedido' + (customerName ? ', ' + customerName : '') + '! 🍪</h2>' +
      '<p style="color:#555;">Hemos recibido tu pedido y lo estamos preparando con mucho cariño.</p>' +
      '<div style="background:#fdf8f6;border-radius:12px;padding:20px;margin:20px 0;">' +
      '<h3 style="margin-top:0;color:#333;">Resumen del pedido #' + order.id.slice(0, 8) + '</h3>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
      '<tr style="color:#888;"><td style="padding:8px 0;"><strong>Producto</strong></td><td style="text-align:center;"><strong>Cant.</strong></td><td style="text-align:right;"><strong>Precio</strong></td></tr>' +
      itemsHtml +
      '</table>' +
      '<hr style="border:none;border-top:1px solid #eee;margin:15px 0;">' +
      '<table style="width:100%;font-size:14px;">' +
      '<tr><td style="padding:4px 0;">Envío</td><td style="text-align:right;">' + (shippingCost > 0 ? '€' + shippingCost.toFixed(2) : 'Gratis') + '</td></tr>' +
      '<tr><td style="padding:4px 0;font-size:18px;"><strong>Total</strong></td><td style="text-align:right;font-size:18px;"><strong>€' + total.toFixed(2) + '</strong></td></tr>' +
      '</table>' +
      '</div>' +
      '<p style="color:#555;">Te avisaremos cuando tu pedido esté en camino.</p>' +
      '<p style="color:#555;">Si tienes alguna pregunta, no dudes en escribirnos a <a href="mailto:hola@valookie.com" style="color:#E8927C;">hola@valookie.com</a></p>' +
      '<p style="color:#999;font-size:12px;margin-top:30px;text-align:center;">— Equipo Valookie<br>Mataró, Barcelona</p>' +
      '</div>';

    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: customerEmail }],
      subject: "¡Pedido confirmado! #" + order.id.slice(0, 8) + " - Valookie",
      html: html
    });

    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("Order confirmation email failed", "error", err.message);
  }

  e.next();
}, "orders");
