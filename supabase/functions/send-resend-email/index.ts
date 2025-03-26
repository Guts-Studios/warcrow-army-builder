import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  type?: 'welcome' | 'reset_password';
  token?: string;
  fromEmail?: string; 
  fromName?: string;  
  checkDomainOnly?: boolean; 
  resendAllPendingConfirmations?: boolean; 
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Resend email function received request:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log('Received email request:', {
      to: emailRequest.to,
      subject: emailRequest.subject,
      type: emailRequest.type || 'standard',
      fromEmail: emailRequest.fromEmail,
      fromName: emailRequest.fromName,
      checkDomainOnly: emailRequest.checkDomainOnly,
      resendAllPendingConfirmations: emailRequest.resendAllPendingConfirmations
    });

    // Check if this is just a domain verification check
    if (emailRequest.checkDomainOnly) {
      console.log('Domain verification check requested');
      
      try {
        // Get all domains in the Resend account
        const domainsResponse = await resend.domains.list();
        
        console.log('Domains in Resend account:', JSON.stringify(domainsResponse));
        
        // Default email domain
        const defaultDomain = "updates.warcrowarmy.com";
        
        // Check if our domain is in the verified list
        const ourDomain = emailRequest.fromEmail ? 
          emailRequest.fromEmail.split('@')[1] : 
          defaultDomain;
          
        const verifiedDomains = domainsResponse.data || [];
        const domainRecord = verifiedDomains.find(
          domain => domain.name === ourDomain
        );
        
        const isDomainVerified = domainRecord?.status === 'verified';
        
        console.log(`Domain ${ourDomain} verification status:`, 
          isDomainVerified ? 'Verified' : `Not verified (${domainRecord?.status || 'not found'})`);
        
        return new Response(JSON.stringify({
          verified: isDomainVerified,
          status: domainRecord ? 
            `Domain ${ourDomain} is ${domainRecord.status}` : 
            `Domain ${ourDomain} not found in Resend account`,
          timestamp: new Date().toISOString(),
          domains: verifiedDomains
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (domainError) {
        console.error('Failed to check domain verification status:', domainError);
        return new Response(
          JSON.stringify({ 
            verified: false,
            status: `Error checking domains: ${domainError.message || 'Unknown error'}`,
            timestamp: new Date().toISOString(),
            domains: []
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Handle resending all pending confirmation emails
    if (emailRequest.resendAllPendingConfirmations) {
      console.log('Attempting to resend all pending confirmation emails');
      
      try {
        // Need to use service role key to access user data
        const supabaseAdminUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseAdminUrl || !supabaseServiceKey) {
          throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
        }
        
        // Fetch users with unconfirmed emails - using proper API endpoint for auth users
        const response = await fetch(`${supabaseAdminUrl}/auth/v1/users?confirmed_at=is.null`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
        }
        
        const responseData = await response.json();
        const unconfirmedUsers = responseData.users || [];
        console.log(`Found ${unconfirmedUsers.length} users with unconfirmed emails`);
        
        // Resend confirmation emails
        const results = [];
        for (const user of unconfirmedUsers) {
          console.log(`Resending confirmation email to ${user.email}`);
          
          try {
            // Send confirmation email through Supabase
            const resendResponse = await fetch(`${supabaseAdminUrl}/auth/v1/users/${user.id}/send-email-verification`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey,
                'Content-Type': 'application/json',
              }
            });
            
            if (!resendResponse.ok) {
              const errorText = await resendResponse.text();
              console.error(`Failed to resend confirmation to ${user.email}: ${resendResponse.status} ${errorText}`);
              results.push({
                email: user.email,
                success: false,
                error: `${resendResponse.status}: ${errorText}`
              });
            } else {
              console.log(`Successfully resent confirmation email to ${user.email}`);
              results.push({
                email: user.email,
                success: true
              });
            }
          } catch (sendError) {
            console.error(`Error sending to ${user.email}:`, sendError);
            results.push({
              email: user.email,
              success: false,
              error: sendError.message || 'Unknown error'
            });
          }
        }
        
        return new Response(JSON.stringify({
          count: unconfirmedUsers.length,
          results: results,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error('Failed to process resend confirmation request:', error);
        return new Response(
          JSON.stringify({ 
            error: error.message || 'Unknown error',
            timestamp: new Date().toISOString()
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Improved error handling and logging
    if (!emailRequest.to || !Array.isArray(emailRequest.to) || emailRequest.to.length === 0) {
      console.error('Invalid recipient list:', emailRequest.to);
      return new Response(
        JSON.stringify({ error: 'Invalid recipient list' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the API key from environment
    const apiKey = Deno.env.get("RESEND_API_KEY");
    // For security, we only log a portion of the API key for debugging
    const maskedApiKey = apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : null;
    
    // Use custom from email if provided, otherwise use default
    const fromEmail = emailRequest.fromEmail || "updates@updates.warcrowarmy.com";
    const fromName = emailRequest.fromName || "Warcrow Army";
    const fromField = `${fromName} <${fromEmail}>`;

    // Log the full configuration being used
    console.log('Sending email with configuration:', {
      from: fromField,
      to: emailRequest.to,
      subject: emailRequest.subject,
      htmlLength: emailRequest.html?.length || 0,
      apiKeyPresent: !!apiKey,
      apiKeyMasked: maskedApiKey,
      domainUsed: fromEmail.split('@')[1]
    });

    // Fetch verified domains to check if our domain is actually verified
    try {
      const domainsResponse = await resend.domains.list();
      console.log('Verified domains in Resend account:', JSON.stringify(domainsResponse));
      
      // Check if our domain is in the verified list
      const ourDomain = fromEmail.split('@')[1];
      const isDomainVerified = domainsResponse.data?.some(
        domain => domain.name === ourDomain && domain.status === 'verified'
      );
      
      console.log(`Domain ${ourDomain} verification status:`, isDomainVerified ? 'Verified' : 'Not verified');
      
      if (!isDomainVerified) {
        console.warn(`Warning: The domain ${ourDomain} appears to not be verified in this Resend account.`);
      }
    } catch (domainError) {
      console.error('Failed to check domain verification status:', domainError);
    }

    const emailResponse = await resend.emails.send({
      from: fromField,
      to: emailRequest.to,
      subject: emailRequest.subject,
      html: emailRequest.html,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error('Error in send-resend-email function:', {
      error,
      message: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response data'
    });

    let errorMessage = error.message || 'Unknown error';
    let errorDetails = 'No additional details available';
    
    if (error.response?.data) {
      errorDetails = typeof error.response.data === 'string' 
        ? error.response.data 
        : JSON.stringify(error.response.data);
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
