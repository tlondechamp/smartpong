import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DATE_FORMAT } from '../constants';

import { Game } from '../game/game.interface';
import { GameResultLabels } from '../game/game.enum';
import { GameService } from '../game/game.service';
import { GameSource } from '../game/utils/game.source';
import { Player } from './player.interface';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit, OnDestroy {
  player: Player;
  favoriteOpponent: object;
  petPeeveOpponent: object;

  public games: GameSource;

  private _player$: Subscription;

  readonly DateFormat = DATE_FORMAT;
  readonly gameResultLabels = GameResultLabels;

  // Score Evolution Chart
  public scoreEvolutionChartData = [
    {data: [], label: 'Score'},
  ];
  public scoreEvolutionChartLabels = [];
  public scoreEvolutionChartOptions = {
    responsive: true
  };
  public scoreEvolutionChartColors = [
    {
      backgroundColor: 'rgba(63,127,191,0.2)',
      borderColor: 'rgba(63,127,191,1)',
      pointBackgroundColor: 'rgba(63,127,191,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(63,127,191,0.8)'
    }
  ];
  public scoreEvolutionChartLegend = true;
  public scoreEvolutionChartType = 'line';

  // Game Chart
  public gameChartOptions = {
    scales: {
      xAxes: [{
         ticks: {
            beginAtZero:true,
            stepSize: 1,
          }
      }]
    },
    responsive: true
  };
  public gameChartLabels = [];
  public gameChartType = 'horizontalBar';
  public gameChartLegend = true;
  public gameChartColors = [
    { backgroundColor: 'rgba(38,114,38,0.8)' },
    { backgroundColor: 'rgba(218,16,16,0.8)' },
  ];
  public gameChartData = [
    {data: [], label: 'Wins'},
    {data: [], label: 'Losses'},
  ];

  // Opponent Game Chart
  public opponentGameChartOptions = {
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero:true,
          stepSize: 1,
        },
      }]
    },
    responsive:true
  };
  public opponentGameChartLabels = [];
  public opponentGameChartType = 'horizontalBar';
  public opponentGameChartLegend = true;
  public opponentGameChartColors = [
    { backgroundColor: 'rgba(38,114,38,0.8)' },
    { backgroundColor: 'rgba(218,16,16,0.8)' },
  ];
  public opponentGameChartData = [
    {data: [], label: 'Wins'},
    {data: [], label: 'Losses'},
  ];

  // Score Chart
  public scoreChartOptions = {
    scaleShowVerticalLines: false,
    scales: {
      xAxes: [{
         ticks: {
            suggestedMin : 900
          }
      }]
    },
    responsive: true,
  };
  public scoreChartLabels = [];
  public scoreChartType = 'horizontalBar';
  public scoreChartLegend = true;
  public scoreChartColors = [
    { backgroundColor: 'rgba(218,16,16,0.8)' },
    { backgroundColor: 'rgba(13,113,175,0.8)' },
    { backgroundColor: 'rgba(38,114,38,0.8)' },
  ];

  public scoreChartData = [
    {data: [], label: 'Min Score'},
    {data: [], label: 'Current Score'},
    {data: [], label: 'Max Score'},
  ];

  constructor(
    private _gameService: GameService,
    private _playerService: PlayerService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.games = new GameSource();
  }

  ngOnInit() {
    this._player$ = (
      this._route.params.pipe(switchMap(params => this._playerService.retrieve(+params['id'])))
                        .subscribe(
                          player => {
                            this.player = player;
                            this.fillLastGamesTab(this.player);
                            this.fillGlobalTab(this.player);
                          },
                          error => {
                            if (error.status === 404) {
                              this._router.navigate(['404']);
                            }
                          }
                        )
    );
  }

  ngOnDestroy() {
    this._player$.unsubscribe();
  }

  fillLastGamesTab(player: Player) {
    const seasons = Object.keys(player.stats['seasons']);
    const currentSeason = seasons[seasons.length - 1]
    const lastGames = Object.entries(player.stats['seasons'][currentSeason]['last_games']);
    let playerScore = player.stats['seasons'][currentSeason]['rating'];

    this.scoreEvolutionChartLabels.splice(0, 0, 'Now');
    this.scoreEvolutionChartData[0].data.splice(0, 0, playerScore);
    for (let [key, game] of lastGames) {
      this.games.push(game as Game);
      // Score Evolution Chart
      this.scoreEvolutionChartLabels.splice(0, 0, 'Game #' + game['id']);
      if (player.id == game['player1']) {
        playerScore -= game['player1_rating_change'];
      }
      if (player.id == game['player2']) {
        playerScore -= game['player2_rating_change'];
      }
      this.scoreEvolutionChartData[0].data.splice(0, 0, playerScore);
    }
  }

  fillGlobalTab(player: Player) {
    for (let [key, value] of Object.entries(player.stats['seasons'])) {
      // Game Chart
      this.gameChartLabels.push('Season ' + key + ' (' + value['win_percentage'] + '% wins)');
      this.gameChartData[0].data.push(value['wins']);
      this.gameChartData[1].data.push(value['losses']);
      // Score Chart
      this.scoreChartLabels.push('Season ' + key);
      this.scoreChartData[0].data.push(value['min_rating']);
      this.scoreChartData[1].data.push(value['rating']);
      this.scoreChartData[2].data.push(value['max_rating']);
    }
  }

  fillSeasonTabs(player: Player, season_index: number) {
    // Reset Chart
    this.opponentGameChartLabels = [];
    this.opponentGameChartData[0].data = [];
    this.opponentGameChartData[1].data = [];
    // Reset favorite & pet peeve
    this.favoriteOpponent = null;
    this.petPeeveOpponent = null;
    // Set default win percentages
    let min_win_percentage = {};
    let max_win_percentage = {};
    min_win_percentage[season_index] = 50;
    max_win_percentage[season_index] = 50;
    for (let [key, value] of Object.entries(player.stats['seasons'][season_index]['opponents'])) {
      // Opponent Game Chart
      this.opponentGameChartLabels.push(value['name']);
      this.opponentGameChartData[0].data.push(value['wins']);
      this.opponentGameChartData[1].data.push(value['losses']);
      if (value['win_percentage'] > max_win_percentage[season_index]) {
        this.favoriteOpponent = value as object;
        max_win_percentage[season_index] = value['win_percentage'];
      }
      if (value['win_percentage'] < min_win_percentage[season_index]) {
        this.petPeeveOpponent = value as object;
        min_win_percentage[season_index] = value['win_percentage'];
      }
    }
  }

}
