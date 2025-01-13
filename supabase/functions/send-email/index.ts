import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Edge function received request:', req.method);
  
  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    console.log('Received email request:', {
      ...emailRequest,
      token: emailRequest.token ? 'PRESENT' : 'MISSING'
    });

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      throw new Error('RESEND_API_KEY is not configured');
    }

    const logoUrl = "https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z";
    let htmlContent = emailRequest.html;

    // If this is a password reset email, use the reset password template
    if (emailRequest.type === 'reset_password' && emailRequest.token) {
      // Format the token as a query parameter instead of hash
      const resetUrl = `https://warcrowarmy.com/reset-password?access_token=${encodeURIComponent(emailRequest.token)}&type=recovery`;
      console.log('Generated reset URL:', resetUrl);
      
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${logoUrl}" alt="Warcrow Logo" style="height: 80px; margin: 0 auto;">
          </div>
          <div style="background-color: #1a1a1a; padding: 30px; border-radius: 8px; color: #ffffff;">
            <h1 style="color: #FFD700; margin-bottom: 20px; text-align: center;">Reset Your Password</h1>
            <p style="margin-bottom: 20px; line-height: 1.6;">
              You've requested to reset your password for your Warcrow Army Builder account. Click the button below to set a new password:
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${resetUrl}" 
                 style="background-color: #FFD700; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="margin-top: 20px; line-height: 1.6; font-size: 14px;">
              If you didn't request this password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666666; font-size: 12px;">
            <p>© 2024 Warcrow Army Builder. All rights reserved.</p>
          </div>
        </div>
      `;
    }

    console.log('Sending request to Resend API');
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Warcrow Army Builder <noreply@warcrow-army.com>",
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: htmlContent,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Successfully sent email:', data);

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error('Resend API error:', error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in sendemail function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);