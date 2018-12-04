import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Player } from './player.interface';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit {
  player: Player;

  private _player$: Subscription;

  constructor(
    private _playerService: PlayerService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {}

  // Game Chart (line)
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

  // Score chart (bar)
  public scoreChartOptions = {
    scaleShowVerticalLines: false,
    scales: {
      yAxes: [{
         ticks: {
            min : 800
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
                            this.fillCharts(this.player);
                          },
                          error => {
                            if (error.status === 404) {
                              this._router.navigate(['404']);
                            }
                          }
                        )
    );
  }

  fillCharts(player: Player) {
    for (let [key, value] of Object.entries(player.stats['seasons'])) {
      // Game Chart
      this.gameChartLabels.push('Season ' + key);
      this.gameChartData[0].data.push(value['wins']);
      this.gameChartData[1].data.push(value['losses']);
      // Score Chart
      this.scoreChartLabels.push('Season ' + key);
      this.scoreChartData[0].data.push(value['min_rating']);
      this.scoreChartData[1].data.push(value['rating']);
      this.scoreChartData[2].data.push(value['max_rating']);
    }
  }

}
