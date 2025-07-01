
import { translateText } from './translation/batchTranslate';

// Mission title translations
const MISSION_TITLE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Consolidated Progress': {
    es: 'Progreso Consolidado',
    fr: 'Progrès Consolidé'
  },
  'Take Positions': {
    es: 'Tomar Posiciones',
    fr: 'Prendre Position'
  },
  'Fog of Death': {
    es: 'Niebla de la Muerte',
    fr: 'Brouillard de la Mort'
  },
  'Influence Zones': {
    es: 'Zonas de Influencia',
    fr: 'Zones d\'Influence'
  },
  'Expanse': {
    es: 'Extensión',
    fr: 'Étendue'
  },
  'Loot': {
    es: 'Botín',
    fr: 'Butin'
  },
  'Quadrants': {
    es: 'Cuadrantes',
    fr: 'Quadrants'
  },
  'Tree Mother': {
    es: 'Árbol Madre',
    fr: 'Arbre Mère'
  },
  'Battle Lines': {
    es: 'Líneas de Batalla',
    fr: 'Lignes de Bataille'
  },
  'Breached Front': {
    es: 'Frente Quebrado',
    fr: 'Front Percé'
  },
  'Ghosts from the Mist': {
    es: 'Fantasmas de la Niebla',
    fr: 'Fantômes de la Brume'
  },
  'Sacred Land': {
    es: 'Tierra Sagrada',
    fr: 'Terre Sacrée'
  },
  'Rescue Mission': {
    es: 'Misión de Rescate',
    fr: 'Mission de Sauvetage'
  }
};

// Feat title translations
const FEAT_TITLE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Track': {
    es: 'Rastreo',
    fr: 'Piste'
  },
  'Decapitation': {
    es: 'Decapitación',
    fr: 'Décapitation'
  },
  'The Rift': {
    es: 'La Grieta',
    fr: 'La Faille'
  },
  'Banner': {
    es: 'Estandarte',
    fr: 'Bannière'
  },
  'Resources': {
    es: 'Recursos',
    fr: 'Ressources'
  }
};

export function getMissionTitle(englishTitle: string, language: string): string {
  if (language === 'en') return englishTitle;
  return MISSION_TITLE_TRANSLATIONS[englishTitle]?.[language] || englishTitle;
}

export function getFeatTitle(englishTitle: string, language: string): string {
  if (language === 'en') return englishTitle;
  return FEAT_TITLE_TRANSLATIONS[englishTitle]?.[language] || englishTitle;
}

// For future use when we want to translate the content details
export async function translateMissionDetails(details: string, targetLanguage: 'es' | 'fr'): Promise<string> {
  try {
    return await translateText(details, targetLanguage);
  } catch (error) {
    console.error('Failed to translate mission details:', error);
    return details; // Return original text as fallback
  }
}

export async function translateFeatDetails(details: string, targetLanguage: 'es' | 'fr'): Promise<string> {
  try {
    return await translateText(details, targetLanguage);
  } catch (error) {
    console.error('Failed to translate feat details:', error);
    return details; // Return original text as fallback
  }
}
