export const EMAIL_QUEUE_NAME = "autokeeper-emails";

export type EmailTemplateName =
  | "otp-verification"
  | "password-reset"
  | "welcome";

export interface EmailQueueMessage {
  to: string;
  subject: string;
  templateName: EmailTemplateName;
  props: Record<string, unknown>;
  metadata?: {
    userId?: string;
    correlationId?: string;
    attemptedAt?: string;
  };
}
