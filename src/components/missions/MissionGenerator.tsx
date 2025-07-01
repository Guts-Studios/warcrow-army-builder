import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shuffle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mission, Feat } from "./types";
import { getMissionTitleTranslation, getFeatTitleTranslation } from "@/utils/missionTitleTranslations";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

// Helper function to get mission image path
const getMissionImagePath = (missionTitle: string): string => {
  const titleToImage: Record<string, string> = {
    "Consolidated Progress": "/art/missions/consolidated_progress.jpg",
    "Take Positions": "/art/missions/take_positions.jpg",
    "Fog of Death": "/art/missions/fog_of_death.jpg",
    "Influence Zones": "/art/missions/influence_zones.jpg",
    "Expanse": "/art/missions/expanse.jpg",
    "Loot": "/art/missions/loot.jpg",
    "Quadrants": "/art/missions/quadrants.jpg",
    "Battle Lines": "/art/missions/battle_lines.jpg",
    "Breached Front": "/art/missions/breached_front.jpg",
    "Ghosts from the Mist": "/art/missions/ghosts_from_the_mist.jpg",
    "Sacred Land": "/art/missions/sacred_lands.jpg",
    "Rescue Mission": "/art/missions/rescue_mission.jpg",
  };
  
  return titleToImage[missionTitle] || "";
};

interface MissionGeneratorProps {
  missions: Mission[];
  feats: Feat[];
}

interface GeneratedScenario {
  mission: Mission;
  feat: Feat;
  missionName?: string;
}

