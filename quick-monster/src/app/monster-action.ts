import { Monster } from "./monster";

export class MonsterAction {

    name: string = "";
    text: string = "";

    private _limitedUse: boolean = false;
    private _multiTarget: boolean = false;
    public get multiTarget(): boolean {
        return this._multiTarget;
    }
    public set multiTarget(value: boolean) {
        this._multiTarget = value;
    }
    _multiAttack: number = 0;

    _attack: boolean = true;
    attackText: string = "";
    _attackDamage: number = 50;

    _save: boolean =  false;
    saveText: string = "";
    _saveDamage: number = 50;
    saveType: string = "Con";

    constructor(public monster: Monster) {}

    set attackDamage(relativeDamage: number) {
        this._attackDamage = relativeDamage;
        // TODO calculate dice and modifiers
    }
    get attackDamage() {
        return this._attackDamage;
    }

    set saveDamage(relativeDamage: number) {
        this._saveDamage = relativeDamage;
    }
    get saveDamage() {
        return this._saveDamage;
    }

    public get limitedUse(): boolean {
        return this._limitedUse;
    }
    public set limitedUse(value: boolean) {
        this._limitedUse = value;
    }

}