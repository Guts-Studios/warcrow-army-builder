
import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCharacteristics } from "./characteristics/useCharacteristics";
import CharacteristicForm from "./characteristics/CharacteristicForm";
import CharacteristicsTable from "./characteristics/CharacteristicsTable";
import TranslationWarning from "./characteristics/TranslationWarning";
import TranslationButtons from "./characteristics/TranslationButtons";
import TranslationProgress from "./characteristics/TranslationProgress";
import { Button } from "@/components/ui/button";
import { WrenchScrewdriver } from "lucide-react";
import { fixMissingTranslations } from "@/utils/translation/updateMissingTranslations";

const UnitCharacteristicsManager: React.FC = () => {
  const { language } = useLanguage();
  const {
    characteristics,
    isLoading,
    editingCharacteristic,
    translationInProgress,
    translationProgress,
    setEditingCharacteristic,
    startEditing,
    saveCharacteristic,
    translateAllCharacteristicsNames,
    translateAllCharacteristicsDescriptions,
    getMissingTranslationsCount,
    fetchCharacteristics
  } = useCharacteristics();
  
  const { namesMissing: spanishNamesMissing, descriptionsMissing: spanishDescMissing } = getMissingTranslationsCount('es');
  const { namesMissing: frenchNamesMissing, descriptionsMissing: frenchDescMissing } = getMissingTranslationsCount('fr');

  const handleFixTranslations = async () => {
    await fixMissingTranslations();
    // Refresh the characteristics list after fixing translations
    fetchCharacteristics();
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Characteristics Management</h2>
          
          <div className="flex gap-2 flex-wrap">
            {(spanishNamesMissing > 0 || frenchNamesMissing > 0 || spanishDescMissing > 0 || frenchDescMissing > 0) && (
              <Button
                variant="outline"
                className="border-amber-500/50 text-amber-500"
                onClick={handleFixTranslations}
                size="sm"
              >
                <WrenchScrewdriver className="h-4 w-4 mr-1" />
                Fix Missing Translations
              </Button>
            )}
            
            <TranslationButtons 
              isLoading={isLoading}
              translationInProgress={translationInProgress}
              spanishNamesMissing={spanishNamesMissing}
              frenchNamesMissing={frenchNamesMissing}
              spanishDescMissing={spanishDescMissing}
              frenchDescMissing={frenchDescMissing}
              onTranslateNames={translateAllCharacteristicsNames}
              onTranslateDescriptions={translateAllCharacteristicsDescriptions}
            />
          </div>
        </div>

        <TranslationWarning 
          spanishNamesMissing={spanishNamesMissing}
          frenchNamesMissing={frenchNamesMissing}
          spanishDescMissing={spanishDescMissing}
          frenchDescMissing={frenchDescMissing}
        />

        <TranslationProgress 
          translationInProgress={translationInProgress}
          translationProgress={translationProgress}
        />
        
        {editingCharacteristic && (
          <CharacteristicForm 
            editingCharacteristic={editingCharacteristic}
            setEditingCharacteristic={setEditingCharacteristic}
            saveCharacteristic={saveCharacteristic}
          />
        )}
        
        <CharacteristicsTable 
          characteristics={characteristics}
          isLoading={isLoading}
          startEditing={startEditing}
        />
      </div>
    </Card>
  );
};

export default UnitCharacteristicsManager;
