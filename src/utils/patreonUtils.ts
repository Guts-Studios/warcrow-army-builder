
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the URL for the Patreon campaign
 */
export const getPatreonCampaignUrl = () => {
  return "https://www.patreon.com/warcrowarmybuilder";
};

/**
 * Fetches the Patreon campaign information from the Supabase Edge Function
 * @returns Campaign information including ID, name, and patron count
 */
export const fetchPatreonCampaigns = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', {
      body: {
        endpoint: 'creator-campaigns'
      }
    });

    if (error) {
      console.error('Error fetching Patreon campaigns:', error);
      return { 
        success: false, 
        error: error.message, 
        campaigns: [] 
      };
    }

    return {
      success: true,
      campaigns: data.campaigns || []
    };
  } catch (err: any) {
    console.error('Error in fetchPatreonCampaigns:', err);
    return { 
      success: false, 
      error: err.message, 
      campaigns: [] 
    };
  }
};

/**
 * Fetches Patreon members (supporters) for a specific campaign
 * @param campaignId The Patreon campaign ID
 * @returns List of campaign members/supporters
 */
export const fetchCampaignMembers = async (campaignId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', {
      body: {
        endpoint: 'campaign-members',
        campaignId
      }
    });

    if (error) {
      console.error('Error fetching campaign members:', error);
      return { 
        success: false, 
        error: error.message, 
        members: [] 
      };
    }

    return {
      success: true,
      members: data.members || []
    };
  } catch (err: any) {
    console.error('Error in fetchCampaignMembers:', err);
    return { 
      success: false, 
      error: err.message, 
      members: [] 
    };
  }
};
