import type { EmailTemplateName } from "@/core/queue/queues/email-queue";
import { OTPVerificationEmail } from "@emails/otp-verification";
import { PasswordResetEmail } from "@emails/password-reset";
import { WelcomeEmail } from "@emails/welcome";
import type React from "react";

type EmailTemplateComponent = React.ComponentType<any>;

const emailTemplates: Record<EmailTemplateName, EmailTemplateComponent> = {
  "otp-verification": OTPVerificationEmail,
  "password-reset": PasswordResetEmail,
  welcome: WelcomeEmail,
};

export function getEmailTemplate(name: EmailTemplateName): EmailTemplateComponent {
  const template = emailTemplates[name];
  if (!template) {
    throw new Error(`Unknown email template: ${name}`);
  }
  return template;
}
