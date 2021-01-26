import { MonsterAction } from "./monster-action";

export interface Monster {
    
    cr: number;
    ac: number;
    hp: number;

    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;

    actions: MonsterAction[];

} 