import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { Statistic } from '../../models/Statistic'
import { environment } from '../../../environments/environment';
import { StatisticPerCategory } from 'src/app/models/StatisticPerCategory';
import { StatisticsEnum } from 'src/app/enums/StatisticsEnum';
import { Event } from '../../models/Event';
import { state } from '@angular/animations';


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

  getStatistic(date: Date, url: string): Observable<Statistic> {
    const statDate = this.datePipe.transform(date, 'yyyy-MM-dd') + 'T00:00:00.000Z'
    return this.http.get<Statistic>(url + statDate);
  }

  loadStatistic(url: string): Observable<Statistic[]> {
    return this.http.get<Statistic[]>(url);
  }

  saveStatistic(statistic: Statistic, url: string) {
    console.log(statistic.sumPomodoros, statistic.sumTasks)
    const method = (statistic.sumPomodoros + statistic.sumTasks) == 1 ? 'POST' : 'PUT';
    const date = (statistic.sumPomodoros + statistic.sumTasks) == 1 ?  '' : this.datePipe.transform(statistic.date, 'yyyy-MM-dd') + 'T00:00:00.000Z';
    return this.http.request(method, url + date, {
      body: statistic
    }).pipe(
      tap(savedStatistic=> {
        this.statisticChanged$.next(savedStatistic)
      }));
  }

  updateStatistic(event: Event, statisticEnum: StatisticsEnum) {
    const today = new Date()
    this.getStatistic(today, DAY_URL).subscribe(res => {
      var statOfToday: Statistic = res;
      if (statOfToday == undefined || statOfToday == null) statOfToday = {}
      if (statOfToday.sumPomodoros == undefined) statOfToday.sumPomodoros = 0;
      if (statOfToday.sumTasks == undefined) statOfToday.sumTasks = 0;
    
      if (statOfToday.date == undefined) {
        statOfToday.date = new Date();
        statOfToday.date.setSeconds(0);
        statOfToday.date.setMinutes(0);
        statOfToday.date.setUTCHours(0);
        statOfToday.date.setUTCMilliseconds(0);
      } 

      if (statOfToday.statisticPerCategory == undefined) statOfToday.statisticPerCategory = []

      const catStatArray = statOfToday.statisticPerCategory.filter(s => s.id == event.category);
      var statCategory: StatisticPerCategory;
      if (catStatArray.length != 0) {
        //there are categories
        statCategory = catStatArray[0];
      } else {
        statCategory = {id: event.category, pomodoro: 0, tasks: 0};
        statOfToday.statisticPerCategory.push(statCategory);
      } 

      if (statisticEnum == StatisticsEnum.POMODORO) {
        statCategory.pomodoro++;
        statOfToday.sumPomodoros++;
      }
      if (statisticEnum == StatisticsEnum.TASK_UP) {
        statCategory.tasks++;
        statOfToday.sumTasks++;
      }
      if (statisticEnum == StatisticsEnum.TASK_DOWN) {
        statCategory.tasks--;
        statOfToday.sumTasks--;
      }
      this.saveStatistic(statOfToday, DAY_URL).subscribe()
    })
  }
}
