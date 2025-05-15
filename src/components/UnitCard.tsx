
import { Unit } from "@/types/army";
import UnitHeader from "./unit/UnitHeader";
import UnitControls from "./unit/UnitControls";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitCardKeywords from "./unit/card/UnitCardKeywords";
import UnitCardImage from "./unit/card/UnitCardImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translationUtils";
import { Button } from "./ui/button";
import { FileImage } from "lucide-react";

interface UnitCardProps {
  unit: Unit;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitCard = ({ unit, quantity, onAdd, onRemove }: UnitCardProps) => {
  const isMobile = useIsMobile();
  const { language, t } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  
  // Translate unit name based on the selected language
  const displayName = translateUnitName(unit.name, language);

  // Function to handle view card button click
  const handleViewCardClick = () => {
    if (unit.imageUrl) {
      window.open(unit.imageUrl, '_blank');
    }
  };

  return (
    <div className="bg-warcrow-accent rounded-lg p-3 md:p-4 space-y-2 md:space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1">
          <UnitHeader 
            unit={unit} 
            mainName={displayName}
            portraitUrl={unit.imageUrl}
          />
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
          <span className="text-warcrow-gold font-semibold">
            {unit.pointsCost} {t('points')}
          </span>
          <UnitControls 
            quantity={quantity} 
            onAdd={onAdd} 
            onRemove={onRemove}
            availability={unit.availability}
            pointsCost={unit.pointsCost}
          />
        </div>
      </div>

      <UnitCardKeywords 
        unit={unit}
        isMobile={isMobile}
      />

      <UnitCardImage unit={unit} />
      
      {unit.imageUrl && (
        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewCardClick}
            className="text-xs"
          >
            <FileImage className="h-3.5 w-3.5 mr-1.5" />
            {t('viewCard') || 'View Card'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UnitCard;
