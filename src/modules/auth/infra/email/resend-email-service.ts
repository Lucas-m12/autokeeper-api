import { Resend } from "resend";
import type {
  EmailService,
  SendEmailVerificationOTPParams,
  SendPasswordResetOTPParams,
  SendPasswordResetParams,
  SendWelcomeParams
} from "./email-service.interface";
import {
  welcomeEmailTemplate,
  emailVerificationOTPTemplate,
  passwordResetOTPTemplate
} from "./templates";

export class ResendEmailService implements EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is required for ResendEmailService");
    }
    if (!fromEmail) {
      throw new Error("EMAIL_FROM is required for ResendEmailService");
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendPasswordReset(params: SendPasswordResetParams): Promise<void> {
    const { to, userName } = params;

    try {
      // Note: This method is currently not used as the app uses OTP-based password reset
      // Keeping it for interface compatibility and potential future use
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: "Redefinição de senha - AutoKeeper",
        html: `
          <p>Olá, ${userName}!</p>
          <p>Este método não está em uso no momento. O sistema utiliza OTP para redefinição de senha.</p>
        `,
      });

      if (error) {
        console.error("[ResendEmailService] Failed to send password reset email:", error);
        throw new Error(`Failed to send password reset email: ${error.message}`);
      }

      console.log("[ResendEmailService] Password reset email sent successfully:", data?.id);
    } catch (error) {
      console.error("[ResendEmailService] Error sending password reset email:", error);
      throw error;
    }
  }

  async sendWelcome(params: SendWelcomeParams): Promise<void> {
    const { to, userName } = params;

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: "Bem-vindo ao AutoKeeper! 🚗",
        html: welcomeEmailTemplate(userName),
      });

      if (error) {
        console.error("[ResendEmailService] Failed to send welcome email:", error);
        throw new Error(`Failed to send welcome email: ${error.message}`);
      }

      console.log("[ResendEmailService] Welcome email sent successfully:", data?.id);
    } catch (error) {
      console.error("[ResendEmailService] Error sending welcome email:", error);
      throw error;
    }
  }

  async sendEmailVerificationOTP(params: SendEmailVerificationOTPParams): Promise<void> {
    const { to, userName, otp } = params;

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: "Código de verificação - AutoKeeper",
        html: emailVerificationOTPTemplate(userName, otp),
      });

      if (error) {
        console.error("[ResendEmailService] Failed to send email verification OTP:", error);
        throw new Error(`Failed to send email verification OTP: ${error.message}`);
      }

      console.log("[ResendEmailService] Email verification OTP sent successfully:", data?.id);
    } catch (error) {
      console.error("[ResendEmailService] Error sending email verification OTP:", error);
      throw error;
    }
  }

  async sendPasswordResetOTP(params: SendPasswordResetOTPParams): Promise<void> {
    const { to, userName, otp } = params;

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: "Redefinição de senha - AutoKeeper",
        html: passwordResetOTPTemplate(userName, otp),
      });

      if (error) {
        console.error("[ResendEmailService] Failed to send password reset OTP:", error);
        throw new Error(`Failed to send password reset OTP: ${error.message}`);
      }

      console.log("[ResendEmailService] Password reset OTP sent successfully:", data?.id);
    } catch (error) {
      console.error("[ResendEmailService] Error sending password reset OTP:", error);
      throw error;
    }
  }
}
