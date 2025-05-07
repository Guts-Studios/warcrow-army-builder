
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ChapterData } from './types';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'chapter' | 'section';
  chapters?: ChapterData[];
  onSave: (data: any) => Promise<void>;
  saveInProgress: boolean;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({
  open,
  onOpenChange,
  type,
  chapters = [],
  onSave,
  saveInProgress
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [orderIndex, setOrderIndex] = useState<number>(0);
  
  const handleSave = async () => {
    const data: any = {
      title,
      order_index: orderIndex
    };
    
    if (type === 'section') {
      data.content = content;
      data.chapter_id = selectedChapterId;
    }
    
    await onSave(data);
    
    // Reset form
    setTitle('');
    setContent('');
    setSelectedChapterId('');
    setOrderIndex(0);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-black border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {type === 'chapter' ? 'Add New Chapter' : 'Add New Section'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-warcrow-gold">Title:</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              placeholder={`Enter ${type} title`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order" className="text-warcrow-gold">Order Index:</Label>
            <Input
              id="order"
              type="number"
              value={orderIndex}
              onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
              className="border border-warcrow-gold/30 bg-black text-warcrow-text"
              placeholder="Enter display order"
            />
          </div>
          
          {type === 'section' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="chapter" className="text-warcrow-gold">Select Chapter:</Label>
                <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                  <SelectTrigger className="border border-warcrow-gold/30 bg-black text-warcrow-text">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border border-warcrow-gold/30">
                    {chapters.map(chapter => (
                      <SelectItem key={chapter.id} value={chapter.id} className="text-warcrow-text hover:bg-warcrow-gold/10">
                        {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-warcrow-gold">Content:</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] border border-warcrow-gold/30 bg-black text-warcrow-text"
                  placeholder="Enter section content"
                />
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={saveInProgress || (type === 'section' && !selectedChapterId) || !title}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
          >
            {saveInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
