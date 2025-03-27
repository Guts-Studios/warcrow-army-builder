
// Export all the email utility functions from a central location
export * from './types';
export * from './sendEmail';
export * from './testEmail';
export * from './domainVerification';
export * from './confirmationEmails';
export * from './adminManagement';

// Add global window declarations for browser testing
import { testResendEmail } from './testEmail';
import { checkDomainVerificationStatus } from './domainVerification';
import { resendAllPendingConfirmationEmails, testConfirmationEmail } from './confirmationEmails';
import { updateUserWabAdminStatus, getWabAdmins } from './adminManagement';

if (typeof window !== 'undefined') {
  (window as any).testResendEmail = testResendEmail;
  (window as any).checkDomainVerificationStatus = checkDomainVerificationStatus;
  (window as any).resendAllPendingConfirmationEmails = resendAllPendingConfirmationEmails;
  (window as any).testConfirmationEmail = testConfirmationEmail;
  (window as any).updateUserWabAdminStatus = updateUserWabAdminStatus;
  (window as any).getWabAdmins = getWabAdmins;
}

declare global {
  interface Window {
    testResendEmail: typeof testResendEmail;
    checkDomainVerificationStatus: typeof checkDomainVerificationStatus;
    resendAllPendingConfirmationEmails: typeof resendAllPendingConfirmationEmails;
    testConfirmationEmail: typeof testConfirmationEmail;
    updateUserWabAdminStatus: typeof updateUserWabAdminStatus;
    getWabAdmins: typeof getWabAdmins;
  }
}
