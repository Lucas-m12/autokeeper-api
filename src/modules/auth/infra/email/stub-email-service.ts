import type { EmailService, SendPasswordResetParams, SendWelcomeParams } from "./email-service.interface";

export class StubEmailService implements EmailService {
  async sendPasswordReset(params: SendPasswordResetParams): Promise<void> {
    const { to, userName, resetUrl } = params;
    console.log('\n=== [EMAIL STUB] Password Reset Email ===');
    console.log(`To: ${to}`);
    console.log(`User: ${userName}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('=========================================\n');
  }

  async sendWelcome(params: SendWelcomeParams): Promise<void> {
    const { to, userName } = params;
    console.log('\n=== [EMAIL STUB] Welcome Email ===');
    console.log(`To: ${to}`);
    console.log(`User: ${userName}`);
    console.log(`Message: Welcome to AutoKeeper! 🚗`);
    console.log('==================================\n');
  }
}