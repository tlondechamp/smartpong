import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DATE_FORMAT } from '../constants';

import { Game } from '../game/game.interface';
import { GameService } from '../game/game.service';
import { GameResultLabels } from '../game/game.enum';
import { Season } from './season.interface';
import { SeasonService } from './season.service';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
})
export class SeasonComponent implements OnInit {
  season: Season;
  last_games: Game[] = [];

  readonly DateFormat = DATE_FORMAT;
  readonly gameResultLabels = GameResultLabels;

  private _season$: Subscription;
  private _games$: Subscription;

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
                          season => {
                            this.season = season;
                            this._gameService.list({'season': this.season.id})
                                             .subscribe(games => this.last_games = games.slice(0, 20));
                          },
                          error => {
                            if (error.status === 404) {
                              this._router.navigate(['404']);
                            }
                          }
                        )
    );
  }

}
