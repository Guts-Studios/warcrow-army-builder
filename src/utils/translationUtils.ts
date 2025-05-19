
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
    if (!ruleName || language === 'en') return ruleName;
    
    const translated = translateSpecialRuleDb(ruleName, language);
    
    // Check if translation exists and is valid (not a key)
    if (translated && 
        !translated.startsWith('specialRules.') && 
        !translated.includes('undefined') &&
        translated !== ruleName) {
      return translated;
    }
    
    // Hard-coded fallbacks for common special rules
    const fallbacks: Record<string, Record<string, string>> = {
      "Reach": {
        "es": "Alcance",
        "fr": "Portée"
      },
      "Shield": {
        "es": "Escudo",
        "fr": "Bouclier"
      }
      // Add more fallbacks as needed
    };
    
    return fallbacks[ruleName]?.[language] || ruleName;
  }, [language, translateSpecialRuleDb]);

  // Translate special rule descriptions
  const translateSpecialRuleDescription = useCallback((ruleName: string) => {
    if (!ruleName || language === 'en') return '';
    return translateSpecialRuleDescriptionDb(ruleName, language);
  }, [language, translateSpecialRuleDescriptionDb]);

  // Translate keywords
  const translateKeyword = useCallback((keyword: string) => {
    if (!keyword || language === 'en') return keyword;
    
    const translated = translateKeywordDb(keyword, language);
    
    // Check if translation exists and is valid (not a key)
    if (translated && 
        !translated.startsWith('keywords.') && 
        !translated.includes('undefined') &&
        translated !== keyword) {
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
      },
      "Tattooist": {
        "es": "Tatuador",
        "fr": "Tatoueur"
      }
    };
    
    // Return fallback translation if available
    return fallbacks[keyword]?.[language] || keyword;
  }, [language, translateKeywordDb]);

  // Translate keyword descriptions
  const translateKeywordDescription = useCallback((keyword: string) => {
    if (!keyword || language === 'en') return '';
    return translateKeywordDescriptionDb(keyword, language);
  }, [language, translateKeywordDescriptionDb]);

  // Translate characteristics
  const translateCharacteristic = useCallback((characteristic: string) => {
    if (!characteristic || language === 'en') return characteristic;
    
    const translated = translateCharacteristicDb(characteristic, language);
    
    // Check if translation exists and is valid (not a key)
    if (translated && 
        !translated.startsWith('characteristics.') && 
        !translated.includes('undefined')) {
      return translated;
    }
    
    // Use the keyword translations as fallback for characteristics
    return translateKeyword(characteristic);
  }, [language, translateCharacteristicDb, translateKeyword]);

  // Translate characteristic descriptions
  const translateCharacteristicDescription = useCallback((characteristic: string) => {
    if (!characteristic || language === 'en') return '';
    return translateCharacteristicDescriptionDb(characteristic, language);
  }, [language, translateCharacteristicDescriptionDb]);

  // Translate unit names
  const translateUnitName = useCallback((name: string, targetLang: string = language) => {
    if (!name || targetLang === 'en') return name;
    
    const translated = translateUnitNameDb(name, targetLang);
    
    // Check if translation exists and is valid (not a key)
    if (translated && 
        !translated.startsWith('unitNames.') && 
        !translated.includes('undefined')) {
      return translated;
    }
    
    // Basic fallback for unit names that have patterns
    if (name.includes("Elf")) {
      return name.replace("Elf", targetLang === "es" ? "Elfo" : "Elfe");
    }
    if (name.includes("Orc")) {
      return name.replace("Orc", targetLang === "es" ? "Orco" : "Orc");
    }
    
    return name;
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
