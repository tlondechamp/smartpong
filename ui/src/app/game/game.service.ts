import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Game } from './game.interface';

@Injectable()
export class GameService {
  private url = '/api/games';

  constructor(protected _http: HttpClient) {}

  retrieve(id: number): Observable<Game> {
    return this._http.get<Game>(`${this.url}/${id}/`, { responseType: 'json' });
  }

  list(): Observable<Game[]> {
    return this._http.get<Game[]>(this.url, { responseType: 'json'});
  }
}
