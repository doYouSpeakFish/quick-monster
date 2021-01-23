import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stat-form',
  templateUrl: './stat-form.component.html',
  styleUrls: ['./stat-form.component.css']
})
export class StatFormComponent implements OnInit {

  crList: number[] = [];

  constructor() { }

  ngOnInit(): void {
    for (var i=1; i<=30; i++) {
      this.crList.push(i);
    }
  }

}
