import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ChapterData, SectionData, TranslationStatus, EditingItem } from './types';

export const useRulesVerifier = () => {
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus[]>([]);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
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
      
      console.log("Fetched chapters data:", chaptersData);
      
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
      
      // Fix: Count sections for each chapter and check if all translations are complete
      const chaptersWithCount = chaptersData.map(chapter => {
        const chapterSections = sectionsData.filter(
          section => section.chapter_id === chapter.id
        );
        
        const sectionCount = chapterSections.length;
        
        // Check if chapter title is translated
        const chapterTitleTranslated = Boolean(chapter.title_es && chapter.title_es.trim() !== '');
        
        // Chapter is complete if its title is translated and it has no sections,
        // or if it has sections, then all sections must have their titles and content translated
        const allSectionsTranslated = chapterSections.length === 0 || 
          chapterSections.every(section => 
            Boolean(section.title_es && section.title_es.trim() !== '') && 
            Boolean(section.content_es && section.content_es.trim() !== '')
          );
        
        return {
          ...chapter,
          sectionCount,
          translationComplete: chapterTitleTranslated && allSectionsTranslated
        };
      });
      
      // Fix: Add proper translation status to sections
      const sectionsWithTranslation = sectionsData.map(section => {
        return {
          ...section,
          translationComplete: Boolean(section.title_es && section.title_es.trim() !== '') && 
                              Boolean(section.content_es && section.content_es.trim() !== '')
        };
      });
      
      setTranslationStatus(translationData || []);
      setChapters(chaptersWithCount);
      setSections(sectionsWithTranslation);
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
      chapterCompletionRate: Math.round((chaptersWithTitle / (chapterStatus.length || 1)) * 100),
      sectionTitleCompletionRate: Math.round((sectionsWithTitle / (sectionStatus.length || 1)) * 100),
      sectionContentCompletionRate: Math.round((sectionsWithContent / (sectionStatus.length || 1)) * 100)
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
        console.log("Sending update to database for chapter:", {
          id: editingItem.id,
          title: editingItem.title, // Update English title
          title_es: editingItem.title_es
        });
        
        // Fetch the current chapter data to get all required fields
        const { data: currentChapter, error: fetchError } = await supabase
          .from('rules_chapters')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching current chapter data:", fetchError);
          throw fetchError;
        }
        
        // Combine the current data with our updates
        const updateData = {
          id: editingItem.id,
          title: editingItem.title, // Update English title
          order_index: currentChapter.order_index,
          title_es: editingItem.title_es,
          updated_at: new Date().toISOString()
        };
        
        console.log("Full update data for chapter:", updateData);
        
        // Now perform the upsert with all required fields
        const { data, error } = await supabase
          .from('rules_chapters')
          .upsert(updateData)
          .select();
          
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        console.log("Update response data:", data);
        
        // Double-check the update with a separate query
        const { data: verifyData, error: verifyError } = await supabase
          .from('rules_chapters')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (verifyError) {
          console.error("Verification error:", verifyError);
        } else {
          console.log("Verified database state after update:", verifyData);
          // Update local state with the verified data
          setChapters(prevChapters => 
            prevChapters.map(chapter => 
              chapter.id === editingItem.id ? 
                {
                  ...chapter, 
                  title: verifyData.title, // Update English title in state
                  title_es: verifyData.title_es,
                  translationComplete: Boolean(verifyData.title_es && verifyData.title_es.trim() !== '') && chapter.translationComplete
                } : 
                chapter
            )
          );
          
          if (!verifyData.title_es) {
            console.warn("WARNING: title_es is still null after update!");
            toast.error("Database update failed - please try again");
          } else {
            console.log("SUCCESS: title_es was updated to:", verifyData.title_es);
            toast.success('Chapter updated successfully');
          }
        }
      } else {
        // Section updates
        console.log("Sending update to database for section:", {
          id: editingItem.id,
          title: editingItem.title, 
          title_es: editingItem.title_es,
          content: editingItem.content?.substring(0, 50) + "...", // Log preview of content
          content_es: editingItem.content_es?.substring(0, 50) + "..." // Log preview of content
        });
        
        // Fetch the current section data to get all required fields
        const { data: currentSection, error: fetchError } = await supabase
          .from('rules_sections')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (fetchError) {
          console.error("Error fetching current section data:", fetchError);
          throw fetchError;
        }
        
        // Combine the current data with our updates
        const updateData = {
          id: editingItem.id,
          chapter_id: currentSection.chapter_id,
          title: editingItem.title, // Update English title
          content: editingItem.content, // Update English content
          order_index: currentSection.order_index,
          title_es: editingItem.title_es,
          content_es: editingItem.content_es,
          updated_at: new Date().toISOString()
        };
        
        console.log("Full update data for section:", updateData);
        
        // Now perform the upsert with all required fields
        const { data, error } = await supabase
          .from('rules_sections')
          .upsert(updateData)
          .select();
          
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        console.log("Update response data:", data);
        
        // Double-check the update with a separate query
        const { data: verifyData, error: verifyError } = await supabase
          .from('rules_sections')
          .select('*')
          .eq('id', editingItem.id)
          .single();
          
        if (verifyError) {
          console.error("Verification error:", verifyError);
        } else {
          console.log("Verified database state after update:", verifyData);
          // Update local state with the verified data
          setSections(prevSections => 
            prevSections.map(section => 
              section.id === editingItem.id ? 
                {
                  ...section, 
                  title: verifyData.title, // Update English title in state
                  content: verifyData.content, // Update English content in state
                  title_es: verifyData.title_es, 
                  content_es: verifyData.content_es,
                  translationComplete: Boolean(verifyData.title_es && verifyData.title_es.trim() !== '') && 
                                     Boolean(verifyData.content_es && verifyData.content_es.trim() !== '')
                } : 
                section
            )
          );
          
          if (!verifyData.title_es) {
            console.warn("WARNING: title_es is still null after update!");
            toast.error("Database update failed - please try again");
          } else {
            console.log("SUCCESS: title_es was updated to:", verifyData.title_es);
            toast.success('Section updated successfully');
          }
        }
      }
      
      // Close the dialog after successful save
      setTranslationEditDialogOpen(false);
      
      // Force a full refetch to ensure all data is synchronized
      setTimeout(() => {
        console.log("Performing full data refetch after save");
        fetchRulesData();
      }, 500);
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
      setTranslationStatus(data || []);
      toast.success('Translation verification completed');
    } catch (error: any) {
      console.error('Error running verification:', error);
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Computed values based on state
  const missingTranslations = sections.filter(section => 
    !section.translationComplete && (
      !section.title_es || section.title_es.trim() === '' || 
      !section.content_es || section.content_es.trim() === ''
    )
  );
  
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

  return {
    chapters,
    sections,
    isLoading,
    translationStatus,
    editingItem,
    setEditingItem,
    translationEditDialogOpen,
    setTranslationEditDialogOpen,
    searchQuery,
    setSearchQuery,
    saveInProgress,
    missingTranslations,
    filteredSections,
    filteredChapters,
    stats,
    fetchRulesData,
    handleEditTranslation,
    saveTranslation,
    runVerification
  };
};
