
import React, { useState } from 'react';
import { RefreshCw, Copy, CheckCircle, ClipboardCopy, Eye, EyeOff } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader className="pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle>
              {editingItem.type === 'chapter' ? 'Edit Chapter Translation' : 'Edit Section Translation'}
            </DialogTitle>
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
          <DialogDescription className="text-xs">
            {editingItem.type === 'chapter' 
              ? 'Edit chapter title in English and Spanish. You can highlight text and apply formatting.' 
              : 'Edit section title and content in English and Spanish. You can highlight text and apply formatting.'}
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
            
            {/* Spanish section */}
            <div className="space-y-3">
              <h3 className="font-medium text-warcrow-gold text-sm flex items-center gap-1">
                Spanish
                <span className="text-xs text-warcrow-text/70">(translation)</span>
              </h3>
              
              {/* Spanish title */}
              <div className="space-y-1">
                <label htmlFor="es-title" className="text-xs text-warcrow-text/70">Title</label>
                <Input
                  id="es-title"
                  placeholder="Translate title"
                  value={editingItem.title_es}
                  onChange={(e) => setEditingItem({...editingItem, title_es: e.target.value})}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text"
                />
              </div>
              
              {/* Spanish content (only for sections) */}
              {editingItem.type === 'section' && (
                <div className="space-y-1">
                  <label htmlFor="es-content" className="text-xs text-warcrow-text/70">Content</label>
                  {previewMode === 'edit' ? (
                    <ColorTextEditor
                      id="es-content"
                      value={editingItem.content_es}
                      onChange={(value) => setEditingItem({...editingItem, content_es: value})}
                      placeholder="Translate content"
                      className={getTextareaHeight()}
                    />
                  ) : (
                    <FormattedTextPreview 
                      content={editingItem.content_es}
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
