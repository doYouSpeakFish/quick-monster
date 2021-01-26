import { MonsterStatBase } from "./metrics";
import { MonsterAction } from "./monster-action";

enum STRENGTH_LEVELS {
    EXTREMELY_WEAK = "extremely weak",
    VERY_WEAK = "very weak",
    WEAK = "weak",
    AVERAGE = "average",
    STRONG = "strong",
    VERY_STRONG = "very strong",
    CORE_ABILITY = "core ability"
}

export class Monster {

    STRENGTH_LEVELS_ORDERED: STRENGTH_LEVELS[] = [
        STRENGTH_LEVELS.EXTREMELY_WEAK,
        STRENGTH_LEVELS.VERY_WEAK,
        STRENGTH_LEVELS.WEAK,
        STRENGTH_LEVELS.AVERAGE,
        STRENGTH_LEVELS.STRONG,
        STRENGTH_LEVELS.VERY_STRONG,
        STRENGTH_LEVELS.CORE_ABILITY
    ];

    private _cr: string = "5";
    ac: number;
    hp: number;

    strLevel: string = STRENGTH_LEVELS.VERY_STRONG;
    dexLevel: string = STRENGTH_LEVELS.AVERAGE;
    conLevel: string = STRENGTH_LEVELS.STRONG;
    intLevel: string = STRENGTH_LEVELS.WEAK;
    wisLevel: string = STRENGTH_LEVELS.AVERAGE;
    chaLevel: string = STRENGTH_LEVELS.AVERAGE;

    actions: MonsterAction[] = [];

    constructor(public monsterBases: Map<string, MonsterStatBase>) {
        this.ac = monsterBases.get(this.cr)!.ac;
        this.hp = monsterBases.get(this.cr)!.hp;
    }

    public get cr(): string {
        return this._cr;
    }
    public set cr(value: string) {
        this._cr = value;
        this.calcDice();
    }

    addAction(): void {
        this.actions.push(new MonsterAction(this, this.monsterBases));
        this.calcDice();
    }

    removeAction(action: MonsterAction): void {
        let i = this.actions.indexOf(action);
        if (i > -1) {
            this.actions.splice(i, 1);
        }
    }

    calcDice(): void {
        let damage = this.monsterBases.get(this.cr)!.damage;
        let multiAttackTotal = 0;
        for (let action of this.actions) {
            if (action.multiAttack) {
                multiAttackTotal += action.totalDamage;
            }
        }
        for (let action of this.actions) {
            let multiplier = 1;
            if (multiAttackTotal && action.multiAttack) {
                multiplier = action.totalDamage / multiAttackTotal;
            }
            action.calcDamage(damage * multiplier);
        }
    }

} 