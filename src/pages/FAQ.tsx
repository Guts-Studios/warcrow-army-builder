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
      answer: 'Line of Sight determines whether a unit can see another unit or target. It is calculated based on the positions of the units and any obstacles between them. When calculating LoS, keep in mind that a troop always has LOS towards itself and adjacent troops.',
    },
    {
      question: 'What is the move action?',
      answer: 'The move action allows a unit to change its position on the battlefield. The distance and direction are determined by the unit\'s movement capabilities and any terrain effects. Keep in mind that your unit can perform the move action and stand still.',
    },
    {
      question: 'How do I push back a defeated unit?',
      answer: 'When a unit is defeated, certain effects or abilities may allow you to push it back. This involves moving the unit a specified distance away from its current position, following the game\'s movement rules. The winning unit shoves the defeated unit at a distance equal to the defeated unit\'s first MOV value. If the move cannot be fully completed (due to the defeated unit colliding with or engaging an enemy unit), the winning unit must choose a new direction that maximizes the distance between the two units.',
    },
    {
      question: 'What happens to a demoralized unit?',
      answer: 'A demoralized unit suffers penalties to its actions and may have reduced effectiveness in combat. If your unit is demoralized: It cannot be activated in any way. It cannot stress itself in any way and cannot reduce its stress. It cannot control objectives (we consider its conquest value null). If it participates in combat, it will always flee after the result. It cannot activate their command abilities.',
    },
    {
      question: 'What are states in the game?',
      answer: 'States represent various conditions that can affect units, such as being stunned, poisoned, or enraged. Each state has specific effects and durations as outlined in the game rules.',
    },
    {
      question: 'How is damage calculated?',
      answer: 'Damage is calculated based on the attacking unit\'s strength, the defending unit\'s defenses, and any modifiers from skills or equipment. When the total of tokens is equal to or greater than the value of your Wounds attribute (W), one of your troops will be taken out of combat. Immediately remove the model from the battlefield and remove from its game profile as many damage tokens as its W value. When removing troops from a unit engaged in combat, you may not remove troops that cause your unit to no longer be engaged with the unit that has inflicted damage. If necessary, exchange the leading unit with another troop of the unit before removing it.',
    },
    {
      question: 'What defines an elite unit?',
      answer: 'Elite units are distinguished by superior stats, abilities, or roles within the game. Elite rules apply to WP rolls, attack (cc and ranged), defense, and the effects of skills and spells of the unit. They do not apply to tinge or spell-blocking rolls (including Dispel). An Elite Spellcaster cannot turn the 4 from the tinge roll to 3 to avoid receiving tinge.',
    },
    {
      question: 'What are neutral units?',
      answer: 'Neutral units are entities on the battlefield that are not controlled by any player. Neutral units are neither allies nor enemies of yours, so you cannot target them with your attacks, abilities, or spells unless they have the Hostile keyword. Hostile neutral units are enemies of all units of any faction, including other neutral units.',
    },
    {
      question: 'Where can I report typos or errors?',
      answer: 'If you encounter any typos or errors in the game materials, please reach out to the support team through the official contact channels provided on the Warcrow website.',
    },
    {
      question: 'How do Permanent properties work?',
      answer: 'Passive skills and command skills with the Permanent property apply their effects even if the unit is not present on the battlefield; whether it is off the table due to Ambusher or Scout, after it has been destroyed, or, in the case of a Character, after they join a unit (even if the skill is not present in their unit game profile). Scout or Ambusher units with a Permanent ability, which are outside the battlefield, can decide to apply it (revealing its existence to the opponent) or not to do so (and remain hidden).',
    },
    {
      question: 'What is the Slowed state?',
      answer: 'Your unit can only use one of the two MOV values when performing the move and assault actions. A unit with the slowed state applies its effects during the "No one gets left behind" step. If a demoralized unit with the slowed state flees, it does not apply the effects of the state. If a unit with the slowed state performs a charge, you must subtract 4 strides from your charge movement and will remove the status at the end of your activation.',
    },
    {
      question: 'How does Cover work?',
      answer: 'Only the adjacent units benefit from Cover, not the unit with the keyword itself.',
    },
    {
      question: 'How does Scout deployment work?',
      answer: 'If a Scout unit deploys at the start of the game, it cannot move or attack. However, when you deploy as Scout once the game has started, you may perform a single simple action (activating a skill, casting a spell, etc.). If a unit is already deployed it cannot be redeployed. If you want to join a Character to a unit (so that it gains the keyword Scout/Ambusher by effect of a skill), leave both off the battlefield and place the Character\'s profile card under the unit\'s. When the unit deploys, the Character must deploy as part of it.',
    },
    {
      question: 'What happens with rounds, turns and activations?',
      answer: 'If you don\'t have units on the battlefield (for example, they are Scout or Ambusher), you can pass or activate one of your Scout or Ambusher units. If in the middle of a round a company runs out of units on the table, scoring happens at the end of the round. You will have to pass until it ends. In case the effects of different skills, passive skills, command skills, or spells occur simultaneously, the player with the initiative decides which one is applied first.',
    },
    {
      question: 'How does movement work with friendly units?',
      answer: 'A unit can end its movement adjacent to a friendly unit. Allied units do not block movement. The unit leader can move through the other models of their own unit.',
    },
    {
      question: 'How does Charge movement work?',
      answer: 'There are no restrictions on Charge movement, as long as your leader ends up engaged with the enemy unit. You are allowed to not engage the closest enemy model at first and you are allowed to not take the shortest path. However, a unit is not allowed to engage in combat with multiple enemy units when it performs a charge or an assault. You must choose a single target when you charge or assault.',
    },
    {
      question: 'How is control of objectives calculated?',
      answer: 'Control of an objective is always checked from the leader, not any model in the unit. Remember: Control of an objective is only checked when a unit ends its activation within 3 steps of it.',
    },
    {
      question: 'How does stress and morale work?',
      answer: 'You can shoot into melee to stress your own unit. You can stress during an activation if you know that the stress from said activation will put you over the threshold, as long as you are under your MOR value.',
    },
    {
      question: 'How do Magic and Dispel work?',
      answer: 'A Spellcaster can have more than one spell with duration active at the same time. Spells that resolve as "ranged attacks" follow the usual rules for ranged attacks. When a non-Spellcaster unit attempts to block a spell using the Dispel keyword, it does not suffer stress. You cannot Dispel and block a spell with a spellcaster at the same time - you must choose one method.',
    },
    {
      question: 'How does Tinge work?',
      answer: 'At the beginning of the round, you must check the effects of the tinge with each of your units affected by it, and you must do it separately. If there are multiple units in your company with tinge tokens, you must roll for each one and apply the corresponding effects separately.',
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
