import { PipeTransform, Pipe } from "@angular/core";
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
    private _targetDamage: number = 0;
    private _damageScaler: number = 0;
    scalerOptions: number[] = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];
    hpScaler: number = 0;
    averageDamagePerRound: number = 0;
    ac: number;
    private _hp: number = 0;
    toHit: number;
    dc: number;
    save: number;
    proficiency: number;
    speed: string = "30";
    private _name: string = "Monster";

    private _strLevel: STRENGTH_LEVELS = STRENGTH_LEVELS.CORE_ABILITY;
    private _dexLevel: STRENGTH_LEVELS = STRENGTH_LEVELS.AVERAGE;
    private _conLevel: STRENGTH_LEVELS = STRENGTH_LEVELS.STRONG;
    private _intLevel: STRENGTH_LEVELS = STRENGTH_LEVELS.WEAK;
    private _wisLevel: STRENGTH_LEVELS = STRENGTH_LEVELS.AVERAGE;
    private _chaLevel: STRENGTH_LEVELS = STRENGTH_LEVELS.AVERAGE;

    strScore: number = 10;
    dexScore: number = 10;
    conScore: number = 10;
    intScore: number = 10;
    wisScore: number = 10;
    chaScore: number = 10;

    // Ability level getters and setters
    public get strLevel(): STRENGTH_LEVELS {
        return this._strLevel;
    }
    public set strLevel(value: STRENGTH_LEVELS) {
        this._strLevel = value;
        this.update();
    }

    public get dexLevel(): STRENGTH_LEVELS {
        return this._dexLevel;
    }
    public set dexLevel(value: STRENGTH_LEVELS) {
        this._dexLevel = value;
        this.update();
    }

    public get conLevel(): STRENGTH_LEVELS {
        return this._conLevel;
    }
    public set conLevel(value: STRENGTH_LEVELS) {
        this._conLevel = value;
        this.update();
    }

    public get intLevel(): STRENGTH_LEVELS {
        return this._intLevel;
    }
    public set intLevel(value: STRENGTH_LEVELS) {
        this._intLevel = value;
        this.update();
    }

    public get wisLevel(): STRENGTH_LEVELS {
        return this._wisLevel;
    }
    public set wisLevel(value: STRENGTH_LEVELS) {
        this._wisLevel = value;
        this.update();
    }

    public get chaLevel(): STRENGTH_LEVELS {
        return this._chaLevel;
    }
    public set chaLevel(value: STRENGTH_LEVELS) {
        this._chaLevel = value;
        this.update();
    }

    // Other getters and setters
    public get targetDamage(): number {
        return this._targetDamage * (1+this.damageScaler/100);
    }
    public set targetDamage(value: number) {
        this._targetDamage = value;
    }

    public calcAbilityMod(score: number) {
        return Math.floor((score - 10)/2);
    }
    
    public get damageScaler(): number {
        return this._damageScaler;
    }
    public set damageScaler(value: number) {
        this._damageScaler = value;
        console.log("Monster: damageScaler = " + value);
        this.calcDice();
    }

    public get hp(): number {
        return Math.round(this._hp * (1 + this.hpScaler/100));
    }
    public set hp(value: number) {
        this._hp = value;
    }

    private calcAbilityScore(level: STRENGTH_LEVELS): number {
        // TODO ability scores are calculating strangley as proficiency doesn't scale a the same time as save
        let coreAbilityScore: number = Math.max(11, (this.save - this.proficiency)*2 + 12);
        switch (level) {
            case STRENGTH_LEVELS.EXTREMELY_WEAK:
                return 2;
            case STRENGTH_LEVELS.VERY_WEAK:
                return 4;
            case STRENGTH_LEVELS.WEAK:
                return 8;
            case STRENGTH_LEVELS.AVERAGE:
                return 10;
            case STRENGTH_LEVELS.STRONG:
                return Math.round(10 + (coreAbilityScore-10)/3)
            case STRENGTH_LEVELS.VERY_STRONG:
                return Math.round(10 + 2*(coreAbilityScore-10)/3)
            case STRENGTH_LEVELS.CORE_ABILITY:
                return coreAbilityScore;
        }
    }

    actions: MonsterAction[] = [];

    constructor(public monsterBases: Map<string, MonsterStatBase>) {
        this.ac = this.monsterBases.get(this.cr)!.ac;
        this.hp = this.monsterBases.get(this.cr)!.hp;
        this.toHit = this.monsterBases.get(this.cr)!.attack;
        this.targetDamage = this.monsterBases.get(this.cr)!.damage;
        this.dc = this.monsterBases.get(this.cr)!.dc;
        this.save = this.monsterBases.get(this.cr)!.save;
        this.proficiency = this.monsterBases.get(this.cr)!.proficiency;
        this.strLevel = STRENGTH_LEVELS.CORE_ABILITY;
        this.dexLevel = STRENGTH_LEVELS.AVERAGE;
        this.conLevel = STRENGTH_LEVELS.STRONG;
        this.intLevel = STRENGTH_LEVELS.WEAK;
        this.wisLevel = STRENGTH_LEVELS.AVERAGE;
        this.chaLevel = STRENGTH_LEVELS.AVERAGE;
        this.calcDice();
    }

    private update(): void {
        this.ac = this.monsterBases.get(this.cr)!.ac;
        this.hp = this.monsterBases.get(this.cr)!.hp;
        this.toHit = this.monsterBases.get(this.cr)!.attack;
        this.targetDamage = this.monsterBases.get(this.cr)!.damage;
        this.dc = this.monsterBases.get(this.cr)!.dc;
        this.save = this.monsterBases.get(this.cr)!.save;
        this.proficiency = this.monsterBases.get(this.cr)!.proficiency;
        this.chaScore = this.calcAbilityScore(this.chaLevel);
        this.wisScore = this.calcAbilityScore(this.wisLevel);
        this.intScore = this.calcAbilityScore(this.intLevel);
        this.conScore = this.calcAbilityScore(this.conLevel);
        this.dexScore = this.calcAbilityScore(this.dexLevel);
        this.strScore = this.calcAbilityScore(this.strLevel);
        this.calcDice();
    }

    public multiattackCount(): number {
        let count: number = 0;
        for (let action of this.actions) {
            count += Number(action.multiAttack);
        }
        return count;
    }

    public getMultiAttackList(): Multiattack[] {
        let attacks: Multiattack[] = [];
        for (let action of this.actions) {
            if (action.multiAttack > 0) {
                let multiattack: Multiattack = {
                    name: action.name,
                    attackCount: action.multiAttack
                }
                attacks.push(multiattack)
            }
        }
        return attacks;
    }

    public get cr(): string {
        return this._cr;
    }
    public set cr(value: string) {
        this._cr = value;
        this.update();
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
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
        console.log("\nMonster: calculating action damages...")
        let targetTotalDamage = this.targetDamage;
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

        // Scale up damage for limited use options
        // note that if there are three limited use attacks, they are not really limited use so are not adjusted
        // This code might not be necessary with damage normalization code
        if (numLimitedUseAttacks == 1) {
            limitedUseMultiplier = 1.5;
            atWillMultiplier = 0.75;
        } else if (numLimitedUseAttacks == 2) {
            limitedUseMultiplier = 1.25;
            atWillMultiplier = 0.5;
        }

        let actionsTargetDamage: {monsterAction: MonsterAction, damage: number}[] = [];
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
            actionsTargetDamage.push({monsterAction: action, damage: targetTotalDamage * multiplier});
        }

        // Normalize the action damages so the actual three round damage equals the target three round damage
        let targetDmg3rounds = targetTotalDamage*3;
        let dmgNormalizer = targetDmg3rounds / Math.max(1, this.threeRoundDamage());
        console.log("Monster: renormalizing damage...");
        for (let action of actionsTargetDamage) {
            action.monsterAction.calcDamage(action.damage * dmgNormalizer);
        }
        console.log("Monster: target avg dmg over three rounds = " + targetDmg3rounds);
        this.threeRoundDamage();
    }

    threeRoundDamage(): number {
        let atWillMultiattackDamage: number = 0;
        let limitedMultiAttackDamage: number = 0;
        let actionsActualDamage: {monsterAction: MonsterAction, damage: number}[] = [];
        for (let action of this.actions) {
            let dmg: number = action.attackAverageDamage + action.saveAverageDamage;
            if (action.multiTarget) {
                // assume multi target attacks hit two creatures
                dmg *= 2;
            }
            if (action.multiAttack > 0) {
                if (action.limitedUse) {
                    limitedMultiAttackDamage += dmg * action.multiAttack;
                } else {
                    atWillMultiattackDamage += dmg * action.multiAttack;
                }
            } else {
                actionsActualDamage.push({monsterAction: action, damage: dmg});
            }
        }

        // Calc damage over first three rounds of combat by choosing max damage option during each round
        // Assumes that limited use actions can only be done once in the first three rounds.
        let actualDamage = 0; // Actual damage over first three rounds of combat
        let limitedMultiAttackUsed = false;
        for (let i=0; i<3; i++) {

            let multiAttackDamage = atWillMultiattackDamage;
            if (!limitedMultiAttackUsed) {
                multiAttackDamage += limitedMultiAttackDamage;
                limitedMultiAttackUsed = true;
            }

            if (actionsActualDamage.length == 0) {
                // multi attack options are only ones available
                actualDamage += multiAttackDamage;
                continue;
            }

            // Find max damage action that is not part of multi attack
            let maxAction: {monsterAction: MonsterAction, damage: number} = actionsActualDamage[0];
            for (let action of actionsActualDamage) {
                if (action.damage > maxAction.damage) {
                    maxAction = action;
                }
            }
            if (maxAction.damage > multiAttackDamage) {
                // multiattack is not the best option, action already selected is better
                actualDamage += maxAction.damage;
                if (maxAction.monsterAction.limitedUse) {
                    // action cannot be used again, so remove it from the list
                    let index = actionsActualDamage.indexOf(maxAction);
                    if (index > -1) {
                        actionsActualDamage.splice(index, 1);
                    }
                }
            } else {
                // multiattack is the best option
                actualDamage += multiAttackDamage;
            }
        }
        this.averageDamagePerRound = Math.round(actualDamage / 3);
        return actualDamage;
    }

}

export interface Multiattack {
    name: string;
    attackCount: number;
}

@Pipe({name: 'signedNumber'})
export class SignedNumberPipe implements PipeTransform {
    transform(value: number): string {
        return value < 0 ? String(value) : "+" + String(value);
    }

}