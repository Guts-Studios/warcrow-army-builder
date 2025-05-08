
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Languages } from "lucide-react";
import { EditingItem } from './types';
import { ColorTextEditor } from "../shared/ColorTextEditor";
import { FormattedTextPreview } from "../shared/FormattedTextPreview";
import { supabase } from "@/integrations/supabase/client";

interface TranslationEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: EditingItem | null;
  setEditingItem: (item: EditingItem | null) => void;
  saveInProgress: boolean;
  onSave: () => Promise<void>;
}

export const TranslationEditDialog: React.FC<TranslationEditDialogProps> = ({
  open,
  onOpenChange,
  editingItem,
  setEditingItem,
  saveInProgress,
  onSave
}) => {
  if (!editingItem) return null;
  
  const isSection = editingItem.type === 'section';
  
  // Function to handle translation of individual fields
  const handleTranslate = async (field: 'title' | 'content') => {
    if (!editingItem) return;
    
    try {
      // Prepare the source text to translate
      const textToTranslate = field === 'title' ? editingItem.title : editingItem.content;
      
      if (!textToTranslate) {
        console.warn(`No ${field} to translate`);
        return;
      }
      
      // Call the DeepL API via Supabase edge function
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: [textToTranslate],
          targetLanguage: 'ES',
          formality: 'more'
        }
      });
      
      if (error) {
        console.error('Translation error:', error);
        return;
      }
      
      if (data && data.translations && data.translations.length > 0) {
        // Update the appropriate field with the translation
        if (field === 'title') {
          setEditingItem({
            ...editingItem,
            title_es: data.translations[0]
          });
        } else {
          setEditingItem({
            ...editingItem,
            content_es: data.translations[0]
          });
        }
      }
    } catch (error) {
      console.error(`Error translating ${field}:`, error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl bg-black border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {isSection ? 'Edit Section Translation' : 'Edit Chapter Translation'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Title section - two columns */}
          <div className="grid grid-cols-2 gap-4">
            {/* English title (original) */}
            <div className="space-y-2">
              <Label htmlFor="title-en" className="text-warcrow-gold">English Title:</Label>
              <Input
                id="title-en"
                value={editingItem.title || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              />
            </div>
            
            {/* Spanish title with translate button */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="title-es" className="text-warcrow-gold">Spanish Title:</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleTranslate('title')}
                  className="h-6 px-2 text-xs border-warcrow-gold/30 text-warcrow-gold"
                >
                  <Languages className="h-3 w-3 mr-1" />
                  Translate
                </Button>
              </div>
              <Input
                id="title-es"
                value={editingItem.title_es || ''}
                onChange={(e) => setEditingItem({ ...editingItem, title_es: e.target.value })}
                className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              />
            </div>
          </div>
          
          {/* Only show content fields for sections - two columns */}
          {isSection && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {/* English content (original) */}
                <div className="space-y-2">
                  <Label htmlFor="content-en" className="text-warcrow-gold">English Content:</Label>
                  <ColorTextEditor
                    id="content-en"
                    value={editingItem.content || ''}
                    onChange={(value) => setEditingItem({ ...editingItem, content: value })}
                    rows={12}
                    placeholder="Enter content in English"
                  />
                  
                  {/* Preview of the formatted content */}
                  <Label className="text-warcrow-gold mt-2">Preview:</Label>
                  <FormattedTextPreview content={editingItem.content || ''} />
                </div>
                
                {/* Spanish content with translate button */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="content-es" className="text-warcrow-gold">Spanish Content:</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleTranslate('content')}
                      className="h-6 px-2 text-xs border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-3 w-3 mr-1" />
                      Translate
                    </Button>
                  </div>
                  <ColorTextEditor
                    id="content-es"
                    value={editingItem.content_es || ''}
                    onChange={(value) => setEditingItem({ ...editingItem, content_es: value })}
                    rows={12}
                    placeholder="Enter content in Spanish"
                  />
                  
                  {/* Preview of the formatted content */}
                  <Label className="text-warcrow-gold mt-2">Preview:</Label>
                  <FormattedTextPreview content={editingItem.content_es || ''} />
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => onSave()} 
            disabled={saveInProgress} 
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
          >
            {saveInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
