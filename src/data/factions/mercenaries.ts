
import { Unit } from "@/types/army";
import { vercana as vercanaHegemony } from "./hegemony-of-embersig/characters/vercana";
import { vercana as vercanaNorthern } from "./northern-tribes/characters/vercana";
import { vercana as vercanaSyenann } from "./syenann/characters/vercana";
import { vercana as vercanaScions } from "./scions-of-yaldabaoth/characters/vercana";

// Generate extended mercenary lists for each faction
export const hegemonyMercenaries: Unit[] = [vercanaHegemony];
export const northernTribesMercenaries: Unit[] = [vercanaNorthern];
export const syenannMercenaries: Unit[] = [vercanaSyenann];
export const scionsMercenaries: Unit[] = [vercanaScions];

// Make sure all mercenaries have the Mercenary keyword
