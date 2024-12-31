import { Keyword } from "@/types/army";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { keywordDefinitions } from "@/data/keywordDefinitions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface KeywordsSectionProps {
  keywords: Keyword[];
}

const KeywordsSection = ({ keywords }: KeywordsSectionProps) => {
  const isMobile = useIsMobile();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const filteredKeywords = keywords.filter(k => 
    !["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
      "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
      "Construct", "Undead", "Mounted", "High Command"].includes(k.name)
  );

  if (filteredKeywords.length === 0) return null;

  const getBaseKeyword = (keyword: string) => {
    return keyword.split('(')[0].trim();
  };

  const KeywordButton = ({ keyword }: { keyword: Keyword }) => (
    <button 
      type="button"
      className="px-2.5 py-1 text-xs rounded bg-warcrow-gold/20 border border-warcrow-gold hover:bg-warcrow-gold/30 transition-colors text-warcrow-text"
    >
      {keyword.name}
    </button>
  );

  const KeywordContent = ({ keyword }: { keyword: Keyword }) => (
    <p className="text-sm leading-relaxed">
      {keywordDefinitions[getBaseKeyword(keyword.name)] || keyword.description || "Description coming soon"}
    </p>
  );

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-warcrow-text">Keywords:</span>
      <div className="flex flex-wrap gap-1.5">
        {filteredKeywords.map((keyword) => (
          isMobile ? (
            <Dialog 
              key={keyword.name}
              open={openDialog === keyword.name}
              onOpenChange={(isOpen) => {
                console.log('Dialog state changing for:', keyword.name, 'to:', isOpen);
                setOpenDialog(isOpen ? keyword.name : null);
              }}
            >
              <DialogTrigger asChild>
                <KeywordButton keyword={keyword} />
              </DialogTrigger>
              <DialogContent 
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text"
              >
                <div className="pt-6">
                  <KeywordContent keyword={keyword} />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <TooltipProvider key={keyword.name} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <KeywordButton keyword={keyword} />
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  sideOffset={5}
                  className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-h-[200px] overflow-y-auto max-w-[300px] whitespace-normal"
                >
                  <KeywordContent keyword={keyword} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        ))}
      </div>
    </div>
  );
};

export default KeywordsSection;