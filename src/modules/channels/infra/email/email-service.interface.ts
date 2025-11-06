import type React from "react";

/**
 * Generic email sending parameters
 */
export interface SendEmailParams<TProps = any> {
  /**
   * Recipient email address
   */
  to: string;

  /**
   * Email subject line
   */
  subject: string;

  /**
   * React Email template component
   */
  template: React.ComponentType<TProps>;

  /**
   * Props to pass to the template component
   */
  props: TProps;
}

/**
 * Email service interface
 * Provides a generic method to send emails with any template
 */
export interface EmailService {
  /**
   * Send an email using a React Email template
   *
   * @param params - Email parameters including template and props
   * @returns Promise that resolves when email is sent
   */
  send<TProps = any>(params: SendEmailParams<TProps>): Promise<void>;
}
