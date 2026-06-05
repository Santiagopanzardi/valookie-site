/// <reference path="../pb_data/types.d.ts" />
onRecordAfterUpdateSuccess((e) => {
  try {
    const order = e.record;
    const oldStatus = e.record.original().get("status");
    const newStatus = order.get("status");

    if (oldStatus === newStatus || newStatus !== "delivered") return e.next();

    const customerEmail = order.get("customerEmail");
    const customerName = order.get("customerName") || "";

    if (!customerEmail) return e.next();

    const html = '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">' +
      '<div style="text-align:center;margin-bottom:20px;"><h1 style="color:#E8927C;margin:0;">Valookie</h1></div>' +
      '<h2 style="color:#333;">¡Esperamos que hayas disfrutado tu pedido' + (customerName ? ', ' + customerName : '') + '! 🍪</h2>' +
      '<p style="color:#555;line-height:1.6;">Nos encantaría saber qué te ha parecido. Tu opinión nos ayuda a mejorar y a que otros clientes descubran nuestras cookies.</p>' +
      '<p style="text-align:center;margin:30px 0;">' +
      '<a href="https://valookie.com/shop" style="background-color:#E8927C;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Dejar una reseña</a>' +
      '</p>' +
      '<p style="color:#555;line-height:1.6;">Solo te llevará un minuto. ¡Gracias por formar parte de la familia Valookie!</p>' +
      '<p style="color:#999;font-size:12px;margin-top:30px;text-align:center;">— Equipo Valookie<br>Mataró, Barcelona</p>' +
      '</div>';

    const message = new MailerMessage({
      from: {
        address: "hola@valookie.com",
        name: "Valookie"
      },
      to: [{ address: customerEmail }],
      subject: "¿Qué te han parecido tus cookies? ⭐",
      html: html
    });

    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("Review request email failed", "error", err.message);
  }

  e.next();
}, "orders");
