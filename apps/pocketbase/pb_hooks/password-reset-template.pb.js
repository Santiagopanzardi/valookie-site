/// <reference path="../pb_data/types.d.ts" />
onMailerSend((e) => {
  const html = e.message.html || "";
  const subject = e.message.subject || "";

  const hasResetToken = html.includes("confirm-password-reset") || subject.toLowerCase().includes("reset") || subject.toLowerCase().includes("password");

  if (!hasResetToken) {
    return e.next();
  }

  const tokenMatch = html.match(/confirm-password-reset\/([^"&\s<]+)/);
  const token = tokenMatch ? tokenMatch[1] : "";

  if (!token) {
    return e.next();
  }

  e.message.subject = "Restablecer tu contraseña - Valookie";
  e.message.html = '<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">' +
    '<h2 style="color: #333;">Hola,</h2>' +
    '<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Valookie.</p>' +
    '<p>Haz clic en el botón de abajo para crear una nueva contraseña:</p>' +
    '<p style="text-align: center; margin: 30px 0;">' +
    '<a href="https://valookie.com/reset-password?token=' + token + '"' +
    ' style="background-color: #E8927C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">' +
    'Restablecer contraseña</a></p>' +
    '<p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo. El enlace expira en 2 horas.</p>' +
    '<p style="color: #999; font-size: 12px; margin-top: 30px;">— Equipo Valookie</p></div>';

  e.next();
});
