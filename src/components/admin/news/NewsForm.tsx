
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Save, Languages } from "lucide-react";
import { format } from "date-fns";

export interface NewsFormData {
  id: string;
  date: string;
  key: string;
  contentEn: string;
  contentEs: string;
}

interface NewsFormProps {
  formData: NewsFormData;
  isNew?: boolean;
  onCancel: () => void;
  onSave: () => void;
  onChange: (field: keyof NewsFormData, value: string) => void;
  onTranslate: () => void;
}

export const NewsForm = ({
  formData,
  isNew = false,
  onCancel,
  onSave,
  onChange,
  onTranslate
}: NewsFormProps) => {
  return (
    <div className="p-4 border border-warcrow-gold/20 rounded-lg">
      {isNew && (
        <h3 className="text-warcrow-gold mb-3 text-sm font-medium">Add New News</h3>
      )}
      
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm text-warcrow-text mb-1">Date</label>
          <div className="relative">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => onChange('date', e.target.value)}
              className="bg-black border-warcrow-gold/30 text-warcrow-text"
            />
            <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-warcrow-gold/60" />
          </div>
        </div>

        {isNew && (
          <>
            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">ID</label>
              <Input
                value={formData.id}
                onChange={(e) => onChange('id', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text"
                placeholder="news-yyyy-mm-dd"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">Key</label>
              <Input
                value={formData.key}
                onChange={(e) => onChange('key', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text"
                placeholder="Translation key"
              />
            </div>
          </>
        )}

        <div className="flex flex-col">
          <label className="text-sm text-warcrow-text mb-1">English Content</label>
          <Textarea
            value={formData.contentEn}
            onChange={(e) => onChange('contentEn', e.target.value)}
            className="bg-black border-warcrow-gold/30 text-warcrow-text"
            placeholder="News content in English"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-warcrow-text">Spanish Content</label>
            <Button
              size="sm"
              variant="outline"
              onClick={onTranslate}
              className="h-7 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
            >
              <Languages className="h-3.5 w-3.5 mr-1" />
              Auto-translate
            </Button>
          </div>
          <Textarea
            value={formData.contentEs}
            onChange={(e) => onChange('contentEs', e.target.value)}
            className="bg-black border-warcrow-gold/30 text-warcrow-text"
            placeholder="News content in Spanish"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="border-warcrow-gold/30 text-warcrow-text"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            <Save className="h-4 w-4 mr-2" />
            Save News
          </Button>
        </div>
      </div>
    </div>
  );
};
