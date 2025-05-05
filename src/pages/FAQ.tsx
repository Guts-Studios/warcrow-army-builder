
import React, { useState } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { FAQItem } from '@/components/faq/FAQItem';
import { Container } from '@/components/ui/custom';
import { ScrollToTopButton } from "@/components/rules/ScrollToTopButton";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Using the translated FAQ questions and answers
  const faqs = [
    {
      question: t('faq_skill_properties'),
      answer: t('faq_skill_properties_answer'),
    },
    {
      question: t('faq_permanent'),
      answer: t('faq_permanent_answer'),
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
      question: t('faq_slowed'),
      answer: t('faq_slowed_answer'),
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
    // New FAQ items
    {
      question: t('faq_face_to_face'),
      answer: t('faq_face_to_face_answer'),
    },
    {
      question: t('faq_repeat_die'),
      answer: t('faq_repeat_die_answer'),
    },
    {
      question: t('faq_engage'),
      answer: t('faq_engage_answer'),
    },
    {
      question: t('faq_lose_combat'),
      answer: t('faq_lose_combat_answer'),
    },
    {
      question: t('faq_modifiers'),
      answer: t('faq_modifiers_answer'),
    },
    {
      question: t('faq_positioning'),
      answer: t('faq_positioning_answer'),
    },
    {
      question: t('faq_remove_troops'),
      answer: t('faq_remove_troops_answer'),
    },
    {
      question: t('faq_switches'),
      answer: t('faq_switches_answer'),
    },
    {
      question: t('faq_hostile_unit'),
      answer: t('faq_hostile_unit_answer'),
    },
    {
      question: t('faq_hold_shoot'),
      answer: t('faq_hold_shoot_answer'),
    },
    {
      question: t('faq_ranged_attack'),
      answer: t('faq_ranged_attack_answer'),
    },
    {
      question: t('faq_join_unit'),
      answer: t('faq_join_unit_answer'),
    },
    {
      question: t('faq_abandon_unit'),
      answer: t('faq_abandon_unit_answer'),
    },
    {
      question: t('faq_objective_control'),
      answer: t('faq_objective_control_answer'),
    },
    {
      question: t('faq_command_skills'),
      answer: t('faq_command_skills_answer'),
    },
    {
      question: t('faq_disarmed'),
      answer: t('faq_disarmed_answer'),
    },
    {
      question: t('faq_frightened'),
      answer: t('faq_frightened_answer'),
    },
    {
      question: t('faq_traps'),
      answer: t('faq_traps_answer'),
    },
    {
      question: t('faq_rugged'),
      answer: t('faq_rugged_answer'),
    },
    {
      question: t('faq_war_surgeon'),
      answer: t('faq_war_surgeon_answer'),
    },
    {
      question: t('faq_lady_telia'),
      answer: t('faq_lady_telia_answer'),
    },
    {
      question: t('faq_pioneers'),
      answer: t('faq_pioneers_answer'),
    },
    {
      question: t('faq_bulwarks'),
      answer: t('faq_bulwarks_answer'),
    },
    {
      question: t('faq_trabor'),
      answer: t('faq_trabor_answer'),
    },
    {
      question: t('faq_evoker'),
      answer: t('faq_evoker_answer'),
    },
    {
      question: t('faq_dice_symbols'),
      answer: t('faq_dice_symbols_answer'),
    },
    {
      question: t('faq_pass'),
      answer: t('faq_pass_answer'),
    },
    {
      question: t('faq_report_errors'),
      answer: t('faq_report_errors_answer'),
    },
  ];

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {/* Search bar */}
          <div className="mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 bg-warcrow-background/50 border border-warcrow-gold/30 rounded text-warcrow-text placeholder-warcrow-text/50 focus:outline-none focus:ring-2 focus:ring-warcrow-gold/50"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-warcrow-gold/50" />
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-warcrow-gold/70">
                {filteredFaqs.length === 0 
                  ? t('noResults')
                  : `${filteredFaqs.length} ${filteredFaqs.length === 1 ? 'result' : 'results'} found`
                }
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-6">
            {filteredFaqs.map((faq, index) => (
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
