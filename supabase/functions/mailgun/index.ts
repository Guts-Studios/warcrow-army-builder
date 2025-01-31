import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

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

// Verify Mailgun webhook signature
function verifyWebhookSignature(
  timestamp: string,
  token: string,
  signature: string
): boolean {
  if (!WEBHOOK_SIGNING_KEY) {
    console.error("Webhook signing key not configured");
    return false;
  }

  const encodedToken = new TextEncoder().encode(
    `${timestamp}${token}`
  );

  const key = new TextEncoder().encode(WEBHOOK_SIGNING_KEY);
  const hmac = createHmac("sha256", key);
  hmac.update(encodedToken);
  const computedSignature = hmac.toString();

  return computedSignature === signature;
}

// Handle incoming webhook events
async function handleWebhook(payload: MailgunWebhookEvent): Promise<void> {
  const { signature, "event-data": eventData } = payload;
  
  // Verify webhook signature
  if (!verifyWebhookSignature(
    signature.timestamp,
    signature.token,
    signature.signature
  )) {
    throw new Error("Invalid webhook signature");
  }

  console.log("Received valid webhook event:", {
    event: eventData.event,
    recipient: eventData.recipient,
    timestamp: eventData.timestamp,
    subject: eventData.message.headers.subject
  });

  // Handle different event types
  switch (eventData.event) {
    case "delivered":
      console.log("Email delivered successfully");
      break;
    case "opened":
      console.log("Email was opened");
      break;
    case "clicked":
      console.log("Link in email was clicked");
      break;
    case "bounced":
      console.log("Email bounced");
      break;
    default:
      console.log(`Unhandled event type: ${eventData.event}`);
  }
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
        const payload: MailgunWebhookEvent = await req.json();
        await handleWebhook(payload);
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