
import { Unit } from "@/types/army";

export const tattooist: Unit = {
    id: "tattooist",
    name: "Tattooist",
    name_es: "Tatuadora",
    pointsCost: 15,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Join (Infantry Varank)", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/tattooist_card.jpg"
  };
