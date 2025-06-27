
import { Unit } from "@/types/army";

export const revenant: Unit = {
    id: "revenant",
    name: "Revenant",
    name_es: "Ya Muerto",
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Immovable", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Vulnerable"],
    tournamentLegal: true,
    imageUrl: "/art/card/revenant_card.jpg"
  };
