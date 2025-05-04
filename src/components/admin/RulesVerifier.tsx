
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, RefreshCw, Languages, ListChecks } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState<'chapters' | 'sections' | 'translations'>('chapters');
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus[]>([]);
  
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
  
  const stats = getTranslationStatusSummary();
  
  return (
    <Card className="p-6 border border-warcrow-gold/40 shadow-sm bg-black">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Rules Content Verifier</h2>
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
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-2">
            <TabsTrigger value="chapters" className={activeTab === 'chapters' ? "bg-warcrow-gold text-black" : ""}>
              Chapters ({chapters.length})
            </TabsTrigger>
            <TabsTrigger value="sections" className={activeTab === 'sections' ? "bg-warcrow-gold text-black" : ""}>
              Sections ({sections.length})
            </TabsTrigger>
            <TabsTrigger value="translations" className={activeTab === 'translations' ? "bg-warcrow-gold text-black" : ""}>
              <Languages className="h-4 w-4 mr-2" />
              Translations
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
                    Found {chapters.length} chapters with {sections.length} total sections
                  </p>
                </div>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-warcrow-gold/20">
                        <TableHead className="text-warcrow-gold/80">Order</TableHead>
                        <TableHead className="text-warcrow-gold/80">Chapter Title</TableHead>
                        <TableHead className="text-warcrow-gold/80">Sections</TableHead>
                        <TableHead className="text-warcrow-gold/80">ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chapters.length > 0 ? (
                        chapters.map((chapter) => (
                          <TableRow key={chapter.id} className="border-warcrow-gold/20">
                            <TableCell className="font-medium">{chapter.order_index}</TableCell>
                            <TableCell className="font-medium text-warcrow-gold">{chapter.title}</TableCell>
                            <TableCell>
                              {chapter.sectionCount > 0 ? (
                                <Badge className="bg-green-600">{chapter.sectionCount}</Badge>
                              ) : (
                                <Badge className="bg-amber-600">0</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-warcrow-text/60 text-xs truncate max-w-[200px]">
                              {chapter.id}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                            <p className="text-warcrow-text">No chapters found in database</p>
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
                    Found {sections.length} sections across {chapters.length} chapters
                  </p>
                </div>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-warcrow-gold/20">
                        <TableHead className="text-warcrow-gold/80">Chapter</TableHead>
                        <TableHead className="text-warcrow-gold/80">Section Title</TableHead>
                        <TableHead className="text-warcrow-gold/80">Order</TableHead>
                        <TableHead className="text-warcrow-gold/80">Content Length</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections.length > 0 ? (
                        sections.map((section) => {
                          const chapterTitle = chapters.find(c => c.id === section.chapter_id)?.title || 'Unknown';
                          return (
                            <TableRow key={section.id} className="border-warcrow-gold/20">
                              <TableCell className="text-warcrow-text/80">{chapterTitle}</TableCell>
                              <TableCell className="font-medium text-warcrow-gold">{section.title}</TableCell>
                              <TableCell>{section.order_index}</TableCell>
                              <TableCell>
                                {section.content && section.content.length > 0 ? (
                                  <Badge className="bg-green-600">{section.content.length} chars</Badge>
                                ) : (
                                  <Badge className="bg-red-600">Empty</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                            <p className="text-warcrow-text">No sections found in database</p>
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
    </Card>
  );
};

export default RulesVerifier;
