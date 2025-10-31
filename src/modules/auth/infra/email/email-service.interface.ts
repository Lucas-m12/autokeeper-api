export interface EmailService {
  sendPasswordReset(params: SendPasswordResetParams): Promise<void>;
  sendWelcome(params: SendWelcomeParams): Promise<void>;
  sendEmailVerificationOTP(params: SendEmailVerificationOTPParams): Promise<void>;
  sendPasswordResetOTP(params: SendPasswordResetOTPParams): Promise<void>;
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

export interface SendEmailVerificationOTPParams {
  to: string;
  otp: string;
  userName: string;
}

export interface SendPasswordResetOTPParams {
  to: string;
  otp: string;
  userName: string;
}