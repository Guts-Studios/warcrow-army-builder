
import { Keyword } from "@/types/army";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { keywordDefinitions } from "@/data/keywordDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';

interface KeywordsSectionProps {
  keywords: Keyword[];
}

const KeywordsSection = ({ keywords }: KeywordsSectionProps) => {
  const isMobile = useIsMobile();
  const [openDialogKeyword, setOpenDialogKeyword] = useState<Keyword | null>(null);
  const { language } = useLanguage();
  const { translateKeyword, translateKeywordDescription } = useTranslateKeyword();

  // Define the list of characteristic types to exclude
  const characteristicTypes = [
    "Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
    "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
    "Construct", "Undead", "Mounted", "Cavalry", "Red Cap", "Living Flesh", "Dead Flesh",
    "Golem", "Mercenary", "High Command"
  ];

  // Filter out all characteristics
  const filteredKeywords = keywords.filter(k => {
    const keywordName = typeof k === 'string' ? k : k.name;
    return !characteristicTypes.includes(keywordName);
  });

  if (filteredKeywords.length === 0) return null;

  const getBaseKeyword = (keyword: string) => {
    return keyword.split('(')[0].trim();
  };

  const getFullKeywordName = (keywordBase: string, originalKeyword: string) => {
    // If the original has parameters (X), keep them in the translated version
    if (originalKeyword.includes('(')) {
      const params = originalKeyword.split('(')[1];
      return `${keywordBase} (${params}`;
    }
    return keywordBase;
  };

  const KeywordContent = ({ keyword }: { keyword: Keyword }) => {
    const keywordName = typeof keyword === 'string' ? keyword : keyword.name;
    // Get the appropriate definition based on language
    const baseKeyword = getBaseKeyword(keywordName);
    let definition = translateKeywordDescription(baseKeyword);
    
    // If no translated description is found, fall back to static definitions
    if (!definition) {
      definition = keywordDefinitions[baseKeyword] || "Description coming soon";
    }
    
    const paragraphs = definition.split('\n').filter(p => p.trim());

    return (
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed">{paragraph}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-warcrow-text">
        {language === 'en' ? 'Keywords' : (language === 'es' ? 'Palabras clave' : 'Mots-clés')}:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {filteredKeywords.map((keyword) => {
          const keywordName = typeof keyword === 'string' ? keyword : keyword.name;
          // Get base keyword name (without parameters)
          const baseKeywordName = getBaseKeyword(keywordName);
          
          // Get translated base keyword
          const translatedBase = translateKeyword(baseKeywordName);
          
          // Get full keyword name with parameters if present
          const displayName = getFullKeywordName(translatedBase, keywordName);
            
          return isMobile ? (
            <button 
              key={keywordName}
              type="button"
              className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/20 border border-warcrow-gold hover:bg-warcrow-gold/30 transition-colors text-warcrow-text"
              onClick={() => setOpenDialogKeyword(keyword)}
            >
              {displayName}
            </button>
          ) : (
            <TooltipProvider key={keywordName} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button"
                    className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/20 border border-warcrow-gold hover:bg-warcrow-gold/30 transition-colors text-warcrow-text"
                  >
                    {displayName}
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  sideOffset={5}
                  className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-h-[300px] overflow-y-auto max-w-[400px] whitespace-normal p-4"
                >
                  <p className="font-medium text-warcrow-gold mb-1">{displayName}</p>
                  <KeywordContent keyword={keyword} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {openDialogKeyword && (
        <div 
          role="dialog" 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpenDialogKeyword(null)}
        >
          <div 
            className="bg-warcrow-background border border-warcrow-gold text-warcrow-text p-6 rounded-lg max-w-lg w-full mx-4 relative max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setOpenDialogKeyword(null)}
              className="absolute right-4 top-4 text-warcrow-text/70 hover:text-warcrow-text"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {typeof openDialogKeyword === 'string' 
                ? getFullKeywordName(translateKeyword(getBaseKeyword(openDialogKeyword)), openDialogKeyword)
                : getFullKeywordName(translateKeyword(getBaseKeyword(openDialogKeyword.name)), openDialogKeyword.name)}
            </h3>
            <div className="pt-2">
              <KeywordContent keyword={openDialogKeyword} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordsSection;
