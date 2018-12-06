import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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

  private _player$: Subscription;

  constructor(
    private _playerService: PlayerService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {}

  // Game Chart
  public gameChartOptions = {
    scales: {
      yAxes: [{
         ticks: {
            min : 0
          }
      }]
    },
    responsive: true
  };
  public gameChartLabels = [];
  public gameChartType = 'bar';
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
      yAxes: [{
         ticks: {
            min : 0
          }
      }]
    },
    responsive: true
  };
  public opponentGameChartLabels = [];
  public opponentGameChartType = 'bar';
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
      yAxes: [{
         ticks: {
            suggestedMin : 900
          }
      }]
    },
    responsive: true,
  };
  public scoreChartLabels = [];
  public scoreChartType = 'bar';
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

  ngOnInit() {
    this._player$ = (
      this._route.params.pipe(switchMap(params => this._playerService.retrieve(+params['id'])))
                        .subscribe(
                          player => {
                            this.player = player;
                            this.fillGlobalTab(this.player);
                            this.fillSeasonTabs(this.player);
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

  fillSeasonTabs(player: Player, season: number = -1) {
    // Reset Chart
    this.opponentGameChartLabels = [];
    this.opponentGameChartData = [
      {data: [], label: 'Wins'},
      {data: [], label: 'Losses'},
    ];
    // Set Season Index
    let season_index;
    if (season == -1) {
      season_index = Object.keys(player.stats['seasons']).length;
    } else {
      season_index = season;
    }
    // Set favorite and pet peeve opponent
    let min_win_percentage = 50;
    let max_win_percentage = 50;
    for (let [key, value] of Object.entries(player.stats['seasons'][season_index]['opponents'])) {
      // Opponent Game Chart
      this.opponentGameChartLabels.push(value['name']);
      this.opponentGameChartData[0].data.push(value['wins']);
      this.opponentGameChartData[1].data.push(value['losses']);
      //
      if (value['win_percentage'] > max_win_percentage) {
        this.favoriteOpponent = value;
        max_win_percentage = value['win_percentage'];
      }
      if (value['win_percentage'] < min_win_percentage) {
        this.petPeeveOpponent = value;
        min_win_percentage = value['win_percentage'];
      }
    }
  }

}
