
// Title-only translations for missions and feats
const missionTitleTranslations: Record<string, Record<string, string>> = {
  "Consolidated Progress": {
    "es": "Progreso Consolidado",
    "fr": "Progrès Consolidé"
  },
  "Take Positions": {
    "es": "Tomar Posiciones",
    "fr": "Prendre Position"
  },
  "Fog of Death": {
    "es": "Niebla de la Muerte",
    "fr": "Brouillard de la Mort"
  },
  "Influence Zones": {
    "es": "Zonas de Influencia",
    "fr": "Zones d'Influence"
  },
  "Expanse": {
    "es": "Expansión",
    "fr": "Étendue"
  },
  "Loot": {
    "es": "Botín",
    "fr": "Butin"
  },
  "Quadrants": {
    "es": "Cuadrantes",
    "fr": "Quadrants"
  },
  "Battle Lines": {
    "es": "Líneas de Batalla",
    "fr": "Lignes de Bataille"
  },
  "Breached Front": {
    "es": "Frente Roto",
    "fr": "Front Percé"
  },
  "Ghosts from the Mist": {
    "es": "Fantasmas de la Niebla",
    "fr": "Fantômes du Brouillard"
  },
  "Sacred Land": {
    "es": "Tierra Sagrada",
    "fr": "Terre Sacrée"
  },
  "Rescue Mission": {
    "es": "Misión de Rescate",
    "fr": "Mission de Sauvetage"
  }
};

const featTitleTranslations: Record<string, Record<string, string>> = {
  "Track": {
    "es": "Rastreo",
    "fr": "Piste"
  },
  "Decapitation": {
    "es": "Decapitación",
    "fr": "Décapitation"
  },
  "The Rift": {
    "es": "La Grieta",
    "fr": "La Faille"
  },
  "Banner": {
    "es": "Estandarte",
    "fr": "Bannière"
  },
  "Resources": {
    "es": "Recursos",
    "fr": "Ressources"
  }
};

export const getMissionTitleTranslation = (originalTitle: string, language: string): string => {
  if (language === 'en' || !missionTitleTranslations[originalTitle]) {
    return originalTitle;
  }
  
  const translation = missionTitleTranslations[originalTitle][language];
  return translation || originalTitle;
};

export const getFeatTitleTranslation = (originalName: string, language: string): string => {
  if (language === 'en' || !featTitleTranslations[originalName]) {
    return originalName;
  }
  
  const translation = featTitleTranslations[originalName][language];
  return translation || originalName;
};
