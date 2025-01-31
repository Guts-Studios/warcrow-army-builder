import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Email function received request:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY');
    const MAILGUN_DOMAIN = 'mg.warcrow-army.com';

    if (!MAILGUN_API_KEY) {
      console.error('MAILGUN_API_KEY is not configured');
      throw new Error('MAILGUN_API_KEY is not configured');
    }

    const emailRequest: EmailRequest = await req.json();
    console.log('Received email request:', {
      to: emailRequest.to,
      subject: emailRequest.subject
    });

    if (!emailRequest.to || emailRequest.to.length === 0) {
      throw new Error('No recipient email addresses provided');
    }

    const auth = btoa(`api:${MAILGUN_API_KEY}`);
    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

    const formData = new FormData();
    formData.append('from', 'Warcrow Army Builder <noreply@warcrow-army.com>');
    emailRequest.to.forEach(recipient => {
      formData.append('to', recipient);
    });
    formData.append('subject', emailRequest.subject);
    formData.append('html', emailRequest.html);

    console.log('Sending request to Mailgun:', {
      url: mailgunUrl,
      to: emailRequest.to,
      subject: emailRequest.subject
    });

    const response = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log('Mailgun API Response:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    if (!response.ok) {
      console.error('Mailgun API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseText
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to send email',
          details: responseText
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.warn('Could not parse Mailgun response as JSON:', responseText);
      result = { message: responseText };
    }

    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({ success: true, ...result }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-email function:', {
      error,
      message: error.message,
      stack: error.stack
    });

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.response?.data || 'No additional details available'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);