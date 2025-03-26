
import { supabase } from "@/integrations/supabase/client";

interface EmailOptions {
  type?: 'welcome' | 'reset_password';
  token?: string;
  fromEmail?: string; 
  fromName?: string;  
}

export const sendEmail = async (
  to: string[], 
  subject: string, 
  html: string, 
  options: EmailOptions = {}
) => {
  try {
    console.log('Preparing to send email:', {
      to,
      subject,
      options,
      provider: 'Resend'
    });
    
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        to,
        subject,
        html,
        type: options.type,
        token: options.token,
        fromEmail: options.fromEmail,
        fromName: options.fromName
      }
    });

    if (error) {
      console.error('Edge Function Error:', {
        error,
        message: error.message,
        details: error.details,
        status: error.status
      });
      throw error;
    }

    console.log('Email sent successfully:', {
      data,
      timestamp: new Date().toISOString(),
      provider: 'Resend'
    });
    
    return data;
  } catch (error) {
    console.error('Email Send Failure:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

export const testResendEmail = async (useDefaultDomain = false) => {
  try {
    const options: EmailOptions = {};
    
    if (useDefaultDomain) {
      options.fromEmail = 'onboarding@resend.dev';
      options.fromName = 'Warcrow Test';
    }
    
    await sendEmail(
      ['caldwejf@gmail.com'],
      'Resend Test Email',
      '<h1>Test Email from Warcrow Army</h1><p>This is a test email sent via Resend to verify the email service is working.</p>',
      options
    );
    console.log('Test email sent successfully via Resend');
    return true;
  } catch (error) {
    console.error('Failed to send test email via Resend:', error);
    throw error;
  }
};

export const checkDomainVerificationStatus = async () => {
  try {
    console.log('Checking domain verification status...');
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        checkDomainOnly: true,
        to: ['check@example.com'],
        subject: 'Domain Check',
        html: '<p>Domain verification check</p>'
      }
    });

    if (error) {
      console.error('Error checking domain status:', error);
      return {
        verified: false,
        status: `Error: ${error.message}`,
        domains: []
      };
    }

    console.log('Domain status check result:', data);
    return data;
  } catch (error) {
    console.error('Failed to check domain status:', error);
    return {
      verified: false,
      status: `Exception: ${error instanceof Error ? error.message : 'Unknown error'}`,
      domains: []
    };
  }
};

export const resendAllPendingConfirmationEmails = async () => {
  try {
    console.log('Fetching users with unconfirmed emails...');
    
    const { data, error } = await supabase.functions.invoke('send-resend-email', {
      body: {
        resendAllPendingConfirmations: true,
        // Adding minimal required fields for the edge function
        to: ['placeholder@example.com'],
        subject: 'Confirmation',
        html: '<p>Confirmation</p>'
      }
    });

    if (error) {
      console.error('Error fetching unconfirmed users:', error);
      throw error;
    }

    console.log('Confirmation emails resend result:', data);
    return {
      success: true,
      message: `Confirmation emails sent to ${data?.count || 0} users`,
      details: data
    };
  } catch (error) {
    console.error('Failed to resend confirmation emails:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: null
    };
  }
};

export const updateUserWabAdminStatus = async (
  userId: string,
  setAsAdmin: boolean
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { 
        success: false, 
        message: "You must be logged in to perform this action"
      };
    }
    
    const { data: adminCheck, error: adminCheckError } = await supabase.rpc(
      'is_wab_admin',
      { user_id: session.user.id }
    );
    
    if (adminCheckError || !adminCheck) {
      console.error('Admin check failed:', adminCheckError);
      return { 
        success: false, 
        message: "You don't have permission to update admin status"
      };
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ wab_admin: setAsAdmin })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating admin status:', error);
      return { 
        success: false, 
        message: `Failed to ${setAsAdmin ? 'grant' : 'revoke'} admin status: ${error.message}` 
      };
    }
    
    return { 
      success: true, 
      message: `Successfully ${setAsAdmin ? 'granted' : 'revoked'} admin privileges` 
    };
  } catch (error) {
    console.error('Unexpected error updating admin status:', error);
    return { 
      success: false, 
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const getWabAdmins = async (): Promise<any[]> => {
  try {
    // First get the admin profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, wab_id')
      .eq('wab_admin', true)
      .order('username');
    
    if (error) {
      console.error('Error fetching wab admins:', error);
      return [];
    }
    
    // Then for each admin, get their email via a separate service role query
    const adminsWithEmails = await Promise.all(
      data.map(async (admin) => {
        // Using RPC call to get user email safely since we can't directly query auth.users
        const { data: userData, error: userError } = await supabase
          .rpc('get_user_email', { user_id: admin.id })
          .single();
        
        return {
          ...admin,
          // If the RPC fails or returns no data, use a fallback
          email: userError ? 'Email not accessible' : (userData?.email || 'No email found')
        };
      })
    );
    
    return adminsWithEmails;
  } catch (error) {
    console.error('Unexpected error fetching wab admins:', error);
    return [];
  }
};

if (typeof window !== 'undefined') {
  (window as any).testResendEmail = testResendEmail;
  (window as any).checkDomainVerificationStatus = checkDomainVerificationStatus;
  (window as any).resendAllPendingConfirmationEmails = resendAllPendingConfirmationEmails;
  (window as any).updateUserWabAdminStatus = updateUserWabAdminStatus;
  (window as any).getWabAdmins = getWabAdmins;
}

declare global {
  interface Window {
    testResendEmail: typeof testResendEmail;
    checkDomainVerificationStatus: typeof checkDomainVerificationStatus;
    resendAllPendingConfirmationEmails: typeof resendAllPendingConfirmationEmails;
    updateUserWabAdminStatus: typeof updateUserWabAdminStatus;
    getWabAdmins: typeof getWabAdmins;
  }
}
