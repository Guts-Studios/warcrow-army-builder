
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { 
  Upload,
  Save,
  Database,
  Languages,
  FileText,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { batchTranslate } from "@/utils/translation/batchTranslate";
import UnitDataUploader from "./units/UnitDataUploader";
import UnitKeywordsManager from "./units/UnitKeywordsManager";
import UnitSpecialRulesManager from "./units/UnitSpecialRulesManager";
import UnitCharacteristicsManager from "./units/UnitCharacteristicsManager";
import DeepLUsageStats from "./units/DeepLUsageStats";

const UnitDataManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState("units");
  const [isLoading, setIsLoading] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const { language } = useLanguage();

  // Track progress through custom event
  useEffect(() => {
    const handleProgress = (e: any) => {
      setTranslationProgress(e.detail.progress || 0);
    };

    window.addEventListener('translation-progress', handleProgress as EventListener);
    
    return () => {
      window.removeEventListener('translation-progress', handleProgress as EventListener);
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-warcrow-gold">Unit Data Management</h1>
        <DeepLUsageStats />
      </div>

      <Tabs
        defaultValue="units"
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="units" className="text-xs sm:text-sm">
            Units
          </TabsTrigger>
          <TabsTrigger value="keywords" className="text-xs sm:text-sm">
            Keywords
          </TabsTrigger>
          <TabsTrigger value="specialrules" className="text-xs sm:text-sm">
            Special Rules
          </TabsTrigger>
          <TabsTrigger value="characteristics" className="text-xs sm:text-sm">
            Characteristics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <UnitDataUploader />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <UnitKeywordsManager />
        </TabsContent>

        <TabsContent value="specialrules" className="space-y-4">
          <UnitSpecialRulesManager />
        </TabsContent>

        <TabsContent value="characteristics" className="space-y-4">
          <UnitCharacteristicsManager />
        </TabsContent>
      </Tabs>

      {translationInProgress && (
        <Card className="p-4 bg-black/50 border-warcrow-gold/30">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-warcrow-text/90">Translating unit data...</span>
              <span className="text-sm font-medium text-warcrow-gold">{translationProgress.toFixed(0)}%</span>
            </div>
            <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        </Card>
      )}
    </div>
  );
};

export default UnitDataManager;
