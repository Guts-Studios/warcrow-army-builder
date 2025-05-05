
import React, { useState } from 'react';
import { RefreshCw, Copy, CheckCircle } from "lucide-react";
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
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-medium text-warcrow-gold">English</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Edit title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(editingItem.title, 'title')}
                  className="flex items-center gap-1"
                >
                  {titleCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {titleCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              {editingItem.type === 'section' && editingItem.content && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-warcrow-text/70">Content</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(editingItem.content || '', 'content')}
                      className="flex items-center gap-1"
                    >
                      {contentCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {contentCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Edit content"
                    value={editingItem.content}
                    onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                    className="h-[200px] border border-warcrow-gold/30 bg-black text-warcrow-text"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <h3 className="font-medium text-warcrow-gold">Spanish</h3>
            <Input
              placeholder="Translate title"
              value={editingItem.title_es}
              onChange={(e) => setEditingItem({...editingItem, title_es: e.target.value})}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
            />
            
            {editingItem.type === 'section' && (
              <div className="mt-2">
                <Textarea
                  placeholder="Translate content"
                  value={editingItem.content_es}
                  onChange={(e) => setEditingItem({...editingItem, content_es: e.target.value})}
                  className="h-[200px] border border-warcrow-gold/30 bg-black text-warcrow-text"
                />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
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
