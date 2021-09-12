import {Event} from '../../models/Event';
import {Injectable, Inject} from '@angular/core';
import {Observable, BehaviorSubject, fromEvent} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {LOAD, ADD, EDIT, REMOVE, EventStore} from '../../store/event.store';
import {SOCKET_IO} from '../../app.tokens';
import {tap} from 'rxjs/internal/operators';



const BASE_URL = 'http://localhost:3000/api/events';
const WEB_SOCKET_URL = 'http://localhost:3001';
@Injectable()
export class EventService {

  socket: any;

  events$: Observable<Event[]>;
    eventsChanged = new BehaviorSubject({});
    constructor(private http: HttpClient, private eventStore: EventStore,
              @Inject(SOCKET_IO) socketIO) {

    this.events$ = eventStore.items$;
    this.socket = socketIO(WEB_SOCKET_URL);
    fromEvent(this.socket, 'event_saved')
      .subscribe((action) => {
        this.eventStore.dispatch(action);
      });
      this.http.get(BASE_URL).pipe(
        tap((tasks) => {
          this.eventStore.dispatch({type: LOAD, data: tasks});
        })).subscribe();
  }


  getEvent(id: number | string): Observable<Event> {
    return this.http.get<Event>(BASE_URL + id);
  }


  saveEvent(event: Event) {
     const method = event.id ? 'PUT' : 'POST';
     const id = event.id ? '/' + event.id : ''
    return this.http.request(method, BASE_URL + id, {
        body: event
    }).pipe(
      tap(savedEvent => {
        this.eventsChanged.next(savedEvent);
        const actionType = event.id ? EDIT : ADD;
        const action = {type : actionType, data: savedEvent};
        this.eventStore.dispatch(action);
        this.socket.emit('broadcast_event', action);
      }));
  }
  deleteEvent(event: Event) {
    return this.http.delete(BASE_URL + event.id).pipe(
      tap(_ => {
        this.eventStore.dispatch({type: REMOVE, data: event});
      }));
  }
}
