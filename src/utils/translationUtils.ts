
import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";

export const useTranslateKeyword = () => {
  const { t, language } = useLanguage();

  // Translate special rules
  const translateSpecialRule = useCallback((ruleName: string) => {
    if (language === 'en') return ruleName;
    return t(`specialRules.${ruleName}`);
  }, [t, language]);

  // Translate special rule descriptions
  const translateSpecialRuleDescription = useCallback((ruleName: string) => {
    if (language === 'en') return '';
    return t(`specialRuleDescriptions.${ruleName}`);
  }, [t, language]);

  // Translate keywords
  const translateKeyword = useCallback((keyword: string) => {
    if (language === 'en') return keyword;
    return t(`keywords.${keyword}`);
  }, [t, language]);

  // Translate keyword descriptions
  const translateKeywordDescription = useCallback((keyword: string) => {
    if (language === 'en') return '';
    return t(`keywordDescriptions.${keyword}`);
  }, [t, language]);

  // Translate characteristics
  const translateCharacteristic = useCallback((characteristic: string) => {
    if (language === 'en') return characteristic;
    return t(`characteristics.${characteristic}`);
  }, [t, language]);

  // Translate characteristic descriptions
  const translateCharacteristicDescription = useCallback((characteristic: string) => {
    if (language === 'en') return '';
    return t(`characteristicDescriptions.${characteristic}`);
  }, [t, language]);

  // Translate unit names
  const translateUnitName = useCallback((name: string) => {
    if (language === 'en') return name;
    return t(`unitNames.${name}`);
  }, [t, language]);

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
