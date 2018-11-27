import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SeasonService } from './season/season.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  constructor(
    private _seasonService: SeasonService,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._seasonService.list().subscribe(
      seasons => {
        this._router.navigate(['/seasons', seasons[0].id]);
      },
      error => {
        if (error.status === 404) {
          this._router.navigate(['/seasons']);
        }
      }
    );
  }
}