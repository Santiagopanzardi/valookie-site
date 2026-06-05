/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const order = e.record;
    const items = order.get("items") || [];
    const total = order.get("total") || 0;
    const shippingCost = order.get("shippingCost") || 0;
    const customerName = order.get("customerName") || "Sin nombre";
    const customerEmail = order.get("customerEmail") || "Sin email";
    const customerPhone = order.get("customerPhone") || "Sin teléfono";
    const shippingAddress = order.get("shippingAddress") || {};
    const postalCode = order.get("postalCode") || "";

    const addressText = typeof shippingAddress === "object"
      ? (shippingAddress.address || JSON.stringify(shippingAddress))
      : shippingAddress;

    let itemsHtml = "";
    if (Array.isArray(items)) {
      items.forEach((item) => {
        itemsHtml += '<tr><td style="padding:8px;border-bottom:1px solid #eee;">' + (item.name || "Producto") + '</td>' +
          '<td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">' + (item.quantity || 1) + '</td>' +
          '<td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">€' + ((item.price || 0) * (item.quantity || 1)).toFixed(2) + '</td></tr>';
      });
    }

    const html = '<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">' +
      '<h2 style="color:#E8927C;">🍪 Nuevo pedido en Valookie</h2>' +
      '<p style="font-size:16px;">Pedido <strong>#' + order.id.slice(0, 8) + '</strong></p>' +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">' +
      '<h3 style="margin-bottom:8px;">Cliente</h3>' +
      '<p style="margin:4px 0;"><strong>Nombre:</strong> ' + customerName + '</p>' +
      '<p style="margin:4px 0;"><strong>Email:</strong> ' + customerEmail + '</p>' +
      '<p style="margin:4px 0;"><strong>Teléfono:</strong> ' + customerPhone + '</p>' +
      '<p style="margin:4px 0;"><strong>Dirección:</strong> ' + addressText + '</p>' +
      '<p style="margin:4px 0;"><strong>Código postal:</strong> ' + postalCode + '</p>' +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">' +
      '<h3 style="margin-bottom:8px;">Productos</h3>' +
      '<table style="width:100%;border-collapse:collapse;">' +
      '<tr style="background:#f9f9f9;"><th style="padding:8px;text-align:left;">Producto</th><th style="padding:8px;text-align:center;">Cant.</th><th style="padding:8px;text-align:right;">Precio</th></tr>' +
      itemsHtml +
      '</table>' +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">' +
      '<p style="margin:4px 0;"><strong>Envío:</strong> ' + (shippingCost > 0 ? '€' + shippingCost.toFixed(2) : 'Gratis') + '</p>' +
      '<p style="font-size:18px;margin:12px 0;"><strong>Total: €' + total.toFixed(2) + '</strong></p>' +
      '<hr style="border:none;border-top:1px solid #eee;margin:20px 0;">' +
      '<p style="color:#666;font-size:14px;">Gestiona este pedido en <a href="https://valookie.com/admin/orders">el panel de pedidos</a>.</p>' +
      '</div>';

    const message = new MailerMessage({
      from: {
        address: $app.settings().meta.senderAddress,
        name: $app.settings().meta.senderName
      },
      to: [{ address: "hola@valookie.com" }],
      subject: "🍪 Nuevo pedido #" + order.id.slice(0, 8) + " - €" + total.toFixed(2),
      html: html
    });

    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("Order notification email failed", "error", err.message);
  }

  e.next();
}, "orders");
