import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Player } from './player.interface';

@Injectable()
export class PlayerService {
  private url = '/api/players';

  constructor(protected _http: HttpClient) {}

  retrieve(id: number): Observable<Player> {
    return this._http.get<Player>(`${this.url}/${id}/`, { responseType: 'json' });
  }

  list(): Observable<Player[]> {
    return this._http.get<Player[]>(this.url, { responseType: 'json'});
  }
}
