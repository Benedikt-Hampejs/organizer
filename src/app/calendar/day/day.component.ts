import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {Event} from 'src/app/models/Event';
import {HttpClient} from '@angular/common/http'
import {EventService} from '../../services/event-service/event.service';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnDestroy {
  events$: Observable<Event[]>;
  day: Date;
  //events: Event[] = [];
  eventChangeSubscription: Subscription;
  
  formEvent: Event = {};

  constructor(private eventService: EventService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    var dateString = this.route.snapshot.paramMap.get('id');
    this.day = new Date(dateString);

    this.events$ = this.eventService.loadEvents(this.day);
    this.eventChangeSubscription = this.eventService.eventChanged$.subscribe(changedEvent => {
      this.events$ = this.eventService.loadEvents(this.day);
    })
  }

  ngOnDestroy(): void {
    this.eventChangeSubscription.unsubscribe();
  }

  saveEvent(inputs: Event) {
    this.formEvent.start = this.day;
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
