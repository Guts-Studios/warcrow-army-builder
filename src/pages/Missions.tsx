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
    details: "Your opponent must reveal which Mission they have chosen before you choose yours.",
  },
  {
    id: "2",
    name: "Decapitation",
    details: "Eliminate an enemy High Command Character to score 3 additional Objective points at the end of the game.",
  },
  {
    id: "3",
    name: "The Rift",
    details: "At the start of Round 2, place a Rift marker anywhere on the battlefield. All miniatures within 6\" of the Rift have -1 to all dice rolls.",
  },
  {
    id: "4",
    name: "Banner",
    details: "Choose one of your Characters at the start of the game. That Character becomes a Banner Bearer and gains +2\" Movement and Fearless.",
  },
  {
    id: "5",
    name: "Resources",
    details: "You may spend 5 additional points when building your army list.",
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
      <PageHeader 
        title={t('missions')} 
        subtitle={t('missionsSubtitle')}
      />
      
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
