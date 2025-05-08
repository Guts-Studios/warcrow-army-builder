import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Save, Database, FileText, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { batchTranslate } from "@/utils/translation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

interface KeywordItem {
  id?: string;
  name: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

const UnitKeywordsManager: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<KeywordItem | null>(null);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_keywords')
        .select('*')
        .order('name');

      if (error) throw error;
      setKeywords(data || []);
    } catch (error: any) {
      console.error("Error fetching keywords:", error);
      toast.error(`Failed to fetch keywords: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (keyword: KeywordItem) => {
    setEditingKeyword({ ...keyword });
  };

  const saveKeyword = async () => {
    if (!editingKeyword) return;
    
    try {
      const { data, error } = await supabase
        .from('unit_keywords')
        .upsert({
          id: editingKeyword.id,
          name: editingKeyword.name,
          description: editingKeyword.description,
          description_es: editingKeyword.description_es,
          description_fr: editingKeyword.description_fr
        }, { onConflict: 'id' });

      if (error) throw error;
      
      setKeywords(keywords.map(k => k.id === editingKeyword.id ? editingKeyword : k));
      setEditingKeyword(null);
      toast.success(`Saved keyword: ${editingKeyword.name}`);
    } catch (error: any) {
      console.error("Error saving keyword:", error);
      toast.error(`Failed to save: ${error.message}`);
    }
  };

  const translateAllKeywords = async (targetLanguage: string) => {
    if (keywords.length === 0) {
      toast.error("No keywords to translate");
      return;
    }

    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    try {
      const itemsToTranslate = keywords
        .filter(k => k.description && (!k.description_es || targetLanguage === 'fr' && !k.description_fr))
        .map(k => ({
          id: k.id || '',
          key: 'description',
          source: k.description
        }));
      
      if (itemsToTranslate.length === 0) {
        toast.info("All keywords already have translations");
        setTranslationInProgress(false);
        return;
      }

      // Track progress
      const total = itemsToTranslate.length;
      let completed = 0;

      // Process in batches
      const batchSize = 10;
      for (let i = 0; i < itemsToTranslate.length; i += batchSize) {
        const batch = itemsToTranslate.slice(i, i + batchSize);
        const results = await batchTranslate(batch, targetLanguage, true, 'unit_keywords');
        
        completed += batch.length;
        setTranslationProgress(Math.round((completed / total) * 100));
        
        // Small delay between batches
        if (i + batchSize < itemsToTranslate.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      await fetchKeywords(); // Refresh keyword list
      toast.success(`Successfully translated ${itemsToTranslate.length} keywords`);
    } catch (error: any) {
      console.error("Error translating keywords:", error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setTranslationInProgress(false);
    }
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Keywords Management</h2>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-warcrow-gold/50 text-warcrow-gold"
              onClick={() => translateAllKeywords('es')}
              disabled={isLoading || translationInProgress}
            >
              <Translate className="h-4 w-4 mr-2" />
              Translate to Spanish
            </Button>
            <Button 
              variant="outline" 
              className="border-warcrow-gold/50 text-warcrow-gold"
              onClick={() => translateAllKeywords('fr')}
              disabled={isLoading || translationInProgress}
            >
              <Translate className="h-4 w-4 mr-2" />
              Translate to French
            </Button>
          </div>
        </div>

        {translationInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-warcrow-text/90">Translation progress</span>
              <span className="text-sm font-medium text-warcrow-gold">{translationProgress}%</span>
            </div>
            <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        )}
        
        {editingKeyword && (
          <Card className="p-4 border-warcrow-gold bg-black/70">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Keyword Name</label>
                <Input 
                  value={editingKeyword.name}
                  onChange={(e) => setEditingKeyword({...editingKeyword, name: e.target.value})}
                  className="bg-black border-warcrow-gold/50"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (English)</label>
                <Textarea 
                  value={editingKeyword.description}
                  onChange={(e) => setEditingKeyword({...editingKeyword, description: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (Spanish)</label>
                <Textarea 
                  value={editingKeyword.description_es || ''}
                  onChange={(e) => setEditingKeyword({...editingKeyword, description_es: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (French)</label>
                <Textarea 
                  value={editingKeyword.description_fr || ''}
                  onChange={(e) => setEditingKeyword({...editingKeyword, description_fr: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingKeyword(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                  onClick={saveKeyword}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        <div className="rounded border border-warcrow-gold/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
                <TableHead className="text-warcrow-gold">Keyword</TableHead>
                <TableHead className="text-warcrow-gold">Description</TableHead>
                <TableHead className="text-warcrow-gold">Spanish</TableHead>
                <TableHead className="text-warcrow-gold">French</TableHead>
                <TableHead className="text-warcrow-gold w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
                </TableRow>
              ) : keywords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-warcrow-text/70">No keywords found</TableCell>
                </TableRow>
              ) : (
                keywords.map((keyword) => (
                  <TableRow key={keyword.id} className="hover:bg-warcrow-accent/5">
                    <TableCell className="font-medium">{keyword.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{keyword.description}</TableCell>
                    <TableCell>
                      {keyword.description_es ? '✓' : '—'}
                    </TableCell>
                    <TableCell>
                      {keyword.description_fr ? '✓' : '—'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => startEditing(keyword)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default UnitKeywordsManager;
