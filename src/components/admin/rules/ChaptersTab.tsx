
import React from 'react';
import { AlertTriangle, Check, Edit, RefreshCw, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ChapterData } from './types';

interface ChaptersTabProps {
  isLoading: boolean;
  filteredChapters: ChapterData[];
  handleEditTranslation: (item: ChapterData, type: 'chapter' | 'section') => void;
}

export const ChaptersTab: React.FC<ChaptersTabProps> = ({
  isLoading,
  filteredChapters,
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
          Found {filteredChapters.length} chapters
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
  );
};
