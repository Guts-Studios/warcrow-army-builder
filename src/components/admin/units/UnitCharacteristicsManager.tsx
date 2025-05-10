
import React from 'react';
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCharacteristics } from "./characteristics/useCharacteristics";
import CharacteristicForm from "./characteristics/CharacteristicForm";
import CharacteristicsTable from "./characteristics/CharacteristicsTable";
import TranslationWarning from "./characteristics/TranslationWarning";
import TranslationButtons from "./characteristics/TranslationButtons";
import TranslationProgress from "./characteristics/TranslationProgress";

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
    getMissingTranslationsCount
  } = useCharacteristics();
  
  const { namesMissing: spanishNamesMissing, descriptionsMissing: spanishDescMissing } = getMissingTranslationsCount('es');
  const { namesMissing: frenchNamesMissing, descriptionsMissing: frenchDescMissing } = getMissingTranslationsCount('fr');

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Characteristics Management</h2>
          
          <div className="flex gap-2 flex-wrap">
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
