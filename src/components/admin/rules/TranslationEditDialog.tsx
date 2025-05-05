
import React, { useState } from 'react';
import { RefreshCw, Copy, CheckCircle, ClipboardCopy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {editingItem.type === 'chapter' ? 'Edit Chapter Translation' : 'Edit Section Translation'}
          </DialogTitle>
          <DialogDescription>
            {editingItem.type === 'chapter' 
              ? 'Edit chapter title in English and Spanish.' 
              : 'Edit section title and content in English and Spanish.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* English section */}
          <div className="grid gap-3">
            <h3 className="font-medium text-warcrow-gold flex items-center gap-2">
              English
              <span className="text-xs text-warcrow-text/70">(source language)</span>
            </h3>
            
            {/* English title */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="en-title" className="text-sm text-warcrow-text/70">Title</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(editingItem.title, 'title')}
                  className="h-7 px-2 text-xs"
                >
                  {titleCopied ? (
                    <><CheckCircle className="h-3.5 w-3.5 mr-1" />Copied</>
                  ) : (
                    <><ClipboardCopy className="h-3.5 w-3.5 mr-1" />Copy</>
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
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="en-content" className="text-sm text-warcrow-text/70">Content</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(editingItem.content || '', 'content')}
                    className="h-7 px-2 text-xs"
                  >
                    {contentCopied ? (
                      <><CheckCircle className="h-3.5 w-3.5 mr-1" />Copied</>
                    ) : (
                      <><ClipboardCopy className="h-3.5 w-3.5 mr-1" />Copy</>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="en-content"
                  placeholder="Edit content"
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                  className="h-[180px] border border-warcrow-gold/30 bg-black text-warcrow-text resize-none"
                />
              </div>
            )}
          </div>
          
          {/* Spanish section */}
          <div className="grid gap-3">
            <h3 className="font-medium text-warcrow-gold flex items-center gap-2">
              Spanish
              <span className="text-xs text-warcrow-text/70">(translation)</span>
            </h3>
            
            {/* Spanish title */}
            <div className="space-y-1.5">
              <label htmlFor="es-title" className="text-sm text-warcrow-text/70">Title</label>
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
              <div className="space-y-1.5">
                <label htmlFor="es-content" className="text-sm text-warcrow-text/70">Content</label>
                <Textarea
                  id="es-content"
                  placeholder="Translate content"
                  value={editingItem.content_es}
                  onChange={(e) => setEditingItem({...editingItem, content_es: e.target.value})}
                  className="h-[180px] border border-warcrow-gold/30 bg-black text-warcrow-text resize-none"
                />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saveInProgress}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saveInProgress}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
          >
            {saveInProgress ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
