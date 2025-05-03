
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-warcrow-gold" />
      <span className="text-xs text-warcrow-text">EN</span>
      <Switch 
        checked={language === 'es'} 
        onCheckedChange={toggleLanguage}
        className="data-[state=checked]:bg-warcrow-gold data-[state=unchecked]:bg-warcrow-accent"
      />
      <span className="text-xs text-warcrow-text">ES</span>
    </div>
  );
};

export default LanguageSwitcher;
