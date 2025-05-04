
import React from 'react';
import { NewsItem } from './NewsItem';
import { NewsForm, NewsFormData } from './NewsForm';

interface NewsListProps {
  isLoading: boolean;
  newsData: NewsFormData[];
  editingIndex: number | null;
  onEditClick: (index: number) => void;
  onCancelEdit: () => void;
  onDeleteNews: (index: number) => void;
  onSaveNews: (index: number) => void;
  onInputChange: (index: number, field: keyof NewsFormData, value: string) => void;
  onTranslate: (index: number) => void;
}

export const NewsList = ({
  isLoading,
  newsData,
  editingIndex,
  onEditClick,
  onCancelEdit,
  onDeleteNews,
  onSaveNews,
  onInputChange,
  onTranslate
}: NewsListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8 text-warcrow-gold/60">
        Loading news data...
      </div>
    );
  }

  if (newsData.length === 0) {
    return (
      <div className="text-center py-8 text-warcrow-gold/60">
        No news items found. Add your first news item.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {newsData.map((news, index) => (
        <div 
          key={news.id}
          className="p-4 border border-warcrow-gold/20 rounded-lg"
        >
          {editingIndex === index ? (
            <NewsForm
              formData={news}
              isNew={false}
              onCancel={onCancelEdit}
              onSave={() => onSaveNews(index)}
              onChange={(field, value) => onInputChange(index, field, value)}
              onTranslate={() => onTranslate(index)}
            />
          ) : (
            <NewsItem 
              news={news} 
              isEditing={false}
              onEdit={() => onEditClick(index)}
              onDelete={() => onDeleteNews(index)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
