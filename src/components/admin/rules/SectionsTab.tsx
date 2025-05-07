
import React from 'react';
import { AlertTriangle, Check, Edit, RefreshCw, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChapterData, type SectionData } from './types';

interface SectionsTabProps {
  isLoading: boolean;
  filteredSections: SectionData[];
  chapters: ChapterData[];
  handleEditTranslation: (item: SectionData, type: 'chapter' | 'section') => void;
  verificationLanguage: 'en' | 'es' | 'fr';
}

export const SectionsTab: React.FC<SectionsTabProps> = ({
  isLoading,
  filteredSections,
  chapters,
  handleEditTranslation,
  verificationLanguage
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
      </div>
    );
  }

  // Sort sections by chapter title and then by section title
  const sortedSections = [...filteredSections].sort((a, b) => {
    const chapterA = chapters.find(c => c.id === a.chapter_id);
    const chapterB = chapters.find(c => c.id === b.chapter_id);
    
    // First sort by chapter title
    if (chapterA && chapterB) {
      if (chapterA.title < chapterB.title) return -1;
      if (chapterA.title > chapterB.title) return 1;
    }
    
    // Then sort by section title
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      <div className="mb-2">
        <p className="text-white text-sm">
          Found {filteredSections.length} sections across {chapters.length} chapters
        </p>
      </div>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="border-warcrow-gold/20">
              <TableHead className="text-warcrow-gold/80">Chapter</TableHead>
              <TableHead className="text-warcrow-gold/80">Section Title (EN)</TableHead>
              <TableHead className="text-warcrow-gold/80">
                {verificationLanguage === 'es' ? 'Spanish Title' : verificationLanguage === 'fr' ? 'French Title' : 'English Title'}
              </TableHead>
              <TableHead className="text-warcrow-gold/80">Content</TableHead>
              <TableHead className="text-warcrow-gold/80">Status</TableHead>
              <TableHead className="text-warcrow-gold/80">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSections.length > 0 ? (
              sortedSections.map((section) => {
                const chapterTitle = chapters.find(c => c.id === section.chapter_id)?.title || 'Unknown';
                
                // Get the appropriate title and content based on verification language
                const translatedTitle = verificationLanguage === 'es' 
                  ? section.title_es 
                  : verificationLanguage === 'fr' 
                    ? section.title_fr 
                    : null;
                
                const translatedContent = verificationLanguage === 'es' 
                  ? section.content_es 
                  : verificationLanguage === 'fr' 
                    ? section.content_fr 
                    : null;
                
                const hasTranslatedTitle = translatedTitle !== null && translatedTitle !== undefined;
                const hasTranslatedContent = translatedContent !== null && translatedContent !== undefined;
                
                return (
                  <TableRow key={section.id} className="border-warcrow-gold/20">
                    <TableCell className="text-white">{chapterTitle}</TableCell>
                    <TableCell className="font-medium text-warcrow-gold">{section.title}</TableCell>
                    <TableCell className={`${hasTranslatedTitle ? 'text-white' : 'text-red-500 italic'}`}>
                      {hasTranslatedTitle ? translatedTitle : "Missing translation"}
                    </TableCell>
                    <TableCell>
                      {hasTranslatedContent ? (
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
                  <p className="text-white">No sections found matching search criteria</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};
