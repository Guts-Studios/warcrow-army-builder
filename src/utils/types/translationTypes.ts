
export interface TranslationItem {
  text: string;
  targetLang: string;
}

export interface TranslatedText extends TranslationItem {
  translation: string;
}
