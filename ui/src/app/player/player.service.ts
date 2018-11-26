import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { Player } from './player.interface';

@Injectable()
export class PlayerService {
  private url = '/api/players/';
  protected listParams = new HttpParams();

  constructor(protected _http: HttpClient) {}

  retrieve(id: number): Observable<Player> {
    return this._http.get<Player>(`${this.url}${id}/`, { responseType: 'json' });
  }

  search(search: string): Observable<Player[]> {
    const searchKey = 'name';
    return this._http.get<Player[]>(
      this.url,
      {
        params: new HttpParams().set(searchKey, search),
        responseType: 'json',
      }
    );
  }

  list(filters?: Object): Observable<Player[]> {
    _.forEach(
      filters,
      (filterValue, filterKey) => {
        this.listParams = this.listParams.set(`${filterKey}`, `${filterValue}`);
      },
    );
    return this._http.get<Player[]>(
        this.url, { params: this.listParams, responseType: 'json'});
  }
}
