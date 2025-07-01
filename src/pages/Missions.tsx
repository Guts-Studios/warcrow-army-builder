import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { MissionList } from "@/components/missions/MissionList";
import { MissionDetails } from "@/components/missions/MissionDetails";
import { FeatList } from "@/components/missions/FeatList";
import { FeatDetails } from "@/components/missions/FeatDetails";
import { Mission, Feat } from "@/components/missions/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationPopulator } from "@/components/missions/TranslationPopulator";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const missionsData: Mission[] = [
  {
    id: "1",
    title: "Consolidated Progress",
    details: "Preparation\nPlace 3 Progress markers as shown in the diagram.\n\nEvent\nAt the end of Round 2, remove all Progress markers from the battlefield.\n\nScoring\nAt the end of Round 1: Each controlled Progress marker is worth 2 Objective points.\nAt the end of Round 2: Each controlled Progress marker is worth 2 Objective points.\nAt the end of Round 3: Each controlled Progress marker is worth 3 Objective points.",
    isHomebrew: false,
  },
  {
    id: "2",
    title: "Take Positions",
    details: "Preparation\nPlace 5 Position markers as shown in the diagram.\n\nScoring\nAt the end of each Round: Each controlled Position marker is worth 1 Objective point.",
    isHomebrew: false,
  },
  {
    id: "3",
    title: "Fog of Death",
    details: "Preparation\nPlace 3 Arcane artefact markers as shown in the diagram.\n\nFog effects\nAll miniatures have Block LoS.\n\nEnd of the game\nFog effects end.\n\nScoring\nAt the end of each Round: Each controlled Arcane artefact marker is worth 2 Objective points.",
    isHomebrew: false,
  },
  {
    id: "4",
    title: "Influence Zones",
    details: "Preparation\nPlace 4 Influence markers as shown in the diagram.\n\nScoring\nAt the end of each Round: Each controlled Influence marker is worth 1 Objective point.\nAt the end of the game: Each controlled Influence marker is worth 2 additional Objective points.",
    isHomebrew: false,
  },
  {
    id: "5",
    title: "Expanse",
    details: "Scoring\nAt the end of each Round: You score 1 Objective point for each enemy Deployment zone quadrant in which you have at least one miniature.",
    isHomebrew: false,
  },
  {
    id: "6",
    title: "Loot",
    details: "Preparation\nPlace 3 Loot markers as shown in the diagram.\n\nSpecial Rules\nLoot markers can be picked up by miniatures in base contact. A miniature carrying a Loot marker moves at -2\" and cannot Charge. If the carrier is eliminated, place the Loot marker in base contact.\n\nScoring\nAt the end of the game: Each Loot marker you control is worth 3 Objective points.",
    isHomebrew: false,
  },
  {
    id: "7",
    title: "Quadrants",
    details: "Preparation\nDivide the battlefield into 4 equal quadrants.\n\nScoring\nAt the end of each Round: You score 2 Objective points for each quadrant you control (have more miniatures than your opponent).",
    isHomebrew: false,
  },
  {
    id: "8",
    title: "Tree Mother",
    details: "Preparation\nPlace the Tree Mother model in the center of the battlefield. Place 6 Sÿena sprout markers around it.\n\nEvent 1: The Tree Mother\nThe Tree Mother is a Large miniature with the following profile:\nMovement: 0\", Defense: 10, Life Points: 5\nKeywords: Immovable, Fearless\n\nWoods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (BLK).\n\nSÿena sprouts\nSÿena sprouts can be destroyed by miniatures in base contact as a simple action.\n\nDestroy a sprout\nWhen a sprout is destroyed, the player who destroyed it scores 1 Objective point immediately.\n\nReturn home\nWhen The Tree Mother is reduced to 0 Life Points, remove it and all remaining sprouts from the battlefield.\n\nScoring\nImmediate: 1 Objective point per destroyed sprout.\nAt the end of the game: 5 Objective points if The Tree Mother was destroyed.",
    isHomebrew: false,
  },
  {
    id: "9",
    title: "Battle Lines",
    details: "Scoring\nAt the end of each Round: You score 1 Objective point for each enemy miniature eliminated this Round.",
    isHomebrew: false,
  },
  {
    id: "10",
    title: "Breached Front",
    details: "Preparation\nPlace 2 Breach markers on the centerline as shown in the diagram.\n\nScoring\nAt the end of each Round: Each controlled Breach marker is worth 2 Objective points.",
    isHomebrew: false,
  },
  {
    id: "11",
    title: "Ghosts from the Mist",
    details: "Preparation\nPlace 3 Mist markers as shown in the diagram.\n\nSpecial Rules\nMist markers provide Cover (BLK) and Block LoS to all miniatures.\n\nScoring\nAt the end of each Round: Each controlled Mist marker is worth 1 Objective point.\nAt the end of the game: Each controlled Mist marker is worth 2 additional Objective points.",
    isHomebrew: false,
  },
  {
    id: "12",
    title: "Sacred Land",
    details: "Preparation\nPlace 1 Sacred marker in the center of the battlefield.\n\nPrayers and Offerings\nMiniatures in base contact with the Sacred marker can Pray as a simple action.\n\nPray\nRoll 1d6. On a 4+, gain 1 Objective point immediately.\n\nDeity Offering\nIf a Character is eliminated within 6\" of the Sacred marker, the opposing player gains 2 Objective points immediately.\n\nScoring\nImmediate: Variable points from Praying and Deity Offerings.\nAt the end of the game: The player controlling the Sacred marker gains 3 Objective points.",
    isHomebrew: false,
  },
  {
    id: "13",
    title: "Rescue Mission",
    details: "Preparation\nPlace 3 Wounded markers in No Man's Land as shown in the diagram.\n\nRescuing the wounded\nMiniatures in base contact with Wounded markers can rescue them as a simple action. Remove the marker and the rescuing player gains it.\n\nEnsure survival\nRescued markers can be 'delivered' by moving into your own Deployment zone. When delivered, gain 2 Objective points immediately.\n\nAvenge the fallen\nIf an enemy Character is eliminated, gain 1 Objective point immediately.\n\nScoring\nImmediate: 2 Objective points per delivered Wounded marker.\nImmediate: 1 Objective point per eliminated enemy Character.\nAt the end of the game: 1 Objective point per undelivered Wounded marker you control.",
    isHomebrew: false,
  },
];

