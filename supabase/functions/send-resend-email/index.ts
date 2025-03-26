
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
      type: emailRequest.type || 'standard'
    });

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

    // Log the full configuration being used (except API key)
    console.log('Sending email with configuration:', {
      from: "Warcrow Army <updates@updates.warcrowarmy.com>",
      to: emailRequest.to,
      subject: emailRequest.subject,
      htmlLength: emailRequest.html?.length || 0,
      apiKeyPresent: !!Deno.env.get("RESEND_API_KEY"),
    });

    const emailResponse = await resend.emails.send({
      from: "Warcrow Army <updates@updates.warcrowarmy.com>", // Using your verified domain
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
