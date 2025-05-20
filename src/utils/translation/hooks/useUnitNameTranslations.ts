
import { useState } from 'react';
import { units } from '@/data/factions';

// Create a map of unit name translations
const unitNameTranslationsMap: Record<string, Record<string, string>> = {};

// Populate the map with known unit translations
units.forEach(unit => {
  if (!unitNameTranslationsMap[unit.name]) {
    unitNameTranslationsMap[unit.name] = { 
      'en': unit.name,
      'es': unit.name, // Default to English if no translation exists
      'fr': unit.name  // Default to English if no translation exists
    };
  }
});

// Add some example translations (you should expand this with actual translations)
unitNameTranslationsMap["Aggressors"] = {
  'en': "Aggressors",
  'es': "Agresores",
  'fr': "Agresseurs"
};

unitNameTranslationsMap["Black Legion Bucklermen"] = {
  'en': "Black Legion Bucklermen",
  'es': "Bucklermen de la Legión Negra",
  'fr': "Boucliers de la Légion Noire"
};

export const useUnitNameTranslations = () => {
  const translateUnitName = (name: string, language: string = 'en'): string => {
    if (!name || language === 'en') return name;
    return unitNameTranslationsMap[name]?.[language] || name;
  };

  return {
    translateUnitName
  };
};
