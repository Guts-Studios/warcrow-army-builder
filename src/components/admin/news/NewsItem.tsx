
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { NewsFormData } from './NewsForm';

interface NewsItemProps {
  news: NewsFormData;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const NewsItem = ({ 
  news, 
  isEditing, 
  onEdit, 
  onDelete 
}: NewsItemProps) => {
  if (isEditing) return null;
  
  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <span className="text-warcrow-gold font-semibold">{news.date}</span>
          <span className="text-warcrow-text/60 text-sm">({news.id})</span>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="h-8 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="h-8 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500/50"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div>
          <p className="text-xs text-warcrow-gold/70 mb-1">English:</p>
          <p className="text-sm text-warcrow-text">{news.contentEn}</p>
        </div>
        <div>
          <p className="text-xs text-warcrow-gold/70 mb-1">Spanish:</p>
          <p className="text-sm text-warcrow-text">{news.contentEs}</p>
        </div>
      </div>
    </div>
  );
};
