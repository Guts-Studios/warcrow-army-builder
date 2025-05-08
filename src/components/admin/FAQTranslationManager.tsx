import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Languages,
  ChevronDown,
  CheckIcon,
  AlertTriangle,
  LoaderIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TranslationEditDialog } from './rules/TranslationEditDialog';
import { batchTranslate } from "@/utils/translation/batchTranslate";

interface FAQSection {
  id: string;
  section: string;
  section_es?: string | null;
  section_fr?: string | null;
  content: string;
  content_es?: string | null;
  content_fr?: string | null;
  order_index: number;
}

type Language = 'en' | 'es' | 'fr';

const FAQTranslationManager: React.FC = () => {
  const [faqSections, setFaqSections] = useState<FAQSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Language>('es');
  const [selectedSection, setSelectedSection] = useState<FAQSection | null>(null);
  const [editField, setEditField] = useState<'section' | 'content' | null>(null);

  // Batch translation states
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [translatedItems, setTranslatedItems] = useState(0);

  const fetchFAQSections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('faq_sections')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setFaqSections(data || []);
    } catch (error) {
      console.error('Error fetching FAQ sections:', error);
      toast.error('Failed to load FAQ sections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQSections();
  }, []);

  const handleSectionSelect = (section: FAQSection, field: 'section' | 'content') => {
    setSelectedSection(section);
    setEditField(field);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as Language);
  };

  const handleUpdateTranslation = async (newTranslation: string) => {
    if (!selectedSection || !editField) return;
    
    try {
      const fieldName = editField === 'section' 
        ? `section_${activeTab}` 
        : `content_${activeTab}`;

      const { error } = await supabase
        .from('faq_sections')
        .update({ [fieldName]: newTranslation })
        .eq('id', selectedSection.id);

      if (error) throw error;

      // Update local state
      setFaqSections(prev => 
        prev.map(section => 
          section.id === selectedSection.id 
            ? { ...section, [fieldName]: newTranslation } 
            : section
        )
      );

      toast.success('Translation updated successfully');
      setSelectedSection(null);
      setEditField(null);
    } catch (error) {
      console.error('Error updating translation:', error);
      toast.error('Failed to update translation');
    }
  };

  const handleCancelEdit = () => {
    setSelectedSection(null);
    setEditField(null);
  };

  const getMissingTranslationsCount = () => {
    return faqSections.reduce((count, section) => {
      if (activeTab === 'es') {
        if (!section.section_es) count++;
        if (!section.content_es) count++;
      } else if (activeTab === 'fr') {
        if (!section.section_fr) count++;
        if (!section.content_fr) count++;
      }
      return count;
    }, 0);
  };

  const getTotalFieldsCount = () => {
    return faqSections.length * 2; // Each section has section title and content
  };

  const handleBatchTranslate = async () => {
    setTranslationInProgress(true);
    setProgress(0);
    setTotalItems(getMissingTranslationsCount());
    setTranslatedItems(0);

    try {
      // We'll collect items needing translation
      const itemsToTranslate = [];
      
      for (const section of faqSections) {
        // Check section title
        const sectionFieldName = `section_${activeTab}`;
        if (!section[sectionFieldName as keyof FAQSection]) {
          itemsToTranslate.push({
            id: section.id,
            key: 'section',
            source: section.section
          });
        }
        
        // Check content
        const contentFieldName = `content_${activeTab}`;
        if (!section[contentFieldName as keyof FAQSection]) {
          itemsToTranslate.push({
            id: section.id,
            key: 'content',
            source: section.content
          });
        }
      }

      if (itemsToTranslate.length === 0) {
        toast.info('All content already translated');
        setTranslationInProgress(false);
        return;
      }
      
      // Set up progress tracking
      const handleProgress = (e: CustomEvent<{completed: number}>) => {
        setTranslatedItems(e.detail.completed);
        setProgress(Math.round((e.detail.completed / itemsToTranslate.length) * 100));
      };

      window.addEventListener('translation-progress', handleProgress as EventListener);

      // Perform translation
      await batchTranslate(itemsToTranslate, activeTab, true, 'faq_sections');
      
      // Refresh data
      await fetchFAQSections();
      
      toast.success(`Successfully translated ${itemsToTranslate.length} items to ${activeTab === 'es' ? 'Spanish' : 'French'}`);
      
      // Clean up event listener
      window.removeEventListener('translation-progress', handleProgress as EventListener);
    } catch (error) {
      console.error('Batch translation error:', error);
      toast.error('An error occurred during batch translation');
    } finally {
      setTranslationInProgress(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-warcrow-gold mb-4">FAQ Translation Manager</h1>
        <Tabs defaultValue="es" value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="es">Spanish</TabsTrigger>
            <TabsTrigger value="fr">French</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Translation Stats */}
      <Card className="p-4 bg-black border border-warcrow-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-warcrow-gold">Translation Status</h3>
            <p className="text-sm text-warcrow-text/70">
              {getMissingTranslationsCount()} of {getTotalFieldsCount()} items need translation to {activeTab === 'es' ? 'Spanish' : 'French'}
            </p>
          </div>
          <Button 
            variant="default"
            onClick={handleBatchTranslate}
            disabled={getMissingTranslationsCount() === 0 || translationInProgress}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            {translationInProgress ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-4 w-4" />
                Batch Translate Missing
              </>
            )}
          </Button>
        </div>
        
        {translationInProgress && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-warcrow-text/70">Translation progress</span>
              <span className="text-xs font-medium text-warcrow-gold">
                {translatedItems} / {totalItems} items
              </span>
            </div>
            <Progress value={progress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        )}
      </Card>

      {/* FAQ Sections Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoaderIcon className="h-8 w-8 animate-spin text-warcrow-gold" />
        </div>
      ) : (
        <div className="border border-warcrow-gold/30 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-black hover:bg-black/90">
                <TableHead className="w-60">Section Title</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqSections.map((section) => {
                const hasSectionTranslation = activeTab === 'es' 
                  ? Boolean(section.section_es) 
                  : Boolean(section.section_fr);
                
                const hasContentTranslation = activeTab === 'es'
                  ? Boolean(section.content_es)
                  : Boolean(section.content_fr);

                return (
                  <Collapsible key={section.id} className="border-t border-warcrow-gold/20">
                    <TableRow className="hover:bg-warcrow-accent/5">
                      <TableCell>
                        <CollapsibleTrigger className="flex items-center w-full text-left">
                          <ChevronDown className="h-4 w-4 mr-2 text-warcrow-gold" />
                          <span>{section.section}</span>
                        </CollapsibleTrigger>
                      </TableCell>
                      <TableCell>
                        {hasSectionTranslation && hasContentTranslation ? (
                          <div className="flex items-center text-green-500">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            <span>Complete</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-500">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span>Needs translation</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                    <CollapsibleContent>
                      <div className="px-4 py-2 bg-black/20 border-t border-warcrow-gold/20 space-y-4">
                        {/* Section Title */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-warcrow-gold">English Title</h4>
                            </div>
                            <div className="p-3 bg-black/30 rounded border border-warcrow-gold/20 text-sm">
                              {section.section}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-warcrow-gold">
                                {activeTab === 'es' ? 'Spanish' : 'French'} Title
                              </h4>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleSectionSelect(section, 'section')}
                              >
                                Edit
                              </Button>
                            </div>
                            <div className="p-3 bg-black/30 rounded border border-warcrow-gold/20 text-sm min-h-[3rem]">
                              {activeTab === 'es' ? section.section_es : section.section_fr}
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-warcrow-gold">English Content</h4>
                            </div>
                            <div className="p-3 bg-black/30 rounded border border-warcrow-gold/20 text-sm whitespace-pre-line">
                              {section.content}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-warcrow-gold">
                                {activeTab === 'es' ? 'Spanish' : 'French'} Content
                              </h4>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleSectionSelect(section, 'content')}
                              >
                                Edit
                              </Button>
                            </div>
                            <div className="p-3 bg-black/30 rounded border border-warcrow-gold/20 text-sm min-h-[3rem] whitespace-pre-line">
                              {activeTab === 'es' ? section.content_es : section.content_fr}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      {selectedSection && editField && (
        <TranslationEditDialog
          open={Boolean(selectedSection && editField)}
          title={editField === 'section' ? 'Edit Section Title' : 'Edit Content'}
          sourceText={editField === 'section' ? selectedSection.section : selectedSection.content}
          translatedText={
            editField === 'section'
              ? (activeTab === 'es' ? selectedSection.section_es : selectedSection.section_fr) || ''
              : (activeTab === 'es' ? selectedSection.content_es : selectedSection.content_fr) || ''
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
