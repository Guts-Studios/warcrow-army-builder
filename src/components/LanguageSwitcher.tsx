
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="text-warcrow-gold hover:bg-warcrow-gold/10"
      >
        <Globe className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">{language.toUpperCase()}</span>
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
