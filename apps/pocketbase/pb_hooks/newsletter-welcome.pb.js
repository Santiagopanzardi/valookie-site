/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  try {
    const message = new MailerMessage({
      from: {
        address: "hola@valookie.com",
        name: "Valookie"
      },
      to: [{ address: e.record.get("email") }],
      subject: "¡Bienvenido/a a la familia Valookie! 🍪",
      html: '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">' +
        '<div style="text-align:center;margin-bottom:20px;"><h1 style="color:#E8927C;margin:0;">Valookie</h1></div>' +
        '<h2 style="color:#333;">¡Gracias por suscribirte!</h2>' +
        '<p style="color:#555;line-height:1.6;">Ahora formas parte de la familia Valookie. Serás el/la primero/a en enterarte de:</p>' +
        '<ul style="color:#555;line-height:1.8;">' +
        '<li>Nuevos sabores y productos</li>' +
        '<li>Ofertas exclusivas para suscriptores</li>' +
        '<li>Novedades y eventos</li>' +
        '</ul>' +
        '<p style="color:#555;line-height:1.6;">Mientras tanto, ¿por qué no echas un vistazo a nuestra tienda?</p>' +
        '<p style="text-align:center;margin:30px 0;">' +
        '<a href="https://valookie.com/shop" style="background-color:#E8927C;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;">Ver productos</a>' +
        '</p>' +
        '<p style="color:#999;font-size:12px;margin-top:30px;text-align:center;">— Equipo Valookie<br>Mataró, Barcelona</p>' +
        '</div>'
    });
    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("Newsletter welcome email failed", "error", err.message);
  }
  e.next();
}, "email_signups");