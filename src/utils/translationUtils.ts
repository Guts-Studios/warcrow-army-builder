
import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";
import { useCharacteristicTranslations, useKeywordTranslations, useSpecialRuleTranslations, useUnitNameTranslations } from "./translation";

export const useTranslateKeyword = () => {
  const { language } = useLanguage();
  
  // Get translations from the database hooks
  const { translateUnitName: translateUnitNameDb } = useUnitNameTranslations();
  const { translateKeyword: translateKeywordDb, translateKeywordDescription: translateKeywordDescriptionDb } = useKeywordTranslations();
  const { translateSpecialRule: translateSpecialRuleDb, translateSpecialRuleDescription: translateSpecialRuleDescriptionDb } = useSpecialRuleTranslations();
  const { translateCharacteristic: translateCharacteristicDb, translateCharacteristicDescription: translateCharacteristicDescriptionDb } = useCharacteristicTranslations();

  // Translate special rules
  const translateSpecialRule = useCallback((ruleName: string) => {
    if (language === 'en') return ruleName;
    const translated = translateSpecialRuleDb(ruleName, language);
    // Only return translated text if it's not empty and not the same as the input
    return translated && translated !== ruleName ? translated : ruleName;
  }, [language, translateSpecialRuleDb]);

  // Translate special rule descriptions
  const translateSpecialRuleDescription = useCallback((ruleName: string) => {
    if (language === 'en') return '';
    return translateSpecialRuleDescriptionDb(ruleName, language);
  }, [language, translateSpecialRuleDescriptionDb]);

  // Translate keywords
  const translateKeyword = useCallback((keyword: string) => {
    if (language === 'en') return keyword;
    const translated = translateKeywordDb(keyword, language);
    // Check if translation exists and is valid
    if (translated && !translated.startsWith('keywords.') && translated !== keyword) {
      return translated;
    }
    
    // Hard-coded fallbacks for common keywords
    const fallbacks: Record<string, Record<string, string>> = {
      "Character": {
        "es": "Personaje",
        "fr": "Personnage"
      },
      "Infantry": {
        "es": "Infantería",
        "fr": "Infanterie"
      },
      "Elite": {
        "es": "Élite",
        "fr": "Élite"
      },
      "Varank": {
        "es": "Varank",
        "fr": "Varank"
      },
      "Human": {
        "es": "Humano",
        "fr": "Humain"
      },
      "Companion": {
        "es": "Compañero",
        "fr": "Compagnon"
      },
      "Dwarf": {
        "es": "Enano",
        "fr": "Nain"
      },
      "Orc": {
        "es": "Orco",
        "fr": "Orc"
      },
      "Elf": {
        "es": "Elfo",
        "fr": "Elfe"
      }
    };
    
    // Return fallback translation if available
    return fallbacks[keyword]?.[language] || keyword;
  }, [language, translateKeywordDb]);

  // Translate keyword descriptions
  const translateKeywordDescription = useCallback((keyword: string) => {
    if (language === 'en') return '';
    return translateKeywordDescriptionDb(keyword, language);
  }, [language, translateKeywordDescriptionDb]);

  // Translate characteristics
  const translateCharacteristic = useCallback((characteristic: string) => {
    if (language === 'en') return characteristic;
    const translated = translateCharacteristicDb(characteristic, language);
    
    // Only return translated text if it's not empty and doesn't start with "characteristics."
    if (translated && !translated.startsWith('characteristics.')) {
      return translated;
    }
    
    // Use the keyword translations as fallback for characteristics
    return translateKeyword(characteristic);
  }, [language, translateCharacteristicDb, translateKeyword]);

  // Translate characteristic descriptions
  const translateCharacteristicDescription = useCallback((characteristic: string) => {
    if (language === 'en') return '';
    return translateCharacteristicDescriptionDb(characteristic, language);
  }, [language, translateCharacteristicDescriptionDb]);

  // Translate unit names
  const translateUnitName = useCallback((name: string, targetLang: string = language) => {
    if (targetLang === 'en') return name;
    const translated = translateUnitNameDb(name, targetLang);
    // Only return translated text if it's not empty and doesn't start with "unitNames."
    return (translated && !translated.startsWith('unitNames.')) ? translated : name;
  }, [language, translateUnitNameDb]);

  return {
    translateKeyword,
    translateKeywordDescription,
    translateCharacteristic,
    translateCharacteristicDescription,
    translateUnitName,
    translateSpecialRule,
    translateSpecialRuleDescription
  };
};
