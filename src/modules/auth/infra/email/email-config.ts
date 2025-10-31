import type { EmailService } from "./email-service.interface";
import { StubEmailService } from "./stub-email-service";
import { ResendEmailService } from "./resend-email-service";

/**
 * Supported email providers
 */
export type EmailProvider = "stub" | "resend";

/**
 * Email configuration options
 */
export interface EmailConfig {
  provider: EmailProvider;
  resendApiKey?: string;
  fromEmail?: string;
}

/**
 * Creates an email service instance based on the provided configuration
 *
 * @param config - Email configuration options
 * @returns EmailService instance
 * @throws Error if configuration is invalid or missing required values
 */
export function createEmailService(config: EmailConfig): EmailService {
  const { provider, resendApiKey, fromEmail } = config;

  switch (provider) {
    case "stub":
      console.log("[EmailConfig] Using StubEmailService (emails will be logged to console)");
      return new StubEmailService();

    case "resend":
      if (!resendApiKey) {
        throw new Error(
          "RESEND_API_KEY environment variable is required when EMAIL_PROVIDER is 'resend'"
        );
      }
      if (!fromEmail) {
        throw new Error(
          "EMAIL_FROM environment variable is required when EMAIL_PROVIDER is 'resend'"
        );
      }
      console.log(`[EmailConfig] Using ResendEmailService with sender: ${fromEmail}`);
      return new ResendEmailService(resendApiKey, fromEmail);

    default:
      throw new Error(
        `Invalid EMAIL_PROVIDER: ${provider}. Must be 'stub' or 'resend'`
      );
  }
}

/**
 * Creates an email service from environment variables
 *
 * Required environment variables:
 * - EMAIL_PROVIDER: 'stub' | 'resend'
 * - EMAIL_FROM: sender email address (required for 'resend')
 * - RESEND_API_KEY: Resend API key (required for 'resend')
 *
 * @returns EmailService instance
 * @throws Error if environment variables are missing or invalid
 */
export function createEmailServiceFromEnv(): EmailService {
  const provider = process.env.EMAIL_PROVIDER as EmailProvider | undefined;

  if (!provider) {
    throw new Error(
      "EMAIL_PROVIDER environment variable is required. Must be 'stub' or 'resend'"
    );
  }

  const config: EmailConfig = {
    provider,
    resendApiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.EMAIL_FROM,
  };

  return createEmailService(config);
}
