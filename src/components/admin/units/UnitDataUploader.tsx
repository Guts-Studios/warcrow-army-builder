
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedUnit } from '@/types/extendedUnit';
import { Textarea } from "@/components/ui/textarea";

const UnitDataUploader: React.FC = () => {
  const [jsonContent, setJsonContent] = useState("");
  const [units, setUnits] = useState<ExtendedUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonContent(content);
        const parsedUnits = JSON.parse(content);
        setUnits(Array.isArray(parsedUnits) ? parsedUnits : [parsedUnits]);
        toast.success(`Successfully loaded ${Array.isArray(parsedUnits) ? parsedUnits.length : 1} units`);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast.error("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveToDatabase = async () => {
    if (units.length === 0) {
      toast.error("No units to save");
      return;
    }

    setIsLoading(true);
    try {
      // First save basic unit data
      const basicUnitData = units.map(unit => ({
        id: unit.id,
        name: unit.name, 
        cost: unit.cost,
        type: unit.type,
        stats: JSON.stringify(unit.stats),
        keywords: unit.keywords ? unit.keywords.join(',') : '',
        imageUrl: unit.imageUrl || null,
        profiles: JSON.stringify(unit.profiles),
        abilities: JSON.stringify(unit.abilities)
      }));

      const { error } = await supabase
        .from('unit_data')
        .upsert(basicUnitData, { onConflict: 'id' });

      if (error) throw error;

      // Process keywords
      const allKeywords = units.flatMap(unit => unit.keywords || []);
      const uniqueKeywords = [...new Set(allKeywords)];
      
      if (uniqueKeywords.length > 0) {
        const keywordObjects = uniqueKeywords.map(keyword => ({
          name: keyword,
          description: '' // Empty description to be filled later
        }));

        const { error: keywordError } = await supabase
          .from('unit_keywords')
          .upsert(
            keywordObjects.map(k => ({ name: k.name })), 
            { onConflict: 'name' }
          );

        if (keywordError) throw keywordError;
      }

      toast.success(`Successfully saved ${units.length} units to database`);
    } catch (error: any) {
      console.error("Error saving to database:", error);
      toast.error(`Failed to save: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Upload Unit Data</h2>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-warcrow-gold/50 text-warcrow-gold"
              onClick={() => document.getElementById('unit-json-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload JSON
              <input
                id="unit-json-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Button>
            
            <Button 
              variant="default" 
              className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
              onClick={handleSaveToDatabase}
              disabled={isLoading || units.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save to Database"}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-warcrow-text/90">Unit JSON Data</label>
            {units.length > 0 && (
              <span className="text-xs text-warcrow-gold">{units.length} units loaded</span>
            )}
          </div>
          <Textarea 
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="font-mono text-sm h-64 bg-black/70 border-warcrow-gold/30"
            placeholder="Paste unit JSON data here or upload a file..."
          />
        </div>
      </div>
    </Card>
  );
};

export default UnitDataUploader;
