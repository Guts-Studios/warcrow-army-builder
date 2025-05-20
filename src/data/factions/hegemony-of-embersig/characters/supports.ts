
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigSupports: Unit[] = [
  {
    id: "aide",
    name: "Aide",
    faction: "hegemony-of-embersig",
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
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false,
    imageUrl: "/art/card/gale_falchion_card.jpg"
  }
];
