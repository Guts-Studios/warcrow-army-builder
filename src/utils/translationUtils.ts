
import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";
import { useCharacteristicTranslations, useKeywordTranslations, useSpecialRuleTranslations, useUnitNameTranslations } from "./translation";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { keywordDefinitions } from "@/data/keywordDefinitions";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";

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
    
    // Extract base rule name (without parameters like Place (3))
    const baseRuleName = ruleName.split('(')[0].trim();
    
    // Try to get translation from database
    const translated = translateSpecialRuleDb(baseRuleName, language);
    
    // If we have a valid translation that's not the same as the input
    if (translated && 
        !translated.startsWith('specialRules.') && 
        !translated.includes('undefined') &&
        translated !== baseRuleName) {
      
      // Handle parameters if present in original rule
      if (ruleName.includes('(')) {
        const params = ruleName.substring(ruleName.indexOf('('));
        return `${translated} ${params}`;
      }
      
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
      },
      "Vulnerable": {
        "es": "Vulnerable",
        "fr": "Vulnérable"
      },
      "Fix a Die": {
        "es": "Fijar un dado",
        "fr": "Fixer un dé"
      },
      "Place": {
        "es": "Colocar",
        "fr": "Placer"
      },
      "Slowed": {
        "es": "Ralentizado",
        "fr": "Ralenti"
      },
      "Disarmed": {
        "es": "Desarmado",
        "fr": "Désarmé"
      },
      "Preferred Terrain": {
        "es": "Terreno Preferido",
        "fr": "Terrain Préféré"
      }
      // Add more fallbacks as needed
    };
    
    const fallbackTranslation = fallbacks[baseRuleName]?.[language];
    
    if (fallbackTranslation) {
      // Handle parameters if present in original rule
      if (ruleName.includes('(')) {
        const params = ruleName.substring(ruleName.indexOf('('));
        return `${fallbackTranslation} ${params}`;
      }
      return fallbackTranslation;
    }
    
    // Default to original rule name if no translation found
    return ruleName;
  }, [language, translateSpecialRuleDb]);

  // Translate special rule descriptions
  const translateSpecialRuleDescription = useCallback((ruleName: string) => {
    if (!ruleName || language === 'en') return '';
    
    // Extract base rule name
    const baseRuleName = ruleName.split('(')[0].trim();
    
    // Try database translation
    const dbDescription = translateSpecialRuleDescriptionDb(baseRuleName, language);
    if (dbDescription && dbDescription.trim() !== '') {
      return dbDescription;
    }
    
    // Fallback to static definitions if no database translation
    const staticDescription = specialRuleDefinitions[baseRuleName];
    return staticDescription || '';
  }, [language, translateSpecialRuleDescriptionDb]);

  // Translate keywords
  const translateKeyword = useCallback((keyword: string) => {
    if (!keyword || language === 'en') return keyword;
    
    // Extract base keyword (without parameters)
    const baseKeyword = keyword.split('(')[0].trim();
    
    // Try database translation
    const translated = translateKeywordDb(baseKeyword, language);
    
    // If we have a valid translation
    if (translated && 
        !translated.startsWith('keywords.') && 
        !translated.includes('undefined') &&
        translated !== baseKeyword) {
      
      // Handle parameters if present in original keyword
      if (keyword.includes('(')) {
        const params = keyword.substring(keyword.indexOf('('));
        return `${translated} ${params}`;
      }
      
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
        "es": "Tatuadora",
        "fr": "Tatoueur"
      },
      "Fearless": {
        "es": "Intrépido",
        "fr": "Intrépide"
      },
      "Join": {
        "es": "Unirse",
        "fr": "Rejoindre"
      },
      "High Command": {
        "es": "Alto Mando",
        "fr": "Haut Commandement"
      },
      "Raging": {
        "es": "Furioso",
        "fr": "Enragé"
      },
      "Spellcaster": {
        "es": "Lanzahechizos",
        "fr": "Lanceur de sorts"
      },
      "Ambusher": {
        "es": "Emboscador",
        "fr": "Embusqueur"
      },
      "Bloodlust": {
        "es": "Sed de Sangre",
        "fr": "Soif de Sang"
      }
    };
    
    // Return fallback translation if available
    const fallbackTranslation = fallbacks[baseKeyword]?.[language];
    
    if (fallbackTranslation) {
      // Handle parameters if present
      if (keyword.includes('(')) {
        const params = keyword.substring(keyword.indexOf('('));
        return `${fallbackTranslation} ${params}`;
      }
      return fallbackTranslation;
    }
    
    return keyword;
  }, [language, translateKeywordDb]);

  // Translate keyword descriptions
  const translateKeywordDescription = useCallback((keyword: string) => {
    if (!keyword || language === 'en') return '';
    
    // Extract base keyword
    const baseKeyword = keyword.split('(')[0].trim();
    
    // Try database translation
    const dbDescription = translateKeywordDescriptionDb(baseKeyword, language);
    if (dbDescription && dbDescription.trim() !== '') {
      return dbDescription;
    }
    
    // Fallback to static definitions
    const staticDescription = keywordDefinitions[baseKeyword];
    return staticDescription || '';
  }, [language, translateKeywordDescriptionDb]);

  // Translate characteristics
  const translateCharacteristic = useCallback((characteristic: string) => {
    if (!characteristic || language === 'en') return characteristic;
    
    // Try database translation
    const translated = translateCharacteristicDb(characteristic, language);
    
    // If we have a valid translation
    if (translated && 
        !translated.startsWith('characteristics.') && 
        !translated.includes('undefined') &&
        translated !== characteristic) {
      return translated;
    }
    
    // Use the keyword translations as fallback
    return translateKeyword(characteristic);
  }, [language, translateCharacteristicDb, translateKeyword]);

  // Translate characteristic descriptions
  const translateCharacteristicDescription = useCallback((characteristic: string) => {
    if (!characteristic || language === 'en') return '';
    
    // Try database translation
    const dbDescription = translateCharacteristicDescriptionDb(characteristic, language);
    if (dbDescription && dbDescription.trim() !== '') {
      return dbDescription;
    }
    
    // Fallback to static definitions
    const staticDescription = characteristicDefinitions[characteristic];
    return staticDescription || '';
  }, [language, translateCharacteristicDescriptionDb]);

  // Translate unit names
  const translateUnitName = useCallback((name: string, targetLang: string = language) => {
    if (!name || targetLang === 'en') return name;
    
    // Try database translation
    const translated = translateUnitNameDb(name, targetLang);
    
    // Check if translation exists and is valid
    if (translated && 
        !translated.startsWith('unitNames.') && 
        !translated.includes('undefined') &&
        translated !== name) {
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
