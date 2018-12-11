import { BehaviorSubject } from 'rxjs';

import { Game } from '../game.interface';


export class GameSource {
  private _data: BehaviorSubject<Game[]>;

  get data(): Game[] { return this._data.getValue(); }
  set data(games: Game[]) {
    this._data.next(games);
  }

  constructor() {
    this._data = new BehaviorSubject<Game[]>([]);
  }

  // Add Game on top of array, not at the end
  add(game: Game) {
    this.data.splice(0, 0, game);
  }

  // Add Game at the end of the array
  push(game: Game) {
    this.data = this.data.concat(game);
  }

}
