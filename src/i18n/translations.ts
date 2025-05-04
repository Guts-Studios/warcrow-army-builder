
import { TranslationsType } from './types';
import { commonTranslations } from './common';
import { authTranslations } from './auth';
import { armyTranslations } from './army';
import { factionTranslations } from './factions';
import { rulesUITranslations } from './rules/index';
import { missionTranslations } from './missions';
import { playTranslations } from './play';
import { landingTranslations } from './landing';
import { aboutTranslations } from './about';
import { activityTranslations } from './activity';
import { unitTranslations } from './units';
import { profileTranslations } from './profile';

// Combine all translation categories
export const translations: TranslationsType = {
  ...commonTranslations,
  ...authTranslations,
  ...armyTranslations,
  ...factionTranslations,
  ...rulesUITranslations,
  ...missionTranslations,
  ...playTranslations,
  ...landingTranslations,
  ...aboutTranslations,
  ...activityTranslations,
  ...unitTranslations,
  ...profileTranslations,
};
