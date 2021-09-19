import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Statistic } from '../../models/Statistic'

export const DAY_URL = 'http://localhost:3000/api/statistic_day/';
export const WEEK_URL = 'http://localhost:3000/api/statistic_week/';
export const MONTH_URL = 'http://localhost:3000/api/statistic_month/';
export const YEAR_URL = 'http://localhost:3000/api/statistic_year/';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  statisticChanged$= new Subject<Statistic>();

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  getStatistic(date: Date, url: string): Observable<Statistic[]> {
    let param = new HttpParams;
    if (date != null) {
      param = param.append('start', this.datePipe.transform(date, 'yyyy-MM-dd') + 'T00:00:00.000Z');
    }
    return this.http.get<Statistic[]>(url, {params: param});
  }

  loadEvents(statisticTyp: string): Observable<Event> {
    const url = this.getUrl(statisticTyp);
    return this.http.get<Event>(url);
  }

  saveEvent(statistic: Statistic, url: string) {
    const method = statistic.id ? 'PUT' : 'POST';
    const id = statistic.id ? statistic.id : '';
    console.log(statistic, url, method, id);
    return this.http.request(method, url + id, {
      body: statistic
    }).pipe(
      tap(savedStatistic=> {
        this.statisticChanged$.next(savedStatistic)
      }));
  }

  getUrl(statistic: string): string {
    if (statistic == 'day') return DAY_URL;
    else if (statistic == 'week') return WEEK_URL;
    else if (statistic == 'month') return MONTH_URL;
    else return YEAR_URL;
  }

}
