
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { EditingItem } from './types';
import { ColorTextEditor } from "../shared/ColorTextEditor";

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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-black border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {isSection ? 'Edit Section Translation' : 'Edit Chapter Translation'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
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
          
          {/* Spanish title */}
          <div className="space-y-2">
            <Label htmlFor="title-es" className="text-warcrow-gold">Spanish Title:</Label>
            <Input
              id="title-es"
              value={editingItem.title_es || ''}
              onChange={(e) => setEditingItem({ ...editingItem, title_es: e.target.value })}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
            />
          </div>
          
          {/* Only show content fields for sections */}
          {isSection && (
            <>
              {/* English content (original) */}
              <div className="space-y-2">
                <Label htmlFor="content-en" className="text-warcrow-gold">English Content:</Label>
                <ColorTextEditor
                  id="content-en"
                  value={editingItem.content || ''}
                  onChange={(value) => setEditingItem({ ...editingItem, content: value })}
                  rows={8}
                  placeholder="Enter content in English"
                />
              </div>
              
              {/* Spanish content */}
              <div className="space-y-2">
                <Label htmlFor="content-es" className="text-warcrow-gold">Spanish Content:</Label>
                <ColorTextEditor
                  id="content-es"
                  value={editingItem.content_es || ''}
                  onChange={(value) => setEditingItem({ ...editingItem, content_es: value })}
                  rows={8}
                  placeholder="Enter content in Spanish"
                />
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
