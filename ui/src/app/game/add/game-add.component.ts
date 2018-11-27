import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { Observable, of, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Player } from '../../player/player.interface';
import { PlayerService } from '../../player/player.service';
import { Game } from '../game.interface';
import { GameResultLabels } from '../game.enum';

@Component({
  selector: 'app-game-add',
  templateUrl: 'game-add.component.html',
})
export class GameAddComponent implements OnInit {
  player1: Player;
  player2: Player;
  players: Player[] = [];
  players_as_p1: Observable<Player>;
  players_as_p2: Observable<Player>;
  searchPlayer1: string;
  searchPlayer2: string;

  public gameForm: FormGroup;
  public gameCreated: Subject<Game>;

  readonly gameResultLabels = GameResultLabels;

  constructor(
    public modalRef: BsModalRef,
    private _fb: FormBuilder,
    private _playerService: PlayerService,
  ) {
    this._buildForm();
    this.gameCreated = new Subject<Game>();
  }

  ngOnInit() {
    this._playerService.list().subscribe(players => this.players = players);
    this.players_as_p1 = Observable.create((observer: any) => { observer.next(this.searchPlayer1); })
                                   .pipe(mergeMap((search: string) => this.getPlayers(search)));
    this.players_as_p2 = Observable.create((observer: any) => { observer.next(this.searchPlayer2); })
                                   .pipe(mergeMap((search: string) => this.getPlayers(search)));
  }

  onSelectP1(event: TypeaheadMatch): void {
    this.player1 = event.item;
  }

  onSelectP2(event: TypeaheadMatch): void {
    this.player2 = event.item;
  }

  confirmGame(): void {
    this.gameCreated.next({
      player1: this.player1.id,
      player2: this.player2.id,
      result: this.gameForm.value.result,
    } as Game);
    this.modalRef.hide();
  }

  _buildForm(): void {
    this.gameForm = this._fb.group({
      player1: new FormControl(null, Validators.required),
      player2: new FormControl(null, Validators.required),
      result: new FormControl(null, Validators.required),
    });
  }

  getPlayers(search: string): Observable<any> {
    const query = new RegExp(search, 'i');
    return of(
      this.players.filter((player: any) => {
        return query.test(player.name);
      })
    );
  }
}
