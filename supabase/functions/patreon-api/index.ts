
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

// Get patrons of the campaign - Updated to use the correct endpoint
async function getPatrons() {
  try {
    console.log("Fetching patrons from Patreon API...");
    
    // First get the campaign ID
    const campaignIdResponse = await fetchFromPatreon("/current_user/campaigns");
    const campaignId = campaignIdResponse.data?.[0]?.id;
    
    if (!campaignId) {
      console.log("Could not find campaign ID");
      return { patrons: [] };
    }
    
    console.log(`Using campaign ID: ${campaignId} for patrons`);
    
    // Use V2 API with the correct endpoint structure for members
    const membersResponse = await fetchFromPatreon(
      `/campaigns/${campaignId}/members?include=user&fields[member]=full_name,patron_status,currently_entitled_amount_cents,pledge_relationship_start`
    );
    
    if (!membersResponse.data) {
      console.log("No members data returned from API");
      return { patrons: [] };
    }
    
    console.log(`Found ${membersResponse.data.length} members`);
    
    // Filter to only include active patrons
    const activePatrons = membersResponse.data.filter((member: any) => 
      member.attributes?.patron_status === "active_patron"
    );
    
    console.log(`Found ${activePatrons.length} active patrons`);
    
    const patrons = activePatrons.map((patron: any) => ({
      id: patron.id,
      full_name: patron.attributes?.full_name || "Anonymous Supporter",
      patron_status: patron.attributes?.patron_status || "active_patron",
      currently_entitled_amount_cents: patron.attributes?.currently_entitled_amount_cents || 0,
      pledge_relationship_start: patron.attributes?.pledge_relationship_start || null
    }));
    
    // Sort by pledge start date if available
    patrons.sort((a: any, b: any) => {
      if (!a.pledge_relationship_start) return 1;
      if (!b.pledge_relationship_start) return -1;
      return new Date(a.pledge_relationship_start).getTime() - new Date(b.pledge_relationship_start).getTime();
    });
    
    return { patrons };
  } catch (error) {
    console.error("Error fetching patrons:", error);
    // Try fallback approach
    try {
      console.log("Trying fallback approach for patrons...");
      
      // Get the campaign ID first
      const campaignIdResponse = await fetchFromPatreon("/current_user/campaigns");
      const campaignId = campaignIdResponse.data?.[0]?.id;
      
      if (campaignId) {
        // Try a simpler request with fewer fields and parameters
        const patronsResponse = await fetchFromPatreon(`/campaigns/${campaignId}/members`);
        
        const fallbackPatrons = patronsResponse.data?.map((patron: any) => ({
          id: patron.id,
          full_name: patron.attributes?.full_name || "Anonymous Supporter",
          patron_status: patron.attributes?.patron_status || "active_patron",
          currently_entitled_amount_cents: patron.attributes?.currently_entitled_amount_cents || 0
        })) || [];
        
        console.log(`Fallback method found ${fallbackPatrons.length} patrons`);
        return { patrons: fallbackPatrons };
      }
    } catch (fallbackError) {
      console.error("Fallback method for patrons also failed:", fallbackError);
    }
    
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

// New function to fetch posts from Patreon
async function getPosts() {
  try {
    console.log("Fetching posts from Patreon API...");
    
    // First get the campaign ID
    const campaignIdResponse = await fetchFromPatreon("/current_user/campaigns");
    const campaignId = campaignIdResponse.data?.[0]?.id;
    
    if (!campaignId) {
      console.log("Could not find campaign ID");
      return { posts: [] };
    }
    
    console.log(`Using campaign ID: ${campaignId} for posts`);
    
    // Use campaign ID to fetch posts
    const postsResponse = await fetchFromPatreon(
      `/campaigns/${campaignId}/posts?fields[post]=title,content,url,published_at,teaser_text&sort=-published_at&page[count]=3`
    );
    
    if (!postsResponse.data) {
      console.log("No posts data returned from API");
      return { posts: [] };
    }
    
    console.log(`Found ${postsResponse.data.length} posts`);
    
    const posts = postsResponse.data.map((post: any) => ({
      id: post.id,
      title: post.attributes?.title || "Untitled Post",
      excerpt: post.attributes?.teaser_text || post.attributes?.content?.substring(0, 100) + "..." || "",
      url: post.attributes?.url || `https://www.patreon.com/posts/${post.id}`,
      date: post.attributes?.published_at || new Date().toISOString()
    }));
    
    return { posts };
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    // If we failed to get posts from the API, try fetching from a fallback endpoint
    try {
      console.log("Trying fallback v1 API for posts...");
      // Try v1 API as fallback
      const campaignIdResponse = await fetchFromPatreon("/current_user/campaigns");
      const campaignId = campaignIdResponse.data?.[0]?.id;
      
      if (campaignId) {
        const postsUrl = `https://www.patreon.com/api/oauth2/api/campaigns/${campaignId}/posts?include=user&fields[post]=title,content,url,published_at&sort=-published_at&page[count]=3`;
        const response = await fetch(postsUrl, {
          headers: {
            Authorization: `Bearer ${PATREON_CREATOR_ACCESS_TOKEN}`,
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const fallbackPosts = data.data.map((post: any) => ({
          id: post.id,
          title: post.attributes?.title || "Untitled Post",
          excerpt: post.attributes?.teaser_text || (post.attributes?.content ? post.attributes.content.substring(0, 100) + "..." : ""),
          url: post.attributes?.url || `https://www.patreon.com/posts/${post.id}`,
          date: post.attributes?.published_at || new Date().toISOString()
        }));
        
        console.log(`Fallback found ${fallbackPosts.length} posts`);
        return { posts: fallbackPosts };
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
    }
    
    return { posts: [] };
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
    } else if (endpoint === "posts") {
      responseData = await getPosts();
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
