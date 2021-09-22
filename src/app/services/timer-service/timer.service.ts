import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import { TimerConfiguration } from 'src/app/models/TimerConfiguration';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiURL + 'timer-configuration/';

const TIMER_ID = 1;
@Injectable({
  providedIn: 'root'
})
export class TimerService {
  timerChanged$ = new Subject<TimerConfiguration>();

  constructor(private http: HttpClient) { }

  loadTimerConfiguration(): Observable<TimerConfiguration> {
    return this.http.get<TimerConfiguration>(BASE_URL + TIMER_ID);
  }

  saveTimerConfiguration(timer: TimerConfiguration) {
    return this.http.request('PUT', BASE_URL + TIMER_ID, {
      body: timer
    }).pipe(tap(savedTimer => {
      this.timerChanged$.next(savedTimer);
    }));
  }
}
