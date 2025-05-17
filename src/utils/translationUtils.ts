
// Create a new file that re-exports the translation hooks for better import organization
import { useKeywordTranslations } from './translation/hooks/useKeywordTranslations';
import { useCharacteristicTranslations } from './translation/hooks/useCharacteristicTranslations';
import { useSpecialRuleTranslations } from './translation/hooks/useSpecialRuleTranslations';

export const useTranslateKeyword = () => {
  const { translateKeyword, translateKeywordDescription } = useKeywordTranslations();
  const { translateCharacteristic, translateCharacteristicDescription } = useCharacteristicTranslations();
  const { translateSpecialRule, translateSpecialRuleDescription } = useSpecialRuleTranslations();
  
  // Add a method to translate unit names
  const translateUnitName = (name: string, language: string): string => {
    // This is a simplified implementation - in a real app you'd fetch translations from the server
    // For now, just return the name as is
    return name;
  };
  
  return {
    translateKeyword,
    translateKeywordDescription,
    translateCharacteristic, 
    translateCharacteristicDescription,
    translateSpecialRule,
    translateSpecialRuleDescription,
    translateUnitName
  };
};
