
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10 transition-colors">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {language === 'en' ? 'English' : 'Español'}
        </span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 border border-warcrow-gold/30 text-warcrow-text min-w-[120px] z-50" align="end">
        <DropdownMenuItem 
          className={`flex justify-between items-center ${language === 'en' ? 'text-warcrow-gold' : ''} hover:bg-warcrow-gold/10 focus:bg-warcrow-gold/10`}
          onClick={() => setLanguage('en')}
        >
          English
          {language === 'en' && <span className="h-1.5 w-1.5 rounded-full bg-warcrow-gold"></span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`flex justify-between items-center ${language === 'es' ? 'text-warcrow-gold' : ''} hover:bg-warcrow-gold/10 focus:bg-warcrow-gold/10`}
          onClick={() => setLanguage('es')}
        >
          Español
          {language === 'es' && <span className="h-1.5 w-1.5 rounded-full bg-warcrow-gold"></span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
