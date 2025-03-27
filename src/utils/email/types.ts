
export interface EmailOptions {
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
}

export interface ResendConfirmationResult {
  success: boolean;
  message: string;
  details: any;
}

export interface DomainVerificationResult {
  verified: boolean;
  status: string;
  domains: Array<{
    id: string;
    name: string;
    status: string;
    created_at?: string;
    region?: string;
  }>;
}

// Re-export everything from the email functions for consistency
export { testConfirmationEmail, resendAllPendingConfirmationEmails } from './confirmationEmails';
export { testResendEmail } from './testEmail';
export { checkDomainVerificationStatus } from './domainVerification';
export { testUserSignup } from './confirmationEmails';
