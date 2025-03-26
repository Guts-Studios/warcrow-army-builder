
import { Database } from "@/integrations/supabase/types";

export interface EmailOptions {
  type?: 'welcome' | 'reset_password';
  token?: string;
  fromEmail?: string; 
  fromName?: string;  
}

export type WabAdmin = {
  id: string;
  username: string | null;
  wab_id: string | null;
  email: string;
};

export type DomainVerificationResult = {
  verified: boolean;
  status: string;
  domains: any[];
};

export type ResendConfirmationResult = {
  success: boolean;
  message: string;
  details: any;
};

export type AdminUpdateResult = {
  success: boolean;
  message: string;
};
