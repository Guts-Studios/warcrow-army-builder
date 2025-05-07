
import React, { useState } from 'react';
import { RefreshCw, Copy, CheckCircle, ClipboardCopy, Eye, EyeOff, Languages, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { type EditingItem } from './types';
import { ColorTextEditor } from '../shared/ColorTextEditor';
import { FormattedTextPreview } from '../shared/FormattedTextPreview';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  onSave,
}) => {
  const [titleCopied, setTitleCopied] = useState(false);
  const [contentCopied, setContentCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<'es' | 'fr'>('es');
  
  if (!editingItem) return null;

  const copyToClipboard = async (text: string, type: 'title' | 'content') => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'title') {
        setTitleCopied(true);
        setTimeout(() => setTitleCopied(false), 2000);
      } else {
        setContentCopied(true);
        setTimeout(() => setContentCopied(false), 2000);
      }
      
      toast.success("Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const translateContent = async () => {
    if (!editingItem) return;
    
    try {
      setTranslationInProgress(true);
      
      const textsToTranslate = [];
      
      // Add title to array of texts to translate
      if (editingItem.title) {
        textsToTranslate.push(editingItem.title);
      }
      
      // Add content to array of texts to translate if it exists
      if (editingItem.content) {
        textsToTranslate.push(editingItem.content);
      }
      
      if (textsToTranslate.length === 0) {
        toast.error("No content to translate");
        return;
      }
      
      // Call the DeepL API via Supabase edge function
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: textsToTranslate,
          targetLanguage: targetLanguage.toUpperCase(),
          formality: 'more'
        }
      });
      
      if (error) {
        console.error('Translation error:', error);
        toast.error(`Translation failed: ${error.message}`);
        return;
      }
      
      if (data && data.translations && data.translations.length > 0) {
        // Update the editingItem with translated content
        const updatedItem = { ...editingItem };
        
        // Set title translation
        if (targetLanguage === 'es') {
          updatedItem.title_es = data.translations[0];
        } else if (targetLanguage === 'fr') {
          // Adding support for French
          updatedItem.title_fr = data.translations[0];
        }
        
        // Set content translation if it exists
        if (data.translations.length > 1 && editingItem.content) {
          if (targetLanguage === 'es') {
            updatedItem.content_es = data.translations[1];
          } else if (targetLanguage === 'fr') {
            updatedItem.content_fr = data.translations[1];
          }
        }
        
        setEditingItem(updatedItem);
        toast.success(`Translation to ${targetLanguage === 'es' ? 'Spanish' : 'French'} completed`);
      } else {
        toast.error("No translation returned");
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Translation failed");
    } finally {
      setTranslationInProgress(false);
    }
  };

  // Calculate appropriate textarea height based on content type
  const getTextareaHeight = () => {
    if (editingItem.type === 'section' && editingItem.content) {
      const contentLength = editingItem.content.length;
      // Adjust height based on content length, but keep it reasonable
      return contentLength > 500 ? "h-[150px]" : "h-[120px]";
    }
    return "h-[100px]";
  };

  const togglePreviewMode = () => {
    setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit');
  };
  
  // Function to get content based on selected language
  const getLanguageContent = () => {
    if (targetLanguage === 'es') {
      return {
        title: editingItem.title_es || '',
        content: editingItem.content_es || ''
      };
    } else if (targetLanguage === 'fr') {
      return {
        title: editingItem.title_fr || '',
        content: editingItem.content_fr || ''
      };
    }
    
    // Default fallback
    return {
      title: editingItem.title_es || '',
      content: editingItem.content_es || ''
    };
  };
  
  // Function to update content based on selected language
  const updateLanguageContent = (field: 'title' | 'content', value: string) => {
    if (!editingItem) return;
    
    const updatedItem = { ...editingItem };
    
    if (targetLanguage === 'es') {
      if (field === 'title') {
        updatedItem.title_es = value;
      } else {
        updatedItem.content_es = value;
      }
    } else if (targetLanguage === 'fr') {
      if (field === 'title') {
        updatedItem.title_fr = value;
      } else {
        updatedItem.content_fr = value;
      }
    }
    
    setEditingItem(updatedItem);
  };
  
  const languageContent = getLanguageContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle>
              {editingItem.type === 'chapter' ? 'Edit Chapter Translation' : 'Edit Section Translation'}
            </DialogTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={togglePreviewMode}
                className="flex items-center gap-1 text-xs border-warcrow-gold/30"
              >
                {previewMode === 'edit' ? (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Edit Mode
                  </>
                )}
              </Button>
            </div>
          </div>
          <DialogDescription className="text-xs">
            {editingItem.type === 'chapter' 
              ? 'Edit chapter title in English and translation. You can highlight text and apply formatting.' 
              : 'Edit section title and content in English and translation. You can highlight text and apply formatting.'}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-2">
            {/* English section */}
            <div className="space-y-3">
              <h3 className="font-medium text-warcrow-gold text-sm flex items-center gap-1">
                English
                <span className="text-xs text-warcrow-text/70">(source)</span>
              </h3>
              
              {/* English title */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="en-title" className="text-xs text-warcrow-text/70">Title</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(editingItem.title, 'title')}
                    className="h-6 px-2 text-xs"
                  >
                    {titleCopied ? (
                      <><CheckCircle className="h-3 w-3 mr-1" />Copied</>
                    ) : (
                      <><ClipboardCopy className="h-3 w-3 mr-1" />Copy</>
                    )}
                  </Button>
                </div>
                <Input
                  id="en-title"
                  placeholder="Edit title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text"
                />
              </div>
              
              {/* English content (only for sections) */}
              {editingItem.type === 'section' && editingItem.content && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="en-content" className="text-xs text-warcrow-text/70">Content</label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(editingItem.content || '', 'content')}
                      className="h-6 px-2 text-xs"
                    >
                      {contentCopied ? (
                        <><CheckCircle className="h-3 w-3 mr-1" />Copied</>
                      ) : (
                        <><ClipboardCopy className="h-3 w-3 mr-1" />Copy</>
                      )}
                    </Button>
                  </div>
                  
                  {previewMode === 'edit' ? (
                    <ColorTextEditor
                      id="en-content"
                      value={editingItem.content}
                      onChange={(value) => setEditingItem({...editingItem, content: value})}
                      placeholder="Edit content"
                      className={getTextareaHeight()}
                    />
                  ) : (
                    <FormattedTextPreview 
                      content={editingItem.content}
                      className={getTextareaHeight()}
                    />
                  )}
                </div>
              )}
            </div>
            
            {/* Translation section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-warcrow-gold text-sm flex items-center gap-1">
                  <Select value={targetLanguage} onValueChange={(value) => setTargetLanguage(value as 'es' | 'fr')}>
                    <SelectTrigger className="w-[130px] h-6 border-warcrow-gold/30 text-sm bg-black">
                      <Languages className="h-3.5 w-3.5 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border border-warcrow-gold/30">
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-warcrow-text/70 ml-2">(translation)</span>
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={translateContent}
                  disabled={translationInProgress}
                  className="h-7 px-2 text-xs border-warcrow-gold/30 text-warcrow-gold"
                >
                  {translationInProgress ? (
                    <><RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />Translating...</>
                  ) : (
                    <><Wand2 className="h-3.5 w-3.5 mr-1" />Translate</>
                  )}
                </Button>
              </div>
              
              {/* Translated title */}
              <div className="space-y-1">
                <label htmlFor="translated-title" className="text-xs text-warcrow-text/70">Title</label>
                <Input
                  id="translated-title"
                  placeholder={`Translate title to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`}
                  value={languageContent.title}
                  onChange={(e) => updateLanguageContent('title', e.target.value)}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text"
                />
              </div>
              
              {/* Translated content (only for sections) */}
              {editingItem.type === 'section' && (
                <div className="space-y-1">
                  <label htmlFor="translated-content" className="text-xs text-warcrow-text/70">Content</label>
                  {previewMode === 'edit' ? (
                    <ColorTextEditor
                      id="translated-content"
                      value={languageContent.content}
                      onChange={(value) => updateLanguageContent('content', value)}
                      placeholder={`Translate content to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`}
                      className={getTextareaHeight()}
                    />
                  ) : (
                    <FormattedTextPreview 
                      content={languageContent.content}
                      className={getTextareaHeight()}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saveInProgress}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saveInProgress}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
            size="sm"
          >
            {saveInProgress ? <RefreshCw className="h-3 w-3 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
