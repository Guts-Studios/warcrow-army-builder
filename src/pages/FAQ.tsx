
import React from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { FAQItem } from '@/components/faq/FAQItem';
import { Container } from '@/components/ui/custom';
import { ScrollToTopButton } from "@/components/rules/ScrollToTopButton";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Using the translated FAQ questions and answers
  const faqs = [
    {
      question: t('faq_skill_properties'),
      answer: t('faq_skill_properties_answer'),
    },
    {
      question: t('faq_line_of_sight'),
      answer: t('faq_line_of_sight_answer'),
    },
    {
      question: t('faq_move_action'),
      answer: t('faq_move_action_answer'),
    },
    {
      question: t('faq_push_back'),
      answer: t('faq_push_back_answer'),
    },
    {
      question: t('faq_demoralized'),
      answer: t('faq_demoralized_answer'),
    },
    {
      question: t('faq_states'),
      answer: t('faq_states_answer'),
    },
    {
      question: t('faq_damage'),
      answer: t('faq_damage_answer'),
    },
    {
      question: t('faq_elite'),
      answer: t('faq_elite_answer'),
    },
    {
      question: t('faq_neutral'),
      answer: t('faq_neutral_answer'),
    },
    {
      question: t('faq_report_errors'),
      answer: t('faq_report_errors_answer'),
    },
    {
      question: t('faq_permanent'),
      answer: t('faq_permanent_answer'),
    },
    {
      question: t('faq_slowed'),
      answer: t('faq_slowed_answer'),
    },
    {
      question: t('faq_cover'),
      answer: t('faq_cover_answer'),
    },
    {
      question: t('faq_scout'),
      answer: t('faq_scout_answer'),
    },
    {
      question: t('faq_rounds'),
      answer: t('faq_rounds_answer'),
    },
    {
      question: t('faq_movement'),
      answer: t('faq_movement_answer'),
    },
    {
      question: t('faq_charge'),
      answer: t('faq_charge_answer'),
    },
    {
      question: t('faq_objectives'),
      answer: t('faq_objectives_answer'),
    },
    {
      question: t('faq_stress'),
      answer: t('faq_stress_answer'),
    },
    {
      question: t('faq_magic'),
      answer: t('faq_magic_answer'),
    },
    {
      question: t('faq_tinge'),
      answer: t('faq_tinge_answer'),
    },
  ];

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={t('faqTitle') || "Frequently Asked Questions"}>
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
          <div className="mt-6 space-y-6">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </div>
        </div>
      </Container>
      <ScrollToTopButton />
    </div>
  );
};

export default FAQ;
