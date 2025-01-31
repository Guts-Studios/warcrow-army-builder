import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const WEBHOOK_SIGNING_KEY = Deno.env.get("MAILGUN_WEBHOOK_SIGNING_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MailgunWebhookEvent {
  signature: {
    timestamp: string;
    token: string;
    signature: string;
  };
  "event-data": {
    event: string;
    timestamp: number;
    recipient: string;
    message: {
      headers: {
        from: string;
        to: string;
        subject: string;
      };
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === "POST") {
      const contentType = req.headers.get("content-type") || "";
      
      // Handle webhook events
      if (contentType.includes("application/json")) {
        const payload = await req.json();
        console.log("Received webhook payload:", payload);

        return new Response(JSON.stringify({ status: "success" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  } catch (error) {
    console.error("Error in mailgun webhook handler:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});