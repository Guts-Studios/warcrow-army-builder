
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { NewsItem } from "@/data/newsArchive";
import { translations } from "@/i18n/translations";
import { CalendarIcon, Pencil, Save, Plus, Trash2, Languages } from "lucide-react";
import { format } from "date-fns";
import { updateNewsItem, createNewsItem, deleteNewsItem, translateToSpanish, fetchNewsItems } from "@/utils/newsUtils";

interface NewsFormData {
  id: string;
  date: string;
  key: string;
  contentEn: string;
  contentEs: string;
}

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
        <div className="mb-6 p-4 border border-warcrow-gold/20 rounded-lg">
          <h3 className="text-warcrow-gold mb-3 text-sm font-medium">Add New News</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">Date</label>
              <div className="relative">
                <Input
                  type="date"
                  value={newNews.date}
                  onChange={(e) => handleNewNewsChange('date', e.target.value)}
                  className="bg-black border-warcrow-gold/30 text-warcrow-text"
                />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-warcrow-gold/60" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">ID</label>
              <Input
                value={newNews.id}
                onChange={(e) => handleNewNewsChange('id', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text"
                placeholder="news-yyyy-mm-dd"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">Key</label>
              <Input
                value={newNews.key}
                onChange={(e) => handleNewNewsChange('key', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text"
                placeholder="Translation key"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm text-warcrow-text mb-1">English Content</label>
              <Textarea
                value={newNews.contentEn}
                onChange={(e) => handleNewNewsChange('contentEn', e.target.value)}
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
                  onClick={() => handleTranslateToSpanish(null)}
                  className="h-7 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
                >
                  <Languages className="h-3.5 w-3.5 mr-1" />
                  Auto-translate
                </Button>
              </div>
              <Textarea
                value={newNews.contentEs}
                onChange={(e) => handleNewNewsChange('contentEs', e.target.value)}
                className="bg-black border-warcrow-gold/30 text-warcrow-text"
                placeholder="News content in Spanish"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingNew(false)}
                className="border-warcrow-gold/30 text-warcrow-text"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveNewNews}
                className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
              >
                <Save className="h-4 w-4 mr-2" />
                Save News
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* News List */}
      {isLoading ? (
        <div className="text-center py-8 text-warcrow-gold/60">
          Loading news data...
        </div>
      ) : (
        <div className="space-y-4">
          {newsData.length === 0 ? (
            <div className="text-center py-8 text-warcrow-gold/60">
              No news items found. Add your first news item.
            </div>
          ) : (
            newsData.map((news, index) => (
              <div 
                key={news.id}
                className="p-4 border border-warcrow-gold/20 rounded-lg"
              >
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <label className="text-sm text-warcrow-text mb-1">Date</label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={news.date}
                          onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                          className="bg-black border-warcrow-gold/30 text-warcrow-text"
                        />
                        <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-warcrow-gold/60" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm text-warcrow-text mb-1">English Content</label>
                      <Textarea
                        value={news.contentEn}
                        onChange={(e) => handleInputChange(index, 'contentEn', e.target.value)}
                        className="bg-black border-warcrow-gold/30 text-warcrow-text"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm text-warcrow-text">Spanish Content</label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTranslateToSpanish(index)}
                          className="h-7 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
                        >
                          <Languages className="h-3.5 w-3.5 mr-1" />
                          Auto-translate
                        </Button>
                      </div>
                      <Textarea
                        value={news.contentEs}
                        onChange={(e) => handleInputChange(index, 'contentEs', e.target.value)}
                        className="bg-black border-warcrow-gold/30 text-warcrow-text"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        className="border-warcrow-gold/30 text-warcrow-text"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleSaveNews(index)}
                        className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
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
                          onClick={() => handleEditClick(index)}
                          className="h-8 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteNews(index)}
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
                )}
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};

export default NewsManager;
