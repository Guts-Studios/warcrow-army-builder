
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const NETLIFY_API_KEY = Deno.env.get("NETLIFY_API_KEY");
const NETLIFY_API_URL = "https://api.netlify.com/api/v1";
const SITE_ID = "warcrow-army-builder"; // You may need to update this with your actual site ID

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client for the function
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Track the latest successful build
let latestSuccessfulBuildTime: Date | null = null;

// List of site IDs to ignore
const ignoreSiteIds = ['bejewelled-jelly-3f6b58'];

// Only track warcrow deployments - exact site name to monitor
const WARCROW_SITE_NAME = "warcrow-army-builder";

// Create a notification for admin users when a build fails
async function createBuildFailureNotification(deploy: any) {
  try {
    console.log("Creating build failure notification for:", deploy.id);
    
    // Ignore notifications from sites in our ignore list
    if (ignoreSiteIds.includes(deploy.site_name)) {
      console.log(`Skipping notification for ignored site: ${deploy.site_name}`);
      return;
    }

    // Only create notifications for the warcrow site
    if (deploy.site_name !== WARCROW_SITE_NAME && deploy.name !== WARCROW_SITE_NAME) {
      console.log(`Skipping notification for non-warcrow site: ${deploy.site_name || deploy.name}`);
      return;
    }
    
    // Check if this notification already exists to avoid duplicates
    const { data: existingNotifications, error: checkError } = await supabase
      .from('notifications')
      .select('id')
      .eq('type', 'build_failure')
      .eq('content->deploy_id', deploy.id);
    
    if (checkError) {
      console.error("Error checking for existing notifications:", checkError);
    }
    
    // If notification already exists for this deploy, don't create another
    if (existingNotifications && existingNotifications.length > 0) {
      console.log(`Notification already exists for deploy ${deploy.id}, skipping`);
      return;
    }
    
    // Get all admin users
    const { data: adminProfiles, error: adminsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('wab_admin', true);
    
    if (adminsError) {
      console.error("Error fetching admin users:", adminsError);
      return;
    }
    
    if (!adminProfiles || adminProfiles.length === 0) {
      console.log("No admin users found to notify");
      return;
    }
    
    console.log(`Creating build failure notifications for ${adminProfiles.length} admin users`);
    
    // Create notifications for all admin users
    const notifications = adminProfiles.map(profile => ({
      recipient_id: profile.id,
      type: 'build_failure',
      content: JSON.stringify({
        deploy_id: deploy.id,
        site_name: deploy.name || deploy.site_name || "warcrowarmy.com",
        branch: deploy.branch,
        error_message: deploy.error_message,
        commit_message: deploy.title || deploy.commit_message || "",
        deploy_url: deploy.deploy_url,
        created_at: deploy.created_at,
      }),
      read: false,
      created_at: new Date(),
    }));
    
    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (notificationError) {
        console.error("Error creating notifications:", notificationError);
      } else {
        console.log(`Successfully created ${notifications.length} build failure notifications`);
      }
    }
  } catch (error) {
    console.error("Error in createBuildFailureNotification:", error);
  }
}

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
    
    // Find the warcrow site specifically
    const warcrowSite = sites.find(site => 
      site.name === WARCROW_SITE_NAME || 
      site.site_id === SITE_ID
    );
    
    // If warcrow site was found, use its ID
    if (warcrowSite) {
      siteId = warcrowSite.site_id;
      console.log(`Found warcrow site: ${warcrowSite.name} with ID: ${siteId}`);
    } else if (sites.length > 0) {
      // Fallback to first site if warcrow site not found
      siteId = sites[0].site_id;
      console.log(`Warcrow site not found, falling back to site: ${sites[0].name} with ID: ${siteId}`);
    }

    // Fetch deployments for the site
    const deploymentsResponse = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/deploys`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_API_KEY}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

    if (!deploymentsResponse.ok) {
      throw new Error(`Error fetching deployments: ${deploymentsResponse.status}`);
    }

    const deploymentsData = await deploymentsResponse.json();
    
    // Sort deployments by creation date (newest first)
    deploymentsData.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    // Transform the data to match our frontend expectations
    const deployments = deploymentsData.map((deploy: any) => ({
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

    // Check for the latest successful build
    const latestSuccessfulBuild = deploymentsData.find((deploy: any) => deploy.state === 'ready');
    if (latestSuccessfulBuild) {
      latestSuccessfulBuildTime = new Date(latestSuccessfulBuild.created_at);
    }

    // Find the latest failed build - only looking at the most recent one
    const latestBuild = deploymentsData[0]; // First one should be the latest build due to sorting
    
    // Only check for warcrow builds
    const isWarcrowSite = (site: string | undefined) => {
      return site === WARCROW_SITE_NAME || site === "warcrowarmy.com";
    };
    
    // Determine if we should send a notification - only for warcrow site failures
    const shouldNotify = latestBuild && 
                        latestBuild.state === 'error' && 
                        isWarcrowSite(latestBuild.name || latestBuild.site_name);
    
    // Only send a notification if the latest build is a failure and from warcrow site
    if (shouldNotify) {
      // Only create a notification for the most recent failure
      await createBuildFailureNotification(latestBuild);
      console.log("Created notification for warcrow site build failure");
    } else {
      console.log("Latest warcrow build is successful or not a warcrow site, no need to create failure notifications");
    }

    return new Response(JSON.stringify({ 
      deployments,
      isLatestBuildFailed: shouldNotify
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-netlify-deployments:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      status: 500,
    });
  }
});
