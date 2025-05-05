
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, RefreshCw, Languages, ListChecks, Edit, Check, X, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type ChapterData = {
  id: string;
  title: string;
  title_es: string | null;
  order_index: number;
  sectionCount: number;
  translationComplete: boolean;
};

type SectionData = {
  id: string;
  chapter_id: string;
  title: string;
  title_es: string | null;
  content_es: string | null;
  order_index: number;
  content: string;
  mission_details?: string | null;
  translationComplete: boolean;
};

type TranslationStatus = {
  content_type: string;
  item_id: string;
  english_title: string;
  spanish_title: string | null;
  has_spanish_title: boolean;
  has_spanish_content: boolean;
};

export const RulesVerifier = () => {
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'sections' | 'translations' | 'verify'>('chapters');
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus[]>([]);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    type: 'chapter' | 'section';
    title: string;
    title_es: string;
    content?: string;
    content_es?: string;
  } | null>(null);
  const [translationEditDialogOpen, setTranslationEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveInProgress, setSaveInProgress] = useState(false);
  
  const fetchRulesData = async () => {
    setIsLoading(true);
    try {
      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("rules_chapters")
        .select("*")
        .order("order_index");
        
      if (chaptersError) throw chaptersError;
      
      // Fetch sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("rules_sections")
        .select("*")
        .order("order_index");
        
      if (sectionsError) throw sectionsError;
      
      // Check translation status
      const { data: translationData, error: translationError } = await supabase
        .rpc("check_rules_translations_completeness");
        
      if (translationError) throw translationError;
      
      // Count sections for each chapter
      const chaptersWithCount = chaptersData.map(chapter => {
        const chapterSections = sectionsData.filter(
          section => section.chapter_id === chapter.id
        );
        
        const sectionCount = chapterSections.length;
        
        // Check if translation is complete for this chapter
        const chapterTranslated = Boolean(chapter.title_es);
        const allSectionsTranslated = chapterSections.every(
          section => Boolean(section.title_es) && Boolean(section.content_es)
        );
        
        return {
          ...chapter,
          sectionCount,
          translationComplete: chapterTranslated && allSectionsTranslated
        };
      });
      
      // Add translation status to sections
      const sectionsWithTranslation = sectionsData.map(section => {
        return {
          ...section,
          translationComplete: Boolean(section.title_es) && Boolean(section.content_es)
        };
      });
      
      setChapters(chaptersWithCount);
      setSections(sectionsWithTranslation);
      setTranslationStatus(translationData || []);
      toast.success("Rules data loaded successfully");
      
    } catch (error: any) {
      console.error("Error fetching rules data:", error);
      toast.error(`Failed to load rules data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRulesData();
  }, []);
  
  const getTranslationStatusSummary = () => {
    const chapterStatus = translationStatus.filter(item => item.content_type === 'chapter');
    const sectionStatus = translationStatus.filter(item => item.content_type === 'section');
    
    const chaptersWithTitle = chapterStatus.filter(c => c.has_spanish_title).length;
    const sectionsWithTitle = sectionStatus.filter(s => s.has_spanish_title).length;
    const sectionsWithContent = sectionStatus.filter(s => s.has_spanish_content).length;
    
    return {
      totalChapters: chapterStatus.length,
      chaptersWithTitle,
      totalSections: sectionStatus.length,
      sectionsWithTitle,
      sectionsWithContent,
      chapterCompletionRate: Math.round((chaptersWithTitle / chapterStatus.length) * 100),
      sectionTitleCompletionRate: Math.round((sectionsWithTitle / sectionStatus.length) * 100),
      sectionContentCompletionRate: Math.round((sectionsWithContent / sectionStatus.length) * 100)
    };
  };

  const handleEditTranslation = (item: ChapterData | SectionData, type: 'chapter' | 'section') => {
    setEditingItem({
      id: item.id,
      type,
      title: item.title,
      title_es: item.title_es || '',
      content: type === 'section' ? (item as SectionData).content : undefined,
      content_es: type === 'section' ? (item as SectionData).content_es || '' : undefined
    });
    setTranslationEditDialogOpen(true);
  };

  const saveTranslation = async () => {
    if (!editingItem) return;

    setSaveInProgress(true);
    try {
      console.log("Saving translation:", editingItem);
      
      if (editingItem.type === 'chapter') {
        const { error } = await supabase
          .from('rules_chapters')
          .update({ title_es: editingItem.title_es })
          .eq('id', editingItem.id);
          
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        // Update local state for immediate UI feedback
        setChapters(prevChapters => 
          prevChapters.map(chapter => 
            chapter.id === editingItem.id ? 
              {...chapter, title_es: editingItem.title_es} : 
              chapter
          )
        );
        
        // Add debug logging
        console.log(`Updated chapter ${editingItem.id} with Spanish title: ${editingItem.title_es}`);
        
        toast.success('Chapter translation updated successfully');
      } else {
        const { error } = await supabase
          .from('rules_sections')
          .update({ 
            title_es: editingItem.title_es,
            content_es: editingItem.content_es
          })
          .eq('id', editingItem.id);
          
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        // Update local state
        setSections(prevSections => 
          prevSections.map(section => 
            section.id === editingItem.id ? 
              {...section, title_es: editingItem.title_es, content_es: editingItem.content_es} : 
              section
          )
        );
        
        toast.success('Section translation updated successfully');
      }
      
      // Refresh data to ensure all UI is up to date
      await fetchRulesData();
      setTranslationEditDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating translation:', error);
      toast.error(`Failed to update translation: ${error.message}`);
    } finally {
      setSaveInProgress(false);
    }
  };

  const runVerification = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('check_rules_translations_completeness');
      if (error) throw error;
      
      setTranslationStatus(data);
      toast.success('Translation verification completed');
      setActiveTab('verify');
    } catch (error: any) {
      console.error('Error running verification:', error);
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const missingTranslations = sections.filter(section => !section.translationComplete);
  
  const filteredSections = searchQuery ? 
    sections.filter(section => 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (section.title_es && section.title_es.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : sections;
    
  const filteredChapters = searchQuery ?
    chapters.filter(chapter => 
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chapter.title_es && chapter.title_es.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : chapters;

  const stats = getTranslationStatusSummary();
  
  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-warcrow-gold flex items-center">
            <Languages className="h-5 w-5 mr-2" />
            Rules Content Translation Manager
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={runVerification}
              disabled={isLoading}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <CheckCircle className={`h-4 w-4 mr-2`} />
              Verify Translations
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchRulesData}
              disabled={isLoading}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search rules content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-warcrow-gold/30 bg-black text-warcrow-text"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-2">
            <TabsTrigger value="chapters" className={activeTab === 'chapters' ? "bg-warcrow-gold text-black" : ""}>
              Chapters ({filteredChapters.length})
            </TabsTrigger>
            <TabsTrigger value="sections" className={activeTab === 'sections' ? "bg-warcrow-gold text-black" : ""}>
              Sections ({filteredSections.length})
            </TabsTrigger>
            <TabsTrigger value="translations" className={activeTab === 'translations' ? "bg-warcrow-gold text-black" : ""}>
              <Languages className="h-4 w-4 mr-2" />
              Translations
            </TabsTrigger>
            <TabsTrigger value="verify" className={activeTab === 'verify' ? "bg-warcrow-gold text-black" : ""}>
              <FileText className="h-4 w-4 mr-2" />
              Verification
              {missingTranslations.length > 0 && (
                <Badge variant="destructive" className="ml-2">{missingTranslations.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chapters">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <p className="text-warcrow-text/80 text-sm">
                    Found {filteredChapters.length} chapters with {sections.length} total sections
                  </p>
                </div>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-warcrow-gold/20">
                        <TableHead className="text-warcrow-gold/80">Order</TableHead>
                        <TableHead className="text-warcrow-gold/80">Chapter Title (EN)</TableHead>
                        <TableHead className="text-warcrow-gold/80">Spanish Title</TableHead>
                        <TableHead className="text-warcrow-gold/80">Sections</TableHead>
                        <TableHead className="text-warcrow-gold/80">Status</TableHead>
                        <TableHead className="text-warcrow-gold/80">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredChapters.length > 0 ? (
                        filteredChapters.map((chapter) => (
                          <TableRow key={chapter.id} className="border-warcrow-gold/20">
                            <TableCell className="font-medium">{chapter.order_index}</TableCell>
                            <TableCell className="font-medium text-warcrow-gold">{chapter.title}</TableCell>
                            <TableCell className={`${chapter.title_es ? 'text-warcrow-text' : 'text-red-500 italic'}`}>
                              {chapter.title_es || "Missing translation"}
                            </TableCell>
                            <TableCell>
                              {chapter.sectionCount > 0 ? (
                                <Badge className="bg-green-600">{chapter.sectionCount}</Badge>
                              ) : (
                                <Badge className="bg-amber-600">0</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {chapter.translationComplete ? (
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
                                onClick={() => handleEditTranslation(chapter, 'chapter')}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                            <p className="text-warcrow-text">No chapters found matching search criteria</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </>
            )}
          </TabsContent>

          <TabsContent value="sections">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <p className="text-warcrow-text/80 text-sm">
                    Found {filteredSections.length} sections across {chapters.length} chapters
                  </p>
                </div>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-warcrow-gold/20">
                        <TableHead className="text-warcrow-gold/80">Chapter</TableHead>
                        <TableHead className="text-warcrow-gold/80">Section Title (EN)</TableHead>
                        <TableHead className="text-warcrow-gold/80">Spanish Title</TableHead>
                        <TableHead className="text-warcrow-gold/80">Content</TableHead>
                        <TableHead className="text-warcrow-gold/80">Status</TableHead>
                        <TableHead className="text-warcrow-gold/80">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSections.length > 0 ? (
                        filteredSections.map((section) => {
                          const chapterTitle = chapters.find(c => c.id === section.chapter_id)?.title || 'Unknown';
                          return (
                            <TableRow key={section.id} className="border-warcrow-gold/20">
                              <TableCell className="text-warcrow-text/80">{chapterTitle}</TableCell>
                              <TableCell className="font-medium text-warcrow-gold">{section.title}</TableCell>
                              <TableCell className={`${section.title_es ? 'text-warcrow-text' : 'text-red-500 italic'}`}>
                                {section.title_es || "Missing translation"}
                              </TableCell>
                              <TableCell>
                                {section.content_es ? (
                                  <Badge className="bg-green-600">Translated</Badge>
                                ) : (
                                  <Badge className="bg-red-600">Missing</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {section.translationComplete ? (
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
                                  onClick={() => handleEditTranslation(section, 'section')}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                            <p className="text-warcrow-text">No sections found matching search criteria</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </>
            )}
          </TabsContent>

          <TabsContent value="translations">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
              </div>
            ) : (
              <>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border border-warcrow-gold/30 bg-black">
                    <h3 className="text-warcrow-gold font-medium mb-2">Chapter Translations</h3>
                    <p className="text-2xl font-bold text-warcrow-text">
                      {stats.chaptersWithTitle}/{stats.totalChapters}
                      <span className="text-sm ml-2 font-normal">
                        ({stats.chapterCompletionRate}%)
                      </span>
                    </p>
                  </Card>
                  
                  <Card className="p-4 border border-warcrow-gold/30 bg-black">
                    <h3 className="text-warcrow-gold font-medium mb-2">Section Titles</h3>
                    <p className="text-2xl font-bold text-warcrow-text">
                      {stats.sectionsWithTitle}/{stats.totalSections}
                      <span className="text-sm ml-2 font-normal">
                        ({stats.sectionTitleCompletionRate}%)
                      </span>
                    </p>
                  </Card>
                  
                  <Card className="p-4 border border-warcrow-gold/30 bg-black">
                    <h3 className="text-warcrow-gold font-medium mb-2">Section Content</h3>
                    <p className="text-2xl font-bold text-warcrow-text">
                      {stats.sectionsWithContent}/{stats.totalSections}
                      <span className="text-sm ml-2 font-normal">
                        ({stats.sectionContentCompletionRate}%)
                      </span>
                    </p>
                  </Card>
                </div>
                
                <ScrollArea className="h-[350px] rounded-md border border-warcrow-gold/20 p-4">
                  <div className="space-y-4">
                    <h3 className="text-warcrow-gold font-medium flex items-center">
                      <ListChecks className="h-4 w-4 mr-2" />
                      Translation Status Details
                    </h3>
                    
                    <h4 className="text-warcrow-gold/80 text-sm mt-4 mb-2">Chapters</h4>
                    <div className="space-y-2">
                      {chapters.map(chapter => (
                        <div key={chapter.id} className="flex items-center justify-between p-2 border border-warcrow-gold/20 rounded-md">
                          <div>
                            <p className="font-medium">{chapter.title}</p>
                            <p className="text-sm text-warcrow-text/60">{chapter.title_es || "No translation"}</p>
                          </div>
                          {chapter.title_es ? (
                            <Badge className="bg-green-600">Translated</Badge>
                          ) : (
                            <Badge className="bg-red-600">Missing</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="text-warcrow-gold/80 text-sm mt-4 mb-2">Sections</h4>
                    <div className="space-y-2">
                      {sections.map(section => (
                        <div key={section.id} className="flex items-center justify-between p-2 border border-warcrow-gold/20 rounded-md">
                          <div className="flex-1">
                            <p className="font-medium">{section.title}</p>
                            <p className="text-sm text-warcrow-text/60">
                              {section.title_es || "No translation"} 
                              {section.content_es ? 
                                <span className="text-green-500 ml-2">• Content available</span> : 
                                <span className="text-red-500 ml-2">• No content</span>
                              }
                            </p>
                          </div>
                          {section.title_es && section.content_es ? (
                            <Badge className="bg-green-600">Complete</Badge>
                          ) : section.title_es || section.content_es ? (
                            <Badge className="bg-amber-600">Partial</Badge>
                          ) : (
                            <Badge className="bg-red-600">Missing</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </>
            )}
          </TabsContent>

          <TabsContent value="verify">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <Card className="p-4 border border-warcrow-gold/30 bg-black">
                    <h3 className="text-warcrow-gold font-medium mb-2">Missing Translations</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-warcrow-text">
                        {missingTranslations.length} sections need translation
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
                          <TableHead className="text-warcrow-gold/80">Chapter</TableHead>
                          <TableHead className="text-warcrow-gold/80">Section</TableHead>
                          <TableHead className="text-warcrow-gold/80">Missing</TableHead>
                          <TableHead className="text-warcrow-gold/80">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {missingTranslations.map(section => {
                          const chapter = chapters.find(c => c.id === section.chapter_id);
                          const missingTitle = !section.title_es;
                          const missingContent = !section.content_es;
                          
                          return (
                            <TableRow key={section.id} className="border-warcrow-gold/20">
                              <TableCell>{chapter?.title || "Unknown"}</TableCell>
                              <TableCell className="font-medium text-warcrow-gold">{section.title}</TableCell>
                              <TableCell>
                                {missingTitle && missingContent ? (
                                  <Badge variant="destructive">Title & Content</Badge>
                                ) : missingTitle ? (
                                  <Badge variant="destructive">Title</Badge>
                                ) : (
                                  <Badge variant="destructive">Content</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-warcrow-gold/30 text-warcrow-gold"
                                  onClick={() => handleEditTranslation(section, 'section')}
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
                      <p className="text-warcrow-gold text-xl font-medium">All sections translated!</p>
                      <p className="text-warcrow-text/60">Spanish translations are complete for all rules content.</p>
                    </div>
                  )}
                </ScrollArea>
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-sm text-warcrow-text/60">
          <p className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 
            All rules content is stored in Supabase and loaded directly from the database
          </p>
          <p className="flex items-center">
            <Languages className="h-4 w-4 mr-2 text-blue-400" /> 
            Spanish translations can now be managed directly in the database
          </p>
        </div>
      </div>

      {/* Translation Edit Dialog */}
      <Dialog open={translationEditDialogOpen} onOpenChange={setTranslationEditDialogOpen}>
        <DialogContent className="bg-black border border-warcrow-gold/40 text-warcrow-text max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold flex items-center">
              <Languages className="h-5 w-5 mr-2" />
              {editingItem?.type === 'chapter' ? 'Edit Chapter Translation' : 'Edit Section Translation'}
            </DialogTitle>
            <DialogDescription className="text-warcrow-text/60">
              Update the translations for this {editingItem?.type}. Changes will be saved to the database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-warcrow-gold/80 text-sm mb-2">English Title</h3>
                <Input 
                  value={editingItem?.title || ''} 
                  disabled
                  className="border border-warcrow-gold/30 bg-black/50 text-warcrow-text/80"
                />
              </div>
              <div>
                <h3 className="text-warcrow-gold/80 text-sm mb-2">Spanish Title</h3>
                <Input 
                  value={editingItem?.title_es || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, title_es: e.target.value} : null)}
                  placeholder="Enter Spanish title..."
                  className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold"
                />
              </div>
            </div>
            
            {editingItem?.type === 'section' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-warcrow-gold/80 text-sm mb-2">English Content</h3>
                  <Textarea 
                    value={editingItem?.content || ''} 
                    disabled
                    rows={10}
                    className="border border-warcrow-gold/30 bg-black/50 text-warcrow-text/80 h-[300px]"
                  />
                </div>
                <div>
                  <h3 className="text-warcrow-gold/80 text-sm mb-2">Spanish Content</h3>
                  <Textarea 
                    value={editingItem?.content_es || ''} 
                    onChange={(e) => setEditingItem(prev => prev ? {...prev, content_es: e.target.value} : null)}
                    placeholder="Enter Spanish content..."
                    rows={10}
                    className="border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold h-[300px]"
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTranslationEditDialogOpen(false)} className="border-warcrow-gold/30">
              Cancel
            </Button>
            <Button 
              onClick={saveTranslation} 
              disabled={saveInProgress} 
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
            >
              {saveInProgress ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Translation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RulesVerifier;
