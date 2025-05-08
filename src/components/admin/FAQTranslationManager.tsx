import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  content: string;
  content_es?: string;
  content_fr?: string;
  created_at?: string;
  updated_at?: string;
}

interface TranslationEditDialogProps {
  isOpen: boolean;
  title: string;
  originalText: string;
  currentTranslation: string;
  targetLanguage: string;
  onCancel: () => void;
  onSave: (translation: string) => void;
}

const TranslationEditDialog: React.FC<TranslationEditDialogProps> = ({
  isOpen,
  title,
  originalText,
  currentTranslation,
  targetLanguage,
  onCancel,
  onSave,
}) => {
  const [translation, setTranslation] = useState(currentTranslation);

  useEffect(() => {
    setTranslation(currentTranslation);
  }, [currentTranslation]);

  const handleSave = () => {
    onSave(translation);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[550px] bg-black border border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">{title}</DialogTitle>
          <DialogDescription className="text-warcrow-text">
            Edit the {targetLanguage === 'es' ? 'Spanish' : 'French'} translation for this FAQ.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="original" className="text-warcrow-text">
              Original Text
            </Label>
            <Textarea
              id="original"
              value={originalText}
              readOnly
              className="col-span-3 border-warcrow-gold/30 bg-black text-warcrow-text resize-none"
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="translation" className="text-warcrow-text">
              Translation
            </Label>
            <Textarea
              id="translation"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="col-span-3 border-warcrow-gold/30 bg-black text-warcrow-text resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel} className="border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black">
            Save Translation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FAQTranslationManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'es' | 'fr'>('es');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('question');

      if (error) throw error;

      setFaqs(data as FAQItem[]);
    } catch (error: any) {
      console.error("Error fetching FAQs:", error);
      toast.error(`Failed to load FAQs: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTranslation = (faq: FAQItem, tab: 'es' | 'fr') => {
    setSelectedFAQ(faq);
    setActiveTab(tab);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedFAQ(null);
  };

  const handleUpdateTranslation = async (translation: string) => {
    if (!selectedFAQ) return;

    setIsLoading(true);
    try {
      const updatePayload = activeTab === 'es'
        ? { content_es: translation }
        : { content_fr: translation };

      const { error } = await supabase
        .from('faqs')
        .update(updatePayload)
        .eq('id', selectedFAQ.id);

      if (error) throw error;

      toast.success(`FAQ ${activeTab === 'es' ? 'Spanish' : 'French'} translation updated successfully`);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error updating FAQ translation:", error);
      toast.error(`Failed to update FAQ translation: ${error.message}`);
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setSelectedFAQ(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4 border border-warcrow-gold/30 shadow-sm bg-black">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-warcrow-gold">FAQ Translations</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-black/30">
              <TableHead className="w-[40%]">Question</TableHead>
              <TableHead className="w-[30%]">Content</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium">{faq.question}</TableCell>
                <TableCell className="text-warcrow-text/80">{faq.content}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTranslation(faq, 'es')}
                    className="text-warcrow-gold hover:bg-warcrow-accent/10"
                  >
                    Translate to Spanish
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTranslation(faq, 'fr')}
                    className="text-warcrow-gold hover:bg-warcrow-accent/10"
                  >
                    Translate to French
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {isEditing && selectedFAQ && (
        <TranslationEditDialog
          isOpen={isEditing}
          title={`Edit ${activeTab === 'es' ? 'Spanish' : 'French'} Translation`}
          originalText={selectedFAQ.content}
          currentTranslation={
            activeTab === 'es'
              ? selectedFAQ.content_es || ''
              : selectedFAQ.content_fr || ''
          }
          targetLanguage={activeTab}
          onCancel={handleCancelEdit}
          onSave={handleUpdateTranslation}
        />
      )}
    </div>
  );
};

export default FAQTranslationManager;
