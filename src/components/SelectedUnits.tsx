import { Button } from "./ui/button";
import { Minus, Eye, Check, Diamond } from "lucide-react";
import { SelectedUnit } from "@/types/army";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import UnitCardDialog from "./stats/unit-explorer/UnitCardDialog";
import { useState } from "react";

interface SelectedUnitsProps {
  selectedUnits: SelectedUnit[];
  onRemove: (unitId: string) => void;
}

const SelectedUnits = ({ selectedUnits, onRemove }: SelectedUnitsProps) => {
  const { t, language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  const [isCardDialogOpen, setIsCardDialogOpen] = useState<boolean>(false);
  const [currentUnit, setCurrentUnit] = useState<SelectedUnit | null>(null);
  
  // Sort units to put High Command first
  const sortedUnits = [...selectedUnits].sort((a, b) => {
    if (a.highCommand && !b.highCommand) return -1;
    if (!a.highCommand && b.highCommand) return 1;
    return 0;
  });

  // Calculate total points
  const totalPoints = selectedUnits.reduce((total, unit) => {
    return total + (unit.pointsCost * unit.quantity);
  }, 0);

  // Calculate total command points
  const totalCommand = selectedUnits.reduce((total, unit) => {
    return total + ((unit.command || 0) * unit.quantity);
  }, 0);

  const formatUnitDisplay = (name: string, quantity: number | undefined) => {
    if (!name || typeof quantity !== 'number') return "";
    // Translate unit name if not in English
    const displayName = language !== 'en' ? translateUnitName(name) : name;
    const displayQuantity = Math.min(quantity, 9);
    return `${displayName} x${displayQuantity}`;
  };

  const handleViewCard = (unit: SelectedUnit) => {
    setCurrentUnit(unit);
    setIsCardDialogOpen(true);
  };

  // Helper function to get the correct card URL
  const getCardUrl = (unit: SelectedUnit) => {
    if (!unit) return "";
    
    // If unit has imageUrl property, use that
    if (unit.imageUrl) return unit.imageUrl;
    
    // Otherwise, construct URL based on unit id
    const baseUrl = `/art/card/${unit.id}_card`;
    
    // Add language suffix
    if (language === 'es') {
      return `${baseUrl}_sp.jpg`;
    } else if (language === 'fr') {
      return `${baseUrl}_fr.jpg`;
    } else {
      return `${baseUrl}_en.jpg`; 
    }
  };

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 space-y-2 flex flex-col max-h-[calc(100vh-12rem)]">
      <div className="flex-grow overflow-auto pr-1">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {sortedUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between bg-warcrow-background p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <div className="text-warcrow-text flex items-center gap-1">
                    <span>{formatUnitDisplay(unit.name, unit.quantity)}</span>
                    {unit.command ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-0.5 text-warcrow-gold">
                              <Diamond className="h-4 w-4" />
                              {unit.command}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('commandPoints')}: {unit.command}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                    {unit.highCommand && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Check className="h-4 w-4 text-warcrow-gold" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('highCommand')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <span className="text-warcrow-muted">
                    ({unit.pointsCost * unit.quantity} {t('pts')})
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
                    onClick={() => handleViewCard(unit)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(unit.id)}
                    className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        {selectedUnits.length === 0 && (
          <p className="text-warcrow-muted text-center py-4">{t('noUnitsSelected')}</p>
        )}
      </div>
      
      {selectedUnits.length > 0 && (
        <div className="flex justify-end pt-2 gap-4 border-t border-warcrow-background mt-2">
          <span className="text-warcrow-gold">
            {t('command')}: {totalCommand}
          </span>
          <span className="text-warcrow-gold">
            {t('totalPoints')}: {totalPoints}
          </span>
        </div>
      )}

      {currentUnit && (
        <UnitCardDialog
          isOpen={isCardDialogOpen}
          onClose={() => setIsCardDialogOpen(false)}
          unitName={currentUnit.name}
          cardUrl={getCardUrl(currentUnit)}
        />
      )}
    </div>
  );
};

export default SelectedUnits;
