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
    attackDice: number = 3.5;
    attackNumDie: number = 1;
    attackDamageMod: number = 3;

    private _save: boolean = false;
    saveText: string = "";
    private _saveDamage: number = 50;
    saveType: string = "Con";
    saveDice: number = 3.5;
    saveNumDie: number = 1;

    constructor(public monster: Monster, private monsterBases: Map<string, MonsterStatBase>) { }

    // Attack getters and setters
    public get attack(): boolean {
        return this._attack;
    }
    public set attack(value: boolean) {
        this._attack = value;
    }
    public set attackDamage(relativeDamage: number) {
        this._attackDamage = relativeDamage;
        // TODO calculate dice and modifiers
    }
    public get attackDamage() {
        if (this.attack) {
            return Math.max(1, this.multiAttack) * this._attackDamage;
        }
        return 0;
    }

    // Saving throw getters and setters
    public set saveDamage(relativeDamage: number) {
        this._saveDamage = relativeDamage;
    }
    public get saveDamage() {
        if (this.save) {
            return Math.max(1, this.multiAttack) * this._saveDamage;
        }
        return 0;
    }
    public get save(): boolean {
        return this._save;
    }
    public set save(value: boolean) {
        this._save = value;
    }

    // Other getters and setters
    public get limitedUse(): boolean {
        return this._limitedUse;
    }
    public set limitedUse(value: boolean) {
        this._limitedUse = value;
    }

    public get multiTarget(): boolean {
        return this._multiTarget;
    }
    public set multiTarget(value: boolean) {
        this._multiTarget = value;
    }

    public get multiAttack(): number {
        return this._multiAttack;
    }
    public set multiAttack(value: number) {
        this._multiAttack = value;
    }

    public get totalDamage() {
        return this.attackDamage + this.saveDamage;
    }

    // Dice and damage modifier calc
    calcDamage(damage: number): void {
        if (!this.totalDamage) { return }
        damage *= this._absoluteDamageMultiplier;
        if (this.limitedUse) { damage *= 4 }
        if (this.multiTarget) { damage *= 0.5 }
        let attackMultiplier = this.attackDamage / this.totalDamage;
        let saveMultiplier = this.saveDamage / this.totalDamage;
        this.calcAttackDamage(damage * attackMultiplier);
        this.calcSaveDamage(damage * saveMultiplier);
    }

    private calcAttackDamage(damage: number): void {
        let cr = this.monster.cr;
        let monsterBase: MonsterStatBase = this.monsterBases.get(cr)!;
        this.attackDamageMod = monsterBase.attack - monsterBase.proficiency;
        let damagePerAttack = damage / Math.max(1, this.multiAttack);
        let dieDamage = damagePerAttack - this.attackDamageMod;
        this.attackNumDie = Math.round(dieDamage / this.attackDice);
    }

    private calcSaveDamage(damage: number): void {
        let damagePerAttack = damage / Math.max(1, this.multiAttack);
        this.saveNumDie = Math.round(damagePerAttack / this.saveDice);
    }

}