
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const NETLIFY_API_KEY = Deno.env.get("NETLIFY_API_KEY");
const NETLIFY_API_URL = "https://api.netlify.com/api/v1";
const SITE_ID = "warcrow-army-builder"; // You may need to update this with your actual site ID

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch the site information first to ensure we have the correct site ID
    let siteId = SITE_ID;
    const sitesResponse = await fetch(`${NETLIFY_API_URL}/sites`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!sitesResponse.ok) {
      throw new Error(`Error fetching sites: ${sitesResponse.status}`);
    }
    
    const sites = await sitesResponse.json();
    
    // If sites were found, use the first one's ID (or you could filter by name)
    if (sites.length > 0) {
      siteId = sites[0].site_id;
      console.log(`Found site: ${sites[0].name} with ID: ${siteId}`);
    }

    // Fetch deployments for the site
    const deploymentsResponse = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/deploys`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deploymentsResponse.ok) {
      throw new Error(`Error fetching deployments: ${deploymentsResponse.status}`);
    }

    const deploymentsData = await deploymentsResponse.json();
    
    // Transform the data to match our frontend expectations
    const deployments = deploymentsData.map(deploy => ({
      id: deploy.id,
      site_name: deploy.name || deploy.site_name || "warcrowarmy.com",
      created_at: deploy.created_at,
      state: deploy.state,
      deploy_url: deploy.deploy_url,
      commit_message: deploy.title || deploy.commit_message || "",
      branch: deploy.branch ? `${deploy.branch}@${deploy.commit_ref?.substring(0, 7) || ""}` : "",
      author: deploy.committer || deploy.commit_ref_name || deploy.user_id || "Unknown",
      error_message: deploy.error_message || null,
      deploy_time: deploy.deploy_time ? `${Math.floor(deploy.deploy_time / 60)}m ${deploy.deploy_time % 60}s` : null
    }));

    return new Response(JSON.stringify({ deployments }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-netlify-deployments:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
