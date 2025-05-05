
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
  
  const faqs = [
    {
      question: 'What are skill properties?',
      answer: 'Skill properties define the special characteristics and effects of a skill. They determine how a skill interacts with other game elements and can influence outcomes during gameplay.',
    },
    {
      question: 'How does Line of Sight (LoS) work?',
      answer: 'Line of Sight determines whether a unit can see another unit or target. It is calculated based on the positions of the units and any obstacles between them.',
    },
    {
      question: 'What is the move action?',
      answer: 'The move action allows a unit to change its position on the battlefield. The distance and direction are determined by the unit\'s movement capabilities and any terrain effects.',
    },
    {
      question: 'How do I push back a defeated unit?',
      answer: 'When a unit is defeated, certain effects or abilities may allow you to push it back. This involves moving the unit a specified distance away from its current position, following the game\'s movement rules.',
    },
    {
      question: 'What happens to a demoralized unit?',
      answer: 'A demoralized unit suffers penalties to its actions and may have reduced effectiveness in combat. Specific rules govern how a unit becomes demoralized and how it can recover.',
    },
    {
      question: 'What are states in the game?',
      answer: 'States represent various conditions that can affect units, such as being stunned, poisoned, or enraged. Each state has specific effects and durations as outlined in the game rules.',
    },
    {
      question: 'How is damage calculated?',
      answer: 'Damage is calculated based on the attacking unit\'s strength, the defending unit\'s defenses, and any modifiers from skills or equipment. The resulting value reduces the target\'s health accordingly.',
    },
    {
      question: 'What defines an elite unit?',
      answer: 'Elite units are distinguished by superior stats, abilities, or roles within the game. They often have unique skills and can significantly impact the outcome of battles.',
    },
    {
      question: 'What are neutral units?',
      answer: 'Neutral units are entities on the battlefield that are not controlled by any player. They may have their own behaviors and can interact with player-controlled units in various ways.',
    },
    {
      question: 'Where can I report typos or errors?',
      answer: 'If you encounter any typos or errors in the game materials, please reach out to the support team through the official contact channels provided on the Warcrow website.',
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
          <p className="mb-8 text-warcrow-text/80 text-lg">
            Welcome, traveler! If your path in Warcrow has brought you to a crossroads and you don't know how to continue, this is the place to find answers.
          </p>
          
          <div className="mt-10 space-y-6">
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
