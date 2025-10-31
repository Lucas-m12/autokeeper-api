import type {
  EmailService,
  SendEmailVerificationOTPParams,
  SendPasswordResetOTPParams,
  SendPasswordResetParams,
  SendWelcomeParams
} from "./email-service.interface";

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

  async sendEmailVerificationOTP(params: SendEmailVerificationOTPParams): Promise<void> {
    const { to, userName, otp } = params;
    console.log('\n=== [EMAIL STUB] Email Verification OTP ===');
    console.log(`To: ${to}`);
    console.log(`User: ${userName}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Message: Use this code to verify your email address`);
    console.log(`Expires in: 5 minutes`);
    console.log('===========================================\n');
  }

  async sendPasswordResetOTP(params: SendPasswordResetOTPParams): Promise<void> {
    const { to, userName, otp } = params;
    console.log('\n=== [EMAIL STUB] Password Reset OTP ===');
    console.log(`To: ${to}`);
    console.log(`User: ${userName}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Message: Use this code to reset your password`);
    console.log(`Expires in: 5 minutes`);
    console.log('=======================================\n');
  }
}