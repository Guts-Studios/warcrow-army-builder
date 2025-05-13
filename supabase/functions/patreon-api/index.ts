
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const PATREON_ACCESS_TOKEN = Deno.env.get("PATREON_ACCESS_TOKEN") || "";
const PATREON_REFRESH_TOKEN = Deno.env.get("PATREON_REFRESH_TOKEN") || "";
const PATREON_CLIENT_ID = Deno.env.get("PATREON_CLIENT_ID") || "";
const PATREON_CLIENT_SECRET = Deno.env.get("PATREON_CLIENT_SECRET") || "";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to fetch data from Patreon API
async function fetchFromPatreon(url: string) {
  try {
    console.log(`Fetching from Patreon: ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PATREON_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const text = await response.text();
      console.error(`Patreon API error: ${response.status} - ${text}`);
      throw new Error(`Patreon API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Patreon API response received: ${url}`);
    return data;
  } catch (error) {
    console.error("Error fetching from Patreon:", error);
    throw error;
  }
}

// Get campaigns for the creator
async function getCreatorCampaigns() {
  try {
    // Fields to request for campaigns
    const campaignFields = [
      "created_at", "creation_name", "patron_count", "pay_per_name",
      "pledge_url", "published_at", "url", "vanity", "name"
    ].join(",");
    
    // First try with the campaigns endpoint
    try {
      const url = `https://www.patreon.com/api/oauth2/v2/campaigns?fields[campaign]=${campaignFields}&include=tiers`;
      console.log(`Fetching creator campaigns from Patreon API...`);
      const data = await fetchFromPatreon(url);
      
      return {
        success: true,
        campaigns: data.data.map((campaign: any) => ({
          id: campaign.id,
          name: campaign.attributes.name || campaign.attributes.creation_name,
          patron_count: campaign.attributes.patron_count,
          created_at: campaign.attributes.created_at,
          url: campaign.attributes.url || `https://www.patreon.com/c/${campaign.id}`
        }))
      };
    } catch (error) {
      console.error("Error fetching creator campaigns:", error);
      
      // Fallback to identity endpoint if the campaigns endpoint fails
      console.log("Trying fallback approach for creator campaigns...");
      const url = "https://www.patreon.com/api/oauth2/v2/identity?include=campaign";
      const data = await fetchFromPatreon(url);
      
      // Extract campaign data from included array
      const campaigns = data.included
        .filter((item: any) => item.type === 'campaign')
        .map((campaign: any) => ({
          id: campaign.id,
          name: campaign.attributes?.name || "Warcrow Army Builder",
          patron_count: campaign.attributes?.patron_count || 0,
          created_at: campaign.attributes?.created_at,
          url: campaign.attributes?.url || `https://www.patreon.com/c/${campaign.id}`
        }));
      
      console.log(`Fallback method found ${campaigns.length} campaigns`);
      
      return {
        success: true,
        campaigns
      };
    }
  } catch (error) {
    console.error("Error in getCreatorCampaigns:", error);
    return {
      success: false,
      error: error.message,
      campaigns: []
    };
  }
}

// Get members for a specific campaign
async function getCampaignMembers(campaignId: string) {
  try {
    const includeFields = "user";
    const memberFields = "full_name,email,pledge_relationship_start,currently_entitled_amount_cents,last_charge_date,patron_status";
    const userFields = "full_name,email,image_url";
    
    const url = `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=${includeFields}&fields[member]=${memberFields}&fields[user]=${userFields}`;
    console.log(`Fetching members for campaign ${campaignId}`);
    
    const data = await fetchFromPatreon(url);
    console.log(`Found ${data.data?.length || 0} members for campaign ${campaignId}`);
    
    // Process members data to extract user details
    const members = data.data.map((member: any) => {
      // Find related user data in included array
      const userId = member.relationships?.user?.data?.id;
      const userData = userId ? data.included?.find((included: any) => 
        included.type === 'user' && included.id === userId
      ) : null;
      
      return {
        id: member.id,
        fullName: userData?.attributes?.full_name || member.attributes?.full_name || "Anonymous Patron",
        email: userData?.attributes?.email || member.attributes?.email,
        imageUrl: userData?.attributes?.image_url,
        pledgeStart: member.attributes?.pledge_relationship_start,
        amountCents: member.attributes?.currently_entitled_amount_cents,
        lastChargeDate: member.attributes?.last_charge_date,
        status: member.attributes?.patron_status
      };
    });
    
    return {
      success: true,
      members
    };
  } catch (error) {
    console.error("Error in getCampaignMembers:", error);
    return {
      success: false,
      error: error.message,
      members: []
    };
  }
}

// Handle API status check
function handleStatusCheck() {
  return {
    status: "ok",
    timestamp: new Date().toISOString()
  };
}

// Main HTTP handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { endpoint, campaignId } = body;
    
    console.log(`Processing request for endpoint: ${endpoint}`);
    
    let response: any = {};
    
    switch (endpoint) {
      case "status":
        response = handleStatusCheck();
        break;
        
      case "creator-campaigns":
        response = await getCreatorCampaigns();
        break;
        
      case "campaign-members":
        if (!campaignId) {
          return new Response(
            JSON.stringify({ success: false, error: "Campaign ID is required" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        response = await getCampaignMembers(campaignId);
        break;
        
      default:
        return new Response(
          JSON.stringify({ success: false, error: "Unknown endpoint" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
    
    console.log(`Returning response for endpoint ${endpoint}`);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
