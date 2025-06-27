
import { Unit } from "@/types/army";

export const battle_scarred: Unit = {
    id: "battle-scarred",
    name: "Battle-Scarred",
    name_es: "Cicatrices De Batalla", 
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Orc", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed", "Vulnerable", "Frightened", "Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/battle-scarred_card.jpg"
  };
