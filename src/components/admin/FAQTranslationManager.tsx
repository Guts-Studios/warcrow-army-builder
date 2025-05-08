
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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Languages, RefreshCw, Check, AlertTriangle, Edit, X, CheckCircle, Eye, EyeOff, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorTextEditor } from './shared/ColorTextEditor';
import { FormattedTextPreview } from './shared/FormattedTextPreview';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FAQTranslationManager: React.FC = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sections' | 'translations' | 'verify'>('sections');
  const [editingItem, setEditingItem] = useState<{
    id: string;
    section: string;
    section_es: string;
    section_fr?: string;
    content: string;
    content_es: string;
    content_fr?: string;
  } | null>(null);
  const [translationEditDialogOpen, setTranslationEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [targetLanguage, setTargetLanguage] = useState<'es' | 'fr'>('es');
  const [translationInProgress, setTranslationInProgress] = useState(false);

  useEffect(() => {
    loadFAQItems();
  }, []);

  const loadFAQItems = async () => {
    setLoading(true);
    try {
      // Fetch items with all translations
      const items = await fetchFAQSections('en');
      setFaqItems(items);
      toast.success('FAQ items loaded successfully');
    } catch (error) {
      console.error('Error loading FAQ items:', error);
      toast.error('Failed to load FAQ items');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTranslation = (item: FAQItem) => {
    setEditingItem({
      id: item.id,
      section: item.section,
      section_es: item.section_es || '',
      section_fr: item.section_fr || '',
      content: item.content,
      content_es: item.content_es || '',
      content_fr: item.content_fr || '',
    });
    setTranslationEditDialogOpen(true);
  };

  const saveTranslation = async () => {
    if (!editingItem) return;

    setSaving(editingItem.id);
    try {
      const updateData: any = {
        section: editingItem.section,
        content: editingItem.content,
        section_es: editingItem.section_es,
        content_es: editingItem.content_es,
      };
      
      // Add French content if available
      if (editingItem.section_fr) {
        updateData.section_fr = editingItem.section_fr;
      }
      
      if (editingItem.content_fr) {
        updateData.content_fr = editingItem.content_fr;
      }
      
      const { error } = await supabase
        .from('faq_sections')
        .update(updateData)
        .eq('id', editingItem.id);

      if (error) throw error;
      
      toast.success('Content updated successfully');
      
      // Update local state with the saved changes
      setFaqItems(faqItems.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              section: editingItem.section,
              content: editingItem.content,
              section_es: editingItem.section_es,
              content_es: editingItem.content_es,
              section_fr: editingItem.section_fr,
              content_fr: editingItem.content_fr,
            } 
          : item
      ));
      
      setTranslationEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(null);
    }
  };
  
  const translateContent = async () => {
    if (!editingItem) return;
    
    try {
      setTranslationInProgress(true);
      
      const textsToTranslate = [];
      
      // Add title to array of texts to translate
      if (editingItem.section) {
        textsToTranslate.push(editingItem.section);
      }
      
      // Add content to array of texts to translate
      if (editingItem.content) {
        textsToTranslate.push(editingItem.content);
      }
      
      if (textsToTranslate.length === 0) {
        toast.error("No content to translate");
        return;
      }
      
      // Call the DeepL API via Supabase edge function
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: textsToTranslate,
          targetLanguage: targetLanguage.toUpperCase(),
          formality: 'more'
        }
      });
      
      if (error) {
        console.error('Translation error:', error);
        toast.error(`Translation failed: ${error.message}`);
        return;
      }
      
      if (data && data.translations && data.translations.length > 0) {
        // Update the editingItem with translated content
        const updatedItem = { ...editingItem };
        
        // Set section translation
        if (targetLanguage === 'es') {
          updatedItem.section_es = data.translations[0];
        } else if (targetLanguage === 'fr') {
          updatedItem.section_fr = data.translations[0];
        }
        
        // Set content translation if it exists
        if (data.translations.length > 1) {
          if (targetLanguage === 'es') {
            updatedItem.content_es = data.translations[1];
          } else if (targetLanguage === 'fr') {
            updatedItem.content_fr = data.translations[1];
          }
        }
        
        setEditingItem(updatedItem);
        toast.success(`Translation to ${targetLanguage === 'es' ? 'Spanish' : 'French'} completed`);
      } else {
        toast.error("No translation returned");
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Translation failed");
    } finally {
      setTranslationInProgress(false);
    }
  };

  const runVerification = async () => {
    setLoading(true);
    try {
      // Check which FAQ items have missing translations
      const verifiedItems = faqItems.map(item => ({
        ...item,
        has_spanish_section: Boolean(item.section_es && item.section_es.trim() !== ''),
        has_spanish_content: Boolean(item.content_es && item.content_es.trim() !== ''),
        has_french_section: Boolean(item.section_fr && item.section_fr?.trim() !== ''),
        has_french_content: Boolean(item.content_fr && item.content_fr?.trim() !== '')
      }));
      
      setFaqItems(verifiedItems);
      toast.success('Translation verification completed');
      setActiveTab('verify');
    } catch (error: any) {
      console.error('Error running verification:', error);
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isItemComplete = (item: FAQItem) => {
    const hasSpanish = Boolean(item.section_es) && Boolean(item.content_es);
    const hasFrench = Boolean(item.section_fr) && Boolean(item.content_fr);
    
    // Item is complete if it has at least Spanish translations
    // (French is considered optional for now)
    return hasSpanish;
  };

  const filteredItems = searchQuery
    ? faqItems.filter(
        item =>
          item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.section_es && item.section_es.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.section_fr && item.section_fr.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.content_es && item.content_es.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.content_fr && item.content_fr.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : faqItems;

  const missingTranslations = faqItems.filter(item => !isItemComplete(item));

  const getTranslationStatusSummary = () => {
    const itemsWithSpanishSection = faqItems.filter(item => Boolean(item.section_es)).length;
    const itemsWithSpanishContent = faqItems.filter(item => Boolean(item.content_es)).length;
    const itemsWithFrenchSection = faqItems.filter(item => Boolean(item.section_fr)).length;
    const itemsWithFrenchContent = faqItems.filter(item => Boolean(item.content_fr)).length;
    const total = faqItems.length;
    
    return {
      totalItems: total,
      itemsWithSpanishSection,
      itemsWithSpanishContent,
      itemsWithFrenchSection,
      itemsWithFrenchContent,
      spanishSectionCompletionRate: Math.round((itemsWithSpanishSection / total) * 100),
      spanishContentCompletionRate: Math.round((itemsWithSpanishContent / total) * 100),
      frenchSectionCompletionRate: Math.round((itemsWithFrenchSection / total) * 100),
      frenchContentCompletionRate: Math.round((itemsWithFrenchContent / total) * 100),
      spanishCompleteItems: faqItems.filter(item => Boolean(item.section_es) && Boolean(item.content_es)).length,
      frenchCompleteItems: faqItems.filter(item => Boolean(item.section_fr) && Boolean(item.content_fr)).length,
      spanishCompleteRate: Math.round((faqItems.filter(item => Boolean(item.section_es) && Boolean(item.content_es)).length / total) * 100),
      frenchCompleteRate: Math.round((faqItems.filter(item => Boolean(item.section_fr) && Boolean(item.content_fr)).length / total) * 100)
    };
  };

  const stats = getTranslationStatusSummary();

  const togglePreviewMode = () => {
    setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit');
  };
  
  // Get current content based on selected language
  const getCurrentLanguageContent = () => {
    if (!editingItem) return { section: '', content: '' };
    
    if (targetLanguage === 'es') {
      return {
        section: editingItem.section_es || '',
        content: editingItem.content_es || ''
      };
    } else if (targetLanguage === 'fr') {
      return {
        section: editingItem.section_fr || '',
        content: editingItem.content_fr || ''
      };
    }
    
    return { section: '', content: '' };
  };
  
  // Update content for the selected language
  const updateLanguageContent = (field: 'section' | 'content', value: string) => {
    if (!editingItem) return;
    
    const updatedItem = { ...editingItem };
    
    if (targetLanguage === 'es') {
      if (field === 'section') {
        updatedItem.section_es = value;
      } else {
        updatedItem.content_es = value;
      }
    } else if (targetLanguage === 'fr') {
      if (field === 'section') {
        updatedItem.section_fr = value;
      } else {
        updatedItem.content_fr = value;
      }
    }
    
    setEditingItem(updatedItem);
  };
  
  const currentLanguageContent = getCurrentLanguageContent();

  if (loading && faqItems.length === 0) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-warcrow-gold"></div>
      </div>
    );
  }

  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-warcrow-gold flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            FAQ Content Translation Manager
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={runVerification}
              disabled={loading}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <CheckCircle className={`h-4 w-4 mr-2`} />
              Verify Translations
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadFAQItems}
              disabled={loading}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search FAQ content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-warcrow-gold/30 bg-black text-warcrow-text"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-2">
            <TabsTrigger value="sections" className={activeTab === 'sections' ? "bg-warcrow-gold text-black" : ""}>
              FAQ Sections ({filteredItems.length})
            </TabsTrigger>
            <TabsTrigger value="translations" className={activeTab === 'translations' ? "bg-warcrow-gold text-black" : ""}>
              <Languages className="h-4 w-4 mr-2" />
              Translation Status
            </TabsTrigger>
            <TabsTrigger value="verify" className={activeTab === 'verify' ? "bg-warcrow-gold text-black" : ""}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verification
              {missingTranslations.length > 0 && (
                <Badge variant="destructive" className="ml-2">{missingTranslations.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections">
            <div className="mb-2">
              <p className="text-warcrow-text/80 text-sm">
                Found {filteredItems.length} FAQ sections
              </p>
            </div>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-warcrow-gold/20">
                    <TableHead className="text-warcrow-gold/80 w-16">Order</TableHead>
                    <TableHead className="text-warcrow-gold/80 w-1/3">English Section</TableHead>
                    <TableHead className="text-warcrow-gold/80 w-1/3">Spanish Section</TableHead>
                    <TableHead className="text-warcrow-gold/80 w-24">Status</TableHead>
                    <TableHead className="text-warcrow-gold/80 w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="border-warcrow-gold/20">
                        <TableCell className="font-medium w-16">{item.order_index}</TableCell>
                        <TableCell className="font-medium text-warcrow-gold w-1/3">
                          <div className="truncate max-w-xs">{item.section}</div>
                          <div className="text-xs text-warcrow-text/70 mt-1 truncate max-w-xs">
                            {item.content.substring(0, 60)}...
                          </div>
                        </TableCell>
                        <TableCell className={`w-1/3 ${item.section_es ? 'text-warcrow-text' : 'text-red-500 italic'}`}>
                          <div className="truncate max-w-xs">
                            {item.section_es || "Missing translation"}
                          </div>
                          {item.section_es && item.content_es && (
                            <div className="text-xs text-warcrow-text/70 mt-1 truncate max-w-xs">
                              {item.content_es.substring(0, 60)}...
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="w-24">
                          {isItemComplete(item) ? (
                            <Badge className="bg-green-600 flex items-center gap-1 whitespace-nowrap">
                              <Check className="h-3 w-3" /> Complete
                            </Badge>
                          ) : (
                            <Badge className="bg-red-600 flex items-center gap-1 whitespace-nowrap">
                              <X className="h-3 w-3" /> Incomplete
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="w-24 text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-warcrow-gold/30 text-warcrow-gold whitespace-nowrap"
                            onClick={() => handleEditTranslation(item)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                        <p className="text-warcrow-text">No FAQ items found matching search criteria</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="translations">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 border border-warcrow-gold/30 bg-black">
                <h3 className="text-warcrow-gold font-medium mb-2">Spanish Section Translations</h3>
                <p className="text-2xl font-bold text-warcrow-text">
                  {stats.itemsWithSpanishSection}/{stats.totalItems}
                  <span className="text-sm ml-2 font-normal">
                    ({stats.spanishSectionCompletionRate}%)
                  </span>
                </p>
              </Card>
              
              <Card className="p-4 border border-warcrow-gold/30 bg-black">
                <h3 className="text-warcrow-gold font-medium mb-2">French Section Translations</h3>
                <p className="text-2xl font-bold text-warcrow-text">
                  {stats.itemsWithFrenchSection}/{stats.totalItems}
                  <span className="text-sm ml-2 font-normal">
                    ({stats.frenchSectionCompletionRate}%)
                  </span>
                </p>
              </Card>
              
              <Card className="p-4 border border-warcrow-gold/30 bg-black">
                <h3 className="text-warcrow-gold font-medium mb-2">Complete Items</h3>
                <p className="text-2xl font-bold text-warcrow-text">
                  <span className="mr-4">ES: {stats.spanishCompleteItems} ({stats.spanishCompleteRate}%)</span>
                  <span>FR: {stats.frenchCompleteItems} ({stats.frenchCompleteRate}%)</span>
                </p>
              </Card>
            </div>
            
            <ScrollArea className="h-[350px] rounded-md border border-warcrow-gold/20 p-4">
              <div className="space-y-4">
                <h3 className="text-warcrow-gold font-medium flex items-center">
                  <Languages className="h-4 w-4 mr-2" />
                  Translation Status Details
                </h3>
                
                <div className="space-y-2">
                  {faqItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 border border-warcrow-gold/20 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium truncate">{item.section}</p>
                        <p className="text-sm text-warcrow-text/60">
                          <span className={item.section_es ? "text-green-500" : "text-red-500"}>
                            • ES Section {item.section_es ? "✓" : "✗"}
                          </span>
                          {' '}
                          <span className={item.content_es ? "text-green-500" : "text-red-500"}>
                            • ES Content {item.content_es ? "✓" : "✗"}
                          </span>
                          {' '}
                          <span className={item.section_fr ? "text-green-500" : "text-red-500"}>
                            • FR Section {item.section_fr ? "✓" : "✗"}
                          </span>
                          {' '}
                          <span className={item.content_fr ? "text-green-500" : "text-red-500"}>
                            • FR Content {item.content_fr ? "✓" : "✗"}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-warcrow-gold/30 text-warcrow-gold whitespace-nowrap"
                          onClick={() => handleEditTranslation(item)}
                        >
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        {isItemComplete(item) ? (
                          <Badge className="bg-green-600">Complete</Badge>
                        ) : item.section_es || item.content_es ? (
                          <Badge className="bg-amber-600">Partial</Badge>
                        ) : (
                          <Badge className="bg-red-600">Missing</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="verify">
            <div className="mb-4">
              <Card className="p-4 border border-warcrow-gold/30 bg-black">
                <h3 className="text-warcrow-gold font-medium mb-2">Missing Translations</h3>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-warcrow-text">
                    {missingTranslations.length} items need translation
                  </p>
                  {missingTranslations.length === 0 && (
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  )}
                </div>
              </Card>
            </div>

            <ScrollArea className="h-[350px] rounded-md">
              {missingTranslations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-warcrow-gold/20">
                      <TableHead className="text-warcrow-gold/80 w-1/2">Section</TableHead>
                      <TableHead className="text-warcrow-gold/80 w-1/4">Missing</TableHead>
                      <TableHead className="text-warcrow-gold/80 w-1/4 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingTranslations.map(item => {
                      const missingSection = !item.section_es;
                      const missingContent = !item.content_es;
                      
                      return (
                        <TableRow key={item.id} className="border-warcrow-gold/20">
                          <TableCell className="font-medium text-warcrow-gold w-1/2">
                            <div className="truncate max-w-xs">{item.section}</div>
                          </TableCell>
                          <TableCell className="w-1/4">
                            {missingSection && missingContent ? (
                              <Badge variant="destructive">Section & Content</Badge>
                            ) : missingSection ? (
                              <Badge variant="destructive">Section</Badge>
                            ) : (
                              <Badge variant="destructive">Content</Badge>
                            )}
                          </TableCell>
                          <TableCell className="w-1/4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-warcrow-gold/30 text-warcrow-gold"
                              onClick={() => handleEditTranslation(item)}
                            >
                              <Edit className="h-3 w-3 mr-1" /> Translate
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <p className="text-warcrow-gold text-xl font-medium">All items translated!</p>
                  <p className="text-warcrow-text/60">Spanish translations are complete for all FAQ content.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-sm text-warcrow-text/60">
          <p className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 
            All FAQ content is stored in Supabase and loaded directly from the database
          </p>
          <p className="flex items-center">
            <Languages className="h-4 w-4 mr-2 text-blue-400" /> 
            Spanish and French translations can now be managed directly from this interface
          </p>
        </div>
      </div>

      {/* Translation Edit Dialog */}
      <Dialog open={translationEditDialogOpen} onOpenChange={setTranslationEditDialogOpen}>
        <DialogContent className="bg-black border border-warcrow-gold/40 text-warcrow-text max-w-3xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-warcrow-gold flex items-center">
                <Languages className="h-5 w-5 mr-2" />
                Edit FAQ Content
              </DialogTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePreviewMode}
                  className="flex items-center gap-1 text-xs border-warcrow-gold/30"
                >
                  {previewMode === 'edit' ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Edit Mode
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-warcrow-gold/80 text-sm mb-2">English Section</h3>
                <Input 
                  value={editingItem?.section || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, section: e.target.value} : null)}
                  placeholder="Enter English section title..."
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-warcrow-gold/80 text-sm flex items-center gap-1">
                    <Select value={targetLanguage} onValueChange={(value) => setTargetLanguage(value as 'es' | 'fr')}>
                      <SelectTrigger className="w-[130px] h-6 border-warcrow-gold/30 text-sm bg-black">
                        <Languages className="h-3.5 w-3.5 mr-1" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black border border-warcrow-gold/30">
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-warcrow-text/70 ml-2">Section</span>
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={translateContent}
                    disabled={translationInProgress}
                    className="h-6 px-2 text-xs border-warcrow-gold/30 text-warcrow-gold"
                  >
                    {translationInProgress ? (
                      <><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Translating...</>
                    ) : (
                      <><Wand2 className="h-3 w-3 mr-1" />Translate</>
                    )}
                  </Button>
                </div>
                <Input 
                  value={currentLanguageContent.section || ''} 
                  onChange={(e) => updateLanguageContent('section', e.target.value)}
                  placeholder={`Enter ${targetLanguage === 'es' ? 'Spanish' : 'French'} section title...`}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-warcrow-gold/80 text-sm mb-2">English Content</h3>
                {previewMode === 'edit' ? (
                  <ColorTextEditor 
                    value={editingItem?.content || ''} 
                    onChange={(value) => setEditingItem(prev => prev ? {...prev, content: value} : null)}
                    placeholder="Enter English content..."
                    rows={8}
                    className="h-[240px]"
                  />
                ) : (
                  <FormattedTextPreview 
                    content={editingItem?.content || ''}
                    className="h-[240px] overflow-y-auto"
                  />
                )}
              </div>
              <div>
                <h3 className="text-warcrow-gold/80 text-sm mb-2">
                  {targetLanguage === 'es' ? 'Spanish' : 'French'} Content
                </h3>
                {previewMode === 'edit' ? (
                  <ColorTextEditor 
                    value={currentLanguageContent.content || ''} 
                    onChange={(value) => updateLanguageContent('content', value)}
                    placeholder={`Enter ${targetLanguage === 'es' ? 'Spanish' : 'French'} content...`}
                    rows={8}
                    className="h-[240px]"
                  />
                ) : (
                  <FormattedTextPreview 
                    content={currentLanguageContent.content || ''}
                    className="h-[240px] overflow-y-auto"
                  />
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTranslationEditDialogOpen(false)} className="border-warcrow-gold/30">
              Cancel
            </Button>
            <Button onClick={saveTranslation} disabled={saving !== null} className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90">
              {saving !== null ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Content
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FAQTranslationManager;

