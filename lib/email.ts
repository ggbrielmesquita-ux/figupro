import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function enviarEmailRecuperacao(email: string, token: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const link = `${appUrl}/resetar-senha/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'FiguPro <noreply@figupro.com>',
    to: email,
    subject: '🔐 Recuperação de senha - FiguPro',
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="background:#0a0a0a; color:#fff; font-family:Arial,sans-serif; padding:40px;">
          <div style="max-width:500px; margin:0 auto; background:#1a1a1a; border-radius:12px; padding:40px; border:1px solid #2a2a2a;">
            <h1 style="color:#ff6b00; font-size:28px; margin-bottom:8px;">FIGUPRO</h1>
            <h2 style="color:#fff; font-size:20px; margin-bottom:24px;">Recuperação de Senha</h2>
            <p style="color:#a0a0a0; margin-bottom:32px;">
              Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha.
            </p>
            <a href="${link}"
               style="display:inline-block; background:#ff6b00; color:#fff; padding:16px 32px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:16px;">
              REDEFINIR SENHA
            </a>
            <p style="color:#606060; margin-top:32px; font-size:12px;">
              Este link expira em 1 hora. Se você não solicitou isso, ignore este email.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}
