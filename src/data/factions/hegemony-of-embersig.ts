import { Unit } from "../../types/army";

export const hegemonyOfEmbersigUnits: Unit[] = [
  // Troops
  {
    id: "agressors",
    name: "Agressors",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],
    highCommand: false
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    faction: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 3,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],
    highCommand: false
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 2,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Cover", description: "Provides cover" },
      { name: "Immovable", description: "Cannot be moved" },
    ],
    highCommand: false
  },
  {
    id: "pioneers",
    name: "Pioneers",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Scout", description: "Has scouting abilities" },
    ],
    highCommand: false
  },
  // Characters
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
    highCommand: false
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
    highCommand: false
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
    highCommand: false
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
    highCommand: false
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
    highCommand: true
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
    highCommand: false
  },
  // Named Characters
  {
    id: "dragoslav-bjelogric",
    name: "Dragoslav Bjelogríc",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Bloodlust (Varank)", description: "Has Bloodlust against Varank" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Bucklermen | Bulwark)", description: "Can join Bucklermen or Bulwark units" },
    ],
    highCommand: true
  },
  {
    id: "lady-telia",
    name: "Lady Télia",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Scout", description: "Has scouting abilities" },
      { name: "Join (Arquebusiers | Pioneers)", description: "Can join Arquebusiers or Pioneers units" },
    ],
    highCommand: false
  },
  {
    id: "marhael-the-refused",
    name: "Marhael the Refused",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false
  },
  {
    id: "nadezhda-lazard",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: false
  }
];