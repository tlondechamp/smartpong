import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, interval, of, Subject, Subscription } from 'rxjs';
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
  currentSeason: Season;

  private _season$: Subscription;

  public games: GameSource;

  readonly DateFormat = DATE_FORMAT;
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
    this.getCurrentSeason();
    this.refreshData();
    interval(REFRESH_DELTA).subscribe(n => this.refreshData());
  }

  ngOnDestroy() {
    this._season$.unsubscribe();
  }

  refreshData() {
    this._season$ = (
      this._route.params.pipe(switchMap(params => this._seasonService.retrieve(+params['id'])))
                        .subscribe(
                          season => {
                            this.season = season;
                            this.getSeasonGames();
                            this.getCurrentSeason();
                          },
                          error => {
                            if (error.status === 404) {
                              this._router.navigate(['404']);
                            }
                          }
                        )
    );
  }

  addGame() {
    const addModal = this._modalService.show(GameAddComponent, {class: 'modal-lg'});
    addModal.content.gameCreated
            .pipe(switchMap(game => this._gameService.create(game as Game)))
            .subscribe(
              (new_game) => {
                this.games.add(new_game);
                this.refreshData();
                this.toastr.success('Your game has been registered !', 'Success');
              },
              () => this.toastr.error('Error while registering your game !', 'Failed')
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

  getCurrentSeason() {
    this._seasonService.list({
      'start_date__lte': this.getDateToStr(new Date()),
      'end_date__gte': this.getDateToStr(new Date()),
    }).subscribe(seasons => {
      this.currentSeason = seasons[0];
    });
  }

  getDateToStr(date: Date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
  }

  isCompleted() {
    return new Date(this.season.end_date) < new Date();
  }

}
