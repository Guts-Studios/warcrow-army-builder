
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, Database, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

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

const UnitExplorer: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("units");
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const { language, setLanguage } = useLanguage();
  
  // Fetch units data
  const { data: units, isLoading, error } = useQuery({
    queryKey: ['units', selectedFaction],
    queryFn: async () => {
      let query = supabase.from('unit_data').select('*');
      
      if (selectedFaction !== 'all') {
        query = query.eq('faction_id', selectedFaction);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Fetch factions for filter
  const { data: factions } = useQuery({
    queryKey: ['factions'],
    queryFn: async () => {
      const { data } = await supabase.from('factions').select('*');
      return data || [];
    }
  });

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
  
  // Filter units based on search query
  const filteredUnits = units?.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (error) {
    return (
      <Card className="p-6 border-red-500 bg-red-50 text-red-900">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold">Error Loading Units</h3>
        </div>
        <p>{(error as Error).message}</p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Unit Explorer</h1>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedFaction} onValueChange={setSelectedFaction}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Faction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Factions</SelectItem>
              {factions?.map(faction => (
                <SelectItem key={faction.id} value={faction.id}>{faction.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-60"
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="units" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No units found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnits.map(unit => (
                <Card key={unit.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{unit.name}</h3>
                      <p className="text-sm text-gray-600">{unit.faction_name}</p>
                    </div>
                    <div className="flex gap-1">
                      {unit.name_es && <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">ES</div>}
                      {unit.name_fr && <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">FR</div>}
                    </div>
                  </div>
                  <p className="mt-2 text-sm line-clamp-2">{unit.description || "No description available"}</p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="translations" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnitExplorer;
