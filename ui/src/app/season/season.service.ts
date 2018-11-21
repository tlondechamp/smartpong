import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Season } from './season.interface';

@Injectable()
export class SeasonService {
  private url = '/api/seasons';

  constructor(protected _http: HttpClient) {}

  retrieve(id: number): Observable<Season> {
    return this._http.get<Season>(`${this.url}/${id}/`, { responseType: 'json' });
  }

  list(): Observable<Season[]> {
    return this._http.get<Season[]>(this.url, { responseType: 'json'});
  }
}
