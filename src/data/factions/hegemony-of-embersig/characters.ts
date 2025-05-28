
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  {
    id: "aide",
    name: "Aide",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Fearless", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    availability: 1,
    command: 1,
    specialRules: ["Place (10)"],
    highCommand: false,
    imageUrl: "/art/card/aide_card_en.jpg"
  },
  {
    id: "corporal",
    name: "Corporal",
    pointsCost: 15,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Human Infantry)", description: "" }
    ],
    availability: 1,
    command: 2,
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/corporal_card_en.jpg"
  },
  {
    id: "frostfire-herald",
    name: "Frostfire Herald",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Fearless", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: ["Slowed", "Impassable"],
    highCommand: false,
    imageUrl: "/art/card/frostfire_herald_card_en.jpg"
  },
  {
    id: "gunnery-corporal",
    name: "Gunnery Corporal",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Arquebusiers)", description: "" },
      { name: "Join (Pioneers)", description: "" }
    ],
    availability: 1,
    command: 1,
    specialRules: ["Repeat a die"],
    highCommand: false,
    imageUrl: "/art/card/gunnery_corporal_card_en.jpg"
  },
  {
    id: "war-surgeon",
    name: "War Surgeon",
    pointsCost: 15,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Infantry)", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/war_surgeon_card_en.jpg"
  },
  {
    id: "lady-telia",
    name: "Lady Télia",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Elite", description: "" },
      { name: "Scout", description: "" },
      { name: "Join (Arquebusiers)", description: "" },
      { name: "Join (Pioneers)", description: "" }
    ],
    availability: 1,
    command: 2,
    specialRules: ["Frightened", "Aim", "Repeat a Die"],
    highCommand: false,
    imageUrl: "/art/card/lady_telia_card_en.jpg"
  },
  {
    id: "marhael-the-refused",
    name: "Marhael the Refused",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Fearless", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    availability: 1,
    command: 1,
    specialRules: ["Place (11)"],
    highCommand: false,
    imageUrl: "/art/card/marhael_the_refused_card_en.jpg"
  },
  {
    id: "nadezhda-lazard-champion-of-embersig",
    name: "Nadezhda Lazard, Champion of Embersig",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Infantry)", description: "" }
    ],
    availability: 1,
    command: 2,
    specialRules: ["Disarmed", "Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card_en.jpg"
  },
  {
    id: "nayra-caladren",
    name: "Nayra Caladren",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Elf", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: ["Disarmed", "Slowed", "Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/nayra_caladren_card_en.jpg"
  },
  {
    id: "naegon-caladren",
    name: "Naegon Caladren",
    pointsCost: 15,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Elf", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    availability: 1,
    command: 1,
    specialRules: ["Place (5)", "Disarmed", "Displace (5)", "Frightened"],
    highCommand: false,
    imageUrl: "/art/card/naergon_caladren_card_en.jpg"
  },
  {
    id: "trabor-slepmund",
    name: "Trabor Slepmund",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Dwarf", description: "" },
      { name: "Ghent", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Join (War Rig)", description: "" }
    ],
    availability: 1,
    command: 1,
    specialRules: ["Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/trabor_slepmund_card_en.jpg"
  },
  {
    id: "gale-falchion",
    name: "Gale Falchion",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/gale_falchion_card_en.jpg"
  },
  {
    id: "engineer",
    name: "Engineer",
    pointsCost: 15,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Ghent", description: "" },
      { name: "Dwarf", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Join (Infantry)", description: "" },
      { name: "Join (War Machine)", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/engineer_card_en.jpg"
  },
  {
    id: "ansera-noighman",
    name: "Ansera Noighman",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Ghent", description: "" },
      { name: "Dwarf", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Join (Infantry)", description: "" },
      { name: "Join (War Machine)", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/ansera_noighman_card_en.jpg"
  },
  {
    id: "vercana",
    name: "Vercana",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Mercenary", description: "" },
      { name: "Ambusher", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: ["Place (5)"],
    highCommand: false,
    imageUrl: "/art/card/vercana_card_en.jpg"
  },
  {
    id: "strategos",
    name: "Strategos",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Infantry)", description: "" }
    ],
    availability: 1,
    command: 1,
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/strategos_card_en.jpg"
  }
];
