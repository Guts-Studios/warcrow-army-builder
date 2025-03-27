
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
  testConfirmationEmail?: boolean;
  email?: string;
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
      resendAllPendingConfirmations: emailRequest.resendAllPendingConfirmations,
      testConfirmationEmail: emailRequest.testConfirmationEmail,
      email: emailRequest.email
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
          
        // Fix the domain verification check - properly access the domains data
        const verifiedDomains = Array.isArray(domainsResponse.data) ? 
          domainsResponse.data : 
          (domainsResponse.data?.data || []);
        
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

    // Handle specific test for confirmation email
    if (emailRequest.testConfirmationEmail && emailRequest.email) {
      console.log(`Testing confirmation email delivery to: ${emailRequest.email}`);
      
      try {
        // Need to use service role key to access auth API
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (!supabaseUrl || !serviceRoleKey) {
          throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
        }
        
        // Send an email directly using Resend to verify email deliverability
        const directEmailResult = await resend.emails.send({
          from: "Warcrow Army <updates@updates.warcrowarmy.com>",
          to: [emailRequest.email],
          subject: "Email Deliverability Test",
          html: `
            <h1>Email Deliverability Test</h1>
            <p>This is a test email to verify that we can send emails to your account.</p>
            <p>If you are seeing this, it means that our system can successfully deliver emails to you.</p>
            <p>Next, we will try to send a confirmation email using Supabase's authentication system.</p>
          `,
        });
        
        console.log("Direct email test result:", directEmailResult);
        
        // Now attempt to send a confirmation email through Supabase
        console.log(`Sending Supabase confirmation email to: ${emailRequest.email}`);
        
        // First check if user exists
        const userCheckResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users?email=${encodeURIComponent(emailRequest.email)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
          },
        });
        
        if (!userCheckResponse.ok) {
          const errorText = await userCheckResponse.text();
          console.error(`Failed to check if user exists: ${userCheckResponse.status} ${errorText}`);
          return new Response(
            JSON.stringify({ 
              error: `Failed to check if user exists: ${userCheckResponse.status}`,
              details: errorText,
              timestamp: new Date().toISOString()
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        const userCheckData = await userCheckResponse.json();
        console.log("User check data:", JSON.stringify(userCheckData));
        
        const users = userCheckData.users || [];
        let userId = null;
        
        if (users.length > 0) {
          userId = users[0].id;
          console.log(`Found existing user: ${userId}`);
          
          // FIXED: Send confirmation email to existing user - using correct endpoint
          const resendResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}/send-magic-link`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailRequest.email
            })
          });
          
          if (!resendResponse.ok) {
            const errorText = await resendResponse.text();
            console.error(`Failed to send magic link to ${emailRequest.email}: ${resendResponse.status} ${errorText}`);
            
            // Try alternative approach with email confirmation
            console.log("Trying alternative authentication email approach");
            const alternativeResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}/generate-link`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: "signup",
                email: emailRequest.email
              })
            });
            
            if (!alternativeResponse.ok) {
              const altErrorText = await alternativeResponse.text();
              console.error(`Failed to generate authentication link: ${alternativeResponse.status} ${altErrorText}`);
              return new Response(
                JSON.stringify({ 
                  error: `Failed to send confirmation email: ${resendResponse.status}`,
                  details: errorText,
                  directEmailSent: !!directEmailResult.id,
                  timestamp: new Date().toISOString()
                }),
                {
                  status: 500,
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
              );
            }
            
            const alternativeData = await alternativeResponse.json();
            console.log("Alternative authentication link generated:", JSON.stringify(alternativeData));
          } else {
            console.log(`Successfully sent magic link to ${emailRequest.email}`);
          }
        } else {
          console.log(`User ${emailRequest.email} not found, creating invite`);
          
          // User doesn't exist, create an invite
          const createUserResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailRequest.email,
              email_confirm: true,
              user_metadata: {
                invited_at: new Date().toISOString()
              },
              app_metadata: {
                provider: "email"
              }
            })
          });
          
          if (!createUserResponse.ok) {
            const errorText = await createUserResponse.text();
            console.error(`Failed to create user invite: ${createUserResponse.status} ${errorText}`);
            return new Response(
              JSON.stringify({ 
                error: `Failed to create user invite: ${createUserResponse.status}`,
                details: errorText,
                directEmailSent: !!directEmailResult.id,
                timestamp: new Date().toISOString()
              }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }
          
          const createUserData = await createUserResponse.json();
          console.log("Created user invite:", JSON.stringify(createUserData));
          
          userId = createUserData.id;
          
          // Send invite email to new user
          const inviteResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}/send-magic-link`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: emailRequest.email
            })
          });
          
          if (!inviteResponse.ok) {
            const errorText = await inviteResponse.text();
            console.error(`Failed to send invite email: ${inviteResponse.status} ${errorText}`);
            
            // Try alternative approach for new user
            console.log("Trying alternative invite approach");
            const alternativeResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}/generate-link`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: "signup",
                email: emailRequest.email
              })
            });
            
            if (!alternativeResponse.ok) {
              const altErrorText = await alternativeResponse.text();
              console.error(`Failed to generate authentication link: ${alternativeResponse.status} ${altErrorText}`);
              return new Response(
                JSON.stringify({ 
                  error: `Failed to send invite email: ${inviteResponse.status}`,
                  details: errorText,
                  directEmailSent: !!directEmailResult.id,
                  timestamp: new Date().toISOString()
                }),
                {
                  status: 500,
                  headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
              );
            }
            
            const alternativeData = await alternativeResponse.json();
            console.log("Alternative authentication link generated:", JSON.stringify(alternativeData));
          } else {
            console.log(`Successfully sent invite email to new user ${emailRequest.email}`);
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          message: `Test confirmation email sent to ${emailRequest.email}`,
          directEmailSent: !!directEmailResult.id,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (confirmError) {
        console.error('Error in test confirmation email:', {
          error: confirmError,
          message: confirmError.message,
          stack: confirmError.stack
        });
        
        return new Response(
          JSON.stringify({ 
            error: confirmError.message || 'Unknown error',
            timestamp: new Date().toISOString()
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
        const response = await fetch(`${supabaseAdminUrl}/auth/v1/admin/users?email_confirmed=is.null`, {
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
            // Use the correct endpoint for sending magic links
            const resendResponse = await fetch(`${supabaseAdminUrl}/auth/v1/admin/users/${user.id}/send-magic-link`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email
              })
            });
            
            if (!resendResponse.ok) {
              // Try alternative approach
              console.log(`Magic link approach failed for ${user.email}, trying generate-link`);
              const alternativeResponse = await fetch(`${supabaseAdminUrl}/auth/v1/admin/users/${user.id}/generate-link`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${supabaseServiceKey}`,
                  'apikey': supabaseServiceKey,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  type: "signup",
                  email: user.email
                })
              });
              
              if (!alternativeResponse.ok) {
                const altErrorText = await alternativeResponse.text();
                console.error(`Failed to generate link for ${user.email}: ${alternativeResponse.status} ${altErrorText}`);
                results.push({
                  email: user.email,
                  success: false,
                  error: `${alternativeResponse.status}: ${altErrorText}`
                });
              } else {
                console.log(`Successfully generated link for ${user.email}`);
                results.push({
                  email: user.email,
                  success: true,
                  method: "generate-link"
                });
              }
            } else {
              console.log(`Successfully resent magic link to ${user.email}`);
              results.push({
                email: user.email,
                success: true,
                method: "magic-link"
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
      
      // Fix this check to properly access domain data
      const ourDomain = fromEmail.split('@')[1];
      const verifiedDomains = Array.isArray(domainsResponse.data) ? 
        domainsResponse.data : 
        (domainsResponse.data?.data || []);
        
      const isDomainVerified = verifiedDomains.some(
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
