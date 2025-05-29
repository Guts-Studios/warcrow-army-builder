
import { Unit } from "@/types/army";

export const eskold_the_executioner: Unit = {
  id: "eskold_the_executioner",
  name: "Eskold the Executioner",
  pointsCost: 30,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Varank", description: "" },
    { name: "Join (Infantry Varank)", description: "" },
    { name: "Join (Calvary Warg)", description: "" },
    { name: "Elite", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: [],
  imageUrl: "/art/card/eskold_the_executioner_card.jpg"
};
