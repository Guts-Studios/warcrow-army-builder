import { Unit } from "@/types/army";
import { vercana } from "./characters/vercana";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  vercana,
  {
    id: "gale",
    name: "Gale",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Character", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Dispersed", "Terrifying", "Twinfate"],
    imageUrl: "/art/card/gale_card.jpg"
  },
  {
    id: "warden",
    name: "Warden",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Character", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Command (1)", "Shield Wall"],
    imageUrl: "/art/card/warden_card.jpg"
  },
  {
    id: "archmagister",
    name: "Archmagister",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Character", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Command (1)", "Heal"],
    imageUrl: "/art/card/archmagister_card.jpg"
  },
  {
    id: "magister",
    name: "Magister",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Character", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Heal"],
    imageUrl: "/art/card/magister_card.jpg"
  },
  {
    id: "the-iron-father",
    name: "The Iron Father",
    pointsCost: 60,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Character", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Fearless", "Shield Wall", "Slowed"],
    imageUrl: "/art/card/the_iron_father_card.jpg"
  }
];
