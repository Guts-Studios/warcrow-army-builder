
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { populateMissionTranslations, populateFeatTranslations, downloadTranslationsAsJSON } from "@/utils/populateMissionTranslations";

// Mission data - this would normally come from your data source
const MISSIONS = [
  {
    title: "Consolidated Progress",
    details: "Preparation\nPlace 3 Progress markers as shown in the diagram.\n\nEvent\nAt the end of Round 2, remove all Progress markers from the battlefield.\n\nScoring\nAt the end of Round 1: Each controlled Progress marker is worth 2 Objective points.\nAt the end of Round 2: Each controlled Progress marker is worth 2 Objective points.\nAt the end of Round 3: Each controlled Progress marker is worth 3 Objective points."
  },
  {
    title: "Take Positions",
    details: "Preparation\nPlace 5 Position markers as shown in the diagram.\n\nScoring\nAt the end of each Round: Each controlled Position marker is worth 1 Objective point."
  },
  {
    title: "Fog of Death",
    details: "Preparation\nPlace 3 Arcane artefact markers as shown in the diagram.\n\nFog effects\nAll miniatures have Block LoS.\n\nEnd of the game\nFog effects end.\n\nScoring\nAt the end of each Round: Each controlled Arcane artefact marker is worth 2 Objective points."
  },
  {
    title: "Influence Zones",
    details: "Preparation\nPlace 4 Influence markers as shown in the diagram.\n\nScoring\nAt the end of each Round: Each controlled Influence marker is worth 1 Objective point.\nAt the end of the game: Each controlled Influence marker is worth 2 additional Objective points."
  },
  {
    title: "Expanse",
    details: "Scoring\nAt the end of each Round: You score 1 Objective point for each enemy Deployment zone quadrant in which you have at least one miniature."
  },
  {
    title: "Loot",
    details: "Preparation\nPlace 3 Loot markers as shown in the diagram.\n\nSpecial Rules\nLoot markers can be picked up by miniatures in base contact. A miniature carrying a Loot marker moves at -2\" and cannot Charge. If the carrier is eliminated, place the Loot marker in base contact.\n\nScoring\nAt the end of the game: Each Loot marker you control is worth 3 Objective points."
  },
  {
    title: "Quadrants",
    details: "Preparation\nDivide the battlefield into 4 equal quadrants.\n\nScoring\nAt the end of each Round: You score 2 Objective points for each quadrant you control (have more miniatures than your opponent)."
  },
  {
    title: "Tree Mother",
    details: "Preparation\nPlace the Tree Mother model in the center of the battlefield. Place 6 Sÿena sprout markers around it.\n\nEvent 1: The Tree Mother\nThe Tree Mother is a Large miniature with the following profile:\nMovement: 0\", Defense: 10, Life Points: 5\nKeywords: Immovable, Fearless\n\nWoods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (BLK).\n\nSÿena sprouts\nSÿena sprouts can be destroyed by miniatures in base contact as a simple action.\n\nDestroy a sprout\nWhen a sprout is destroyed, the player who destroyed it scores 1 Objective point immediately.\n\nReturn home\nWhen The Tree Mother is reduced to 0 Life Points, remove it and all remaining sprouts from the battlefield.\n\nScoring\nImmediate: 1 Objective point per destroyed sprout.\nAt the end of the game: 5 Objective points if The Tree Mother was destroyed."
  },
  {
    title: "Battle Lines",
    details: "Scoring\nAt the end of each Round: You score 1 Objective point for each enemy miniature eliminated this Round."
  },
  {
    title: "Breached Front",
    details: "Preparation\nPlace 2 Breach markers on the centerline as shown in the diagram.\n\nScoring\nAt the end of each Round: Each controlled Breach marker is worth 2 Objective points."
  },
  {
    title: "Ghosts from the Mist",
    details: "Preparation\nPlace 3 Mist markers as shown in the diagram.\n\nSpecial Rules\nMist markers provide Cover (BLK) and Block LoS to all miniatures.\n\nScoring\nAt the end of each Round: Each controlled Mist marker is worth 1 Objective point.\nAt the end of the game: Each controlled Mist marker is worth 2 additional Objective points."
  },
  {
    title: "Sacred Land",
    details: "Preparation\nPlace 1 Sacred marker in the center of the battlefield.\n\nPrayers and Offerings\nMiniatures in base contact with the Sacred marker can Pray as a simple action.\n\nPray\nRoll 1d6. On a 4+, gain 1 Objective point immediately.\n\nDeity Offering\nIf a Character is eliminated within 6\" of the Sacred marker, the opposing player gains 2 Objective points immediately.\n\nScoring\nImmediate: Variable points from Praying and Deity Offerings.\nAt the end of the game: The player controlling the Sacred marker gains 3 Objective points."
  },
  {
    title: "Rescue Mission",
    details: "Preparation\nPlace 3 Wounded markers in No Man's Land as shown in the diagram.\n\nRescuing the wounded\nMiniatures in base contact with Wounded markers can rescue them as a simple action. Remove the marker and the rescuing player gains it.\n\nEnsure survival\nRescued markers can be 'delivered' by moving into your own Deployment zone. When delivered, gain 2 Objective points immediately.\n\nAvenge the fallen\nIf an enemy Character is eliminated, gain 1 Objective point immediately.\n\nScoring\nImmediate: 2 Objective points per delivered Wounded marker.\nImmediate: 1 Objective point per eliminated enemy Character.\nAt the end of the game: 1 Objective point per undelivered Wounded marker you control."
  }
];

