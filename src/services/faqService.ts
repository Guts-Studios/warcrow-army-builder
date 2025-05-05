
import { supabase } from "@/integrations/supabase/client";

export interface FAQItem {
  id: string;
  section: string;
  content: string;
  section_es?: string; 
  content_es?: string;
  order_index: number;
}

export const fetchFAQSections = async (language: string = 'en'): Promise<FAQItem[]> => {
  const { data, error } = await supabase
    .from('faq_sections')
    .select('*')
    .order('order_index');

  if (error) {
    console.error('Error fetching FAQ sections:', error);
    return [];
  }

  return data || [];
};
