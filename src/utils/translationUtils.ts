
import { useLanguage } from "@/contexts/LanguageContext";
import { useCallback } from "react";

export const useTranslateKeyword = () => {
  const { t, language } = useLanguage();

  // Translate special rules
  const translateSpecialRule = useCallback((ruleName: string, language: string) => {
    if (language === 'en') return ruleName;
    return t(`specialRules.${ruleName}`, ruleName);
  }, [t]);

  // Translate special rule descriptions
  const translateSpecialRuleDescription = useCallback((ruleName: string, language: string) => {
    if (language === 'en') return '';
    return t(`specialRuleDescriptions.${ruleName}`, '');
  }, [t]);

  // Translate keywords
  const translateKeyword = useCallback((keyword: string, language: string) => {
    if (language === 'en') return keyword;
    return t(`keywords.${keyword}`, keyword);
  }, [t]);

  // Translate keyword descriptions
  const translateKeywordDescription = useCallback((keyword: string, language: string) => {
    if (language === 'en') return '';
    return t(`keywordDescriptions.${keyword}`, '');
  }, [t]);

  // Translate characteristics
  const translateCharacteristic = useCallback((characteristic: string, language: string) => {
    if (language === 'en') return characteristic;
    return t(`characteristics.${characteristic}`, characteristic);
  }, [t]);

  // Translate characteristic descriptions
  const translateCharacteristicDescription = useCallback((characteristic: string, language: string) => {
    if (language === 'en') return '';
    return t(`characteristicDescriptions.${characteristic}`, '');
  }, [t]);

  // Translate unit names
  const translateUnitName = useCallback((name: string, language: string) => {
    if (language === 'en') return name;
    return t(`unitNames.${name}`, name);
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
