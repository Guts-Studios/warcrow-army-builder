
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Upload,
  Save,
  Database,
  Languages,
  FileText,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import UnitDataUploader from "@/components/admin/units/UnitDataUploader";
import UnitKeywordsManager from "@/components/admin/units/UnitKeywordsManager";
import UnitSpecialRulesManager from "@/components/admin/units/UnitSpecialRulesManager";
import UnitCharacteristicsManager from "@/components/admin/units/UnitCharacteristicsManager";
import DeepLUsageStats from "@/components/admin/units/DeepLUsageStats";
import PopulateDataButton from "@/components/admin/units/PopulateDataButton";
import UnitDataTable from "@/components/admin/units/UnitDataTable";

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
        <div className="flex gap-3">
          <PopulateDataButton />
          <DeepLUsageStats />
        </div>
      </div>

      <Tabs
        defaultValue="units"
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="units" className="text-xs sm:text-sm text-warcrow-text">
            Units
          </TabsTrigger>
          <TabsTrigger value="unittable" className="text-xs sm:text-sm text-warcrow-text">
            Unit Table
          </TabsTrigger>
          <TabsTrigger value="keywords" className="text-xs sm:text-sm text-warcrow-text">
            Keywords
          </TabsTrigger>
          <TabsTrigger value="specialrules" className="text-xs sm:text-sm text-warcrow-text">
            Special Rules
          </TabsTrigger>
          <TabsTrigger value="characteristics" className="text-xs sm:text-sm text-warcrow-text">
            Characteristics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <UnitDataUploader />
        </TabsContent>

        <TabsContent value="unittable" className="space-y-4">
          <UnitDataTable />
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
