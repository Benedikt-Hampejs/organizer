import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventService } from '../../services/event-service/event.service';
import { Event } from '../../models/Event';
import { ActivatedRoute, Router } from '@angular/router';
import { timestamp } from 'rxjs/internal/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar.component.html',
})
export class CalendarComponent implements OnInit{
  count: Number[];
  refresh: Subject<any> = new Subject();
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();
  events: Event[] = [];
  constructor(private eventService: EventService){}
  ngOnInit(): void {
    this.eventService.loadEvents(null).subscribe(res => {
      res.forEach(x => {
        var ev: Event = {
          start: new Date(x.start),
          title: x.title,
          description: x.description
        } 
        this.events.push(ev)
      })
      this.refresh.next();
    });
  }
  onClick(){
    this.onClickHelper();
    this.onClickHelper();
  }
  onClickHelper(){
    
  }

}