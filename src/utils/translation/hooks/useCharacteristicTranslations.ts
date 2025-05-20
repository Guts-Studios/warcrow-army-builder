
import { useState } from 'react';
import { characteristicDefinitions } from '@/data/characteristicDefinitions';

// Interface for typed characteristic translations
interface CharacteristicTranslation {
  en: string;
  es: string;
  fr: string;
  description_en: string;
  description_es: string;
  description_fr: string;
}

// Local characteristic translations (you can expand this)
const characteristicTranslations: Record<string, CharacteristicTranslation> = {
  "Human": {
    en: "Human",
    es: "Humano",
    fr: "Humain",
    description_en: characteristicDefinitions["Human"] || "",
    description_es: "Miembros de la raza humana, la especie más numerosa y adaptable.",
    description_fr: "Membres de la race humaine, l'espèce la plus nombreuse et adaptable."
  },
  "Infantry": {
    en: "Infantry",
    es: "Infantería",
    fr: "Infanterie",
    description_en: characteristicDefinitions["Infantry"] || "",
    description_es: "Tropas terrestres que forman la columna vertebral de la mayoría de los ejércitos.",
    description_fr: "Troupes terrestres qui forment l'épine dorsale de la plupart des armées."
  },
  // Add more characteristic translations as needed
};

export const useCharacteristicTranslations = () => {
  const translateCharacteristic = (characteristic: string, language: string): string => {
    if (!characteristic || language === 'en') return characteristic;
    
    return characteristicTranslations[characteristic]?.[language as 'en' | 'es' | 'fr'] || characteristic;
  };

  const translateCharacteristicDescription = (characteristic: string, language: string): string => {
    // Get the description based on language
    const descriptionKey = `description_${language}` as 'description_en' | 'description_es' | 'description_fr';
    const fallbackKey = 'description_en';
    
    // Try to get description in requested language, fall back to English
    const description = characteristicTranslations[characteristic]?.[descriptionKey] || 
                       characteristicTranslations[characteristic]?.[fallbackKey] ||
                       characteristicDefinitions[characteristic] || '';
    
    return description;
  };

  return {
    translateCharacteristic,
    translateCharacteristicDescription
  };
};
