
import { Unit } from "@/types/army";

export const hegemonyCharactersSpecialists: Unit[] = [
  {
    id: "war-surgeon",
    name: "War Surgeon",
    faction: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/war_surgeon_card.jpg"
  },
  {
    id: "gunnery-corporal",
    name: "Gunnery Corporal",
    faction: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Arquebusiers | Pioneers)", description: "Can join Arquebusiers or Pioneers units" },
    ],
    specialRules: ["Repeat a Die"],
    highCommand: false,
    imageUrl: "/art/card/gunnery_corporal_card.jpg"
  },
  {
    id: "engineer",
    name: "Engineer",
    faction: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Dispel (BLU)", description: "Can dispel blue dice" },
      { name: "Join (Infantry | War Machine)", description: "Can join Infantry or War Machine units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/engineer_card.jpg"
  },
  {
    id: "ansera-noighman",
    name: "Ansera Noighman",
    faction: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Dispel (BLU)", description: "Can dispel blue dice" },
      { name: "Join (Infantry | War Machine)", description: "Can join Infantry or War Machine units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/ansera_noighman_card.jpg"
  }
];
