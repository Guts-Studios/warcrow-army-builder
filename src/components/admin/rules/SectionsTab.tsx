
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
}

export const SectionsTab: React.FC<SectionsTabProps> = ({
  isLoading,
  filteredSections,
  chapters,
  handleEditTranslation,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-warcrow-gold" />
      </div>
    );
  }

  return (
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
  );
};
