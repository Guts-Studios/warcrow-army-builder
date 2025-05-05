
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface UnifiedSearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: number;
  setSearchResults: (count: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchInRules: () => void;
  searchInFAQ: () => void;
}

const UnifiedSearchContext = createContext<UnifiedSearchContextType | undefined>(undefined);

export const UnifiedSearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(0);
  const [activeTab, setActiveTab] = useState("rules");
  const navigate = useNavigate();
  const location = useLocation();

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname === "/faq") {
      setActiveTab("faq");
    } else if (location.pathname === "/rules") {
      setActiveTab("rules");
    }
  }, [location.pathname]);

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

  return (
    <UnifiedSearchContext.Provider value={{ 
      searchTerm, 
      setSearchTerm, 
      searchResults,
      setSearchResults,
      activeTab,
      setActiveTab,
      searchInRules,
      searchInFAQ
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
