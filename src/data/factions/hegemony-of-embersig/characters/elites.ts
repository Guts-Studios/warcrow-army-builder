
import { Unit } from "@/types/army";

export const hegemonyCharactersElites: Unit[] = [
  {
    id: "nadezhda-lazard",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    specialRules: ["Disarmed", "Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card.jpg"
  },
  {
    id: "lady-telia",
    name: "Lady Télia",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Scout", description: "Has scouting abilities" },
      { name: "Join (Arquebusiers | Pioneers)", description: "Can join Arquebusiers or Pioneers units" },
    ],
    specialRules: ["Frightened", "Aim", "Repeat a Die"],
    highCommand: false,
    imageUrl: "/art/card/lady_telia_card.jpg"
  },
  {
    id: "marhael-the-refused",
    name: "Marhael the Refused",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    specialRules: ["Place (11)"],
    highCommand: false,
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  },
  {
    id: "nayra-caladren",
    name: "Nayra Caladren",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Colossal Company unit" },
      { name: "Elf", description: "Elf race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    specialRules: ["Disarmed", "Slowed", "Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/nayra_caladren_card.jpg"
  },
  {
    id: "naergon-caladren",
    name: "Naergon Caladren",
    faction: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Colossal Company unit" },
      { name: "Elf", description: "Elf race" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    specialRules: ["Place (5)", "Disarmed", "Displace (5)", "Frightened"],
    highCommand: false,
    imageUrl: "/art/card/naergon_caladren_card.jpg"
  },
  {
    id: "trabor-slepmund",
    name: "Trabor Slepmund",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Colossal Company unit" },
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Dispel (BLU)", description: "Can dispel blue dice" },
      { name: "Join (War Rig)", description: "Can join War Rig units" },
    ],
    specialRules: ["Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/trabor_slepmund_card.jpg",
    companion: "MK-OS Automata"
  }
];
