import { Chapter } from "@/hooks/useRules";

// Define the structure for rules translations
export interface RulesTranslation {
  [key: string]: any;
  en: {
    chapters: Chapter[];
  };
  es: {
    chapters: Chapter[];
  };
}

export const rulesTranslations: RulesTranslation = {
  en: {
    chapters: [
      {
        id: "basic-concepts",
        title: "Basic Concepts",
        sections: [
          {
            id: "basic-concepts-intro",
            title: "Basic Concepts",
            content: "In this chapter you will find the basic concepts for playing WARCROW, including unit attributes, line of sight, formations and other fundamental elements of the game."
          },
          {
            id: "game-elements",
            title: "Game Elements",
            content: "WARCROW is a miniatures game that takes place on a gaming table. To play you need several elements:\n\n• Miniatures: Represent your troops on the battlefield.\n• Unit profiles: Contain all the information about your troops.\n• A measuring device (steps): To measure distances in the game.\n• Dice: WARCROW uses special colored dice to resolve actions.\n• Tokens: To represent effects, states and other game elements."
          },
          {
            id: "line-of-sight",
            title: "Line of Sight (LoS)",
            content: "Line of Sight (LoS) is an imaginary line that goes from any point on the base of a miniature to any point on the base of another miniature. If this line is not obstructed by any scenery element or by another miniature, then there is Line of Sight.\n\nLoS is reciprocal, meaning if a miniature has LoS to another, that other miniature also has LoS to the first.\n\nWhen calculating LoS, keep in mind that:\n\nA troop always has LoS to itself and adjacent troops.\n\n[[red]]When calculating LoS to a unit, the troops that compose it do not block LoS to other members of the same unit. For example, when tracing LoS over a unit of Orc Hunters, those in front do not block LoS to those behind.[[/red]]"
          },
          {
            id: "attribute-profiles",
            title: "Attribute Profiles",
            content: "Each unit in WARCROW has a profile with its attributes and capabilities. The main attributes are:\n\n• MOV (Movement): Indicates how much the unit can move in steps.\n• MOR (Morale): Represents the mental resistance and determination of the unit.\n• WP (Willpower): The ability to resist mental and psychological effects.\n• W (Wounds): How much damage the unit can suffer before being eliminated.\n\nIn addition, each unit has attack and defense dice represented by colored dice."
          }
        ]
      },
      {
        id: "stress-morale",
        title: "Stress and Morale",
        sections: [
          {
            id: "stress-intro",
            title: "Stress and Morale",
            content: "Stress represents the psychological pressure your troops suffer during combat. When a unit suffers certain negative events, it accumulates stress tokens that can lead to demoralization."
          },
          {
            id: "stress-generation",
            title: "Stress Generation",
            content: "A unit receives stress when:\n\n• It loses a member of the unit.\n• It performs a maneuver under adverse conditions.\n• It is the target of certain abilities or spells.\n• It fails challenge rolls in dangerous situations.\n\nEach unit can accumulate stress up to its MOR (Morale) value. When the stress level exceeds its MOR, the unit must make a WP (Willpower) test."
          },
          {
            id: "morale-checks",
            title: "Morale Checks",
            content: "When a unit must make a morale check, roll as many dice as its WP value. If it gets at least one success, the unit passes the test and continues normally, although it still has its current stress level. If it gets no successes, the unit becomes demoralized."
          },
          {
            id: "demoralization",
            title: "Demoralization",
            content: "A demoralized unit:\n\n• Must immediately flee away from the enemy.\n• Cannot perform normal actions until it recovers.\n• Does not count for controlling mission objectives.\n• Cannot receive orders or use abilities.\n\nTo recover, a demoralized unit must use its activation to make a WP test. If successful, it recovers but maintains its stress level."
          },
          {
            id: "stress-recovery",
            title: "Stress Recovery",
            content: "Units can remove stress tokens through:\n\n• The Rally activation, which allows a WP test to remove stress.\n• Certain abilities and effects from support characters.\n• Special effects from tactical cards or faction abilities."
          }
        ]
      },
      {
        id: "prepare-game",
        title: "Prepare the Game",
        sections: [
          {
            id: "prepare-intro",
            title: "Prepare the Game",
            content: "Before starting a game of WARCROW, you must follow several steps to prepare everything correctly."
          },
          {
            id: "battlefield",
            title: "Battlefield",
            content: "It is recommended to play on a board of approximately 120 x 120 cm (4' x 4'). The field should have enough scenery elements to create an interesting tactical environment. Place between 5-7 scenery elements distributed in a balanced way."
          },
          {
            id: "mission-selection",
            title: "Mission Selection",
            content: "Missions define the objectives to achieve during the game. It can be an official mission or one created by the community. The mission will specify:\n\n• Duration of the game (number of rounds)\n• Objectives to achieve\n• Victory conditions\n• Special rules (if any)"
          },
          {
            id: "deployment",
            title: "Deployment",
            content: "Each mission has its own deployment zones. Follow these steps for deployment:\n\n1. Determine who chooses side (usually by rolling dice)\n2. Determine who deploys first (usually by rolling dice)\n3. Deploy your troops alternating between players until all are on the field"
          },
          {
            id: "unit-reservations",
            title: "Unit Reservations",
            content: "Some units have special keywords that allow them to deploy differently:\n\n• Scout: Allows deployment outside the deployment zone.\n• Ambush: Allows the unit to be deployed later during the game.\n\nReserves must be declared during deployment and follow the specific rules of each keyword."
          }
        ]
      },
      {
        id: "game-round",
        title: "Game Round",
        sections: [
          {
            id: "round-intro",
            title: "Game Round",
            content: "The game is played in a series of rounds, each divided into 4 phases. Rounds continue until reaching the limit defined by the mission."
          },
          {
            id: "initiative-phase",
            title: "1. Initiative Phase",
            content: "At the beginning of each round, both players determine who has the initiative:\n\n1. Each player rolls as many dice as units they have on the battlefield\n2. The player with more successes gets the initiative\n3. In case of a tie, the player who had the initiative in the previous round wins"
          },
          {
            id: "command-phase",
            title: "2. Command Phase",
            content: "During this phase, players can use command abilities and other effects that activate at the beginning of the round. The player with initiative acts first."
          },
          {
            id: "activation-phase",
            title: "3. Activation Phase",
            content: "Players take turns activating their units, one by one. The player with the initiative decides who activates first in each activation turn. When a unit is activated, it can perform two actions:\n\n• Movement\n• Attack\n• Magic/Prayer\n• Abilities\n• Regroup\n• Secure\n\nActions can be performed in any order, but the same action cannot be repeated in the same activation (except Movement)."
          },
          {
            id: "activate-move",
            title: "Activate a unit and move",
            content: "When you activate a unit, you can move it up to its MOV value in steps. Movement must follow these rules:\n\n• You cannot move through other units or impassable terrain\n• You must maintain formation at the end of movement\n• You cannot separate the unit into groups\n\n[...] Keep in mind that:\n\n[[red]]Your unit can perform the movement action and remain stationary.[[/red]]"
          },
          {
            id: "combat",
            title: "Combat",
            content: "Follow these steps to resolve combat:\n\n1. Your unit must perform positioning maneuvers if any of its troops are not involved in combat. (See \"Positioning Maneuvers\" section).\n2. Select a melee attack from your unit profile.\n3. All troops in your unit participate in the attack, and all troops in the enemy unit defend.\n4. Your opponent gathers the defense roll indicated in their combat panel according to the number of troops in their unit. If the unit includes a Character, they can add dice or automatic symbols to the roll. (See \"Characters\"). At this point they must declare if their unit is stressed to add their modifier to the defense roll. If your opponent decides not to do so, they cannot change their mind later.\n5. Gather your attack dice pool. Take the dice indicated in your unit's combat panel according to the number of troops currently in it. If your unit includes a Character, they can add dice or automatic symbols to the roll. (See \"Characters\"). Declare now if your unit is stressed to add the modifier to its attack roll.\n6. Resolve a Face to Face roll between your attack roll and your opponent's defense roll.\n7. Your opponent receives as much damage as Successes remain in your roll and vice versa, your unit receives as much damage as Successes remain in your opponent's roll.\n\n(FAQ V 1.2.1)"
          },
          {
            id: "end-phase",
            title: "4. End Phase",
            content: "In this phase, effects that occur at the end of the round are resolved, such as the recovery of certain abilities, evaluation of controlled objectives, and preparation for the next round."
          }
        ]
      },
      {
        id: "skills",
        title: "Skills",
        sections: [
          {
            id: "skills-intro",
            title: "Skills",
            content: "Skills are special abilities that units and characters have in WARCROW. These can provide advantages in combat, movement, survival or other aspects of the game."
          },
          {
            id: "skill-types",
            title: "Skill Types",
            content: "In WARCROW we find several types of skills:\n\n• Passive Skills: They are always active and do not require activation.\n• Active Skills: They require an action to be used.\n• Command Skills: They can only be used by characters with the Officer characteristic.\n• Faction Skills: Specific to certain factions of the game."
          },
          {
            id: "skill-activation",
            title: "Skill Activation",
            content: "To use an active skill, the unit must:\n\n1. Be activated and not demoralized.\n2. Declare which skill it is going to use.\n3. Spend an action (unless the skill indicates otherwise).\n4. Meet any specific requirements of the skill (range, target, etc.).\n5. Resolve the effects according to the instructions of the skill."
          },
          {
            id: "command-skills",
            title: "Command Skills",
            content: "Command skills are special because:\n\n• They can only be used by Officers.\n• Some affect other allied units within a certain range.\n• They can be used during the Command Phase or as part of the Officer's activation.\n• They typically represent orders, inspiration, or special tactics."
          },
          {
            id: "skill-limitations",
            title: "Skill Limitations",
            content: "It is important to remember that:\n\n• A unit cannot use the same skill more than once per activation (unless the skill specifies it).\n• Demoralized units cannot use skills.\n• Skills cannot be used during opportunistic attacks unless specifically indicated.\n• Some skills have usage limitations per round or per game."
          }
        ]
      },
      {
        id: "magic-prayers",
        title: "Magic and Prayers",
        sections: [
          {
            id: "magic-intro",
            title: "Magic and Prayers",
            content: "Magic and prayers represent the supernatural forces that some characters and units can control in WARCROW. Although they function similarly, they have some important differences."
          },
          {
            id: "spellcasters",
            title: "Spellcasters",
            content: "Spellcasters are characters with the Magic keyword. To cast a spell, they follow these steps:\n\n1. Declare the spell to cast and its target.\n2. Spend a Magic action.\n3. Perform a casting test using the dice indicated in the spell profile.\n4. If they get enough successes, the spell is cast correctly.\n5. The target may be entitled to a resistance test if the spell allows it."
          },
          {
            id: "prayers",
            title: "Prayers",
            content: "Prayers work similarly to spells but are associated with the Prayer keyword instead of Magic. The main differences are:\n\n• Prayers tend to have effects more oriented towards buffing allies or debuffing enemies.\n• Some prayers may have restrictions related to alignments or factions.\n• Failure mechanics may be different from those of spells."
          },
          {
            id: "magic-resistance",
            title: "Magic Resistance",
            content: "Some units have the ability to resist magical effects. When they are the target of a spell, they can perform a resistance test using their WP dice. If they get enough successes, they can reduce or completely nullify the effects of the spell."
          },
          {
            id: "magical-terrain",
            title: "Magical Terrain",
            content: "Some scenarios include terrain elements with magical properties that can affect spells and prayers. These can increase or decrease the power of certain spells, prevent their casting, or create special effects when magical abilities are used near them."
          }
        ]
      },
      {
        id: "terrain-cover",
        title: "Terrain and Cover",
        sections: [
          {
            id: "terrain-intro",
            title: "Terrain and Cover",
            content: "Terrain in WARCROW not only defines the aesthetics of the battlefield but also tactically affects the game, offering advantages or presenting obstacles to troops."
          },
          {
            id: "terrain-types",
            title: "Terrain Types",
            content: "In WARCROW we find several types of terrain:\n\n• Open Terrain: It offers no impediment to movement or line of sight.\n• Difficult Terrain: It reduces the movement of troops (each step in difficult terrain counts as 2).\n• Impassable Terrain: It does not allow movement through it (high walls, precipices, etc.).\n• Obstacles: Elements such as fences or low walls that require tests to be crossed.\n• Cover Terrain: It provides protection to units."
          },
          {
            id: "cover",
            title: "Cover",
            content: "Cover offers protection to units against enemy attacks. A unit is in cover when:\n\n• At least 50% of its troops are behind a terrain element with respect to the attacker.\n• The element provides enough mass or height to partially hide the troops.\n\nA unit in cover receives an additional defense die against ranged attacks. This benefit does not apply in melee combat."
          },
          {
            id: "hiding",
            title: "Hiding",
            content: "Some parts of the terrain can provide total concealment, completely blocking the line of sight. A unit behind an element that completely blocks the line of sight cannot be the target of ranged attacks or abilities that require line of sight."
          },
          {
            id: "structures",
            title: "Structures",
            content: "Structures such as buildings, towers or ruins have special rules:\n\n• Units can occupy structures if they have the appropriate size.\n• Structures can provide complete or partial cover depending on how the unit is positioned.\n• Some structures may have accessible upper floors.\n• Units inside structures can obtain bonuses to defense or movement restrictions."
          },
          {
            id: "special-terrain",
            title: "Special Terrain",
            content: "Some terrain elements have special rules:\n\n• Water: It can slow movement or prevent passage to certain troops.\n• Elevated Terrain: It provides advantages to units that occupy it.\n• Unstable Terrain: It may require tests to avoid suffering damage.\n• Magical Terrain: It affects magic abilities or provides special effects."
          }
        ]
      },
      {
        id: "combat",
        title: "Combat",
        sections: [
          {
            id: "combat-intro",
            title: "Combat",
            content: "Combat is one of the central aspects of WARCROW, allowing your units to face both ranged and melee with enemy forces."
          },
          {
            id: "attack-action",
            title: "Attack Action",
            content: "To perform an attack, follow these steps:\n\n1. Declare which unit is going to attack and its target.\n2. Verify that the target is in range and line of sight (for ranged attacks).\n3. Roll the attack dice indicated in the unit profile.\n4. The defender rolls their defense dice.\n5. Compare the results and apply the corresponding damage and effects."
          },
          {
            id: "ranged-combat",
            title: "Ranged Combat",
            content: "Ranged combat allows attacking enemies that are outside melee range:\n\n• It requires clear line of sight to the target.\n• The attack range is determined by the weapon (short, medium or long).\n• Cover provides defensive benefits to the target.\n• Some weapons have special rules such as Area or Explosion."
          },
          {
            id: "close-combat",
            title: "Melee Combat",
            content: "Melee combat occurs when units are in base-to-base contact:\n\n• It does not require range tests, but units must be adjacent.\n• Cover generally does not apply in melee combat.\n• Some weapons and abilities have specific bonuses for this type of combat.\n• Units in melee combat have movement restrictions."
          },
          {
            id: "opportunity-attacks",
            title: "Opportunity Attacks",
            content: "Opportunity attacks occur when an enemy unit performs certain actions within the melee range of your unit:\n\n• They are triggered primarily when an enemy tries to leave melee contact.\n• They are resolved before the enemy unit completes its action.\n• They are normal melee attacks but do not count as an action for the unit performing them.\n• They cannot be performed if the unit has already been activated in that round."
          },
          {
            id: "damage",
            title: "Damage",
            content: "When a unit suffers damage:\n\n• Place damage tokens on its profile according to the amount of damage received.\n• When damage tokens equal or exceed the W (Wounds) value of a troop, it is eliminated.\n• The elimination of troops can generate stress in the unit.\n• Some units have special abilities that modify how they receive or recover damage."
          }
        ]
      },
      {
        id: "characters",
        title: "Characters",
        sections: [
          {
            id: "characters-intro",
            title: "Characters",
            content: "Characters are single miniature units that have the Character keyword in their profile. Depending on the strength of their leadership or their role in their company, we distinguish between Officers and Supports."
          },
          {
            id: "officers-and-supports",
            title: "Officers and Supports",
            content: "The type of Character a unit is is indicated by an icon in its profile.\n\nIn addition to fighting individually like any unit, Characters can join allied units to lead them, improve their capabilities or give them unique abilities."
          },
          {
            id: "join-a-unit",
            title: "Join a Unit",
            content: "Characters with the ability to join a unit have this indicated in their profile using the Join (X) keyword, where \"X\" can be the name of a unit, a characteristic, a keyword or several groups of them separated by lines. (\"|\"). In the latter case, the target unit must have all the keywords or characteristics, or be named as at least one of the groups\n\nCharacters who do not have the Join (X) keyword cannot join any unit in any way.\n\nExamples:\n• Join (Infantry). The Character can join a unit with the Infantry characteristic.\n• Join (Orc Hunters). The Character can only join an \"Orc Hunters\" unit.\n• Join (Infantry, Varank). The Character can join a unit that has the Infantry and Varank characteristics.\n• Join (Infantry, Ghent | Squire). The Character can join a unit that has the Infantry and Ghent characteristics; or a unit with the Squire keyword.\n\nA unit cannot include more than one Character."
          },
          {
            id: "chain-of-command",
            title: "Chain of Command",
            content: "Officer-type Characters automatically become the troop leader of the unit they join."
          },
          {
            id: "characters-joining-unit",
            title: "Characters joining a unit",
            content: "You can join a Character to a unit during deployment or during its activation."
          },
          {
            id: "join-during-deployment",
            title: "A. Join during deployment",
            content: "When you are about to deploy your Character, select one of your already deployed units (that meets the requirements of its Join keyword and in which there is no other Character) and declare to your opponent that your Character is joining the unit. Then place the Character on the battlefield in formation with the unit (you can relocate troops to make room for them and ensure the unit is in formation).\n\nRemember that if the Character is an Officer type, they become the troop leader, so the troops in the unit must have LoS to them and be within 2 steps.\n\nIf you want to deploy your Character with a unit that is deployed at another time in the game (e.g., Scout and Ambush units), you must reserve them hidden and deploy them at the same time as you deploy the unit."
          },
          {
            id: "join-during-activation",
            title: "B. Join during activation",
            content: "During activation, your Character can join a unit (that meets the requirements of its Join keyword) as long as:\n\n• There are no other Characters in the unit.\n• The unit is not demoralized.\n\nIf these requirements are met, declare to your opponent that the Character is joining the unit. The only movement your Character can perform is the movement action (you can move twice) and must end its activation in formation with its new unit (having LoS and within 2 steps of the troop leader).\n\nAt the end of its activation, in the case of an Officer, your Character automatically becomes the troop leader, so you can swap its position with the previous troop leader of the unit so that all troops are in formation with the Character."
          },
          {
            id: "damage-stress-states",
            title: "Damage, stress, states and other tokens",
            content: "If your Character has tokens on their profile, do the following for each type of token:\n\n• Damage tokens. The Character keeps their damage tokens on their own profile. While joined to a unit, they will be ignored. Damage tokens will only be taken into account again if the unit is destroyed or the Character leaves it.\n• Stress tokens. Compare the stress level between the Character and the unit and leave the higher of the two on the unit.\n• State tokens. Place the Character's state tokens on the unit. As you can only have one token of each state, remove any repeated states. (See \"States\").\n• Effect tokens. If the Character has assigned any number of effect tokens (e.g., spells), they are transferred to the unit profile.\n• Activation token. Remove the Character's activation token."
          },
          {
            id: "character-game-profile",
            title: "Character game profile in units",
            content: "When a Character has joined a unit, you must use their \"Character in unit game profile\". The unit will use the values that the Character shares (e.g., in the case of Officers, their WP).\n\nTo handle this union more comfortably, we have designed the cards with the game profiles in such a way that you can place the Character card under the unit card, and therefore, both profiles will be grouped together.\n\nWhen these values are absolute, they will replace those of the unit, while if they are modifiers (prefixed with \"+\") they will be added to those of the unit (even if it has a value). Remember that when modifying a roll, you cannot roll more than 3 dice of the same color, so ignore all dice of one color that exceed that number."
          },
          {
            id: "combat",
            title: "Combat",
            content: "Characters participate with their unit in combat, providing their corresponding modifiers and changes if they have them."
          },
          {
            id: "characters-as-members",
            title: "Characters as members of a unit",
            content: "Officer-type Characters count as another member of the unit when determining the number of troops participating in combat (attackers and defenders), as well as to quantify the conquering value of the unit (although the Officer Character may modify it).\n\nSupports do not count with the number of troops in the unit\n\nCharacters inherit all the keywords of the unit they join, since, for all purposes, you play with the unit profile while the Character is included in it."
          },
          {
            id: "skills-and-spells",
            title: "Skills, passive abilities and spells",
            content: "The unit can use the skills, command skills, passive abilities and spells present in the \"Character in unit game profile\" as if they were its own, since it is the unit that activates and performs the actions."
          },
          {
            id: "characters-leaving-unit",
            title: "Characters leaving their unit",
            content: "For your Character to leave their unit, follow these steps:\n\n• Declare to your opponent that your Character is leaving the unit.\n• Your Character can perform the movement action up to twice (this movement does not generate opportunity attacks)\n• Your Character has been activated, so place an activation Token on their profile.\n• If the Character is an Officer, you can place the troop leader of the unit in the position that the Character occupied so that all other troops are in formation.\n\nWhen a Character leaves a unit, the unit returns to the original values of its attributes. If its stress level exceeds its original MOR level, perform a WP test. If it does not pass, the unit is demoralized and must flee immediately. (See \"Stress and morale. Flee\").\n\nRemember, each time a Character leaves their unit (or is eliminated from the game due to being eliminated), you must designate a new troop leader for the unit."
          },
          {
            id: "damage-stress-tokens-leaving",
            title: "Damage, stress, state and other tokens",
            content: "If the unit has tokens on its profile, do the following for each type of token:\n\n• Damage tokens. The unit keeps all damage tokens. The Character only keeps the damage tokens they had before joining the unit.\n• Stress tokens. The Character receives the same stress level as the unit.\n• State tokens. Place the same state tokens on your Character that the unit has.\n• Effect tokens. The unit keeps all effect tokens.\n\nCharacters cannot join and leave a unit (and vice versa) during the same activation."
          },
          {
            id: "assign-damage-characters",
            title: "Assign damage to units with Characters",
            content: "Officer Characters who are in a unit are the last to suffer damage, as they are the troop leader.\n\nSupport-type Characters who are in a unit can be eliminated like any other troop. When the damage suffered is equal to the W (Wounds) value of the unit, you can eliminate the Support Character instead of a soldier."
          },
          {
            id: "characters-destroyed-units",
            title: "Characters and destroyed units",
            content: "When all troops in a unit have been removed from combat, dedicate the remaining damage to the Character. Because the unit has been destroyed, the Character is no longer part of it. Before removing the unit from the battlefield, perform the following steps:\n\n• Separate the Character card and the unit card.\n• Transfer the corresponding tokens from the unit to the Character as indicated in the \"Damage, stress, state and other tokens\" section.\n\nOnce these steps are completed, you can remove all game elements of the unit from the game."
          }
        ]
      },
      {
        id: "line-of-sight-movement",
        title: "Line of Sight and Movement",
        sections: [
          {
            id: "line-of-sight-intro",
            title: "Line of Sight and Movement",
            content: "Line of sight and movement are fundamental aspects for the tactical positioning of your troops on the battlefield."
          },
          {
            id: "line-of-sight-detail",
            title: "Line of Sight in Detail",
            content: "Line of sight (LoS) determines what your units can see on the battlefield:\n\n• It is traced from any point on the base of the miniature to any point on the base of the target.\n\n• If the line is not obstructed by terrain or enemy miniatures, there is LoS.\n\n• Miniatures of the same unit do not block LoS between each other.\n\n• Terrain with the 'blocks LoS' rule completely interrupts vision.\n\n• Terrain with the 'obscures' rule provides defensive bonuses but does not block LoS."
          },
          {
            id: "formation-rules",
            title: "Formation Rules",
            content: "Units must maintain formation to operate effectively:\n\n• All miniatures must be a maximum of 2 steps from the unit leader.\n\n• All miniatures must have LoS to the unit leader.\n\n• Units cannot separate into groups.\n\n• The unit leader is chosen at the start of the game, but can change during the game."
          },
          {
            id: "movement-details",
            title: "Movement Details",
            content: "Movement in WARCROW is measured in steps:\n\n• Each unit has a MOV value that indicates how many steps it can move.\n\n• Difficult terrain reduces speed (each step counts as 2).\n\n• A unit must always end its movement in formation.\n\n• Units can perform two movement actions in the same activation."
          }
        ]
      }
    ]
  },
  es: {
    chapters: []  // Spanish translations are provided in useRules.ts directly
  }
};

// UI translations for rules section
export const rulesUITranslations = {
  searchPlaceholder: {
    en: "Search rules...",
    es: "Buscar reglas..."
  },
  noResults: {
    en: "No results found",
    es: "No se encontraron resultados"
  },
  resultsFound: {
    en: "results found",
    es: "resultados encontrados"
  },
  caseSensitive: {
    en: "Case sensitive",
    es: "Distinguir mayúsculas"
  }
};
