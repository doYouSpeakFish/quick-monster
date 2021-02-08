import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Monster } from '../monsterClass';
import { MonsterAction } from '../monster-action';
import { MonsterService } from '../monster.service';

@Component({
  selector: 'app-stat-form',
  templateUrl: './stat-form.component.html',
  styleUrls: ['./stat-form.component.css']
})
export class StatFormComponent implements OnInit {

  damageModifier: number[] = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  multiAttacks = [1, 2, 3, 4, 5, 6, 7, 8];
  dice = [2.5, 3.5, 4.5, 5.5, 6.5, 10.5, 50.5];
  saveAbilities = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];
  monster!: Monster;

  constructor(public monsterService: MonsterService) { }

  ngOnInit(): void {
    this.monster = this.monsterService.getMonster();
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
