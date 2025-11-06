import { logger } from "@/core/logger";
import { render } from "@react-email/render";
import React from "react";
import type { EmailService, SendEmailParams } from "../email-service.interface";

/**
 * Stub email provider implementation for development
 * Logs emails to console instead of actually sending them
 */
export class StubEmailProvider implements EmailService {
  async send<TProps = any>(params: SendEmailParams<TProps>): Promise<void> {
    const { to, subject, template: Template, props } = params;

    try {
      // Render the template to get the HTML (for debugging/testing)
      const html = await render(React.createElement(Template as any, props as any));

      logger.info('\n=== [EMAIL STUB] ===', {
        to,
        subject,
        props,
        htmlPreview: html.substring(0, 200) + '...'
      });
      logger.info('====================\n');
    } catch (error) {
      logger.error('[StubEmailProvider] Error rendering email template', { to, subject, error });
      throw error;
    }
  }
}
