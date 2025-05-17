
import { Keyword } from "@/types/army";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface CharacteristicsSectionProps {
  keywords: Keyword[];
  highCommand?: boolean;
}

const CharacteristicsSection = ({ keywords, highCommand }: CharacteristicsSectionProps) => {
  const isMobile = useIsMobile();
  const [openDialogCharacteristic, setOpenDialogCharacteristic] = useState<string | null>(null);
  const { language } = useLanguage();
  const { translateCharacteristic, translateCharacteristicDescription } = useTranslateKeyword();

  // Define the list of characteristic types
  const characteristicTypes = [
    "Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
    "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
    "Construct", "Undead", "Mounted", "High Command", "Cavalry", "Red Cap", "Living Flesh", "Dead Flesh",
    "Golem", "Mercenary"
  ];

  // Filter keywords to only include characteristics
  const characteristics = keywords
    .filter(k => {
      const keywordName = typeof k === 'string' ? k : k.name;
      return characteristicTypes.includes(keywordName);
    })
    .map(k => typeof k === 'string' ? k : k.name);

  // Add High Command if the prop is provided
  if (highCommand && !characteristics.includes("High Command")) {
    characteristics.push("High Command");
  }

  // If no characteristics, don't render anything
  if (characteristics.length === 0) return null;

  // This component now properly displays just the characteristic name
  const CharacteristicContent = ({ text }: { text: string }) => (
    <p className="text-sm leading-relaxed">
      {translateCharacteristic(text)}
    </p>
  );

  // This component is used for the dialog which shows the full description
  const CharacteristicDescription = ({ text }: { text: string }) => (
    <p className="text-sm leading-relaxed">
      {translateCharacteristicDescription(text)}
    </p>
  );

  return (
    <div className="flex flex-wrap gap-1">
      {characteristics.map((characteristic) => (
        isMobile ? (
          <button 
            key={characteristic}
            type="button"
            className="px-2 py-0.5 text-xs rounded bg-warcrow-gold text-black"
            onClick={() => setOpenDialogCharacteristic(characteristic)}
          >
            {language !== 'en' ? translateCharacteristic(characteristic) : characteristic}
          </button>
        ) : (
          <TooltipProvider key={characteristic}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  type="button"
                  className="px-2 py-0.5 text-xs rounded bg-warcrow-gold text-black"
                >
                  {language !== 'en' ? translateCharacteristic(characteristic) : characteristic}
                </button>
              </TooltipTrigger>
              <TooltipContent 
                className="bg-warcrow-background border-warcrow-gold text-warcrow-text max-w-[250px] whitespace-normal"
              >
                <CharacteristicContent text={characteristic} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      ))}

      {openDialogCharacteristic && (
        <div 
          role="dialog" 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpenDialogCharacteristic(null)}
        >
          <div 
            className="bg-warcrow-background border border-warcrow-gold text-warcrow-text p-6 rounded-lg max-w-lg w-full mx-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setOpenDialogCharacteristic(null)}
              className="absolute right-4 top-4 text-warcrow-text/70 hover:text-warcrow-text"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {language !== 'en' 
                ? translateCharacteristic(openDialogCharacteristic)
                : openDialogCharacteristic}
            </h3>
            <div className="pt-2">
              <CharacteristicDescription text={openDialogCharacteristic} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacteristicsSection;
