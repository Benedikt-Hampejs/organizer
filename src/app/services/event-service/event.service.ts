import {Event} from '../../models/Event';
import {Injectable, Inject} from '@angular/core';
import {Observable, BehaviorSubject, fromEvent, Subject} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {map, tap} from 'rxjs/internal/operators';
import {DatePipe} from '@angular/common'



const BASE_URL = 'http://localhost:3000/api/events/';
@Injectable()
export class EventService {
  eventChanged$ = new Subject<Event>();

  events$: Observable<Event[]>;
    //eventsChanged = new BehaviorSubject({});
    constructor(private http: HttpClient, private datePipe: DatePipe) {}


  getEvent(id: number | string): Observable<Event> {
    return this.http.get<Event>(BASE_URL + id);
  }

  loadEvents(day: Date): Observable<Event[]> {
    let param = new HttpParams;
    if (day != null) {
      param = param.append('start', this.datePipe.transform(day, 'yyyy-MM-dd') + 'T00:00:00.000Z');
    }
    return this.http.get<Event[]>(BASE_URL, {params:param}).pipe(map(events => events.sort((e1, e2) => {
    if(e1.done == e2.done) {
      return 0;
    } else {
      return e2.done ? -1 : 1;
    }})));
  }

  saveEvent(event: Event) {
     const method = event.id ? 'PUT' : 'POST';
     const id = event.id ? event.id : ''
    return this.http.request(method, BASE_URL + id, {
        body: event
    }).pipe(
      tap(savedEvent => {
        this.eventChanged$.next(savedEvent)
        //this.eventsChanged.next(savedEvent);
      }));
  }
  deleteEvent(event: Event) {
    return this.http.delete(BASE_URL + event.id).pipe(
      tap(savedEvent => {
        this.eventChanged$.next(savedEvent)
      }));
  }

  updateEventDone(event: Event) {
    if (event.done) {
      event.end = new Date();
    } else {
      event.end = null;
    }
  }
  
}
