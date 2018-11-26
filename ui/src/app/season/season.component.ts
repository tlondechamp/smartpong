import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DATE_FORMAT } from '../constants';

import { Game } from '../game/game.interface';
import { GameAddComponent } from '../game/add/game-add.component';
import { GameService } from '../game/game.service';
import { GameResultLabels } from '../game/game.enum';
import { Season } from './season.interface';
import { SeasonService } from './season.service';


class GameSource {
  private _data: BehaviorSubject<Game[]>;

  get data(): Game[] { return this._data.getValue(); }
  set data(games: Game[]) {
    this._data.next(games);
  }

  constructor() {
    this._data = new BehaviorSubject<Game[]>([]);
  }

  add(schedule: Game) {
    this.data = this.data.concat(schedule);
  }

}

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
})
export class SeasonComponent implements OnInit {
  season: Season;

  private _season$: Subscription;

  public games: GameSource = new GameSource();

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
    this._season$ = (
      this._route.params.pipe(switchMap(params => this._seasonService.retrieve(+params['id'])))
                        .subscribe(
                          season => {
                            this.season = season;
                            this._gameService.list({'season': this.season.id})
                                             .subscribe(games => {
                                               this.games.data = games.slice(0, 20);
                                             });
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
                this.toastr.success('Your game has been created !', 'Success');
              },
              () => this.toastr.error('Error while creating your game !', 'Failed')
            );
  }

}
