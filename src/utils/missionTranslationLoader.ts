
interface TranslationData {
  [key: string]: {
    es: string;
    fr: string;
  };
}

interface MissionTranslations {
  missions: TranslationData;
}

interface FeatTranslations {
  feats: TranslationData;
}

let missionTranslations: MissionTranslations | null = null;
let featTranslations: FeatTranslations | null = null;

export async function loadMissionTranslations(): Promise<MissionTranslations> {
  if (!missionTranslations) {
    try {
      const response = await fetch('/data/missions/mission-translations.json');
      missionTranslations = await response.json();
    } catch (error) {
      console.error('Failed to load mission translations:', error);
      missionTranslations = { missions: {} };
    }
  }
  return missionTranslations;
}

export async function loadFeatTranslations(): Promise<FeatTranslations> {
  if (!featTranslations) {
    try {
      const response = await fetch('/data/missions/feat-translations.json');
      featTranslations = await response.json();
    } catch (error) {
      console.error('Failed to load feat translations:', error);
      featTranslations = { feats: {} };
    }
  }
  return featTranslations;
}

export function getMissionTranslation(missionTitle: string, language: 'es' | 'fr', originalText: string): string {
  if (!missionTranslations?.missions[missionTitle]?.[language]) {
    return originalText; // Fallback to original if no translation exists
  }
  const translation = missionTranslations.missions[missionTitle][language];
  return translation || originalText;
}

export function getFeatTranslation(featName: string, language: 'es' | 'fr', originalText: string): string {
  if (!featTranslations?.feats[featName]?.[language]) {
    return originalText; // Fallback to original if no translation exists
  }
  const translation = featTranslations.feats[featName][language];
  return translation || originalText;
}