const FEATS = [
  {
    name: "Track",
    details: "Your opponent must reveal which Mission they have chosen before you choose yours."
  },
  {
    name: "Decapitation",
    details: "Eliminate an enemy High Command Character to score 3 additional Objective points at the end of the game."
  },
  {
    name: "The Rift",
    details: "At the start of Round 2, place a Rift marker anywhere on the battlefield. All miniatures within 6\" of the Rift have -1 to all dice rolls."
  },
  {
    name: "Banner",
    details: "Choose one of your Characters at the start of the game. That Character becomes a Banner Bearer and gains +2\" Movement and Fearless."
  },
  {
    name: "Resources",
    details: "You may spend 5 additional points when building your army list."
  }
];

export const TranslationPopulator = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentItem, setCurrentItem] = useState("");
  const { toast } = useToast();

  const handleTranslateMissions = async (language: 'es' | 'fr') => {
    setIsTranslating(true);
    setProgress(0);
    setCurrentItem("Starting mission translations...");

    try {
      const translations = await populateMissionTranslations(MISSIONS, language);
      
      // Format for the JSON structure
      const formattedTranslations = {
        missions: translations
      };

      // Download the file
      downloadTranslationsAsJSON(
        formattedTranslations, 
        `mission-translations-${language}.json`
      );

      toast({
        title: "Success!",
        description: `Mission translations for ${language.toUpperCase()} have been generated and downloaded.`,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate translations. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
      setProgress(0);
      setCurrentItem("");
    }
  };

  const handleTranslateFeats = async (language: 'es' | 'fr') => {
    setIsTranslating(true);
    setProgress(0);
    setCurrentItem("Starting feat translations...");

    try {
      const translations = await populateFeatTranslations(FEATS, language);
      
      // Format for the JSON structure
      const formattedTranslations = {
        feats: translations
      };

      // Download the file
      downloadTranslationsAsJSON(
        formattedTranslations, 
        `feat-translations-${language}.json`
      );

      toast({
        title: "Success!",
        description: `Feat translations for ${language.toUpperCase()} have been generated and downloaded.`,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate translations. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
      setProgress(0);
      setCurrentItem("");
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Translation Populator</h3>
      <p className="text-sm text-muted-foreground">
        Generate translations for missions and feats using DeepL API. The translations will be downloaded as JSON files.
      </p>
      
      {isTranslating && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">{currentItem}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Missions</h4>
          <Button 
            onClick={() => handleTranslateMissions('es')} 
            disabled={isTranslating}
            className="w-full"
          >
            Translate to Spanish
          </Button>
          <Button 
            onClick={() => handleTranslateMissions('fr')} 
            disabled={isTranslating}
            className="w-full"
          >
            Translate to French
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Feats</h4>
          <Button 
            onClick={() => handleTranslateFeats('es')} 
            disabled={isTranslating}
            className="w-full"
          >
            Translate to Spanish
          </Button>
          <Button 
            onClick={() => handleTranslateFeats('fr')} 
            disabled={isTranslating}
            className="w-full"
          >
            Translate to French
          </Button>
        </div>
      </div>
    </Card>
  );
};
