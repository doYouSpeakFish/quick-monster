import { MonsterStatBase } from "./metrics";
import { Monster } from "./monster";

export class MonsterAction {

    name: string = "";
    text: string = "";

    private _limitedUse: boolean = false;
    private _multiTarget: boolean = false;
    private _multiAttack: number = 0;
    private _absoluteDamageMultiplier = 1;

    private _attack: boolean = true;
    attackText: string = "";
    private _attackDamage: number = 50;
    private _attackDice: number = 3.5;
    attackNumDie: number = 1;
    attackDamageMod: number = 3;
    attackDamageType: string;

    private _save: boolean = false;
    saveText: string = "";
    private _saveDamage: number = 50;
    saveType: string = "Con";
    private _saveDice: number = 3.5;
    saveNumDie: number = 1;
    saveDamageType: string;

    constructor(public monster: Monster, private monsterBases: Map<string, MonsterStatBase>) {
        this.attackDamageType = monster.DAMAGE_TYPES.BLUDGEONING;
        this.saveDamageType = monster.DAMAGE_TYPES.NECROTIC;
        monster.calcDice();
    }

    // Attack getters and setters
    public get attack(): boolean {
        return this._attack;
    }
    public set attack(value: boolean) {
        this._attack = value;
        this.monster.calcDice();
    }
    public set attackDamage(relativeDamage: number) {
        this._attackDamage = relativeDamage;
        this.monster.calcDice();
    }
    public get attackDamage(): number {
        if (this.attack) {
            return this._attackDamage;
        }
        return 0;
    }
    private get totalAttackDamage(): number {
        return Math.max(1, this.multiAttack) * this.attackDamage;
    }
    public get attackDice(): number {
        return this._attackDice;
    }
    public set attackDice(value: number) {
        this._attackDice = value;
        this.monster.calcDice();
    }

    // Saving throw getters and setters
    public set saveDamage(relativeDamage: number) {
        this._saveDamage = relativeDamage;
        this.monster.calcDice();
    }
    public get saveDamage(): number {
        if (this.save) {
            return this._saveDamage;
        }
        return 0;
    }
    private get totalSaveDamage(): number {
        return Math.max(1, this.multiAttack) * this.saveDamage;
    }
    public get save(): boolean {
        return this._save;
    }
    public set save(value: boolean) {
        this._save = value;
        this.monster.calcDice();
    }
    public get saveDice(): number {
        return this._saveDice;
    }
    public set saveDice(value: number) {
        this._saveDice = value;
        this.monster.calcDice();
    }

    // Other getters and setters
    public get limitedUse(): boolean {
        return this._limitedUse;
    }
    public set limitedUse(value: boolean) {
        this._limitedUse = value;
        this.monster.calcDice();
    }

    public get multiTarget(): boolean {
        return this._multiTarget;
    }
    public set multiTarget(value: boolean) {
        this._multiTarget = value;
        this.monster.calcDice();
    }

    public get multiAttack(): number {
        return this._multiAttack;
    }
    public set multiAttack(value: number) {
        console.log("multiattack = " + value)
        this._multiAttack = value;
        this.monster.calcDice();
    }

    public get totalDamage(): number {
        return this.totalAttackDamage + this.totalSaveDamage;
    }

    // Dice and damage modifier calc
    calcDamage(damage: number): void {
        if (!this.totalDamage) { return }
        damage *= this._absoluteDamageMultiplier;
        if (this.multiTarget) { damage *= 0.5 }

        console.log("RECALC " + this.name + ": damage target = " + damage);

        let attackMultiplier = this.totalAttackDamage / this.totalDamage;
        let saveMultiplier = this.totalSaveDamage / this.totalDamage;
        this.calcAttackDamage(damage * attackMultiplier);
        this.calcSaveDamage(damage * saveMultiplier);

        let attackDieString = this.attackDice == 0 ? 0 : this.attackDice*2 - 1;
        console.log(this.name + ": attack dice = " + this.attackNumDie + "d" + attackDieString);
        console.log(this.name + ": attack mod = " + this.attackDamageMod);
        console.log(this.name + ": save dice = " + this.saveNumDie + "d" + (this.saveDice * 2 - 1));
        let totalAverageDamage = (this.attackNumDie * this.attackDice + this.attackDamageMod +
            this.saveDice * this.saveNumDie) * Math.max(1, this.multiAttack);
        console.log(this.name + ": average damage = " + (totalAverageDamage));
        console.log(this.name + ": damage inaccuracy = " + Math.round(100 * totalAverageDamage / damage - 100) + "%");
    }

    private calcAttackDamage(damage: number): void {
        if (damage == 0) {
            this.attackNumDie = 0;
            this.attackDamageMod = 0;
        } else {
            let damagePerAttack = damage / Math.max(1, this.multiAttack);
            if (damage < this.attackDice) {
                this.attackNumDie = 1;
                this.attackDamageMod = Math.round(damagePerAttack - this.attackDice);
            } else if (this.attackDice == 0) {
                this.attackNumDie = 0;
                this.attackDamageMod = Math.round(damagePerAttack);
            } else {
                let cr = this.monster.cr;
                let monsterBase: MonsterStatBase = this.monsterBases.get(cr)!;
                this.attackDamageMod = monsterBase.attack - monsterBase.proficiency;
                let dieDamage = damagePerAttack - this.attackDamageMod;
                this.attackNumDie = Math.round(dieDamage / this.attackDice);
            }
        }
    }

    private calcSaveDamage(damage: number): void {
        if (damage == 0) {
            this.saveNumDie = 0;
        } else {
            let damagePerAttack = damage / Math.max(1, this.multiAttack);
            this.saveNumDie = Math.round(damagePerAttack / this.saveDice);
        }
    }

}