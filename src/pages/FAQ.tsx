
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Container } from '@/components/ui/custom';
import { ScrollToTopButton } from "@/components/rules/ScrollToTopButton";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FAQList } from '@/components/faq/FAQList';
import { FAQSearch } from '@/components/faq/FAQSearch';
import { fetchFAQSections, FAQItem } from '@/services/faqService';

const FAQ = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [faqSections, setFaqSections] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadFAQSections = async () => {
      setLoading(true);
      try {
        const sections = await fetchFAQSections(language);
        setFaqSections(sections);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch FAQ sections:', err);
        setError('Failed to load FAQ data');
      } finally {
        setLoading(false);
      }
    };
    
    loadFAQSections();
  }, [language]);

  // Filter sections based on search query
  const filteredSections = faqSections.filter(item => 
    item.section.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={t('frequently_asked_questions') || "FAQ"}>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/')}
            className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-accent/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <LanguageSwitcher />
        </div>
      </PageHeader>
      
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search Component */}
          <FAQSearch 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            resultsCount={filteredSections.length}
          />
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-pulse text-warcrow-gold">{t('loading')}</div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : (
            <FAQList items={filteredSections} />
          )}
        </div>
      </Container>
      <ScrollToTopButton />
    </div>
  );
};

export default FAQ;
