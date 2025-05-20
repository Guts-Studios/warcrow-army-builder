
import { Unit } from "@/types/army";

export const hegemonyCharactersElites: Unit[] = [
  {
    id: "nayra-caladren",
    name: "Nayra Caladren",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of the Colossal Company" },
      { name: "Elf", description: "Elf race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Fearless", description: "Immune to fear effects" },
      { name: "Spellcaster", description: "Can cast spells" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Disarmed", "Slowed", "Vulnerable"],
    imageUrl: "/art/card/nayra_caladren_card.jpg"
  },
  {
    id: "naegon-caladren",
    name: "Naegon Caladren",
    pointsCost: 15,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of the Colossal Company" },
      { name: "Elf", description: "Elf race" },
      { name: "Spellcaster", description: "Can cast spells" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Place (5)", "Disarmed", "Displace (5)", "Frightened"],
    imageUrl: "/art/card/naergon_caladren_card.jpg"
  },
  {
    id: "trabor-slepmund",
    name: "Trabor Slepmund",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of the Colossal Company" },
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Ghent", description: "Ghent cultural group" },
      { name: "Dispel (BLU)", description: "Can dispel BLU effects" },
      { name: "Join (War Rig)", description: "Can join War Rig units" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Disarmed"],
    imageUrl: "/art/card/trabor_slepmund_card.jpg"
  }
];
