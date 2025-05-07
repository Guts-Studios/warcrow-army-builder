
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ColorTextEditor } from "../shared/ColorTextEditor";

interface Chapter {
  id: string;
  title: string;
}

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'chapter' | 'section';
  chapters: Chapter[];
  onSave: (data: NewItemData) => Promise<void>;
  saveInProgress: boolean;
}

export interface NewItemData {
  type: 'chapter' | 'section';
  title: string;
  title_es: string;
  content?: string;
  content_es?: string;
  chapter_id?: string;
  order_index?: number;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onOpenChange,
  type,
  chapters,
  onSave,
  saveInProgress
}) => {
  const [newItem, setNewItem] = useState<NewItemData>({
    type,
    title: '',
    title_es: '',
    content: type === 'section' ? '' : undefined,
    content_es: type === 'section' ? '' : undefined,
    chapter_id: type === 'section' ? (chapters[0]?.id || '') : undefined,
    order_index: 1
  });

  const handleChange = (field: keyof NewItemData, value: string | number) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContentChange = (field: 'content' | 'content_es', value: string) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    await onSave(newItem);
    setNewItem({
      type,
      title: '',
      title_es: '',
      content: type === 'section' ? '' : undefined,
      content_es: type === 'section' ? '' : undefined,
      chapter_id: type === 'section' ? (chapters[0]?.id || '') : undefined,
      order_index: 1
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-black border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {type === 'chapter' ? 'Add New Chapter' : 'Add New Section'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          {/* Order Index */}
          <div className="space-y-2">
            <Label htmlFor="order-index" className="text-warcrow-gold">Order Index:</Label>
            <Input
              id="order-index"
              type="number"
              value={newItem.order_index || 1}
              onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 1)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
            />
          </div>
          
          {/* Parent Chapter (for sections only) */}
          {type === 'section' && (
            <div className="space-y-2">
              <Label htmlFor="chapter-id" className="text-warcrow-gold">Parent Chapter:</Label>
              <Select 
                value={newItem.chapter_id} 
                onValueChange={(value) => handleChange('chapter_id', value)}
              >
                <SelectTrigger id="chapter-id" className="border border-warcrow-gold/30 bg-black text-warcrow-text">
                  <SelectValue placeholder="Select a chapter" />
                </SelectTrigger>
                <SelectContent className="border border-warcrow-gold/30 bg-black text-warcrow-text">
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* English title */}
          <div className="space-y-2">
            <Label htmlFor="title-en" className="text-warcrow-gold">English Title:</Label>
            <Input
              id="title-en"
              value={newItem.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
            />
          </div>
          
          {/* Spanish title */}
          <div className="space-y-2">
            <Label htmlFor="title-es" className="text-warcrow-gold">Spanish Title:</Label>
            <Input
              id="title-es"
              value={newItem.title_es}
              onChange={(e) => handleChange('title_es', e.target.value)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
            />
          </div>
          
          {/* Content fields (for sections only) */}
          {type === 'section' && (
            <>
              {/* English content */}
              <div className="space-y-2">
                <Label htmlFor="content-en" className="text-warcrow-gold">English Content:</Label>
                <ColorTextEditor
                  id="content-en"
                  value={newItem.content || ''}
                  onChange={(value) => handleContentChange('content', value)}
                  rows={8}
                  placeholder="Enter content in English"
                />
              </div>
              
              {/* Spanish content */}
              <div className="space-y-2">
                <Label htmlFor="content-es" className="text-warcrow-gold">Spanish Content:</Label>
                <ColorTextEditor
                  id="content-es"
                  value={newItem.content_es || ''}
                  onChange={(value) => handleContentChange('content_es', value)}
                  rows={8}
                  placeholder="Enter content in Spanish"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={saveInProgress} 
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
          >
            {saveInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === 'chapter' ? 'Add Chapter' : 'Add Section'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
