import { Component, OnInit } from '@angular/core';
import { METRICS } from '../metricsList';

@Component({
  selector: 'app-stat-form',
  templateUrl: './stat-form.component.html',
  styleUrls: ['./stat-form.component.css']
})
export class StatFormComponent implements OnInit {

  crList: string[] = Object.keys(METRICS);

  constructor() { }

  ngOnInit(): void { }

}