const featsData: Feat[] = [
  {
    id: "1",
    name: "Track",
    details: "Required material\n• 4 event tokens, numbered from 1 to 4.\n\nPreparation\n\nThe company that wins the initiative receives event tokens 1 and 3, the rival company receives event tokens 2 and 4.\n\nEach company places one of their event tokens on the \"1\" position of the turn counter (track meter).\n\nAfter deploying all units in the game preparation phase (including Scouts), each company, in deployment order, places their remaining event token on any point of the battlefield farther than 10 strides away from their deployment zone (vestige).\n\nTracking and Vestiges\n\n• Event tokens on the turn counter represent each company's track meter.\n• Event tokens on the battlefield represent vestiges.\n• Units may move through vestiges, but cannot finish their movement on them.\n• Each company has their own track meter and own vestiges.\n• Companies cannot interact with the rival's vestiges.\n\nTracking a vestige\n\nCharacter units and units with a joined Character that finish their activation adjacent to their company's vestige can track it:\n\n• The unit makes a WP test.\n• Scout and Ambusher units add ORG to their roll.\n• During the switches step of the roll, units may stress themselves to add 1 SUCCESS to their roll.\n• When a unit passes the test with 2 SUCCESS, the company advances the track meter by 1 position on the turn counter. Then, the rival company must place the vestige at 15 strides of its current position (it cannot be placed on Impassable terrain).\n\nScoring\n\nWhen a company advances their track meter to position \"4\" of the turn counter it obtains 4 AP and the rival company obtains as many AP as its current position on the track meter minus 1.\n\nAt the end of the game, if neither company got their track meter to position \"4\":\n\n• Each company obtains as many AP as the current position of their track meter.",
  },
  {
    id: "2",
    name: "Decapitation",
    details: "Required material\n\n• 2 event tokens.\n\nCommander\n\n• Companies must deploy their commander during the deployment phase (they cannot use Scout or Ambusher).\n• If the commander is removed from the battlefield by any effect it will be considered eliminated (for scoring purposes)\n• The commander cannot join any unit.\n\nContract\n\nAfter deploying all units in the game preparation phase (including Scouts), each company, in deployment order, chooses a unit from the rival company as their contract (place an event token on their profile card).\n\n• The contract cannot be the commander\n• If the contract is removed from the battlefield by any effect it will be considered eliminated (for scoring purposes).\n• If the unit with the contract has a joined Character, the contract will be considered eliminated once the unit is destroyed, even if the Character survives.\n• A company that couldn't choose its contract (because there were no deployed enemy units) will do so at the end of the round. A demoralized unit cannot be chosen as a contract. If a company still can't choose its contract at the end of a round, it will do so at the end of the next one.\n\nScoring\n\nAt the end of the game, each company obtains:\n\n• 2 AP if they eliminated the rival's commander.\n• 1 AP if their commander hasn't been eliminated.\n• 1 AP if they eliminated their contract.",
  },
  {
    id: "3",
    name: "The Rift",
    details: "Required material\n\n• 2 fog markers.\n• 2 event tokens.\n\nFog\n\nAfter deploying all units in the preparation phase (including Scouts), each company, in deployment order, must place a fog marker further than 20 strides from their deployment zone.\n\nThese fog markers cannot be moved.\n\nCharacter units and units with a joined Character that finish their activation adjacent to one of the fog markers may begin sealing the rift.\n\nSealing the Rift\n\nThe unit performs a WP test, using the Character's WP. The company places an event token on the turn counter, 6 positions ahead of the current turn, and then moves it back 1 position for each SUCCESS they got in the test.\n\n• Spellcaster Characters add ORG to their roll.\n\nIf the unit sealing the rift is no longer adjacent to the fog marker or if it activates, the event token is removed.\n\nA unit cannot begin sealing a rift that is already being sealed by another unit.\n\nWhen the event token is activated, the company sealing the rift obtains the fog marker (and removes it from the battlefield).\n\nScoring\n\nAt the end of the game, each company gets 2 AP for each fog marker it obtained.",
  },
  {
    id: "4",
    name: "Banner",
    details: "Required material\n\n• 4 event tokens, numbered from 1 to 4.\n\nPreparation\n\nThe company that wins the initiative receives event tokens 1 and 3, the rival company receives event tokens 2 and 4.\n\nEach company places one of their event tokens on the \"1\" position of the turn counter (glory meter).\n\nAfter deploying all units in the game preparation phase (including Scouts and Ambushers), each company, in deployment order, chooses one of their deployed units to carry the banner, placing an event token on their profile card.\n\n• Characters carrying the banner cannot join a unit\n• A unit carrying the banner cannot have a joined Character.\n\nBanner\n\nFor each WOUND inflicted by the unit carrying the banner, its company advances their glory meter 1 position on the turn counter. If the glory meter is on position \"10\", move the rival company's glory meter back (to a minimum of 1).\n\nLost banner\n\nIf the unit carrying the banner flees, is destroyed or leaves the battlefield, the company controlling it places the banner on the battlefield, adjacent to its leader, before removing the unit from the battlefield or fleeing.\n\nPick up the banner\n\nIf a company's banner is on the battlefield, any adjacent allied unit may pick it up performing the Pick up banner simple action.\n\nScoring\n\nAt the end of the game, each company gets:\n\n• 1 AP if their rival lost its banner at any point.\n• 1 AP if they didn't lose their own banner\n• 1 AP if their glory meter is on the same position as their rivals.\n• 2 AP if their glory meter is higher on the turn counter than their rivals.",
  },
  {
    id: "5",
    name: "Resources",
    details: "Required material\n\n• 2 event tokens.\n\nPreparation\n\nThe company that wins the initiative receives event token 1, the rival company receives event token 2.\n\nEach company places their event token on position \"1\" of the turn counter (resource meter).\n\nResources\n\nUnits further than 12 strides from their deployment zone that are not engaged in combat may stress themselves at the end of their activation to obtain resources.\n\nObtain resources\n\nThe unit performs a simple roll, the dice of which will depend on the amount of troops in the unit (Support counts when calculating the number of troops for this action). The unit's company advances their resource meter 1 position for each SUCCESS they got. If the resource meter is on position \"10\", instead of advancing the resource meter, move the rival company's resource meter back (to a minimum of 1).\n\nA company cannot obtain resources more than once per turn.\n\nDice rolled:\n• 1 Troop: YLW\n• 2-3 Troops: YLW ORG\n• 4+ Troops: YLW ORG RED\n\nScoring\n\nAt the end of the game, each company obtains:\n\n• 1 AP if their resource meter is on position 4 or higher.\n• 1 AP if their resource meter is on position 7 or higher.\n• 1 AP if their resource meter is on position 10.\n• 1 AP if their resource meter is higher on the turn counter than their rival's",
  },
];

