export class MonsterAction {

    name: string = "";
    text: string = "";

    limitedUse: boolean = false;
    multiTarget: boolean = false;
    multiAttack: number = 0;

    attack: boolean = true;
    attackText: string = "";
    attackDamage: number = 50;

    save: boolean =  false;
    saveText: string = "";
    saveDamage: number = 50;
    saveType: string = "Con";

}