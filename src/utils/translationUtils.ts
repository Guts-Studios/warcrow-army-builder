
import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";

export const useTranslateKeyword = () => {
  const { t, language } = useLanguage();

  // Translate special rules
  const translateSpecialRule = useCallback((ruleName: string, targetLang: string) => {
    if (targetLang === 'en') return ruleName;
    return t(`specialRules.${ruleName}`);
  }, [t]);

  // Translate special rule descriptions
  const translateSpecialRuleDescription = useCallback((ruleName: string, targetLang: string) => {
    if (targetLang === 'en') return '';
    return t(`specialRuleDescriptions.${ruleName}`);
  }, [t]);

  // Translate keywords
  const translateKeyword = useCallback((keyword: string, targetLang: string) => {
    if (targetLang === 'en') return keyword;
    return t(`keywords.${keyword}`);
  }, [t]);

  // Translate keyword descriptions
  const translateKeywordDescription = useCallback((keyword: string, targetLang: string) => {
    if (targetLang === 'en') return '';
    return t(`keywordDescriptions.${keyword}`);
  }, [t]);

  // Translate characteristics
  const translateCharacteristic = useCallback((characteristic: string, targetLang: string) => {
    if (targetLang === 'en') return characteristic;
    return t(`characteristics.${characteristic}`);
  }, [t]);

  // Translate characteristic descriptions
  const translateCharacteristicDescription = useCallback((characteristic: string, targetLang: string) => {
    if (targetLang === 'en') return '';
    return t(`characteristicDescriptions.${characteristic}`);
  }, [t]);

  // Translate unit names
  const translateUnitName = useCallback((name: string, targetLang: string) => {
    if (targetLang === 'en') return name;
    return t(`unitNames.${name}`);
  }, [t]);

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
