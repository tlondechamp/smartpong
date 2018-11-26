import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { Season } from './season.interface';

@Injectable()
export class SeasonService {
  private url = '/api/seasons/';
  protected listParams = new HttpParams();

  constructor(protected _http: HttpClient) {}

  retrieve(id: number): Observable<Season> {
    return this._http.get<Season>(`${this.url}${id}/`, { responseType: 'json' });
  }

  list(filters?: Object): Observable<Season[]> {
    _.forEach(
      filters,
      (filterValue, filterKey) => {
        this.listParams = this.listParams.set(`${filterKey}`, `${filterValue}`);
      },
    );
    return this._http.get<Season[]>(
        this.url, { params: this.listParams, responseType: 'json'});
  }
}
