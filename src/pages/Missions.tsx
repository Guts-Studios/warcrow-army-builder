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
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { AdminOnly } from "@/utils/adminUtils";

const missionsData: Mission[] = [
  {
    id: "1",
    title: "Consolidated Progress",
    details: "Preparation\n\nPlace 5 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\n\nEach round lasts for 5 turns.\n\nScoring\n\nAt the end of each round, you obtain:\n\n• 1 VP if you control the central objective\n• 1 VP if you control your opponent's objective (1)\n• 2 VPs if you control your opponent's objective (2)\n• 1 VP if your opponent controls neither of your objectives (1 and 2)\n\nEnd of the game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points, the result will be a tie",
    isHomebrew: false,
  },
  {
    id: "2",
    title: "Take Positions",
    details: "Preparation\n\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\n\nEach round lasts for 5 turns.\n\nScoring\n\nAt the end of each round, you obtain:\n\n• 1 VP for each objective you control with your opponent's color.\n• 1 VP if your opponent doesn't control any of the objectives of your color.\n\nEnd of the game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield. If you have more Victory Points than your opponent at the end of the game, you win.\n\nIf you and your opponent have the same number of Victory Points, the result will be a tie.",
    isHomebrew: false,
  },
  {
    id: "3",
    title: "Fog of Death",
    details: "Preparation\n\nPlace an objective marker in the center of the battlefield, as shown in the diagram. This marker represents an ancient and powerful arcane artifact capable of manipulating the fog that surrounds the companies.\n\nThe player who deploys first must place a conquest marker (showing its color) adjacent to the objective marker. This marker indicates which side controls the artifact at all times, so it begins under the control of the first company to deploy.\n\nPlace the four Fog markers each in one corner of the battlefield, as shown in the diagram.\n\nPlace an event token on position 3 of the turn counter.\n\nRounds\n\nEach round lasts for 4 turns.\n\nEvent\n\nWhen the event is activated do the following:\n\n• Displace all Fog markers Displace 10 strides in the direction of the conquest marker.\n• All units within 8 strides of any of the Fog markers must resolve a \"Fog Effects\" roll for each Fog marker within 8 strides of them. Whoever has the initiative decides which side resolves all their rolls first.\n• Advance the event token 3 positions on the turn counter.\n\nArcane artefact\n\nCompany units in control of the objective, which are within 3 strides of it, can perform the action:\n\nControl energy. Take a WP test. If you succeed, move the conquest marker in the desired direction 5 strides for each Success obtained.\n\nConquest marker\n\nThe conquest marker must always show the color of the side that controls the objective.\n\nAt the end of each turn, whoever controls the artifact (target) can move the conquest marker 2 strides in any direction. This marker can never end on units or terrain elements.\n\nFog effects\n\nWhen the event is activated, units within 8 strides of a Fog marker must roll ORG and apply the effects from the following table according to the result obtained. Units must resolve as many rolls as there are Fog markers within 8 strides.\n\nResult       Effect\n\nSuccess - The unit must face to face roll its defense roll against as many Success as there are troops in it and suffers as much damage as Success not canceled.\n\nSuccess, Special -  The unit must face to face roll its defense roll at 2 Sucess for each troop that is part of it and suffers as much damage as Success not canceled.\n\nSuccess, Hollow Special - The unit must face to face roll its defense roll against as many Success as there are troops in it and suffers as much damage as Success not canceled. The unit is stressed.\n\nHollow Success, Special -  The unit must face to face roll its defense roll at 4 Success and takes as much damage as Success not canceled.\n\nSpecial - The unit must face to face roll its defense roll at 6 Success and takes as much damage as Success not canceled. The unit becomes stressed.\n\nHollow Special -  Disoriented. The unit must make a move using its first MOV value in the direction indicated by its opponent.\n\nScoring\n\nYou gain 1 VP if you control the artifact (objective) and a Fog marker comes into contact with the conquest marker. In this case, remove the Fog marker from the game.\n\nAt the end of each round, you get:\n• 2 VPs if you control the artifact (objective)\n\nEnd of the game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points, the result will be a tie.",
    isHomebrew: false,
  },
  {
    id: "4",
    title: "Influence Zones",
    details: "Required material\n\n• 2 red objective markers.\n• 2 blue objective markers.\n• 1 brown objective marker.\n\nRounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company obtains:\n\n• 1 MP if they control more objectives than their rival.\n• 1 MP if they control at least one objective of their rival's color.\n• 1 MP if they control at least 2 objectives.\n\nEnd of the game\n\nThe game ends at the end of round 3.\n\nStrategic domain\n\n• All units that are not demoralized have their conquest value increased by 1.\n• Conquest modifiers are not increased.\n\nInfluence zones\n\nUnits may contest control of objectives at 7 strides instead of 3.",
    isHomebrew: false,
  },
  {
    id: "5",
    title: "Expanse",
    details: "Required material\n\n• 4 brown objective markers.\n• 1 blue objective marker.\n\nPreparation\n\nBrown objective markers start the game controlled by the company that has their deployment zone adjacent to them.\n\nRounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company obtains:\n\n• 2 MP if they control more brown objectives than their rival.\n• 1 MP if they control the same amount of brown objectives as their rival.\n• 1 MP if they control the central objective (blue).\n\nEnd of the game\n\nThe game ends at the end of round 3.",
    isHomebrew: false,
  },
  {
    id: "6",
    title: "Loot",
    details: "Required material\n\n• 2 red objective markers.\n• 2 blue objective markers.\n• 1 brown objective marker.\n\nRounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company obtains:\n\n• 1 MP if they have at least 1 loot.\n• 1 MP if they have more loot than their rival.\n• 1 MP if their rival has no loot.\n\nEnd of the game\n\nThe game ends at the end of round 3.\n\nLoot\n\nObjective markers are used to represent loot.\n\nThey use the following rules instead of those from the rulebook:\n\n• A unit adjacent to an objective marker may stress itself to pick it up (placing it on their profile card).\n• Units may move through an objective marker but cannot end their movement on one.\n• Units cannot pick up objective markers of their rival's color.\n• Units cannot carry more than 1 objective marker at the same time.\n• When a unit carrying loot is destroyed, the company controlling it places the loot adjacent to their leader before removing it from the battlefield. If the unit has an Officer Character joined, it may instead give the loot to the Character.\n• When a unit carrying loot becomes demoralized, place the objective marker adjacent to their leader before fleeing.\n• If a Character leaves a unit carrying loot, it can choose to take the loot or leave it in the unit.",
    isHomebrew: false,
  },
  {
    id: "7",
    title: "Quadrants",
    details: "Rounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company gets:\n\n• 2 MP if they control more quadrants than their rival.\n• 1 MP if they control the same amount of quadrants as their rival.\n• 1 MP if they control at least 1 quadrant adjacent to their rival's deployment zone.\n\nEnd of the game\n\nThe game ends at the end of round 3.\n\nStrategic domain\n\n• All units that are not demoralized have their conquest value increased by 1.\n• Conquest value modifiers (from skills and effects) are not increased.\n\nQuadrants\n\nThe battlefield (not including deployment zones) is divided into four quadrants, which can be controlled as if they were objectives although no objective markers are used.\n\nUnits can contest control of a quadrant if their leader is within the quadrant (a leader whose base is in contact with more than one quadrant is not within any quadrant, so their unit cannot control or contest any quadrant).\n\nAlthough no objective markers are used, a conquest marker is placed in each quadrant to indicate which company controls it.",
    isHomebrew: false,
  },
  {
    id: "8",
    title: "Battle Lines",
    details: "Preparation\n\nPlace 6 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\n\nEach round lasts 5 turns.\n\nScoring\n\nAt the end of each round, you obtain:\n• 2 VP for controlling your opponent's color objective (A).\n• 1 VP for controlling your color objective (A).\n• 1 VP for controlling each neutral objective (B or C).\n• 1 VP for controlling both neutral objectives (B and C)\n\nEnd of game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nSpecial Rules\n\nThe Supply Chest– Use a 30mm objective marker to represent the Supply Chest. Place the Supply chest as indicated by the Objective S on the map. The Supply Chest behaves like an objective, but the players start the game controlling their color supply chest. While you control your Supply Chest, once per Round after a unit activates, choose another unit within 20 strides of one of your color objectives that you control. This unit may activate and perform only one action, and it does not receive stress or an activation token. If your opponent controls a Supply Chest at the end of any round, remove the Supply Chest from the game.\n\nThis Homebrew mission was created by our Community member Anthony Pham, aka Viridian",
    isHomebrew: true,
  },
  {
    id: "9",
    title: "Breached Front",
    details: "Preparation\n\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\n\nEach round lasts 5 turns.\n\nScoring\n\nAt the end of each round, you obtain:\n• 2 VP for controlling the center neutral objective (1).\n• 1 VP for controlling East neutral objective (2).\n• 1 VP for controlling your color objective\n• 1 VP for controlling your opponent's color objective\n\nEnd of the game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield. If you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nThis Homebrew mission was created by our Community member Anthony Pham, aka Viridian",
    isHomebrew: true,
  },
  {
    id: "10",
    title: "Ghosts from the Mist",
    details: "Preparation\n\nPlace 4 fog ghosts (represented by generic objective markers) at centerline of the battlefield, also place 2 coloured objective markers on each half of the battlefield as shown in the diagram.\nPlace an event marker on position 2 on a dial.\n\nRounds\n\nEach round lasts 4 turns\n\nEvent\n\nWhen event is activated do the following:\n\nStarting with a player who has the initiative, whoever controls fog ghost markers can place them 5 strides from their current position.\nIf fog ghost marker player controls is placed adjusted to enemy unit- that unit must roll defence roll at **** and takes as much damage as * is not blocked.\nIf fog ghost marker player controls is placed adjusted to allied unit- that unit may clear 1 stress.\nAdvance event token 2 positions on the turn counter.\n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP if more fog ghosts are fully on the opponent's half of the board than on your side of a board.\n- 1 VP if you control 3 fog ghosts or more\n- 1 VP if you control at least 1 fog ghost\n- 3 VP if fog ghost under your control is within 3 of the objective marker of your colour for each fog ghost marker within 3 of the objective marker of your colour. After scoring VPs this way, remove every fog ghost marker under your control within 3 of the objective marker of your colour from the game.\n\nEnd of the Game\n\nThe game ends at the end of round 3 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm",
    isHomebrew: true,
  },
  {
    id: "11",
    title: "Sacred Land",
    details: "Preparation\n\nPlace 2 sacred altars and 3 lesser altars objective markers as shown in the diagram.\n\nRounds\n\nFirst round lasts 2 turns, Second round lasts 3 turns, Third round lasts 4 turns and Fourth round lasts 5 turns\n\nPrayers and Offerings\n\nIn this mission any unit may use special simple action Pray and special command ability Deity Offering\n\nPray: when your unit is within 3 from the lesser altar - you can use this action. Mark the unit that took this action with a Prayer token, it gets +1 to the conquest characteristic until the end of the game. This action can be used multiple times, to get multiple +1 conquest.\n\nDeity Offering: when your unit is within 3 from the sacred altar - you can use this command ability during the unit's activation.\n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP if you control 2 or more lesser altars\n- 1 VP if you control 1 or more sacred altars\n- 1 VP if one or more units of your units with Prayer token is within 3 of lesser altar\n- 2 VP if one or more of your units with Prayer token are within 3 of sacred altar and they have High command characteristic or Spellcaster characteristic\n- 3 VP if you used Deity Offering on both sacred altars. You can score this 3 VPs only once per game.\n\nEnd of the Game\n\nThe game ends at the end of round 4 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm",
    isHomebrew: true,
  },
  {
    id: "12",
    title: "Rescue Mission",
    details: "Preparation\n\nPlace 6 Fallen comrade markers(represented by coloured objective markers) as shown in the diagram.\nPlace an event marker on position 5 on a dial.\n\nRounds\n\nEach round lasts 4 turns\n\nEvent\n\nWhen event is activated do the following:\n\nReplace all Fallen comrade markers with Mournful sights markers (represented by coloured objective markers of the same colour).\n\nRemove the event marker from the dial.\n\nRescuing the wounded\n\nIn this mission any unit may use special simple action Ensure survival: when your unit is within 3 from the Fallen comrade marker of your colour - you can use this action.\nYou can choose to place Survivor token on this unit or on any allied unit within 8. You can recover 1 trooper model in that unit. Remove that Fallen comrade marker from the game.\n\nIf unit with Survivor token is destroyed - discard Survivor token.\nIf an officer or support leaves the unit, you can choose which of them retains the Survivor token.\n\nAvenge the fallen\n\nIn this mission after your unit inficts any amount of damage to an enemy unit- place 1 vengeance token on that unit (you can represent it by d6 dice)\nIf your unit destroys an enemy unit - place 3 vengeance tokens on that unit instead. Your unit can never have more than 6 vengeance tokens. If you have to place any excessive vengeance tokens on a unit- discard them so there are no more than 6 vengeance tokens on your unit.\nUnit can repeat the number of dice on your attack rolls up to the number of vengeance tokens on it.\n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP for each Fallen comrade token you control\n- 1 VP for each Survivor token on your units that are on the battlefield and are not engaged.\n- 1 VP for each 2 vengeance tokens on your units within 3 of Mournful sights markers of your colour. After scoring VPs this way, remove all the vengeance tokens from your units within 3 of Mournful sights markers of your colour.\n\nEnd of the Game\n\nThe game ends at the end of round 3 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm",
    isHomebrew: true,
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
  const { isAuthenticated, isWabAdmin } = useAuth();

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
        showNavigation={true}
      >
        <LanguageSwitcher />
      </PageHeader>
      
      <div className="container mx-auto px-4 py-8">
        {/* Translation Tools - Admin Only Section */}
        <AdminOnly 
          isAuthenticated={isAuthenticated} 
          isWabAdmin={isWabAdmin}
        >
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
        </AdminOnly>

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