export const MissionGenerator = ({ missions, feats }: MissionGeneratorProps) => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [includeOfficial, setIncludeOfficial] = useState(true);
  const [includeCommunity, setIncludeCommunity] = useState(false);
  const [generatedScenario, setGeneratedScenario] = useState<GeneratedScenario | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isGeneratingName, setIsGeneratingName] = useState(false);

  const generateMissionName = async (mission: Mission, feat: Feat) => {
    setIsGeneratingName(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-mission-name', {
        body: {
          missionTitle: mission.title,
          missionDetails: mission.details,
          featName: feat.name,
          featDetails: feat.details,
        },
      });

      if (error) throw error;
      return data.missionName;
    } catch (error) {
      console.error('Error generating mission name:', error);
      return null;
    } finally {
      setIsGeneratingName(false);
    }
  };

  const generateScenario = async () => {
    // Filter missions based on selected options
    const filteredMissions = missions.filter(mission => {
      if (mission.isHomebrew && !includeCommunity) return false;
      if (!mission.isHomebrew && !includeOfficial) return false;
      return true;
    });

    if (filteredMissions.length === 0 || feats.length === 0) {
      return;
    }

    // Randomly select one mission and one feat
    const randomMission = filteredMissions[Math.floor(Math.random() * filteredMissions.length)];
    const randomFeat = feats[Math.floor(Math.random() * feats.length)];

    // First set the scenario without the mission name
    setGeneratedScenario({
      mission: randomMission,
      feat: randomFeat
    });

    // Then generate the AI mission name
    const generatedName = await generateMissionName(randomMission, randomFeat);
    
    // Update with the generated name
    setGeneratedScenario({
      mission: randomMission,
      feat: randomFeat,
      missionName: generatedName || undefined
    });
  };

  const resetGenerator = () => {
    setGeneratedScenario(null);
  };

  const Container = isMobile ? Sheet : Dialog;
  const Content = isMobile ? SheetContent : DialogContent;
  const Header = isMobile ? SheetHeader : DialogHeader;
  const Title = isMobile ? SheetTitle : DialogTitle;
  const Trigger = isMobile ? SheetTrigger : DialogTrigger;

  const contentProps = isMobile 
    ? { 
        className: "bg-warcrow-dark border border-warcrow-gold/20",
        side: "bottom" as const
      }
    : { 
        className: "max-w-4xl max-h-[90vh] overflow-y-auto bg-warcrow-dark border border-warcrow-gold/20" 
      };

  return (
    <>
      <Container open={isOpen} onOpenChange={setIsOpen}>
        <Trigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            Create Scenario
          </Button>
        </Trigger>
        <Content {...contentProps}>
          <Header>
            <div className="text-center space-y-2">
              <Title className="text-warcrow-gold text-xl">The Scenario</Title>
              {generatedScenario?.missionName && (
                <div className="text-warcrow-gold/80 text-lg font-semibold italic">
                  "{generatedScenario.missionName}"
                </div>
              )}
              {generatedScenario && isGeneratingName && (
                <div className="text-warcrow-gold/60 text-sm animate-pulse">
                  Forging mission name...
                </div>
              )}
            </div>
          </Header>
          
          <ScrollArea className={isMobile ? "h-[80vh]" : "max-h-full"}>
            <div className="space-y-4 p-1">
              {!generatedScenario ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-warcrow-gold font-semibold">Filter Options</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="official"
                          checked={includeOfficial}
                          onCheckedChange={(checked) => setIncludeOfficial(checked as boolean)}
                        />
                        <label htmlFor="official" className="text-warcrow-text">
                          {t('official')} Missions
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="community"
                          checked={includeCommunity}
                          onCheckedChange={(checked) => setIncludeCommunity(checked as boolean)}
                        />
                        <label htmlFor="community" className="text-warcrow-text">
                          {t('community')} Missions
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={generateScenario}
                    disabled={!includeOfficial && !includeCommunity}
                    className="w-full"
                    variant="gold"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate Random Scenario
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                    {/* Mission Card */}
                    <Card className="bg-black/70 border-warcrow-gold/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className={`text-warcrow-gold ${isMobile ? 'text-lg' : 'text-xl'} leading-tight`}>
                            {getMissionTitleTranslation(generatedScenario.mission.title, language)}
                          </CardTitle>
                          <Badge 
                            variant={generatedScenario.mission.isHomebrew ? "outline" : "secondary"}
                            className={`flex-shrink-0 ${generatedScenario.mission.isHomebrew 
                              ? "bg-purple-800/40 text-purple-200 border-purple-600"
                              : "bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold/40"
                            }`}
                          >
                            {generatedScenario.mission.isHomebrew ? t('community') : t('official')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ScrollArea className={`${isMobile ? 'h-32' : 'h-40'} w-full`}>
                          <div className="text-warcrow-text text-sm whitespace-pre-wrap pr-3">
                            {generatedScenario.mission.details}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Feat Card */}
                    <Card className="bg-black/70 border-warcrow-gold/20">
                      <CardHeader className="pb-3">
                        <CardTitle className={`text-warcrow-gold ${isMobile ? 'text-lg' : 'text-xl'} leading-tight`}>
                          {getFeatTitleTranslation(generatedScenario.feat.name, language)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ScrollArea className={`${isMobile ? 'h-32' : 'h-40'} w-full`}>
                          <div className="text-warcrow-text text-sm whitespace-pre-wrap pr-3">
                            {generatedScenario.feat.details}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Mission Image Card */}
                  {getMissionImagePath(generatedScenario.mission.title) && (
                    <Card className="bg-black/70 border-warcrow-gold/20">
                      <CardHeader className="pb-3">
                        <CardTitle className={`text-warcrow-gold text-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
                          Mission Map
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 flex justify-center">
                        <img 
                          src={getMissionImagePath(generatedScenario.mission.title)}
                          alt={getMissionTitleTranslation(generatedScenario.mission.title, language)}
                          className={`rounded-md border border-warcrow-gold/20 cursor-pointer hover:opacity-80 transition-opacity ${
                            isMobile ? 'max-w-full h-auto max-h-48 object-contain' : 'max-w-full h-auto'
                          }`}
                          onClick={() => setShowImageModal(true)}
                        />
                      </CardContent>
                    </Card>
                  )}

                  <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                    <Button onClick={generateScenario} variant="outline" className={isMobile ? 'w-full' : ''}>
                      <Shuffle className="h-4 w-4 mr-2" />
                      Generate New Scenario
                    </Button>
                    <Button onClick={resetGenerator} variant="ghost" className={isMobile ? 'w-full' : ''}>
                      Back to Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Content>
      </Container>

      {/* Image Modal - Mobile optimized */}
      {generatedScenario && (
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className={`bg-warcrow-dark border border-warcrow-gold/20 ${
            isMobile ? 'max-w-[95vw] max-h-[95vh] p-2' : 'max-w-5xl max-h-[95vh]'
          }`}>
            <DialogHeader>
              <DialogTitle className={`text-warcrow-gold text-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {getMissionTitleTranslation(generatedScenario.mission.title, language)} - Mission Map
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              <img 
                src={getMissionImagePath(generatedScenario.mission.title)}
                alt={getMissionTitleTranslation(generatedScenario.mission.title, language)}
                className={`object-contain rounded-md border border-warcrow-gold/20 ${
                  isMobile ? 'max-w-full max-h-[70vh]' : 'max-w-full max-h-[80vh]'
                }`}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};