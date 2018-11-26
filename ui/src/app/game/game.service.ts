import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { Game } from './game.interface';

@Injectable()
export class GameService {
  private url = '/api/games/';
  protected listParams = new HttpParams();

  constructor(protected _http: HttpClient) {}

  retrieve(id: number): Observable<Game> {
    return this._http.get<Game>(`${this.url}${id}/`, { responseType: 'json' });
  }

  list(filters?: Object): Observable<Game[]> {
    _.forEach(
      filters,
      (filterValue, filterKey) => {
        this.listParams = this.listParams.set(`${filterKey}`, `${filterValue}`);
      },
    );
    return this._http.get<Game[]>(
        this.url, { params: this.listParams, responseType: 'json'});
  }
}
