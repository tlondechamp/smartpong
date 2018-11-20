import { Component, OnInit } from '@angular/core';

import { Season } from '../season.interface';
import { SeasonService } from '../season.service';

@Component({
  selector: 'app-season-list',
  templateUrl: './season-list.component.html',
})
export class SeasonListComponent implements OnInit {
  seasons: Season[] = [];

  constructor(private seasonService: SeasonService) {}

  ngOnInit() {
    this.seasonService.list().subscribe(seasons => this.seasons = seasons);
  }
}