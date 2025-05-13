
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const PATREON_CLIENT_ID = Deno.env.get("PATREON_CLIENT_ID");
const PATREON_CLIENT_SECRET = Deno.env.get("PATREON_CLIENT_SECRET");
const PATREON_CREATOR_ACCESS_TOKEN = Deno.env.get("PATREON_CREATOR_ACCESS_TOKEN");
const PATREON_CREATOR_REFRESH_TOKEN = Deno.env.get("PATREON_CREATOR_REFRESH_TOKEN");
const PATREON_API_BASE = "https://www.patreon.com/api/oauth2/v2";
const PATREON_API_V1_BASE = "https://www.patreon.com/api/oauth2/api/campaigns";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to fetch from Patreon API
async function fetchFromPatreon(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${PATREON_API_BASE}${endpoint}`;
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${PATREON_CREATOR_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  console.log(`Fetching from Patreon: ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Patreon API error: ${response.status} - ${error}`);
    throw new Error(`Patreon API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Patreon API response received: ${url}`);
  return data;
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
  console.log("Token refreshed successfully");
  return data;
}

// Get information about the campaign (creator page)
async function getCampaignInfo() {
  try {
    const campaignData = await fetchFromPatreon(
      "/campaigns?include=tiers&fields[tier]=title,description,amount_cents,published"
    );
    
    // Extract the first campaign
    const campaign = campaignData.data?.[0] || null;
    const tiers = campaignData.included?.filter(item => item.type === "tier") || [];
    
    return {
      campaign: campaign ? {
        id: campaign.id,
        name: campaign.attributes?.name || "Warcrow Army Builder",
        url: campaign.attributes?.url || "https://www.patreon.com/c/GutzStudio",
        summary: campaign.attributes?.summary || "",
        patron_count: campaign.attributes?.patron_count || 0,
        pledge_sum: campaign.attributes?.pledge_sum || 0,
        currency: campaign.attributes?.currency || "USD",
        created_at: campaign.attributes?.created_at || new Date().toISOString()
      } : null,
      tiers: tiers.map(tier => ({
        id: tier.id,
        title: tier.attributes?.title || "Supporter",
        description: tier.attributes?.description || "",
        amount_cents: tier.attributes?.amount_cents || 0, 
        amount: (tier.attributes?.amount_cents || 0) / 100,
        url: tier.attributes?.url || "",
        published: tier.attributes?.published || false,
        patron_count: tier.attributes?.patron_count || 0
      }))
    };
  } catch (error) {
    console.error("Error fetching campaign info:", error);
    return { campaign: null, tiers: [] };
  }
}

// Get patrons of the campaign
async function getPatrons() {
  try {
    console.log("Fetching patrons from Patreon API...");
    
    // First attempt to get all members including patrons from the campaign endpoint
    const campaignData = await fetchFromPatreon(
      "/campaigns?include=members&fields[member]=full_name,email,patron_status,currently_entitled_amount_cents"
    );
    
    console.log(`Members data received. Processing ${campaignData.included?.length || 0} members`);
    
    // Filter to only include active patrons
    const members = campaignData.included?.filter(item => 
      item.type === "member" && 
      item.attributes?.patron_status === "active_patron"
    ) || [];
    
    console.log(`Found ${members.length} active patrons`);
    
    const patrons = members.map(member => ({
      id: member.id,
      full_name: member.attributes?.full_name || "Anonymous Supporter",
      patron_status: member.attributes?.patron_status || "active_patron",
      currently_entitled_amount_cents: member.attributes?.currently_entitled_amount_cents || 0
    }));
    
    // If we have no patrons in the primary approach, try a fallback method
    if (patrons.length === 0) {
      console.log("No patrons found using primary method, trying fallback...");
      
      // Get the campaign ID first
      const campaignIdResponse = await fetchFromPatreon("/current_user/campaigns");
      const campaignId = campaignIdResponse.data?.[0]?.id;
      
      if (campaignId) {
        console.log(`Using campaign ID: ${campaignId} for fallback`);
        // Use campaign ID to fetch patrons directly
        const patronsResponse = await fetchFromPatreon(
          `/campaigns/${campaignId}/members?include=currently_entitled_tiers&fields[member]=full_name,patron_status,currently_entitled_amount_cents`
        );
        
        const fallbackPatrons = patronsResponse.data?.map(patron => ({
          id: patron.id,
          full_name: patron.attributes?.full_name || "Anonymous Supporter",
          patron_status: patron.attributes?.patron_status || "active_patron",
          currently_entitled_amount_cents: patron.attributes?.currently_entitled_amount_cents || 0
        })) || [];
        
        console.log(`Fallback method found ${fallbackPatrons.length} patrons`);
        return { patrons: fallbackPatrons };
      }
    }
    
    return { patrons };
  } catch (error) {
    console.error("Error fetching patrons:", error);
    return { patrons: [] };
  }
}

// Get the number of patrons for the creator
async function getPatronCount() {
  try {
    const campaignInfo = await getCampaignInfo();
    return { 
      patron_count: campaignInfo.campaign?.patron_count || 0 
    };
  } catch (error) {
    console.error("Error fetching patron count:", error);
    return { patron_count: 0 };
  }
}

// Simple status check endpoint for monitoring
async function getApiStatus() {
  return {
    status: "operational",
    timestamp: new Date().toISOString(),
    api_version: "v2"
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Parse the JSON body if it exists
    const { endpoint } = await req.json().catch(() => ({ endpoint: "" }));
    console.log(`Processing request for endpoint: ${endpoint}`);

    let responseData;
    
    // Only allow specific endpoints
    if (endpoint === "campaign") {
      responseData = await getCampaignInfo();
    } else if (endpoint === "patrons") {
      responseData = await getPatrons();
    } else if (endpoint === "patron-count") {
      responseData = await getPatronCount();
    } else if (endpoint === "tiers") {
      const campaignInfo = await getCampaignInfo();
      responseData = { tiers: campaignInfo.tiers };
    } else if (endpoint === "refresh-token") {
      // This would be a protected endpoint only accessible by admin
      responseData = await refreshPatreonToken();
    } else if (endpoint === "status") {
      responseData = await getApiStatus();
    } else {
      return new Response(JSON.stringify({ error: "Invalid endpoint" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
    
    console.log(`Returning response for endpoint ${endpoint}`);
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Patreon API function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
