import { createEmailServiceFromEnv } from "./email-config";

/**
 * Email service singleton instance
 * Configured based on EMAIL_PROVIDER environment variable
 */
export const emailService = createEmailServiceFromEnv();

/**
 * Re-export types and interfaces for external use
 */
export type {
  EmailService,
  SendEmailParams,
} from "./email-service.interface";

export type { EmailProvider, EmailConfig } from "./email-config";
export { createEmailService, createEmailServiceFromEnv } from "./email-config";

/**
 * Re-export email templates
 */
export * from "./templates";
