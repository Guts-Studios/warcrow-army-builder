
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
  
  // Rules sections with their content
  const sections = [
    {
      section: "Permanent",
      content: "Passive skills and command skills with the Permanent property apply their effects even if the unit is not present on the battlefield; whether it is off the table due to Ambusher or Scout, after it has been destroyed, or, in the case of a Character, after they join a unit (even if the skill is not present in their unit game profile).\n\nScout or Ambusher units with a Permanent ability, which are outside the battlefield, can decide to apply it (revealing its existence to the opponent) or not to do so (and remain hidden).",
    },
    {
      section: "Line of Sight (LoS)",
      content: "[...] When calculating LoS, keep in mind that:\n\nA troop always has LOS towards itself and adjacent troops.",
    },
    {
      section: "Move",
      content: "[...] Keep in mind that:\n\nYour unit can perform the move action and stand still.",
    },
    {
      section: "Push back the defeated unit",
      content: "[...] The winning unit shoves the defeated unit at a distance equal to the defeated unit's first MOV value. If the move cannot be fully completed (due to the defeated unit colliding with or engaging an enemy unit), the winning unit must choose a new direction that maximizes the distance between the two units.",
    },
    {
      section: "Demoralized unit",
      content: "If your unit is demoralized:\n\n \n- It cannot be activated in any way.\n\n \n- It cannot stress itself in any way and cannot reduce its stress.\n\n \n- It cannot control objectives (we consider its conquest value null).\n\n \n- If it participates in combat, it will always flee after the result. (See \"Melee Attack\").\n\n \n- It cannot activate their command abilities.",
    },
    {
      section: "Slowed",
      content: "Your unit can only use one of the two MOV values when performing the move and assault actions.",
    },
    {
      section: "Damage",
      content: "\"[...] When the total of tokens is equal to or greater than the value of your Wounds attribute (W), one of your troops will be taken out of combat. Immediately remove the model from the battlefield and remove from its game profile as many damage tokens as its W value\".\n\nWhen removing troops from a unit engaged in combat, you may not remove troops that cause your unit to no longer be engaged with the unit that has inflicted damage. If necessary, exchange the leading unit with another troop of the unit before removing it.",
    },
    {
      section: "Elite",
      content: "Elite rules apply to WP rolls, attack (cc and ranged), defense, and the effects of skills and spells of the unit. They do not apply to tinge or spell-blocking rolls (including Dispel).",
    },
    {
      section: "Neutral units",
      content: "Neutral units are neither allies nor enemies of yours, so you cannot target them with your attacks, abilities, or spells unless they have the Hostile keyword. Hostile neutral units are enemies of all units of any faction, including other neutral units.",
    },
    {
      section: "Elite",
      content: "Can an Elite Spellcaster turn the 4 from the tinge roll to 3 to avoid receiving tinge?\n\nNo (read Updates).",
    },
    {
      section: "Cover",
      content: "Does a unit with the keyword Cover benefit from it, or only the adjacent units?\n\nOnly the adjacent units.",
    },
    {
      section: "Scout",
      content: "If a Scout unit deploys at the start of the game, can it move or attack?\nNo, if it deploys at the start of the game it simply sets up on the battlefield following its special deployment conditions.\n\n\nCan I perform a non-move action when I activate and deploy with my Scout unit?\nYes. When you deploy as Scout once the game has started, you may perform a single simple action (activating a skill, casting a spell, etc.).",
    },
    {
      section: "Scout / Ambusher",
      content: "If during deployment you already have a unit on the battlefield and you decide to deploy a Character with the keyword Scout to lead the unit, do you get to take advantage of the Scout rule to re-deploy the Hunters at the end of the deployment phase?\n\nNo, if a unit is already deployed it cannot be redeployed. If you want to join a Character to a unit (so that it gains the keyword Scout/Ambusher by effect of a skill), leave both off the battlefield and place the Character's profile card under the unit's. When the unit deploys, the Character must deploy as part of it.",
    },
    {
      section: "Round, turns and activations",
      content: "What happens when it is my turn and I don't have units on the battlefield (for example, they are Scout or Ambusher)?\nYou can pass or activate one of your Scout or Ambusher units.\n\nWhat happens if in the middle of a round a company runs out of units on the table (is it scored at the end of the round? Or is it cut off there as is?)\nIt is scored at the end of the round. You will have to pass until it ends.\n\nIn case the effects of different skills, passive skills, command skills, or spells occur simultaneously, which one is applied first?\nThe player with the initiative decides.",
    },
    {
      section: "Pass",
      content: "It's your activation and you don't have any units you can legally activate. What do you do?\nIn this case you must pass.",
    },
    {
      section: "Movement",
      content: "Can a unit end its movement adjacent to a friendly unit?\nYes (see errata).\n\nDo allied units block movement? Can you traverse allied units?\nAllied units do not block movement (see errata).\n\nCan the unit leader move through the other models of their own unit?\nYes.",
    },
    {
      section: "Charge",
      content: "There seem to be no restrictions on Charge movement, as long as your leader ends up engaged with the enemy unit. Am I allowed to not engage the closest enemy model at first? Am I allowed to not take the shortest path?\nYes, you can.\n\nIs a unit allowed to engage in combat with multiple enemy units when it performs a charge or an assault, either by the leader's movement or as a result of positioning maneuvers?\nNo. You must choose a single target when you charge or assault.",
    },
    {
      section: "Control of objectives",
      content: "Is the control of objectives within 3 strides checked from any model of the unit, or the leader?\nAlways from the leader.\n\n Remember: Control of an objective is only checked when a unit ends its activation within 3 steps of it.",
    },
    {
      section: "Stress and morale",
      content: "Can I shoot into melee to stress my own unit?\nYes.\n\nCan I stress during an activation if I know that the stress from said activation will put me over the threshold?\nYes, if you are under your MOR value.",
    },
    {
      section: "Face to face roll",
      content: "If during a face to face roll in combat one of the units disengages (for example, due to a switch), do we continue resolving the roll?\n\nYes, you must resolve the face to face roll even though both units disengage during any of the steps.",
    },
    {
      section: "Repeat a die or a roll",
      content: "What happens if I can repeat a die or a roll and my opponent has a skill that forces me to repeat as well? Do I repeat first?\n\nYes. You resolve all your repetitions first (in the order you want) and then resolve the effects indicated by the skills of your opponent.",
    },
    {
      section: "Engage",
      content: "Skills like Tundra Marauder's Snow Leopard Tattoo allow you to Displace (X) and engage with enemy units. If the leader of my unit cannot reach the enemy, can I engage with any other troop of the unit?\n\nNo, to engage you need your leader to come in contact with any troop of the enemy unit.",
    },
    {
      section: "Lose a combat",
      content: "Yes. You'd lose the combat and therefore suffer 1 stress. However, you can benefit from the extra movement for destroying a unit.",
    },
    {
      section: "Modifiers",
      content: "What happens if a unit has a modifier and so does the Character who joined it? Do I stress for each of the modifiers?\n\nYes, if you want to activate different modifiers, you must stress for each one of them separately.",
    },
    {
      section: "Push back the defeated unit",
      content: "Who decides the direction for the push back?\nSee Updates. Push back the defeated unit.\n\nIf units are no longer in base-to-base contact when casualties are removed, can the losing unit still be rejected?\nThis situation should not occur (see Updates).",
    },
    {
      section: "Positioning maneuvres",
      content: "If after finishing a combat only the leaders remain and they are distanced, do we have to perform the positioning maneuvres?\nThis situation should not occur (see Updates).\n\nDuring positioning maneuvres, is there a maximum distance the models can displace to be engaged again with the enemy?\nNo.",
    },
    {
      section: "Remove eliminated troops",
      content: "Who decides which miniatures are removed when there are casualties?\n\nThe owner of the miniatures that suffer the damage.",
    },
    {
      section: "Switches",
      content: "If I eliminate a unit with the switches, do we continue the combat?\nYes, it resolves all the combat steps indicated in the rules.\n\nHow does Displace work as a defensive switch? Do you get to move away before the damage is allocated?\nYou move before the damage is distributed, but despite you displacing or placing yourself and, thus, disengaging, the combat continues and resolves until the end. Displacement and placement switches do not prevent you from receiving damage.",
    },
    {
      section: "Ranged attack a Hostile unit",
      content: "If the Hostile unit is engaged with an enemy unit, does this unit suffer stress if I attack the Hostile unit with a ranged attack?\nYes",
    },
    {
      section: "\"Hold and shoot\". Loss of troops in a unit with an Officer",
      content: "What happens if a unit with a joined Officer loses all of its troops due to the \"Hold and shoot\" of the target the unit was charging?\n\nThe Character must use their MOV to charge. Should they not be able to move to engage, the action ends immediately.",
    },
    {
      section: "\"Hold and shoot\". Timing",
      content: "When can a unit \"Hold and shoot\"? Can I wait until I am engaged to benefit from bonuses or skills?\n\nOne of the conditions to be able to shoot (and that includes \"Hold and shoot\") is not being engaged. Thus, you must choose a moment in which you are not engaged with the charging unit.",
    },
    {
      section: "\"Hold and shoot\". Skills",
      content: "\"Hold and shoot\" rules don't allow the use of switches. Can a unit that uses Hold and shoot benefit from passive skills related to ranged attacks?\n\nYes.",
    },
    {
      section: "Ranged attack. Skills",
      content: "If, as part of the effects of a skill, I perform or resolve a ranged attack, can I activate the switches of my unit's ranged attack?\n\nIf the skill specifies a value for the ranged attack, you cannot use your unit's ranged attack switches. If it only states to make a ranged attack, you will have to use the ranged attack roll and, therefore, have its switches accessible.",
    },
    {
      section: "Join a unit",
      content: "If my Character joins a unit that has not activated during the round and we get to the \"No one gets left behind\" step, can they move since the Character removes their activation token when joining?\nYes.\n\nWhat happens if a Character with a ranged attack bonus on the joined profile joins a unit without a ranged attack?\nSince the unit itself cannot perform a ranged attack, that bonus is not applied.\n\nA Character who joined a unit is considered a unit inside a unit?\nNo. A Character who joined a unit, be it Support or Officer, is considered a member of the unit and not an independent unit.\n\nA Support Character inside a unit has a bonus skill that affects a target within X strides. Do we measure from the Character or the leader?\nThe Character is inside a unit, so all measurements must be made from the leader of said unit.",
    },
    {
      section: "Abandon a unit",
      content: "When a Character leaves a unit, does the unit also receive an activation token?\nNo.\n\nCan a Character leaving their unit move through friendly troops that are part of the unit they are leaving?\nYes (see errata. Move)",
    },
    {
      section: "Objective control",
      content: "Can a demoralized unit within 3 strides of an objective control it or fight to control it?\n\nNo. Demoralized units should not be considered for objective control (treat them as if they were not on the battlefield).",
    },
    {
      section: "Command skills",
      content: "Can I use a command skill from a demoralized unit?\nNo (see Updates).",
    },
    {
      section: "Disarmed and Vulnerable",
      content: "Can the disarmed and vulnerable state effects be applied during the activation in which they are given to a unit?\n\nThe states disarmed and vulnerable apply after rolling the dice and before the switches.",
    },
    {
      section: "Slowed",
      content: "A unit with the slowed state applies its effects during the \"No one gets left behind\" step?\nYes, if it decides to move since the unit is performing a movement. In this case, the unit uses its first MOV value.\n\nIf a demoralized unit with the slowed state flees, does it apply the effects of the state?\nNo, since fleeing is not a movement action.\n\nWhat happens if a unit with the slowed state performs a charge?\nYou must subtract 4 strides from your charge movement and will remove the status at the end of your activation.",
    },
    {
      section: "Frightened",
      content: "What happens when a unit has a skill that allows it to repeat its failed WP tests and then suffers the frightener state?\n\nThe state must be applied whenever applicable. In this case, if the first roll is successful, repeat for frightened and you can use your ability to repeat later. If the first roll is unsuccessful: repeat for the skill and in case of success, repeat for frightened.",
    },
    {
      section: "Magic",
      content: "Can a Spellcaster have more than one spell with duration active at the same time?\nYes. Do not confuse active spells with spells with duration.\n\nHow should spells that resolve as \"ranged attacks\" be treated? Do allies engaged with targets get stressed? Can you activate changes to your ranged attacks?\nThe action \"Cast a spell\" can allow the unit to perform a ranged attack. These attacks must follow the usual rules for ranged attacks.\nRanged attack switches are associated to their roll, that is why if a spell allows the unit to \"perform a ranged attack\" it will be able to use its switched, while if a specific ranged attack is specified (indicating its roll) the ranged attack switches of the profile, in case it has them, will not be able to be used.",
    },
    {
      section: "Dispel",
      content: "When a non-Spellcaster unit attempts to block a spell using the Dispel keyword (eg, Alborc's \"Sword of the Sun\" passive ability), does it gain stress?\nNo, the unit does not suffer stress.\n\nCan I Dispel and block a spell with a spellcaster at the same time?\nDispel is a keyword that enables your unit to block a spell as if you were a Spellcaster. Should you have both options, you must choose one. From the rulebook: Remember that you cannot attempt to block a spell more than once or with more than one unit.",
    },
    {
      section: "Tinge",
      content: "Do we roll for all tinged units at the beginning of the round to check the effects of the tinge?\n\nAt the beginning of the round, you must check the effects of the tinge with each of your units affected by it, and you must do it separately. I.e., if there are 3 units in your company with tinge tokens (Frostfire Herald, Bucklermen and Marhael), you must roll 3 times and apply the corresponding effects separately.",
    },
    {
      section: "Traps",
      content: "What if two Traps activate at the same time?\n\nThe player with the initiative decides the order of activation of the Traps.",
    },
    {
      section: "Rugged",
      content: "Does Rugged without any type indicated work against every kind of unit?\n\nFrom the rulebook: If no 'X' value is specified, the effect applies to all units.",
    },
    {
      section: "War Surgeon",
      content: "Are wounds dealt from switches in combat each counted as a separate instance of damage for the purpose of \"Medic!\"? Or is \"Medic!\" resolved at the end of combat, against all incoming damage at once?\n\nYou should roll \"Medic!\" every time the unit is about to suffer damage, first during the switches step (all damage from switches should be added into one total), and then at the resolution.",
    },
    {
      section: "Lady Télia",
      content: "If Lady Télia performs her \"Headshot\" skill against an Elite Character inside a unit without Elite, can this Character apply Elite to their defense roll?\nYes, since they are using their own profile and not the unit's.\n\nHow does defending against Lady Télia's \"Headshot\" work when she targets a Character attached to a unit?\nThe Character should defend from Télia using their profile defense value, as if they were alone and not joined to a unit (therefore including automatic symbols should they have any).",
    },
    {
      section: "Pioneers",
      content: "If the Pioneers use their \"Mortar\" skill, and Lady Télia has joined the unit, do they add her auto SUCCESS to that roll, or is the symbol only added to their standard ranged attack?\nThe skill specifies how to create the roll depending on the number of troops, so the automatic SUCCESS from Télia is not added.\n\nThe rule \"Trench yourselves!\" has two bonuses. Do they obtain both as long as they have not activated? Or do they obtain the first if they don't activate and the second is always there, even if you activated?\nThey are two separate effects, the first one has the condition of non-activation and the second one always applies.",
    },
    {
      section: "Bulwarks",
      content: "Can I taunt a unit already engaged in combat?\n\nNo, since charging is not an action a unit can perform while being engaged.",
    },
    {
      section: "Trabor",
      content: "When do the Automata move?\nAutomata use Trabor's MOV values and move only when Trabor does. The second person in the Automata chart refers exclusively to Trabor.\n\nAre Automata a unit? Do they need to maintain a formation when deployed?\nAutomata are Trabor's tokens from Warcrow Adventures expansion pack: Deathclaws of the Dream. Automata are not considered a unit of 3 troops, therefore they do not need to stay in formation.",
    },
    {
      section: "Evoker",
      content: "What happens if a unit under the effects of Spirit of the Thermapleurus and the second alteration charges against an enemy unit and suffers stress due to Intimidating? Does the target of the charge flee and the charging unit loses the charge?\nYes.\n\nHow does the second alteration of the spell Summon the rock work?\nThe spell has a single target. The alteration grants it the property Remains active to the effect: at the beginning of its activation, the target of the spell and all the units within 5 strides of it suffer the slowed state. If the target of the spell never activates, nobody ever gets slowed.",
    },
    {
      section: "Dice and symbols",
      content: "",
    },
  ];

  // Filter sections based on search query
  const filteredSections = sections.filter(item => 
    item.section.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={t('rulesReference') || "Rules Reference"}>
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
                {filteredSections.length === 0 
                  ? t('noResults')
                  : `${filteredSections.length} ${filteredSections.length === 1 ? 'result' : 'results'} found`
                }
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-6">
            {filteredSections.map((section, index) => (
              <FAQItem 
                key={index} 
                section={section.section} 
                content={section.content} 
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
