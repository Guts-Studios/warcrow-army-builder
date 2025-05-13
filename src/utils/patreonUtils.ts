
import { supabase } from "@/integrations/supabase/client";

/**
 * Patron/Member types and interfaces
 */
export interface PatreonPatron {
  id: string;
  fullName: string;
  email?: string;
  imageUrl?: string;
  pledgeStart?: string;
  amountCents: number;
  status?: string;
  lastChargeDate?: string;
}

/**
 * Campaign types and interfaces
 */
export interface PatreonCampaign {
  id: string;
  name: string;
  patron_count: number;
  created_at: string;
  url: string;
  summary?: string;
}

/**
 * Post types and interfaces
 */
export interface PatreonPost {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  url: string;
  teaser?: string;
}

/**
 * Tier types and interfaces
 */
export interface PatreonTier {
  id: string;
  title: string;
  description: string;
  amountCents: number;
  userCount: number;
  imageUrl?: string;
}

/**
 * Gets the URL for the Patreon campaign
 */
export const getPatreonCampaignUrl = () => {
  return "https://www.patreon.com/warcrowarmybuilder";
};

/**
 * Gets information about the campaign including tiers, patron count, etc.
 */
export const getPatreonCampaignInfo = async () => {
  try {
    const campaigns = await getCreatorCampaigns();
    
    // Return the first campaign if any were found
    if (campaigns && campaigns.length > 0) {
      return campaigns[0];
    }
    
    return null;
  } catch (err) {
    console.error('Error fetching Patreon campaign info:', err);
    return null;
  }
};

/**
 * Formats a Patreon amount in cents to a display string
 * @param amountCents Amount in cents
 * @returns Formatted string (e.g., "$5 per month")
 */
export const formatPatreonAmount = (amountCents: number): string => {
  const dollars = (amountCents / 100).toFixed(0);
  return `$${dollars} per month`;
};

/**
 * Checks if Patreon API is operational
 */
export const checkPatreonApiStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', {
      body: {
        endpoint: 'status'
      }
    });
    
    if (error) {
      console.error('Error checking Patreon API status:', error);
      return { status: 'down', error: error.message };
    }
    
    return { status: 'operational', data };
  } catch (err: any) {
    console.error('Error in checkPatreonApiStatus:', err);
    return { status: 'down', error: err.message };
  }
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
 * Get creator campaigns
 */
export const getCreatorCampaigns = async (): Promise<PatreonCampaign[]> => {
  try {
    const result = await fetchPatreonCampaigns();
    
    if (result.success && result.campaigns) {
      return result.campaigns;
    }
    
    return [];
  } catch (err) {
    console.error('Error in getCreatorCampaigns:', err);
    return [];
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

/**
 * Gets list of patrons for the given campaign
 * @param campaignId Optional campaign ID, will use the first one found if not specified
 */
export const getPatreonPatrons = async (campaignId?: string): Promise<PatreonPatron[]> => {
  try {
    // If no campaign ID provided, get the first one
    if (!campaignId) {
      const campaigns = await getCreatorCampaigns();
      if (!campaigns || campaigns.length === 0) {
        console.error('No campaigns found');
        return [];
      }
      campaignId = campaigns[0].id;
    }
    
    const result = await fetchCampaignMembers(campaignId);
    
    if (result.success && result.members) {
      return result.members.map(member => ({
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        imageUrl: member.imageUrl,
        pledgeStart: member.pledgeStart,
        amountCents: member.amountCents || 0,
        // Add other fields as needed
      }));
    }
    
    return [];
  } catch (err) {
    console.error('Error in getPatreonPatrons:', err);
    return [];
  }
};

/**
 * Gets recent posts from Patreon campaign
 */
export const getPatreonPosts = async (): Promise<PatreonPost[]> => {
  // This would call the Patreon API's posts endpoint
  // For now returning empty array as placeholder
  return [];
};
