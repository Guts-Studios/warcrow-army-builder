
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/i18n/translations";
import { format } from "date-fns";
import { updateNewsItem, createNewsItem, deleteNewsItem, translateToSpanish, fetchNewsItems } from "@/utils/newsUtils";
import { NewsForm, NewsFormData } from './news/NewsForm';
import { NewsList } from './news/NewsList';

export const NewsManager = () => {
  const { t } = useLanguage();
  const [newsData, setNewsData] = useState<NewsFormData[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNews, setNewNews] = useState<NewsFormData>({
    id: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    key: "",
    contentEn: "",
    contentEs: ""
  });

  // Load news data from Supabase
  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = async () => {
    setIsLoading(true);
    
    try {
      // Load news data from Supabase
      const items = await fetchNewsItems();
      
      // Convert to form data format
      const formattedData = items.map(item => {
        const translationKey = item.key;
        const contentEn = translations[translationKey]?.en || "";
        const contentEs = translations[translationKey]?.es || "";
        
        return {
          id: item.id,
          date: item.date,
          key: translationKey,
          contentEn,
          contentEs
        };
      });
      
      setNewsData(formattedData);
    } catch (error) {
      console.error("Error loading news data:", error);
      toast.error("Failed to load news data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
  };

  const handleInputChange = (
    index: number,
    field: keyof NewsFormData,
    value: string
  ) => {
    const updatedNewsData = [...newsData];
    updatedNewsData[index] = {
      ...updatedNewsData[index],
      [field]: value,
    };
    setNewsData(updatedNewsData);
  };

  const handleNewNewsChange = (field: keyof NewsFormData, value: string) => {
    setNewNews({
      ...newNews,
      [field]: value,
    });
    
    // Auto-generate ID when date changes
    if (field === 'date') {
      const formattedDate = value.replace(/-/g, '');
      setNewNews(prev => ({
        ...prev,
        id: `news-${formattedDate}`,
      }));
    }
    
    // Auto-generate key if empty
    if (field === 'contentEn' && !newNews.key) {
      const key = `news${new Date().getTime()}`;
      setNewNews(prev => ({
        ...prev,
        key,
      }));
    }
  };

  const handleSaveNews = async (index: number) => {
    const newsItem = newsData[index];
    
    // Send update to Supabase
    const success = await updateNewsItem({
      id: newsItem.id,
      date: newsItem.date,
      key: newsItem.key,
      content: {
        en: newsItem.contentEn,
        es: newsItem.contentEs
      }
    });
    
    if (success) {
      toast.success(`News "${newsItem.id}" updated successfully`);
      setEditingIndex(null);
      // Reload news data to ensure display is up-to-date
      loadNewsData();
    } else {
      toast.error("Failed to update news");
    }
  };

  const handleAddNewNews = () => {
    setIsAddingNew(true);
    setEditingIndex(null);
  };

  const handleSaveNewNews = async () => {
    // Validate new news
    if (!newNews.date || !newNews.contentEn || !newNews.contentEs) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Send create request to Supabase
    const success = await createNewsItem({
      id: newNews.id,
      date: newNews.date,
      key: newNews.key,
      content: {
        en: newNews.contentEn,
        es: newNews.contentEs
      }
    });
    
    if (success) {
      toast.success(`New news "${newNews.id}" added successfully`);
      
      // Reset form
      setIsAddingNew(false);
      setNewNews({
        id: "",
        date: format(new Date(), 'yyyy-MM-dd'),
        key: "",
        contentEn: "",
        contentEs: ""
      });
      
      // Reload news data to include the new item
      loadNewsData();
    } else {
      toast.error("Failed to create news");
    }
  };

  const handleDeleteNews = async (index: number) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      const newsToDelete = newsData[index];
      
      // Send delete request to Supabase
      const success = await deleteNewsItem(newsToDelete.id);
      
      if (success) {
        toast.success("News deleted successfully");
        // Reload news data after deletion
        loadNewsData();
      } else {
        toast.error("Failed to delete news");
      }
    }
  };

  const handleTranslateToSpanish = (index: number | null) => {
    if (index === null && !isAddingNew) return;
    
    if (isAddingNew) {
      // Translate the new news content
      const translatedText = translateToSpanish(newNews.contentEn);
      setNewNews({
        ...newNews,
        contentEs: translatedText
      });
      toast.success("Spanish translation updated");
    } else if (index !== null) {
      // Translate the existing news content
      const updatedNewsData = [...newsData];
      const translatedText = translateToSpanish(updatedNewsData[index].contentEn);
      updatedNewsData[index] = {
        ...updatedNewsData[index],
        contentEs: translatedText
      };
      setNewsData(updatedNewsData);
      toast.success("Spanish translation updated");
    }
  };

  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-warcrow-gold">News Management</h2>
        <Button 
          variant="outline"
          onClick={handleAddNewNews}
          disabled={isAddingNew || isLoading}
          className="border-warcrow-gold/30 text-warcrow-gold"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New News
        </Button>
      </div>

      {/* New News Form */}
      {isAddingNew && (
        <NewsForm
          formData={newNews}
          isNew={true}
          onCancel={() => setIsAddingNew(false)}
          onSave={handleSaveNewNews}
          onChange={handleNewNewsChange}
          onTranslate={() => handleTranslateToSpanish(null)}
        />
      )}

      {/* News List */}
      <NewsList
        isLoading={isLoading}
        newsData={newsData}
        editingIndex={editingIndex}
        onEditClick={handleEditClick}
        onCancelEdit={handleCancelEdit}
        onDeleteNews={handleDeleteNews}
        onSaveNews={handleSaveNews}
        onInputChange={handleInputChange}
        onTranslate={handleTranslateToSpanish}
      />
    </Card>
  );
};

export default NewsManager;
