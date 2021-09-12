import {BehaviorSubject} from 'rxjs';
import {Event} from '../models/Event';
import {Injectable} from '@angular/core';

export const LOAD = 'LOAD';
export const ADD = 'ADD';
export const EDIT = 'EDIT';
export const REMOVE = 'REMOVE';

@Injectable({
  providedIn: 'root'
})
export class EventStore {
  private events: Event[] = [];
  items$ = new BehaviorSubject<Event[]>([]);
  
  dispatch(action) {
    this.events = this._reduce(this.events, action);
    this.items$.next(this.events);
  }

  _reduce(events: Event[], action) {
    switch (action.type) {
      case LOAD:
        return [...action.data];
      case ADD:
        return [...events, action.data];
      case EDIT:
        return events.map(task => {
          const editedTask = action.data;
          if (task.id !== editedTask.id) {
            return task;
          }
          return editedTask;
        });
      case REMOVE:
        return events.filter(event => event.id !== action.data.id);
      default:
        return events;
    }
  }
}
