
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PATREON_CLIENT_ID = Deno.env.get("PATREON_CLIENT_ID");
const PATREON_CLIENT_SECRET = Deno.env.get("PATREON_CLIENT_SECRET");
const PATREON_CREATOR_ACCESS_TOKEN = Deno.env.get("PATREON_CREATOR_ACCESS_TOKEN");
const PATREON_CREATOR_REFRESH_TOKEN = Deno.env.get("PATREON_CREATOR_REFRESH_TOKEN");
const PATREON_API_BASE = "https://www.patreon.com/api/oauth2/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to fetch from Patreon API
async function fetchFromPatreon(endpoint: string, options: RequestInit = {}) {
  const url = `${PATREON_API_BASE}${endpoint}`;
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${PATREON_CREATOR_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Patreon API error: ${response.status} - ${error}`);
    throw new Error(`Patreon API error: ${response.status}`);
  }

  return response.json();
}

// Handle token refresh - this would be called when access token expires
async function refreshPatreonToken() {
  const url = "https://www.patreon.com/api/oauth2/token";
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: PATREON_CREATOR_REFRESH_TOKEN || "",
    client_id: PATREON_CLIENT_ID || "",
    client_secret: PATREON_CLIENT_SECRET || "",
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Token refresh error: ${response.status} - ${error}`);
    throw new Error(`Token refresh error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Get information about the campaign (creator page)
async function getCampaignInfo() {
  return fetchFromPatreon(
    "/campaigns?include=tiers&fields[tier]=title,description,amount_cents,published"
  );
}

// Get patrons of the campaign
async function getPatrons() {
  return fetchFromPatreon(
    "/campaigns?include=members&fields[member]=full_name,email,patron_status"
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.replace("/patreon-api", "");

    // Only allow specific endpoints
    if (endpoint === "/campaign") {
      const campaignData = await getCampaignInfo();
      return new Response(JSON.stringify(campaignData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (endpoint === "/patrons") {
      const patronsData = await getPatrons();
      return new Response(JSON.stringify(patronsData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (endpoint === "/refresh-token") {
      // This would be a protected endpoint only accessible by admin
      const tokenData = await refreshPatreonToken();
      return new Response(JSON.stringify(tokenData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }
  } catch (error) {
    console.error("Patreon API function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
