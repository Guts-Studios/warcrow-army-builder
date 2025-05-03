
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export const useRules = () => {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("rules_chapters")
        .select("*")
        .order("order_index");

      if (chaptersError) throw chaptersError;

      const { data: sectionsData, error: sectionsError } = await supabase
        .from("rules_sections")
        .select("*")
        .order("order_index");

      if (sectionsError) throw sectionsError;

      // Find the basic concepts chapter and line of sight section
      const basicConceptsChapter = chaptersData.find(chapter => 
        chapter.title.toLowerCase().includes("basic concepts"));
      
      let lineOfSightSection = null;
      if (basicConceptsChapter) {
        lineOfSightSection = sectionsData.find(section => 
          section.chapter_id === basicConceptsChapter.id && 
          section.title.toLowerCase().includes("line of sight"));
      }
      
      // If we found the Line of Sight section, update its content with our custom formatted text
      if (lineOfSightSection) {
        lineOfSightSection.content = `${lineOfSightSection.content}\n\nWhen calculating LoS, keep in mind that:\n\nA troop always has LOS towards itself and adjacent troops.\n\n[[red]]When calculating the LoS to a unit, the troops that make it up do not block the LoS to other members of the same unit. For example, when tracing LoS over an Orc Hunter unit, those in front do not block the LoS to those behind.[[/red]]`;
      }

      const charactersChapter = {
        id: "characters",
        title: "Characters",
        sections: [
          {
            id: "characters-intro",
            title: "Characters",
            content: "Characters are single miniature units that feature the Character keyword in their profile. Depending on the strength of their leadership or their role in your company, we distinguish between Officers and Supports."
          },
          {
            id: "officers-and-supports",
            title: "Officers and Supports",
            content: "The type of Character a unit is is indicated by an icon on its profile.\n\nIn addition to fighting individually like any unit, Characters can join allied units to lead them, improve their capabilities, or give them unique abilities."
          },
          {
            id: "join-a-unit",
            title: "Join a Unit",
            content: "Characters with the ability to join a unit have it indicated in their profile using the keyword Join (X), where \"X\" can be the name of a unit, a characteristic, a keyword or several groups of them separated by lines. (\"|\"). In the latter case, the target unit must have all the keywords or characteristics, or be named as at least one of the groups\n\nCharacters who do not have the Join (X) keyword cannot join any unit in any way.\n\nExamples:\n• Join (Infantry). The Character can join a unit with the Infantry characteristic.\n• Join (Orc Hunters). The Character can only join a unit of \"Orc Hunters\".\n• Join (Infantry, Varank). The Character can join a unit that has the Infantry and Varank characteristics.\n• Join (Infantry, Ghent | Scout). The character can join a unit that has the Infantry and Ghent characteristics; or a unit with the Scout keyword.\n\nA unit cannot include more than one Character."
          },
          {
            id: "chain-of-command",
            title: "Chain of command",
            content: "Officer type Characters automatically become the troop leader of the unit they join."
          },
          {
            id: "characters-joining-unit",
            title: "Characters joining a unit",
            content: "You can join a Character to a unit during deployment or during its activation."
          },
          {
            id: "join-during-deployment",
            title: "A. Join during deployment",
            content: "When you are going to deploy your Character, select one of your units that is already deployed (that meets the requirements of its keyword Join and in which there is no other Character) and declare to your opponent that your Character is joining the unit. Then place the Character on the battlefield in formation with the unit (you can reposition troops to make room for them and ensure the unit is in formation).\n\nRemember that if the Character is of the Officer type they become the troop leader, so the unit's troops must have LoS towards them and be within 2 strides.\n\nIf you want to deploy your Character with a unit that is deployed at another time in the game (for example, Scout and Ambusher units), you must reserve them hidden and deploy them at the same time you deploy the unit."
          },
          {
            id: "join-during-activation",
            title: "B. Join during activation",
            content: "During activation, your Character can join a unit (that meets the requirements of its Join keyword) as long as:\n\n• There are no other Characters in the unit.\n• The unit is not demoralized.\n\nIf these requirements are met, declare to your opponent that the Character is joining the unit. The only action your Character can perform is move (you can move twice) and they must finish their activation in formation with their new unit (having LoS and being 2 strides from the troop leader).\n\nAt the end of their activation, in the case of an Officer, your Character automatically becomes the troop leader, so you can exchange their position with the previous troop leader of the unit so that all the troops are in formation with the Character."
          },
          {
            id: "damage-stress-states",
            title: "Damage, stress, states and other tokens",
            content: "If your Character has tokens on their profile, do the following for each type of token:\n\n• Damage tokens. The Character keeps their damage tokens on their own profile. While joined to a unit they will be ignored. Damage tokens are only be taken into account again if the unit is destroyed or the Character abandons it.\n• Stress tokens. Compare the stress level between the Character and the unit and leave the higher of the two on the unit.\n• State tokens. Place the Character's state tokens on the unit. Since you can only have one token of each state, remove any repeated states. (See \"States\").\n• Effects tokens. If the Character has any number of effects tokens assigned to them (for example, spells), they are transferred to the unit's profile.\n• Activation token. Remove the activation token from the Character."
          },
          {
            id: "character-game-profile",
            title: "Character game profile in units",
            content: "When a Character has joined a unit, you must use their \"Character in Unit\" game profile. The unit will make use of the values that the Character shares (for example, in the case of Officers, their WP).\n\nTo manage this union more comfortably, we have designed the cards with the game profiles so that you can place the Character card under the unit card, and therefore have both profiles grouped together.\n\nWhen these values are absolute, they will replace those of the unit, while if they are modifiers (they are preceded by \"+\") they are added to those of the unit (even if it has no value). Remember that when modifying a roll you cannot roll more than 3 dice of the same color, so ignore all dice of a color that exceed that amount."
          },
          {
            id: "combat",
            title: "Combat",
            content: "Characters participate with their unit in combat, providing their corresponding modifiers and switches if they have them."
          },
          {
            id: "characters-as-members",
            title: "Characters as members of a unit",
            content: "Officer type Characters count as another member of the unit when determining the number of troops participating in a combat (attacking and defending), as well as to quantify the unit's conquest value (although the Officer Character can modify it).\n\nSupports do not count towards the Number of troops in the unit\n\nCharacters inherit all keywords of the unit they join since, for all intents and purposes, you play with the unit's profile while the Character is included In it."
          },
          {
            id: "skills-and-spells",
            title: "Skills, Passive Skills, and Spells",
            content: "The unit can use the skills, command skills, passive skills and spells present in the \"Character in unit\" profile as if they were its own, since it is the unit that activates and performs the actions"
          },
          {
            id: "characters-leaving-unit",
            title: "Characters leaving their unit",
            content: "To have your Character leave their unit, follow these steps:\n\n• Declare to your opponent that your Character is leaving the unit.\n• Your Character can perform the move action up to two times (this movement does not generate opportunity attacks)\n• Your Character has been activated, so place an Activation token on their profile.\n• If the Character is an Officer, you can place the unit's troop leader in the position the Character was in so that all other troops are in formation.\n\nWhen a Character leaves a unit, the unit regains the original values of its attributes. If its stress level exceeds its original MOR, take a WP test. If you do not pass it, the unit is demoralized and must flee immediately. (See \"Stress and morale. Flee\").\n\nRemember, every time a Character leaves their unit (or is removed from the game because they are eliminated), you must designate a new leader troop for the unit."
          },
          {
            id: "damage-stress-tokens-leaving",
            title: "Damage, Stress, states and other tokens",
            content: "If the unit has tokens on its profile, do the following for each type of token:\n\n• Damage tokens. The unit keeps all damage tokens. The Character only keeps the damage tokens they had before joining the unit.\n• Stress tokens. The Character receives the same level of stress as the unit.\n• State tokens. Place the same state tokens on your Character as the unit has.\n• Effects tokens. The unit keeps all effect tokens.\n\nCharacters cannot leave and join a unit (and vice versa) during the same activation."
          },
          {
            id: "assign-damage-characters",
            title: "Assign damage to units with Characters",
            content: "Officer Characters that are part of a unit are the last to suffer damage, since they are the troop leader.\n\nSupport Characters that are part of a unit can be eliminated like any other troop. When the damage suffered equals the unit's W (Wounds) value, you can remove the Support Character instead of a trooper."
          },
          {
            id: "characters-destroyed-units",
            title: "Characters and destroyed units",
            content: "When all the troops of a unit are taken out of combat, deal the remaining damage to the Character. Since the unit has been destroyed, the Character is no longer part of it. Before removing the unit from the battlefield perform the following actions:\n\n• Separate the character and unit profile cards.\n• Transfer the corresponding tokens from the unit to the Character as indicated in the \"Damage, Stress, Status, and Other Tokens\" section.\n\nOnce these steps are completed, you can remove all of the unit's gaming elements from the game."
          }
        ]
      };

      const typedChapters: Chapter[] = chaptersData.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        sections: sectionsData
          .filter((section) => section.chapter_id === chapter.id)
          .map((section) => ({
            id: section.id,
            title: section.title,
            content: section.content,
          })),
      }));

      const stressAndMoraleIndex = typedChapters.findIndex(chapter => 
        chapter.title.toLowerCase().includes("stress and morale")
      );

      if (stressAndMoraleIndex !== -1) {
        typedChapters.splice(stressAndMoraleIndex + 1, 0, charactersChapter);
      } else {
        typedChapters.push(charactersChapter);
      }

      return typedChapters;
    },
  });
};

export type { Section, Chapter };