const Missions = () => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslationTools, setShowTranslationTools] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSelectMission = (mission: Mission) => {
    setSelectedMission(mission);
  };

  const handleSelectFeat = (feat: Feat) => {
    setSelectedFeat(feat);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warcrow-dark to-black text-warcrow-text">
      <PageHeader title={t('missions')} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Translation Tools - Admin Section */}
        <div className="mb-6">
          <Collapsible open={showTranslationTools} onOpenChange={setShowTranslationTools}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="mb-4">
                <Settings className="h-4 w-4 mr-2" />
                Translation Tools
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <TranslationPopulator />
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-warcrow-accent">
            <TabsTrigger value="missions">{t('missions')}</TabsTrigger>
            <TabsTrigger value="feats">{t('feats')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="missions">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-1">
                <MissionList
                  missions={missionsData}
                  selectedMission={selectedMission}
                  onSelectMission={handleSelectMission}
                  isLoading={isLoading}
                  language={language}
                />
              </div>
              <div className="lg:col-span-2">
                <MissionDetails
                  mission={selectedMission}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="feats">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-1">
                <FeatList
                  feats={featsData}
                  selectedFeat={selectedFeat}
                  onSelectFeat={handleSelectFeat}
                  isLoading={isLoading}
                />
              </div>
              <div className="lg:col-span-2">
                <FeatDetails
                  feat={selectedFeat}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Missions;
