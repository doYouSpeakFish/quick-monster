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
enum DAMAGE_TYPES_ENUM {
    ACID = "acid",
    BLUDGEONING = "bludgeoning",
    COLD = "cold",
    FIRE = "fire",
    FORCE = "force",
    LIGHTNING = "lightning",
    NECROTIC = "necrotic",
    PIERCING = "piercing",
    POISON = "poison",
    PSYCHIC = "psychic",
    RADIANT = "radiant",
    SLASHING = "slashing",
    THUNDER = "thunder"
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
    damageTypesOrder: DAMAGE_TYPES_ENUM[] = [
        DAMAGE_TYPES_ENUM.ACID,
        DAMAGE_TYPES_ENUM.BLUDGEONING,
        DAMAGE_TYPES_ENUM.COLD,
        DAMAGE_TYPES_ENUM.FIRE,
        DAMAGE_TYPES_ENUM.FORCE,
        DAMAGE_TYPES_ENUM.LIGHTNING,
        DAMAGE_TYPES_ENUM.NECROTIC,
        DAMAGE_TYPES_ENUM.PIERCING,
        DAMAGE_TYPES_ENUM.POISON,
        DAMAGE_TYPES_ENUM.PSYCHIC,
        DAMAGE_TYPES_ENUM.RADIANT,
        DAMAGE_TYPES_ENUM.SLASHING,
        DAMAGE_TYPES_ENUM.THUNDER
    ];

    DAMAGE_TYPES = DAMAGE_TYPES_ENUM;

    private _cr: string = "5";
    targetDamage: number = 0;
    ac?: number;
    hp?: number;
    toHit?: number;
    dc?: number;

    strLevel: string = STRENGTH_LEVELS.VERY_STRONG;
    dexLevel: string = STRENGTH_LEVELS.AVERAGE;
    conLevel: string = STRENGTH_LEVELS.STRONG;
    intLevel: string = STRENGTH_LEVELS.WEAK;
    wisLevel: string = STRENGTH_LEVELS.AVERAGE;
    chaLevel: string = STRENGTH_LEVELS.AVERAGE;

    actions: MonsterAction[] = [];

    constructor(public monsterBases: Map<string, MonsterStatBase>) {
        this.update();
    }

    private update(): void {
        this.ac = this.monsterBases.get(this.cr)!.ac;
        this.hp = this.monsterBases.get(this.cr)!.hp;
        this.toHit = this.monsterBases.get(this.cr)!.attack;
        this.targetDamage = this.monsterBases.get(this.cr)!.damage;
        this.dc = this.monsterBases.get(this.cr)!.dc;
        this.calcDice();
    }

    public get cr(): string {
        return this._cr;
    }
    public set cr(value: string) {
        this._cr = value;
        this.update();
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
        this.calcDice();
    }

    calcDice(): void {
        let targetTotalDamage = this.monsterBases.get(this.cr)!.damage;
        let multiAttackTotal = 0;
        let numLimitedUseAttacks = 0;
        let limitedUseMultiplier = 1;
        let atWillMultiplier = 1;
        for (let action of this.actions) {
            if (action.multiAttack != 0 && !action.limitedUse) {
                multiAttackTotal += action.totalDamage;
            }
            if (action.limitedUse) {
                numLimitedUseAttacks += 1;
            }
        }

        // Scale limited use damage higher
        // note that if there are three limited use attacks, they are not really limited use so are not adjusted
        if (numLimitedUseAttacks == 1) {
            limitedUseMultiplier = 1.5;
            atWillMultiplier = 0.75;
        } else if (numLimitedUseAttacks == 2) {
            limitedUseMultiplier = 1.25;
            atWillMultiplier = 0.5;
        }

        for (let action of this.actions) {
            let multiplier = 1;
            if ((multiAttackTotal != 0) && (action.multiAttack != 0)) {
                multiplier = action.totalDamage / multiAttackTotal;
            }
            if (action.limitedUse) {
                multiplier *= limitedUseMultiplier;
            } else {
                multiplier *= atWillMultiplier;
            }
            // TODO cap max damage
            action.calcDamage(targetTotalDamage * multiplier);
        }

        // Calc actual monster damage.
        // make a priority queue for actions ordered by their damage
        // 1. calc damage done by each regular at will actions and add to queue
        // 2. calc damage done by at will multi-attack actions. add to Q
        // 3. calc damage done by limited use actions that are part of multi-attack + at will multi-attack. add to Q
        // 4. calc damage done by limited use actions that are not part of multi-attack. add to Q
        // then calc first three round damage by using the highest damage action each round. pop limited use from the Q if used
        //
        // when legendary actions are added, this will need to have a second Q for legendary actions.
        // 
        // damage should be capped for each action to avoid one hit kills. how to do this for multi-attack?
        //
        // damage should be normalized so that total three round damage equals target three round damage
        // should action damage be capped before adding up total damage?
        // no. this avoids 3 round damage being too high. it might be too low when some actions are capped, but this is better.
        // perhaps add a display to show how the actual damage lines up with the target damage.
    
    }

} 