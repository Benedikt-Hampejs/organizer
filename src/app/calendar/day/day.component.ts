import { Component, OnDestroy, OnInit } from '@angular/core';
import {Event} from 'src/app/models/Event';
import {HttpClient} from '@angular/common/http'
import {EventService} from '../../services/event-service/event.service';
import { Observable, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnDestroy {
  events$: Observable<Event[]>;
  //events: Event[] = [];
  eventChangeSubscription: Subscription;
  
  formEvent: Event = {};

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.loadEvents();
    this.eventChangeSubscription = this.eventService.eventChanged$.subscribe(changedEvent => {
      this.events$ = this.eventService.loadEvents();
    })
  }

  ngOnDestroy(): void {
    this.eventChangeSubscription.unsubscribe();
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
    this.eventService.deleteEvent(input).subscribe();
  }
  
}
