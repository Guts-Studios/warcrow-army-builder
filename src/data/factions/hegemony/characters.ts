import { Unit } from "../../../types/army";

export const hegemonyCharacters: Unit[] = [
  {
    id: "aide",
    name: "Aide",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/aide_card.jpg"
  },
  {
    id: "corporal",
    name: "Corporal",
    faction: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Human, Infantry)", description: "Can join Human Infantry units" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/corporal_card.jpg"
  },
  {
    id: "frostfire-herald",
    name: "Frostfire Herald",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/frostfire_herald_card.jpg"
  },
  {
    id: "gunnery-corporal",
    name: "Gunnery Corporal",
    faction: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Arquebusiers | Pioneers)", description: "Can join Arquebusiers or Pioneers units" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/Gunnery_Corporal_card.jpg"
  },
  {
    id: "hetman",
    name: "Hetman",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: true,
    imageUrl: "/src/art/card/hetman_card.jpg"
  },
  {
    id: "war-surgeon",
    name: "War Surgeon",
    faction: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/war_surgeon_card.jpg"
  }
];