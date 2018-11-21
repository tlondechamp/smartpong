import { Component, OnInit } from '@angular/core';

import { Player } from '../player.interface';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.playerService.list().subscribe(players => this.players = players);
  }
}