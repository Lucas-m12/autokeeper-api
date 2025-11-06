import { logger } from "@/core/logger";
import { render } from "@react-email/render";
import React from "react";
import { Resend } from "resend";
import type { EmailService, SendEmailParams } from "../email-service.interface";

/**
 * Resend email provider implementation
 * Sends emails using the Resend API with React Email templates
 */
export class ResendEmailProvider implements EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is required for ResendEmailProvider");
    }
    if (!fromEmail) {
      throw new Error("EMAIL_FROM is required for ResendEmailProvider");
    }

    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async send<TProps = any>(params: SendEmailParams<TProps>): Promise<void> {
    const { to, subject, template: Template, props } = params;

    try {
      // Render the React Email template to HTML
      const html = await render(React.createElement(Template as any, props as any));

      // Send the email via Resend
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        logger.error("[ResendEmailProvider] Failed to send email", { to, subject, error });
        throw new Error(`Failed to send email: ${error.message}`);
      }

      logger.info("[ResendEmailProvider] Email sent successfully", { to, subject, emailId: data?.id });
    } catch (error) {
      logger.error("[ResendEmailProvider] Error sending email", { to, subject, error });
      throw error;
    }
  }
}
