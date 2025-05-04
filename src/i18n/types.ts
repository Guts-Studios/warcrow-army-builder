
export type Translation = {
  en: string;
  es: string;
};

export type TranslationsType = {
  [key: string]: Translation;
};

// Add specific type for rules translations
export type RulesTranslation = {
  chapters: any[];
  [key: string]: any;
};
