
import { supabase } from "../integrations/supabase/client";

export interface FAQItem {
  id: string;
  section: string;
  section_es: string | null;
  section_fr?: string | null;
  content: string;
  content_es: string | null;
  content_fr?: string | null;
  order_index: number;
}

export const fetchFAQSections = async (language: string = 'en'): Promise<FAQItem[]> => {
  try {
    const { data, error } = await supabase
      .from('faq_sections')
      .select('*')
      .order('order_index');
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching FAQ sections:', error);
    throw error;
  }
};
