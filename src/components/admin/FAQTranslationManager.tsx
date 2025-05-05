
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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Languages, RefreshCw, Check, AlertTriangle, Edit, X, CheckCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FAQTranslationManager: React.FC = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sections' | 'translations' | 'verify'>('sections');
  const [editingItem, setEditingItem] = useState<{
    id: string;
    section: string;
    section_es: string;
    content: string;
    content_es: string;
  } | null>(null);
  const [translationEditDialogOpen, setTranslationEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      content: item.content,
      content_es: item.content_es || '',
    });
    setTranslationEditDialogOpen(true);
  };

  const saveTranslation = async () => {
    if (!editingItem) return;

    setSaving(editingItem.id);
    try {
      const { error } = await supabase
        .from('faq_sections')
        .update({
          section: editingItem.section,
          content: editingItem.content,
          section_es: editingItem.section_es,
          content_es: editingItem.content_es,
        })
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

  const runVerification = async () => {
    setLoading(true);
    try {
      // Check which FAQ items have missing translations
      const verifiedItems = faqItems.map(item => ({
        ...item,
        has_spanish_section: Boolean(item.section_es && item.section_es.trim() !== ''),
        has_spanish_content: Boolean(item.content_es && item.content_es.trim() !== '')
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
    return Boolean(item.section_es) && Boolean(item.content_es);
  };

  const filteredItems = searchQuery
    ? faqItems.filter(
        item =>
          item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.section_es && item.section_es.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.content_es && item.content_es.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : faqItems;

  const missingTranslations = faqItems.filter(item => !isItemComplete(item));

  const getTranslationStatusSummary = () => {
    const itemsWithSection = faqItems.filter(item => Boolean(item.section_es)).length;
    const itemsWithContent = faqItems.filter(item => Boolean(item.content_es)).length;
    const total = faqItems.length;
    
    return {
      totalItems: total,
      itemsWithSection,
      itemsWithContent,
      sectionCompletionRate: Math.round((itemsWithSection / total) * 100),
      contentCompletionRate: Math.round((itemsWithContent / total) * 100),
      completeItems: faqItems.filter(item => isItemComplete(item)).length,
      completeRate: Math.round((faqItems.filter(item => isItemComplete(item)).length / total) * 100)
    };
  };

  const stats = getTranslationStatusSummary();

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
                    <TableHead className="text-warcrow-gold/80">Order</TableHead>
                    <TableHead className="text-warcrow-gold/80">English Section</TableHead>
                    <TableHead className="text-warcrow-gold/80">Spanish Section</TableHead>
                    <TableHead className="text-warcrow-gold/80">Status</TableHead>
                    <TableHead className="text-warcrow-gold/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id} className="border-warcrow-gold/20">
                        <TableCell className="font-medium">{item.order_index}</TableCell>
                        <TableCell className="font-medium text-warcrow-gold">
                          {item.section}
                          <div className="text-xs text-warcrow-text/70 mt-1 truncate max-w-xs">
                            {item.content.substring(0, 100)}...
                          </div>
                        </TableCell>
                        <TableCell className={`${item.section_es ? 'text-warcrow-text' : 'text-red-500 italic'}`}>
                          {item.section_es || "Missing translation"}
                          {item.section_es && item.content_es && (
                            <div className="text-xs text-warcrow-text/70 mt-1 truncate max-w-xs">
                              {item.content_es.substring(0, 100)}...
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {isItemComplete(item) ? (
                            <Badge className="bg-green-600 flex items-center gap-1">
                              <Check className="h-3 w-3" /> Complete
                            </Badge>
                          ) : (
                            <Badge className="bg-red-600 flex items-center gap-1">
                              <X className="h-3 w-3" /> Incomplete
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-warcrow-gold/30 text-warcrow-gold"
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
                <h3 className="text-warcrow-gold font-medium mb-2">Section Translations</h3>
                <p className="text-2xl font-bold text-warcrow-text">
                  {stats.itemsWithSection}/{stats.totalItems}
                  <span className="text-sm ml-2 font-normal">
                    ({stats.sectionCompletionRate}%)
                  </span>
                </p>
              </Card>
              
              <Card className="p-4 border border-warcrow-gold/30 bg-black">
                <h3 className="text-warcrow-gold font-medium mb-2">Content Translations</h3>
                <p className="text-2xl font-bold text-warcrow-text">
                  {stats.itemsWithContent}/{stats.totalItems}
                  <span className="text-sm ml-2 font-normal">
                    ({stats.contentCompletionRate}%)
                  </span>
                </p>
              </Card>
              
              <Card className="p-4 border border-warcrow-gold/30 bg-black">
                <h3 className="text-warcrow-gold font-medium mb-2">Complete Items</h3>
                <p className="text-2xl font-bold text-warcrow-text">
                  {stats.completeItems}/{stats.totalItems}
                  <span className="text-sm ml-2 font-normal">
                    ({stats.completeRate}%)
                  </span>
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
                        <p className="font-medium">{item.section}</p>
                        <p className="text-sm text-warcrow-text/60">
                          {item.section_es ? 
                            <span className="text-green-500">• Section translated</span> : 
                            <span className="text-red-500">• Section missing</span>
                          }
                          {' '}
                          {item.content_es ? 
                            <span className="text-green-500">• Content translated</span> : 
                            <span className="text-red-500">• Content missing</span>
                          }
                        </p>
                      </div>
                      {isItemComplete(item) ? (
                        <Badge className="bg-green-600">Complete</Badge>
                      ) : item.section_es || item.content_es ? (
                        <Badge className="bg-amber-600">Partial</Badge>
                      ) : (
                        <Badge className="bg-red-600">Missing</Badge>
                      )}
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
                      <TableHead className="text-warcrow-gold/80">Section</TableHead>
                      <TableHead className="text-warcrow-gold/80">Missing</TableHead>
                      <TableHead className="text-warcrow-gold/80">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingTranslations.map(item => {
                      const missingSection = !item.section_es;
                      const missingContent = !item.content_es;
                      
                      return (
                        <TableRow key={item.id} className="border-warcrow-gold/20">
                          <TableCell className="font-medium text-warcrow-gold">{item.section}</TableCell>
                          <TableCell>
                            {missingSection && missingContent ? (
                              <Badge variant="destructive">Section & Content</Badge>
                            ) : missingSection ? (
                              <Badge variant="destructive">Section</Badge>
                            ) : (
                              <Badge variant="destructive">Content</Badge>
                            )}
                          </TableCell>
                          <TableCell>
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
            Spanish translations can now be managed directly from this interface
          </p>
        </div>
      </div>

      {/* Translation Edit Dialog */}
      <Dialog open={translationEditDialogOpen} onOpenChange={setTranslationEditDialogOpen}>
        <DialogContent className="bg-black border border-warcrow-gold/40 text-warcrow-text max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold flex items-center">
              <Languages className="h-5 w-5 mr-2" />
              Edit FAQ Content
            </DialogTitle>
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
                <h3 className="text-warcrow-gold/80 text-sm mb-2">Spanish Section</h3>
                <Input 
                  value={editingItem?.section_es || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, section_es: e.target.value} : null)}
                  placeholder="Enter Spanish section title..."
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-warcrow-gold/80 text-sm mb-2">English Content</h3>
                <Textarea 
                  value={editingItem?.content || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, content: e.target.value} : null)}
                  placeholder="Enter English content..."
                  rows={8}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold h-[240px]"
                />
              </div>
              <div>
                <h3 className="text-warcrow-gold/80 text-sm mb-2">Spanish Content</h3>
                <Textarea 
                  value={editingItem?.content_es || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, content_es: e.target.value} : null)}
                  placeholder="Enter Spanish content..."
                  rows={8}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold h-[240px]"
                />
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
