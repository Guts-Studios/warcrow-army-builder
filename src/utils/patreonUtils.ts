
import { supabase } from "@/integrations/supabase/client";

export type PatreonTier = {
  id: string;
  title: string;
  description: string;
  amount_cents: number;
  published: boolean;
};

export type PatreonPatron = {
  id: string;
  full_name: string;
  email: string;
  patron_status: string;
};

export type PatreonCampaignInfo = {
  id: string;
  name: string;
  url: string;
  tiers: PatreonTier[];
};

/**
 * Fetch Patreon campaign information including membership tiers
 */
export const getPatreonCampaignInfo = async (): Promise<PatreonCampaignInfo | null> => {
  try {
    const { data, error } = await supabase.functions.invoke("patreon-api", {
      path: "/campaign",
    });

    if (error) {
      console.error("Error fetching Patreon campaign info:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getPatreonCampaignInfo:", error);
    return null;
  }
};

/**
 * Get patrons for the campaign (admin only)
 */
export const getPatreonPatrons = async (): Promise<PatreonPatron[] | null> => {
  try {
    const { data, error } = await supabase.functions.invoke("patreon-api", {
      path: "/patrons",
    });

    if (error) {
      console.error("Error fetching Patreon patrons:", error);
      return null;
    }

    return data?.data || [];
  } catch (error) {
    console.error("Error in getPatreonPatrons:", error);
    return null;
  }
};

/**
 * Refresh the Patreon access token (admin only)
 */
export const refreshPatreonToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("patreon-api", {
      path: "/refresh-token",
    });

    if (error) {
      console.error("Error refreshing Patreon token:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in refreshPatreonToken:", error);
    return false;
  }
};

/**
 * Format cents to a readable currency string
 */
export const formatPatreonAmount = (amountCents: number, locale = 'en-US', currency = 'USD'): string => {
  const dollars = amountCents / 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(dollars);
};

/**
 * Generate a Patreon "become a patron" link
 */
export const getPatreonJoinLink = (creatorUrl: string): string => {
  return `https://www.patreon.com/${creatorUrl}`;
};
