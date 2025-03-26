
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
  fromEmail?: string; // Allow specifying the sender email
  fromName?: string;  // Allow specifying the sender name
  checkDomainOnly?: boolean; // Flag to only check domain verification status
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
      checkDomainOnly: emailRequest.checkDomainOnly
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
          
        const domainRecord = domainsResponse.data?.find(
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
          domains: domainsResponse.data || []
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
