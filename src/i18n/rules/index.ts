
import { basicRulesTranslations } from './basic';
import { charactersRulesTranslations } from './characters';
import { miniaturesRulesTranslations } from './miniatures';
import { troopsRulesTranslations } from './troops';
import { unitsRulesTranslations } from './units';
import { uiRulesTranslations } from './ui';
import { TranslationsType } from '../types';

// Combine all rules translation categories
export const rulesTranslations: TranslationsType = {
  ...basicRulesTranslations,
  ...charactersRulesTranslations,
  ...miniaturesRulesTranslations,
  ...troopsRulesTranslations,
  ...unitsRulesTranslations,
  ...uiRulesTranslations,
};
