import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MonsterStatBase } from '../metrics';
import { Monster } from '../monster';
import { MonsterAction } from '../monster-action';

@Component({
  selector: 'app-stat-form',
  templateUrl: './stat-form.component.html',
  styleUrls: ['./stat-form.component.css']
})
export class StatFormComponent implements OnInit {

  monsterBases = new Map<string, MonsterStatBase>();
  damageModifier: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  monster: Monster;

  constructor() { 
    this.genStatBases();
    this.monster = new Monster(this.monsterBases);
  }

  ngOnInit(): void { }

  genStatBases(): void {
    this.monsterBases.set("0", new MonsterStatBase(12, 3, 2, 1, 9, 1, 2));
    this.monsterBases.set("1/8", new MonsterStatBase(12, 9, 3, 3, 10, 2, 2));
    this.monsterBases.set("1/4", new MonsterStatBase(13, 15, 3, 5, 10, 2, 2));
    this.monsterBases.set("1/2", new MonsterStatBase(13, 24, 4, 8, 11, 3, 2));
    this.monsterBases.set("1", new MonsterStatBase(13, 30, 4, 10, 11, 3, 2));
    for (let cr = 2; cr <= 30; cr++) {
      let ac = Math.floor(13 + cr / 3);
      let hp = 15 * cr;
      let attack = Math.floor(4 + 0.5 * cr);
      let damage = 5 * cr;
      let dc = Math.floor(11 + 0.5 * cr);
      let save = Math.floor(3 + 0.5 * cr);
      let proficiency = Math.ceil(1 + cr/4);
      if (cr < 8) {
        hp += 15;
        damage += 5;
      }
      this.monsterBases.set(String(cr), new MonsterStatBase(ac, hp, attack, damage, dc, save, proficiency));
    };
  }

  // function to force ngFor to maintain Map order
  unsorted(a: KeyValue<any, any>, b: KeyValue<any, any>): number { return 1; }

  addAction(): void {
    this.monster.addAction();
  }

  removeAction(action: MonsterAction): void {
    this.monster.removeAction(action);
  }

}
