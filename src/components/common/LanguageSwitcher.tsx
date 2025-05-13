
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <div className="flex gap-2 items-center">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={language === lang.code ? "default" : "outline"}
          onClick={() => setLanguage(lang.code as 'en' | 'es' | 'fr')}
          size="sm"
          className={`px-3 ${
            language === lang.code 
              ? 'bg-warcrow-gold text-black hover:bg-warcrow-gold/80' 
              : 'border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black'
          } flex items-center gap-1`}
        >
          {language === lang.code && <CheckIcon className="h-3 w-3" />}
          {lang.name}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
