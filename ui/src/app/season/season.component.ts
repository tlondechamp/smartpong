import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DATE_FORMAT, NB_LAST_GAMES, REFRESH_DELTA } from '../constants';

import { Game } from '../game/game.interface';
import { GameAddComponent } from '../game/add/game-add.component';
import { GameService } from '../game/game.service';
import { GameSource } from '../game/utils/game.source';
import { GameResultLabels } from '../game/game.enum';
import { Season } from './season.interface';
import { SeasonService } from './season.service';


@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
})
export class SeasonComponent implements OnInit {
  season: Season;
  counter: number;
  interval;

  private _season$: Subscription;

  public games: GameSource;

  readonly dateFormat = DATE_FORMAT;
  readonly gameResultLabels = GameResultLabels;

  constructor(
    private _seasonService: SeasonService,
    private _gameService: GameService,
    private _modalService: BsModalService,
    private _route: ActivatedRoute,
    private _router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.games = new GameSource();
    this.refreshData();
  }

  ngOnDestroy() {
    this.stopCountdown();
    this._season$.unsubscribe();
  }

  refreshData() {
    this._season$ = (
      this._route.params.pipe(switchMap(params => this._seasonService.retrieve(+params['id'])))
                        .subscribe(
                          season => {
                            this.season = season;
                            this.getSeasonGames();
                            if (!this.isCompleted()) {
                              this.countDown(REFRESH_DELTA);
                            }
                            this.getSeasonProgress();
                          },
                          error => {
                            if (error.status === 404) {
                              this._router.navigate(['404']);
                            }
                          }
                        )
    );
  }

  getSeasonProgressWidth() {
    return +this.getSeasonProgress() + '%';
  }

  countDown(seconds: number){
    this.counter = seconds;
    this.interval = setInterval(() => {
      this.counter--;
      if (this.counter < 0) {
        this.counter = 0;
        this.stopCountdown();
        this.refreshData();
      };
    }, 1000);
  };

  stopCountdown() {
    clearInterval(this.interval);
  }

  addGame() {
    const addModal = this._modalService.show(GameAddComponent, {class: 'modal-lg'});
    addModal.content.gameCreated
            .pipe(switchMap(game => this._gameService.create(game as Game)))
            .subscribe(
              (new_game) => {
                this.games.add(new_game);
                this.stopCountdown();
                this.refreshData();
                setTimeout(() => this.toastr.success('Your game has been registered !', 'Success'));
              },
              () => {
                setTimeout(() => this.toastr.error('Error while registering your game !', 'Failed'));
              }
            );
  }

  getSeasonGames() {
    this._gameService.list({
      'season': this.season.id,
      'player1': '',
      'player2': '',
    }).subscribe(games => {
     this.games.data = games.slice(0, NB_LAST_GAMES);
   });
  }

  getSeasonProgress() {
    const start = new Date(this.season.start_date).getTime();
    const now = new Date().getTime();
    const end = new Date(this.season.end_date).getTime();
    const progress = (Math.min(now, end) - start) / (end - start) * 100;
    return Math.round(progress * 100) / 100;
  }

  isCompleted() {
    return new Date(this.season.end_date) < new Date();
  }

}
