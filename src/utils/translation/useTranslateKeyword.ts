
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslateKeyword = () => {
  const { language } = useLanguage();
  const [keywordsMap, setKeywordsMap] = useState<Record<string, { es?: string, fr?: string }>>({});
  
  useEffect(() => {
    const fetchKeywords = async () => {
      const { data, error } = await supabase
        .from('unit_keywords')
        .select('id, name, name_es, name_fr');
        
      if (error) {
        console.error('Error fetching unit keywords:', error);
        return;
      }
      
      if (data) {
        const map: Record<string, { es?: string, fr?: string }> = {};
        data.forEach(kw => {
          map[kw.name.toLowerCase()] = {
            es: kw.name_es || undefined,
            fr: kw.name_fr || undefined
          };
        });
        setKeywordsMap(map);
      }
    };
    
    fetchKeywords();
  }, []);
  
  const translateKeyword = (keyword: string, fallbackLanguage = 'en'): string => {
    if (!keyword) return '';
    
    const keyLower = keyword.toLowerCase();
    const translations = keywordsMap[keyLower];
    
    if (language === 'en' || !translations) {
      return keyword;
    }
    
    if (language === 'es' && translations.es) {
      return translations.es;
    } else if (language === 'fr' && translations.fr) {
      return translations.fr;
    }
    
    return keyword;
  };
  
  return { translateKeyword, keywordsMap };
};
