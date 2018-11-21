import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Game } from '../game/game.interface';
import { GameService } from '../game/game.service';
import { Season } from './season.interface';
import { SeasonService } from './season.service';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
})
export class SeasonComponent implements OnInit {
  season: Season;
  last_games: Game[] = [];

  private _season$: Subscription;

  constructor(
    private _seasonService: SeasonService,
    private _gameService: GameService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._season$ = (
      this._route.params.pipe(switchMap(params => this._seasonService.retrieve(+params['id'])))
                        .subscribe(
                          season => { this.season = season; },
                          error => {
                            if (error.status === 404) {
                              this._router.navigate(['404']);
                            }
                          }
                        )
    );
    this._gameService.list().subscribe(games => this.last_games = games.slice(0, 20));
  }

}
