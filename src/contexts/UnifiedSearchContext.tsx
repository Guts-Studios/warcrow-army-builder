
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchFAQSections } from "@/services/faqService";
import { useRules } from "@/hooks/useRules";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResultItem {
  id: string;
  title: string;
  content: string;
  source: "rules" | "faq";
  path: string;
}

interface UnifiedSearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: SearchResultItem[];
  isSearching: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchInRules: () => void;
  searchInFAQ: () => void;
  performUnifiedSearch: (term: string) => Promise<void>;
}

const UnifiedSearchContext = createContext<UnifiedSearchContextType | undefined>(undefined);

export const UnifiedSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("rules");
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { data: rulesData } = useRules();

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname === "/faq") {
      setActiveTab("faq");
    } else if (location.pathname === "/rules") {
      setActiveTab("rules");
    }
  }, [location.pathname]);

  // Perform search when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      performUnifiedSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, language]);

  const searchInRules = () => {
    if (activeTab !== "rules") {
      navigate("/rules", { state: { searchTerm } });
    }
  };

  const searchInFAQ = () => {
    if (activeTab !== "faq") {
      navigate("/faq", { state: { searchTerm } });
    }
  };

  const performUnifiedSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setIsSearching(true);
    const results: SearchResultItem[] = [];

    try {
      // Search in FAQ
      const faqData = await fetchFAQSections(language);
      const faqResults = faqData.filter(item => 
        item.section.toLowerCase().includes(term.toLowerCase()) || 
        item.content.toLowerCase().includes(term.toLowerCase())
      ).map(item => ({
        id: item.id,
        title: item.section,
        content: item.content,
        source: "faq" as const,
        path: "/faq"
      }));
      
      results.push(...faqResults);

      // Search in Rules
      if (rulesData) {
        const rulesResults: SearchResultItem[] = [];
        
        // Helper function to recursively search through rules sections
        const searchInSections = (sections: any[], path: string = "/rules") => {
          sections.forEach(section => {
            const sectionTitle = section.title || "";
            const sectionContent = section.content || "";
            
            if (sectionTitle.toLowerCase().includes(term.toLowerCase()) || 
                sectionContent.toLowerCase().includes(term.toLowerCase())) {
              rulesResults.push({
                id: section.id || `rules-${rulesResults.length}`,
                title: sectionTitle,
                content: sectionContent,
                source: "rules" as const,
                path
              });
            }
            
            // Search in subsections
            if (section.sections && section.sections.length > 0) {
              searchInSections(section.sections, path);
            }
          });
        };
        
        rulesData.forEach(chapter => {
          if (chapter.sections) {
            searchInSections(chapter.sections);
          }
        });
        
        results.push(...rulesResults);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error performing unified search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <UnifiedSearchContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      searchResults,
      isSearching,
      activeTab,
      setActiveTab,
      searchInRules,
      searchInFAQ,
      performUnifiedSearch
    }}>
      {children}
    </UnifiedSearchContext.Provider>
  );
};

export const useUnifiedSearch = () => {
  const context = useContext(UnifiedSearchContext);
  if (!context) {
    throw new Error("useUnifiedSearch must be used within a UnifiedSearchProvider");
  }
  return context;
};
