
import React from 'react';
import { RefreshCw } from "lucide-react";
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
  if (!editingItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {editingItem.type === 'chapter' ? 'Edit Chapter Translation' : 'Edit Section Translation'}
          </DialogTitle>
          <DialogDescription>
            {editingItem.type === 'chapter' 
              ? 'Translate the chapter title to Spanish.' 
              : 'Translate the section title and content to Spanish.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-medium text-warcrow-gold">English</h3>
            <p>{editingItem.title}</p>
            {editingItem.type === 'section' && editingItem.content && (
              <div className="mt-2">
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="whitespace-pre-wrap">{editingItem.content}</div>
                </ScrollArea>
              </div>
            )}
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
            Save Translation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
