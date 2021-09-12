import {Event} from '../../models/Event';
import {Injectable, Inject} from '@angular/core';
import {Observable, BehaviorSubject, fromEvent, Subject} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';



const BASE_URL = 'http://localhost:3000/api/events';
const WEB_SOCKET_URL = 'http://localhost:3001';
@Injectable()
export class EventService {
  eventChanged$ = new Subject<Event>();

  events$: Observable<Event[]>;
    //eventsChanged = new BehaviorSubject({});
    constructor(private http: HttpClient) {}


  getEvent(id: number | string): Observable<Event> {
    return this.http.get<Event>(BASE_URL + id);
  }

  loadEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(BASE_URL);
  }


  saveEvent(event: Event) {
     const method = event.id ? 'PUT' : 'POST';
     const id = event.id ? '/' + event.id : ''
    return this.http.request(method, BASE_URL + id, {
        body: event
    }).pipe(
      tap(savedEvent => {
        this.eventChanged$.next(savedEvent)
        //this.eventsChanged.next(savedEvent);
      }));
  }
  deleteEvent(event: Event) {
    console.log("test2 " + BASE_URL+ " "+event.id);
    return this.http.delete(BASE_URL +"/"+ event.id).pipe(
      tap(savedEvent => {
        this.eventChanged$.next(savedEvent)
      }));
  }
}
