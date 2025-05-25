
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  // Nadezhda Lazard, Champion of Embersig - NOT high command
  {
    id: "nadezhda_lazard_champion_of_embersig",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
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
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Fearless", "Spellcaster"],
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  },
  // Aide - from CSV
  {
    id: "aide",
    name: "Aide",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Fearless", "Spellcaster", "Place (10)"],
    imageUrl: "/art/card/aide_card.jpg"
  },
  // War Surgeon - from CSV
  {
    id: "war_surgeon",
    name: "War Surgeon",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)"],
    imageUrl: "/art/card/war_surgeon_card.jpg"
  },
  // Ansera Noighman - from CSV
  {
    id: "ansera_noighman",
    name: "Ansera Noighman",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Ghent", description: "" },
      { name: "Dwarf", description: "" }
    ],
    specialRules: ["Dispel (BLU)", "Join (Infantry | War Machine)"],
    imageUrl: "/art/card/ansera_noighman_card.jpg"
  },
  // Gale Falchion - from CSV
  {
    id: "gale_falchion",
    name: "Gale Falchion",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Spellcaster"],
    imageUrl: "/art/card/gale_falchion_card.jpg"
  }
];
