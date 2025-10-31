/**
 * Email templates for AutoKeeper
 * All templates are in Portuguese (PT-BR)
 */

const BASE_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  .header {
    text-align: center;
    padding: 20px 0;
    border-bottom: 3px solid #2563eb;
  }
  .header h1 {
    margin: 0;
    color: #2563eb;
    font-size: 28px;
  }
  .tagline {
    color: #666;
    font-size: 14px;
    margin-top: 5px;
  }
  .content {
    padding: 30px 0;
  }
  .otp-box {
    background: #f3f4f6;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin: 20px 0;
  }
  .otp-code {
    font-size: 32px;
    font-weight: bold;
    letter-spacing: 8px;
    color: #2563eb;
    font-family: 'Courier New', monospace;
  }
  .footer {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
    color: #666;
    font-size: 12px;
  }
  .button {
    display: inline-block;
    padding: 12px 24px;
    background-color: #2563eb;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 500;
    margin: 20px 0;
  }
  .warning {
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    padding: 12px;
    margin: 20px 0;
    font-size: 14px;
  }
`;

export function welcomeEmailTemplate(userName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="header">
    <h1>🚗 AutoKeeper</h1>
    <p class="tagline">Mantenha seus veículos em dia</p>
  </div>

  <div class="content">
    <h2>Bem-vindo(a), ${userName}!</h2>

    <p>É um prazer ter você conosco! 🎉</p>

    <p>
      O <strong>AutoKeeper</strong> foi criado para ajudar você a nunca mais perder
      prazos importantes com seus veículos. Aqui você pode gerenciar:
    </p>

    <ul>
      <li>📋 IPVA e licenciamento</li>
      <li>🔧 Manutenções preventivas</li>
      <li>🛡️ Renovação de seguro</li>
      <li>✅ Lembretes personalizados</li>
    </ul>

    <p>
      Estamos aqui para garantir que seus veículos estejam sempre em conformidade
      e bem cuidados. Qualquer dúvida, é só entrar em contato!
    </p>

    <p>Boas vindas e boa jornada!</p>

    <p>
      <strong>Equipe AutoKeeper</strong><br>
      <em>Mantenha seus veículos em dia</em>
    </p>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} AutoKeeper. Todos os direitos reservados.</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
  `.trim();
}

export function emailVerificationOTPTemplate(userName: string, otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="header">
    <h1>🚗 AutoKeeper</h1>
    <p class="tagline">Mantenha seus veículos em dia</p>
  </div>

  <div class="content">
    <h2>Verificação de Email</h2>

    <p>Olá, ${userName}!</p>

    <p>
      Para confirmar seu endereço de email e ativar sua conta no AutoKeeper,
      utilize o código de verificação abaixo:
    </p>

    <div class="otp-box">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Seu código de verificação:</p>
      <div class="otp-code">${otp}</div>
    </div>

    <div class="warning">
      ⚠️ <strong>Importante:</strong> Este código expira em <strong>5 minutos</strong>
      e só pode ser usado uma vez.
    </div>

    <p>
      Se você não solicitou este código, por favor ignore este email.
      Sua conta permanecerá segura.
    </p>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} AutoKeeper. Todos os direitos reservados.</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
  `.trim();
}

export function passwordResetOTPTemplate(userName: string, otp: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${BASE_STYLES}</style>
</head>
<body>
  <div class="header">
    <h1>🚗 AutoKeeper</h1>
    <p class="tagline">Mantenha seus veículos em dia</p>
  </div>

  <div class="content">
    <h2>Redefinição de Senha</h2>

    <p>Olá, ${userName}!</p>

    <p>
      Recebemos uma solicitação para redefinir a senha da sua conta.
      Utilize o código abaixo para continuar:
    </p>

    <div class="otp-box">
      <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Seu código de redefinição:</p>
      <div class="otp-code">${otp}</div>
    </div>

    <div class="warning">
      ⚠️ <strong>Importante:</strong> Este código expira em <strong>5 minutos</strong>
      e só pode ser usado uma vez.
    </div>

    <p>
      <strong>Você não solicitou esta alteração?</strong><br>
      Se você não pediu para redefinir sua senha, ignore este email.
      Sua conta está segura e nenhuma alteração será feita.
    </p>

    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      <strong>Dica de segurança:</strong> Nunca compartilhe este código com ninguém.
      Nossa equipe jamais solicitará seu código por telefone ou email.
    </p>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} AutoKeeper. Todos os direitos reservados.</p>
    <p>Este é um email automático, por favor não responda.</p>
  </div>
</body>
</html>
  `.trim();
}
