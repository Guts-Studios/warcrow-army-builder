
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type ChapterData = {
  id: string;
  title: string;
  order_index: number;
  sectionCount: number;
};

type SectionData = {
  id: string;
  chapter_id: string;
  title: string;
  order_index: number;
  content: string;
  mission_details?: string | null;
};

export const RulesVerifier = () => {
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'sections'>('chapters');
  
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
      
      // Count sections for each chapter
      const chaptersWithCount = chaptersData.map(chapter => {
        const sectionCount = sectionsData.filter(
          section => section.chapter_id === chapter.id
        ).length;
        
        return {
          ...chapter,
          sectionCount
        };
      });
      
      setChapters(chaptersWithCount);
      setSections(sectionsData);
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
        
        <div className="flex space-x-2 mb-2">
          <Button
            variant={activeTab === 'chapters' ? 'default' : 'outline'}
            className={activeTab === 'chapters' 
              ? "bg-warcrow-gold text-black" 
              : "border-warcrow-gold/30 text-warcrow-gold"}
            onClick={() => setActiveTab('chapters')}
          >
            Chapters ({chapters.length})
          </Button>
          <Button
            variant={activeTab === 'sections' ? 'default' : 'outline'}
            className={activeTab === 'sections' 
              ? "bg-warcrow-gold text-black" 
              : "border-warcrow-gold/30 text-warcrow-gold"}
            onClick={() => setActiveTab('sections')}
          >
            Sections ({sections.length})
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
          </div>
        ) : activeTab === 'chapters' ? (
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
        
        <div className="mt-4 text-sm text-warcrow-text/60">
          <p className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 
            All rules content is stored in Supabase and loaded directly from the database
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RulesVerifier;
