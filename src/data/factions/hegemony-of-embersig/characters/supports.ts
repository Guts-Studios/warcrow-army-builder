
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigSupports: Unit[] = [
  {
    id: "aide",
    name: "Aide",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    specialRules: ["Place (10)"],
    highCommand: false,
    imageUrl: "/art/card/aide_card.jpg"
  },
  {
    id: "frostfire-herald",
    name: "Frostfire Herald",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    specialRules: ["Slowed", "Impassable"],
    highCommand: false,
    imageUrl: "/art/card/frostfire_herald_card.jpg"
  },
  {
    id: "gale-falchion",
    name: "Gale Falchion",
    name_es: "Alfanje Del Vendaval",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/gale_falchion_card.jpg"
  }
];
