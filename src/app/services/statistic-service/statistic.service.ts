import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Statistic } from '../../models/Statistic'
import { environment } from '../../../environments/environment';


export const DAY_URL = environment.apiURL + 'statistic_day/';
export const WEEK_URL = environment.apiURL + 'statistic_week/';
export const MONTH_URL = environment.apiURL + 'statistic_month/';
export const YEAR_URL = environment.apiURL + 'statistic_year/';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  statisticChanged$= new Subject<Statistic>();

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  getStatistic(date: Date, url: string): Observable<Statistic[]> {
    let param = new HttpParams;
    if (date != null) {
      param = param.append('date', this.datePipe.transform(date, 'yyyy-MM-dd') + 'T00:00:00.000Z');
    }
    return this.http.get<Statistic[]>(url, {params: param});
  }

  loadStatistic(url: string): Observable<Statistic[]> {
    return this.http.get<Statistic[]>(url);
  }

  saveStatistic(statistic: Statistic, url: string) {
    const method = statistic.id ? 'PUT' : 'POST';
    const id = statistic.id ? statistic.id : '';
    return this.http.request(method, url + id, {
      body: statistic
    }).pipe(
      tap(savedStatistic=> {
        this.statisticChanged$.next(savedStatistic)
      }));
  }
}
