
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

  const filteredKeywords = keywords.filter(k => 
    !["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
      "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
      "Construct", "Undead", "Mounted", "High Command", "Cavalry"].includes(k.name)
  );

  if (filteredKeywords.length === 0) return null;

  const getBaseKeyword = (keyword: string) => {
    return keyword.split('(')[0].trim();
  };

  const KeywordContent = ({ keyword }: { keyword: Keyword }) => {
    // Get the appropriate definition based on language
    const baseKeyword = getBaseKeyword(keyword.name);
    let definition = translateKeywordDescription(baseKeyword, language);
    
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
      <span className="text-xs font-semibold text-warcrow-text">Keywords:</span>
      <div className="flex flex-wrap gap-1.5">
        {filteredKeywords.map((keyword) => {
          // Get translated keyword name if not in English
          const displayName = language !== 'en' 
            ? translateKeyword(keyword.name, language) 
            : keyword.name;
            
          return isMobile ? (
            <button 
              key={keyword.name}
              type="button"
              className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/20 border border-warcrow-gold hover:bg-warcrow-gold/30 transition-colors text-warcrow-text"
              onClick={() => setOpenDialogKeyword(keyword)}
            >
              {displayName}
            </button>
          ) : (
            <TooltipProvider key={keyword.name} delayDuration={0}>
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
              {language !== 'en' 
                ? translateKeyword(openDialogKeyword.name, language) 
                : openDialogKeyword.name}
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
