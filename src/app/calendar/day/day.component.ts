import { Component, OnInit } from '@angular/core';
import {Event} from 'src/app/models/Event';
import {HttpClient} from '@angular/common/http'
import {EventService} from '../../services/event-service/event.service';
import { Observable } from 'rxjs';
import { EventStore } from 'src/app/store/event.store';


@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {
  events$: Observable<Event[]>;
  //events: Event[] = [];

  
  formEvent: Event = {};

  constructor(private eventService: EventService, eventStore: EventStore) {
    this.events$ = eventStore.items$;
  }

  ngOnInit(): void {
    this.events$ = this.eventService.events$;
  }
  saveEvent(inputs: Event) {
    this.eventService.saveEvent(this.formEvent).subscribe();
    //this.events.push(inputs);
    this.formEvent = {}
  }
  setEditEvent(inputs: Event) {
    this.formEvent = inputs;
  }
  deleteEvent(input: Event) {
    this.eventService.deleteEvent(input);
  }

}
