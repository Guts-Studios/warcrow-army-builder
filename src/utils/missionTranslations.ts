
import { translations } from '@/i18n/translations';

// This will be populated when translations are loaded
let missionTranslations: any = null;
let featTranslations: any = null;

export const loadTranslations = async () => {
  try {
    const [missionResponse, featResponse] = await Promise.all([
      fetch('/data/missions/mission-translations.json'),
      fetch('/data/missions/feat-translations.json')
    ]);
    
    if (missionResponse.ok) {
      missionTranslations = await missionResponse.json();
    }
    
    if (featResponse.ok) {
      featTranslations = await featResponse.json();
    }
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

// These functions are for content translations, not titles
export const getMissionContentTranslation = (originalTitle: string, language: string, fallbackContent: string): string => {
  if (language === 'en' || !missionTranslations?.missions[originalTitle]) {
    return fallbackContent;
  }
  
  const translation = missionTranslations.missions[originalTitle][language];
  return translation || fallbackContent;
};

export const getFeatContentTranslation = (originalName: string, language: string, fallbackContent: string): string => {
  if (language === 'en' || !featTranslations?.feats[originalName]) {
    return fallbackContent;
  }
  
  const translation = featTranslations.feats[originalName][language];
  return translation || fallbackContent;
};

// Load translations on module import
loadTranslations();
