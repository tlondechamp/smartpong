import { Component, OnInit } from '@angular/core';

import { DATE_FORMAT } from '../../constants';
import { Game } from '../game.interface';
import { GameService } from '../game.service';
import { GameResultLabels } from '../game.enum';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
})
export class GameListComponent implements OnInit {
  games: Game[] = [];

  readonly DateFormat = DATE_FORMAT;
  readonly gameResultLabels = GameResultLabels;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.list().subscribe(games => this.games = games);
  }
}