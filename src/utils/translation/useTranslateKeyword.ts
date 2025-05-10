
import { useKeywordTranslations } from './hooks/useKeywordTranslations';
import { useSpecialRuleTranslations } from './hooks/useSpecialRuleTranslations';
import { useCharacteristicTranslations } from './hooks/useCharacteristicTranslations';
import { useUnitNameTranslations } from './hooks/useUnitNameTranslations';

export const useTranslateKeyword = () => {
  const { translateKeyword, translateKeywordDescription } = useKeywordTranslations();
  const { translateSpecialRule, translateSpecialRuleDescription } = useSpecialRuleTranslations();
  const { translateCharacteristic, translateCharacteristicDescription } = useCharacteristicTranslations();
  const { translateUnitName } = useUnitNameTranslations();

  return {
    translateKeyword,
    translateSpecialRule,
    translateCharacteristic,
    translateKeywordDescription,
    translateSpecialRuleDescription,
    translateCharacteristicDescription,
    translateUnitName
  };
};
