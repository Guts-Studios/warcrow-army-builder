
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  // Nadezhda Lazard, Champion of Embersig - NOT high command
  {
    id: "nadezhda_lazard_champion_of_embersig",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    highCommand: false,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)"],
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card.jpg"
  },
  // Marhael The Refused - NOT high command, regular character
  {
    id: "marhael_the_refused",
    name: "Marhael The Refused",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    highCommand: false, // Corrected: NOT high command
    command: 2,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
      // Removed "High Command" keyword since he's not high command
    ],
    specialRules: ["Fearless", "Spellcaster"],
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  }
];
