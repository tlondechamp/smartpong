import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTER_TIMEOUT } from './constants';

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

  readonly loader = 'assets/images/loader.gif';

  ngOnInit() {
    this._seasonService.list().subscribe(
      seasons => {
        setTimeout(() => {
          this._router.navigate(['/seasons', seasons[0].id]);
        }, ROUTER_TIMEOUT);
      },
      error => {
        if (error.status === 404) {
          setTimeout(() => {
            this._router.navigate(['/seasons']);
          }, ROUTER_TIMEOUT);
        }
      }
    );
  }
}