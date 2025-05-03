
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

type Translations = {
  [key: string]: {
    en: string;
    es: string;
  };
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Translations = {
  // Common elements
  appTitle: {
    en: 'Army Builder',
    es: 'Constructor de Ejércitos',
  },
  playMode: {
    en: 'Play Mode',
    es: 'Modo de Juego',
  },
  // Rules page
  rulesTitle: {
    en: 'Rules',
    es: 'Reglas',
  },
  search: {
    en: 'Search',
    es: 'Buscar',
  },
  caseSensitive: {
    en: 'Case sensitive',
    es: 'Distinguir mayúsculas',
  },
  // Add more translations as needed
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
