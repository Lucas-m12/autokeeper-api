export interface EmailService {
  sendPasswordReset(params: SendPasswordResetParams): Promise<void>;
  sendWelcome(params: SendWelcomeParams): Promise<void>;
}

export interface SendPasswordResetParams {
  to: string;
  resetUrl: string;
  userName: string;
}

export interface SendWelcomeParams {
  to: string;
  userName: string;
}