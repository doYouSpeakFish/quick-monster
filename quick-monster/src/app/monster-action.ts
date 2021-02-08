import { MonsterStatBase } from "./metrics";
import { Monster } from "./monsterClass";

export class MonsterAction {

    name: string = "Action";
    text: string = "";

    // TODO allow reach to be adjusted
    reach: string = "5 ft";

    hidden: boolean = false;

    private _limitedUse: boolean = false;
    private _multiTarget: boolean = false;
    private _multiAttack: number = 0;
    private _absoluteDamageMultiplier = 1;

    private _attack: boolean = true;
    private _attackText: string = "";
    private _attackDamage: number = 50;
    private _attackDice: number = 3.5;
    attackNumDie: number = 1;
    attackDamageMod: number = 3;
    attackDamageType: string;

    private _save: boolean = false;
    saveText: string = "";
    private _saveDamage: number = 50;
    saveType: string = "Constitution";
    private _saveDice: number = 3.5;
    saveNumDie: number = 1;
    saveDamageType: string;

    constructor(public monster: Monster, private monsterBases: Map<string, MonsterStatBase>) {
        this.attackDamageType = monster.DAMAGE_TYPES.BLUDGEONING;
        this.saveDamageType = monster.DAMAGE_TYPES.POISON;
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
        if (!this.attack) { return 0; }
        return Math.max(1, this.multiAttack) * this.attackDamage;
    }
    public get attackDice(): number {
        return this._attackDice;
    }
    public set attackDice(value: number) {
        this._attackDice = value;
        this.monster.calcDice();
    }
    public get attackDiceDisplay(): string {
        if (this.attackNumDie == 0) {
            return "";
        }
        let display = "(" + this.attackNumDie + "d" + (this.attackDice * 2 - 1);
        if (this.attackDamageMod != 0) {
            if (this.attackDamageMod > 0) {
                display += " + "
            } else if (this.attackDamageMod < 0) {
                display += " - "
            }
            display += String(Math.abs(this.attackDamageMod));
        }
        return display + ")";
    }

    public get attackText(): string {
        return this._attackText;
    }
    public set attackText(value: string) {
        this._attackText = value;
    }
    public get attackTextDisplay(): string {
        // insert DC if user has typed DC?
        let text = this.attackText.replace(/DC\?/, "DC " + this.monster.dc);

        // insert to hit if user has typed TOHIT?
        text = this.attackText.replace(/TOHIT\?/, String(this.monster.toHit));

        // insert damage if user has types DMG?
        let matches = text.match(/(DMG\?)(\d*%)?/g); // match DMG? optionally followed by digits and then a percent character
        matches = matches && matches.length? matches : [];
        console.log("MonsterAction: matches = " + matches.toString())
        let attackDamageSources = [];
        for (let damage of matches) {
            damage = damage.replace("DMG?", "");
            let relativeDamage: number = 50;
            if (damage.length > 0) {
                relativeDamage = +damage.replace("%", "");
            }
            attackDamageSources.push(relativeDamage);
        }
        while (text.indexOf("DMG?") > 0) {
            // TODO calculate what the damage should be and insert it.
            //      the damage for the main part of the attack needs to be included when calculating how the damage is distributed
            //      and must be updated aswell.
        }
        return text;
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
        if (!this.save) { return 0; }
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

    public get saveDiceDisplay(): string {
        return "(" + this.saveNumDie + "d" + (this.saveDice * 2 - 1) + ")";
    }
    public get saveAverageDamage(): number {
        if (!this.save) { return 0; }
        return Math.floor(this.saveNumDie * this.saveDice);
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
        this._multiAttack = value;
        this.monster.calcDice();
    }

    public get totalDamage(): number {
        let dmg = this.totalAttackDamage + this.totalSaveDamage;
        return dmg;
    }

    public get attackAverageDamage(): number {
        if (!this.attack) {
            return 0;
        }
        let damage = this.attackNumDie * this.attackDice + this.attackDamageMod;
        damage = Math.floor(damage);
        return damage;
    }

    public get saveTextDisplay(): string {
        return this.saveText.replace(/DC\?/, "DC " + this.monster.dc);
    }

    public get actionTextDisplay(): string {
        return this.text.replace(/DC\?/, "DC " + this.monster.dc);
    }

    // Dice and damage modifier calc
    calcDamage(damage: number): void {
        if (!this.totalDamage) {
            this.calcSaveDamage(0);
            this.calcAttackDamage(0);
        }
        damage *= this._absoluteDamageMultiplier;
        if (this.multiTarget) { damage *= 0.5 }

        let attackMultiplier = this.totalAttackDamage / this.totalDamage;
        let saveMultiplier = this.totalSaveDamage / this.totalDamage;
        this.calcAttackDamage(damage * attackMultiplier);
        this.calcSaveDamage(damage * saveMultiplier);
    }

    private calcAttackDamage(damage: number): void {
        console.log("MonsterAction: calculating attack dice with target damage = " + damage);
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
        console.log("MonsterAction: calculating save dice with target damage = " + damage);
        if (damage == 0) {
            this.saveNumDie = 0;
        } else {
            let damagePerAttack = damage / Math.max(1, this.multiAttack);
            this.saveNumDie = Math.round(damagePerAttack / this.saveDice);
        }
    }

    public toggleVisible() {
        this.hidden = !this.hidden;
    }

}