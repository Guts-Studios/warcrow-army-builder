
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Unit } from '@/types/game';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UnitCardDialog from '@/components/stats/unit-explorer/UnitCardDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateCardUrl } from '@/utils/imageUtils';

interface PlayerUnitsListProps {
  units: Unit[];
}

const PlayerUnitsList: React.FC<PlayerUnitsListProps> = ({ units }) => {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState<boolean>(false);
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const { language } = useLanguage();

  const handleViewCard = (unit: Unit) => {
    setCurrentUnit(unit);
    setIsCardDialogOpen(true);
  };

  return (
    <div>
      <Label className="font-medium">Units</Label>
      <div className="mt-2 space-y-2">
        {units.length > 0 ? (
          units.map((unit) => (
            <Card key={unit.id} className="bg-background/50 border-dashed">
              <CardContent className="p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{unit.name}</div>
                  {unit.status && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Status: {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 text-warcrow-gold hover:text-warcrow-gold/80"
                  onClick={() => handleViewCard(unit)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-sm text-muted-foreground italic">No units parsed from list</div>
        )}
      </div>
      
      {currentUnit && (
        <UnitCardDialog
          isOpen={isCardDialogOpen}
          onClose={() => setIsCardDialogOpen(false)}
          unitName={currentUnit.name}
          cardUrl={generateCardUrl(currentUnit.name, language)}
        />
      )}
    </div>
  );
};

export default PlayerUnitsList;
