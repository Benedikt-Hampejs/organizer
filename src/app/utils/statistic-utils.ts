import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Statistic } from '../models/Statistic'
import { environment } from '../../environments/environment';


export const DAY_URL = environment.apiURL + 'statistic_day/';
export const WEEK_URL = environment.apiURL + 'statistic_week/';
export const MONTH_URL = environment.apiURL + 'statistic_month/';
export const YEAR_URL = environment.apiURL + 'statistic_year/';

@Injectable({
  providedIn: 'root'
})
export class StatisticUtils {
  statisticChanged$= new Subject<Statistic>();
  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  loadTodaysStatistic(){
    
  }
}
