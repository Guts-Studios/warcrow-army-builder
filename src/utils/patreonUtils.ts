
import { supabase } from '@/integrations/supabase/client';

/**
 * Types for Patreon API responses
 */
export interface PatreonTier {
  id: string;
  title: string;
  description: string;
  amount: number;
  amount_cents: number;
  image_url?: string;
  url?: string;
  published: boolean;
  patron_count?: number;
}

export interface PatreonCampaign {
  id: string;
  name: string;
  url: string;
  summary?: string;
  patron_count: number;
  pledge_sum: number;
  currency: string;
  created_at: string;
}

export interface PatreonPatron {
  id: string;
  full_name: string;
  patron_status: string;
  currently_entitled_amount_cents: number;
}

/**
 * Format the amount in cents to a readable currency string
 */
export function formatPatreonAmount(amountCents: number): string {
  const amount = amountCents / 100; // Convert cents to dollars/euros
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get the list of tiers from Patreon
 */
export async function getPatreonTiers(): Promise<PatreonTier[]> {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', { 
      body: { endpoint: 'tiers' }
    });
    
    if (error) throw error;
    return data.tiers || [];
  } catch (error) {
    console.error('Error fetching Patreon tiers:', error);
    return [];
  }
}

/**
 * Get the creator's campaign information from Patreon
 */
export async function getPatreonCampaign(): Promise<PatreonCampaign | null> {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', { 
      body: { endpoint: 'campaign' }
    });
    
    if (error) throw error;
    return data.campaign || null;
  } catch (error) {
    console.error('Error fetching Patreon campaign:', error);
    return null;
  }
}

/**
 * Helper function to get both campaign and tiers in one call
 */
export async function getPatreonCampaignInfo() {
  const campaign = await getPatreonCampaign();
  const tiers = await getPatreonTiers();
  return { campaign, tiers, url: getPatreonCampaignUrl() };
}

/**
 * Get the list of patrons from Patreon
 */
export async function getPatreonPatrons(): Promise<PatreonPatron[]> {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', { 
      body: { endpoint: 'patrons' }
    });
    
    if (error) throw error;
    return data.patrons || [];
  } catch (error) {
    console.error('Error fetching Patreon patrons:', error);
    return [];
  }
}

/**
 * Get the number of patrons for the creator
 */
export async function getPatronCount(): Promise<number> {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', { 
      body: { endpoint: 'patron-count' }
    });
    
    if (error) throw error;
    return data.patron_count || 0;
  } catch (error) {
    console.error('Error fetching Patreon patron count:', error);
    return 0;
  }
}

/**
 * Check the status of the Patreon API
 */
export async function checkPatreonApiStatus(): Promise<{ status: string, timestamp: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('patreon-api', { 
      body: { endpoint: 'status' }
    });
    
    if (error) throw error;
    return {
      status: data.status || 'unknown',
      timestamp: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error checking Patreon API status:', error);
    return {
      status: 'down',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Get the Patreon campaign URL
 */
export function getPatreonCampaignUrl(): string {
  return 'https://www.patreon.com/c/GutzStudio';
}

/**
 * Get the "Buy me a coffee" URL as a fallback
 */
export function getBuyMeCoffeeUrl(): string {
  return 'https://www.patreon.com/c/GutzStudio';
}
