
import React, { useState } from 'react';
import { toast } from '@/components/ui/toast-core';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Database } from 'lucide-react';

interface TranslationPanelProps {
  units: Array<any>;
  onTranslationComplete: () => void;
}

// Simulated translation service
const translateAllMissingContent = async (language: string) => {
  try {
    // This would be replaced with actual API call to your translation service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Translated missing content to ${language}`);
    return { success: true, count: Math.floor(Math.random() * 20) + 5 };
  } catch (error) {
    toast.error(`Failed to translate content: ${(error as Error).message}`);
    return { success: false, count: 0 };
  }
};

export const TranslationPanel: React.FC<TranslationPanelProps> = ({ units, onTranslationComplete }) => {
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

  // Translation statistics
  const missingTranslations = {
    es: {
      names: units?.filter(unit => !unit.name_es).length || 0,
      descriptions: units?.filter(unit => !unit.description_es).length || 0
    },
    fr: {
      names: units?.filter(unit => !unit.name_fr).length || 0,
      descriptions: units?.filter(unit => !unit.description_fr).length || 0
    }
  };

  const handleTranslate = async (targetLanguage: string) => {
    if (translationInProgress) return;
    
    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    try {
      // Progress simulation for better UX
      const interval = setInterval(() => {
        setTranslationProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 10);
        });
      }, 300);
      
      const result = await translateAllMissingContent(targetLanguage);
      
      clearInterval(interval);
      setTranslationProgress(100);
      
      if (result.success) {
        toast.success(`Successfully translated ${result.count} items to ${targetLanguage}`);
        onTranslationComplete();
      } else {
        toast.error(`Translation to ${targetLanguage} failed`);
      }
      
      // Reset progress after a delay
      setTimeout(() => {
        setTranslationProgress(0);
        setTranslationInProgress(false);
      }, 1000);
      
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(`Translation error: ${(error as Error).message}`);
      setTranslationInProgress(false);
      setTranslationProgress(0);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Translation Status</h3>
      
      {translationInProgress && (
        <div className="mb-6">
          <p className="text-sm mb-2">Translation in progress... {translationProgress}%</p>
          <Progress value={translationProgress} className="h-2" />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Spanish (ES) Translations</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Unit Names:</span>
              <span className={missingTranslations.es.names > 0 ? "text-amber-600" : "text-green-600"}>
                {units ? units.length - missingTranslations.es.names : 0} / {units?.length || 0}
                {missingTranslations.es.names === 0 && <CheckCircle className="inline ml-1 h-4 w-4" />}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Descriptions:</span>
              <span className={missingTranslations.es.descriptions > 0 ? "text-amber-600" : "text-green-600"}>
                {units ? units.length - missingTranslations.es.descriptions : 0} / {units?.length || 0}
                {missingTranslations.es.descriptions === 0 && <CheckCircle className="inline ml-1 h-4 w-4" />}
              </span>
            </div>
          </div>
          <Button 
            onClick={() => handleTranslate('es')}
            disabled={translationInProgress || missingTranslations.es.names + missingTranslations.es.descriptions === 0}
            className="w-full"
          >
            <Database className="mr-2 h-4 w-4" />
            Translate Missing Spanish Content
          </Button>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">French (FR) Translations</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Unit Names:</span>
              <span className={missingTranslations.fr.names > 0 ? "text-amber-600" : "text-green-600"}>
                {units ? units.length - missingTranslations.fr.names : 0} / {units?.length || 0}
                {missingTranslations.fr.names === 0 && <CheckCircle className="inline ml-1 h-4 w-4" />}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Descriptions:</span>
              <span className={missingTranslations.fr.descriptions > 0 ? "text-amber-600" : "text-green-600"}>
                {units ? units.length - missingTranslations.fr.descriptions : 0} / {units?.length || 0}
                {missingTranslations.fr.descriptions === 0 && <CheckCircle className="inline ml-1 h-4 w-4" />}
              </span>
            </div>
          </div>
          <Button 
            onClick={() => handleTranslate('fr')}
            disabled={translationInProgress || missingTranslations.fr.names + missingTranslations.fr.descriptions === 0}
            className="w-full"
          >
            <Database className="mr-2 h-4 w-4" />
            Translate Missing French Content
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TranslationPanel;
