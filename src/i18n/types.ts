
export type Translation = {
  en: string;
  es: string;
  fr?: string;
};

export type TranslationsType = {
  [key: string]: Translation;
};
