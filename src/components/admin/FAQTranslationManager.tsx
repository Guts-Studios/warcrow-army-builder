
import React, { useState, useEffect } from 'react';
import { fetchFAQSections, FAQItem } from '@/services/faqService';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Languages } from 'lucide-react';

const FAQTranslationManager: React.FC = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<Record<string, Partial<FAQItem>>>({});

  useEffect(() => {
    loadFAQItems();
  }, []);

  const loadFAQItems = async () => {
    setLoading(true);
    try {
      // Fetch items with all translations
      const items = await fetchFAQSections('en');
      setFaqItems(items);
    } catch (error) {
      console.error('Error loading FAQ items:', error);
      toast.error('Failed to load FAQ items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id: string, field: 'section_es' | 'content_es', value: string) => {
    setEditedItems({
      ...editedItems,
      [id]: {
        ...editedItems[id],
        [field]: value,
      },
    });
  };

  const handleSaveTranslation = async (id: string) => {
    if (!editedItems[id]) return;
    
    setSaving(id);
    try {
      const { error } = await supabase
        .from('faq_sections')
        .update({
          section_es: editedItems[id].section_es,
          content_es: editedItems[id].content_es,
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Translation updated successfully');
      
      // Update local state with the saved changes
      setFaqItems(faqItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              section_es: editedItems[id].section_es || item.section_es,
              content_es: editedItems[id].content_es || item.content_es,
            } 
          : item
      ));
      
      // Clear edited state for this item
      const newEditedItems = { ...editedItems };
      delete newEditedItems[id];
      setEditedItems(newEditedItems);
    } catch (error) {
      console.error('Error saving translation:', error);
      toast.error('Failed to save translation');
    } finally {
      setSaving(null);
    }
  };

  const isItemEdited = (id: string) => {
    return !!editedItems[id];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-warcrow-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-warcrow-gold flex items-center">
          <Languages className="mr-2 h-5 w-5" />
          FAQ Translations Manager
        </h2>
        <Button 
          variant="outline" 
          onClick={loadFAQItems}
          disabled={loading}
          className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/20"
        >
          Refresh
        </Button>
      </div>

      <Card className="bg-black border-warcrow-gold/30 p-4">
        <div className="p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-warcrow-gold/20">
                <TableHead className="text-warcrow-gold/80">English Section</TableHead>
                <TableHead className="text-warcrow-gold/80">Spanish Section</TableHead>
                <TableHead className="text-warcrow-gold/80 w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqItems.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className="border-warcrow-gold/20">
                    <TableCell className="align-top">
                      <div className="font-medium text-warcrow-text mb-2">{item.section}</div>
                      <div className="text-sm text-warcrow-text/70 whitespace-pre-wrap">
                        {item.content}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Textarea
                        value={editedItems[item.id]?.section_es !== undefined 
                          ? editedItems[item.id].section_es 
                          : item.section_es || ''}
                        onChange={(e) => handleInputChange(item.id, 'section_es', e.target.value)}
                        placeholder="Enter Spanish section title"
                        className="min-h-[40px] mb-2 bg-black/50 border-warcrow-gold/30 text-warcrow-text focus:border-warcrow-gold"
                      />
                      <Textarea
                        value={editedItems[item.id]?.content_es !== undefined 
                          ? editedItems[item.id].content_es 
                          : item.content_es || ''}
                        onChange={(e) => handleInputChange(item.id, 'content_es', e.target.value)}
                        placeholder="Enter Spanish content"
                        className="min-h-[120px] bg-black/50 border-warcrow-gold/30 text-warcrow-text focus:border-warcrow-gold"
                      />
                    </TableCell>
                    <TableCell className="align-middle">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!isItemEdited(item.id) || saving === item.id}
                        onClick={() => handleSaveTranslation(item.id)}
                        className={`w-full border-warcrow-gold/30 text-warcrow-gold ${isItemEdited(item.id) ? 'bg-warcrow-gold/20' : ''}`}
                      >
                        {saving === item.id ? 'Saving...' : 'Save'}
                      </Button>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default FAQTranslationManager;
