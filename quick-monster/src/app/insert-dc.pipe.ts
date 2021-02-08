import { Pipe, PipeTransform } from '@angular/core';
import { MonsterService } from './monster.service';
import { Monster } from './monsterClass';

@Pipe({
  name: 'insertDC',
  pure: false // TODO this is resource intensive. Is there a better solution?
})
export class InsertDCPipe implements PipeTransform {

  private monster: Monster;

  constructor(private monsterService: MonsterService) { 
    this.monster = monsterService.getMonster();
  }

  transform(text: string): string {
    return text.replace(/DC\?/, "DC" + this.monster.dc);
  }

}
