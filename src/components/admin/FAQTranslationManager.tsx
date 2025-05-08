
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
import { Progress } from "@/components/ui/progress";
import { Save, Plus, Languages, Edit, Trash2 } from "lucide-react";
import { translateWithDeepL } from "@/utils/newsUtils";

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
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    setTranslation(currentTranslation);
  }, [currentTranslation]);

  const handleSave = () => {
    onSave(translation);
  };

  const handleAutoTranslate = async () => {
    if (!originalText) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateWithDeepL(originalText, targetLanguage);
      setTranslation(translated);
      toast.success(`Auto-translated to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`);
    } catch (error) {
      toast.error("Translation failed. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] bg-black border border-warcrow-gold/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">{title}</DialogTitle>
          <DialogDescription className="text-warcrow-text">
            Edit the {targetLanguage === 'es' ? 'Spanish' : 'French'} translation for this FAQ.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="original" className="text-warcrow-text">
                Original Text
              </Label>
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAutoTranslate} 
                disabled={isTranslating}
                className="text-xs border-warcrow-gold/40 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                <Languages className="mr-1 h-3.5 w-3.5" />
                Auto-Translate with DeepL
              </Button>
            </div>
            <Textarea
              id="original"
              value={originalText}
              readOnly
              className="col-span-3 border-warcrow-gold/30 bg-black/50 text-warcrow-text resize-none h-32"
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
              className="col-span-3 border-warcrow-gold/30 bg-black text-warcrow-gold resize-none h-48"
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
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const { language } = useLanguage();
  const [isCreating, setIsCreating] = useState(false);
  const [newFAQ, setNewFAQ] = useState<Partial<FAQItem>>({ question: '', content: '' });

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

  const handleCreateFAQ = async () => {
    if (!newFAQ.question || !newFAQ.content) {
      toast.error("Question and content are required");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('faqs')
        .insert({
          question: newFAQ.question,
          content: newFAQ.content
        });

      if (error) throw error;

      toast.success("FAQ created successfully");
      setIsCreating(false);
      setNewFAQ({ question: '', content: '' });
      fetchFAQs();
    } catch (error: any) {
      console.error("Error creating FAQ:", error);
      toast.error(`Failed to create FAQ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("FAQ deleted successfully");
      fetchFAQs();
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      toast.error(`Failed to delete FAQ: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkTranslate = async (language: 'es' | 'fr') => {
    const untranslatedFAQs = faqs.filter(faq => 
      language === 'es' ? !faq.content_es : !faq.content_fr
    );
    
    if (untranslatedFAQs.length === 0) {
      toast.info(`All FAQs already have ${language === 'es' ? 'Spanish' : 'French'} translations`);
      return;
    }

    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    try {
      let completed = 0;
      const total = untranslatedFAQs.length;
      
      for (const faq of untranslatedFAQs) {
        const translated = await translateWithDeepL(faq.content, language);
        
        const updatePayload = language === 'es'
          ? { content_es: translated }
          : { content_fr: translated };
          
        const { error } = await supabase
          .from('faqs')
          .update(updatePayload)
          .eq('id', faq.id);
          
        if (error) throw error;
        
        completed++;
        setTranslationProgress(Math.round((completed / total) * 100));
      }
      
      toast.success(`Translated ${untranslatedFAQs.length} FAQs to ${language === 'es' ? 'Spanish' : 'French'}`);
      fetchFAQs();
    } catch (error: any) {
      console.error("Error translating FAQs:", error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setTranslationInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4 border border-warcrow-gold/30 shadow-sm bg-black">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-warcrow-gold">FAQ Translations</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBulkTranslate('es')}
              disabled={isLoading || translationInProgress}
              className="border-warcrow-gold/50 text-warcrow-gold"
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate All to Spanish
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleBulkTranslate('fr')}
              disabled={isLoading || translationInProgress}
              className="border-warcrow-gold/50 text-warcrow-gold"
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate All to French
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreating(true)}
              className="border-warcrow-gold/50 text-warcrow-gold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>
        </div>

        {translationInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-warcrow-text/90">Translation progress</span>
              <span className="text-sm font-medium text-warcrow-gold">{translationProgress}%</span>
            </div>
            <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="bg-black/30">
              <TableHead className="w-[40%] text-warcrow-gold">Question</TableHead>
              <TableHead className="w-[30%] text-warcrow-gold">Content</TableHead>
              <TableHead className="text-warcrow-gold">Translations</TableHead>
              <TableHead className="text-right text-warcrow-gold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-warcrow-text/70">No FAQs found</TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium text-warcrow-text">{faq.question}</TableCell>
                  <TableCell className="text-warcrow-text max-h-20 overflow-hidden text-ellipsis">
                    {faq.content.substring(0, 100)}{faq.content.length > 100 ? '...' : ''}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <span className="text-xs text-warcrow-text mr-1">ES:</span>
                        {faq.content_es ? 
                          <span className="text-green-500">✓</span> : 
                          <span className="text-red-500">✗</span>
                        }
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-warcrow-text mr-1">FR:</span>
                        {faq.content_fr ? 
                          <span className="text-green-500">✓</span> : 
                          <span className="text-red-500">✗</span>
                        }
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTranslation(faq, 'es')}
                      className="text-warcrow-gold hover:bg-warcrow-accent/10"
                    >
                      <Languages className="h-4 w-4 mr-1" />
                      ES
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTranslation(faq, 'fr')}
                      className="text-warcrow-gold hover:bg-warcrow-accent/10"
                    >
                      <Languages className="h-4 w-4 mr-1" />
                      FR
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="text-red-400 hover:bg-warcrow-accent/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Translation Dialog */}
      {isEditing && selectedFAQ && (
        <TranslationEditDialog
          isOpen={isEditing}
          title={`Edit ${activeTab === 'es' ? 'Spanish' : 'French'} Translation for "${selectedFAQ.question}"`}
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

      {/* Create New FAQ Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[600px] bg-black border border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Create New FAQ</DialogTitle>
            <DialogDescription className="text-warcrow-text">
              Add a new question and answer to the FAQ section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="question" className="text-warcrow-text">
                Question
              </Label>
              <Input
                id="question"
                value={newFAQ.question}
                onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                className="border-warcrow-gold/30 bg-black text-warcrow-gold"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="content" className="text-warcrow-text">
                Answer Content
              </Label>
              <Textarea
                id="content"
                value={newFAQ.content}
                onChange={(e) => setNewFAQ({...newFAQ, content: e.target.value})}
                className="border-warcrow-gold/30 bg-black text-warcrow-gold resize-none h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsCreating(false)}
              className="border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleCreateFAQ} 
              disabled={isLoading}
              className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
            >
              Create FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQTranslationManager;
