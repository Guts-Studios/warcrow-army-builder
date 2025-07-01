
import { getMissionContentTranslation, getFeatContentTranslation, loadTranslations } from './missionTranslations';

export const loadMissionTranslations = loadTranslations;
export const loadFeatTranslations = loadTranslations;

export const getMissionTranslation = (
  originalTitle: string, 
  language: 'es' | 'fr', 
  fallbackContent: string
): string => {
  return getMissionContentTranslation(originalTitle, language, fallbackContent);
};

export const getFeatTranslation = (
  originalName: string, 
  language: 'es' | 'fr', 
  fallbackContent: string
): string => {
  return getFeatContentTranslation(originalName, language, fallbackContent);
};
