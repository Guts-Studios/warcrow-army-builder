import { Faction, Unit } from "../types/army";

export const factions: Faction[] = [
  { id: "northern-tribes", name: "Northern Tribes" },
  { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
];

export const units: Unit[] = [
  // Northern Tribes - Troops
  {
    id: "battle-scarred",
    name: "Battle-Scarred",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 3,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Fearless", description: "Has the Fearless ability" },
    ],
    highCommand: false
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 2,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Preferred Terrain (Rugged)", description: "Gains advantages in rugged terrain" },
      { name: "Scout", description: "Has scouting abilities" },
    ],
    highCommand: false
  },
  // Northern Tribes - Characters
  {
    id: "contender",
    name: "Contender",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false
  },
  {
    id: "darkmaster",
    name: "Darkmaster",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Ambusher", description: "Has ambush abilities" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Join (Hunters)", description: "Can join Hunter units" },
    ],
    highCommand: false
  },
  {
    id: "evoker",
    name: "Evoker",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false
  },
  {
    id: "hersir",
    name: "Hersir",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Beserker Rage", description: "Has Berserker Rage" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    highCommand: false
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false
  },
  {
    id: "wisemane",
    name: "Wisemane",
    faction: "northern-tribes",
    pointsCost: 15,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
    ],
    highCommand: false
  },
  {
    id: "wrathmane",
    name: "Wrathmane",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Elite", description: "Elite unit" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: true
  },
  // Northern Tribes - Named Characters
  {
    id: "ahlwardt",
    name: "Ahlwardt, Ice Bear",
    faction: "northern-tribes",
    pointsCost: 60,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Varank", description: "Varank race" },
      { name: "Beserker Rage", description: "Has Berserker Rage" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Skin Changers)", description: "Can join Skin Changers units" },
    ],
    highCommand: true
  },
  {
    id: "alborc",
    name: "Alborc",
    faction: "northern-tribes",
    pointsCost: 50,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc | Infantry, Varank)", description: "Can join Infantry Orc or Infantry Varank units" },
      { name: "Elite", description: "Elite unit" },
    ],
    highCommand: true
  },
  {
    id: "lotta",
    name: "Lotta",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false
  },
  {
    id: "njord",
    name: "Njord",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Beserker Rage", description: "Has Berserker Rage" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    highCommand: false
  },
  // Hegemony of Embersig - Troops
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
  // Hegemony of Embersig - Characters
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
  // Hegemony of Embersig - Named Characters
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
  },
];