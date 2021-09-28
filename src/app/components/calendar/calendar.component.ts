import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { EventService } from '../../services/event-service/event.service';
import { Event } from '../../models/Event';
import { Subject } from 'rxjs';

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar.component.html',
  styleUrls: ['./calendar.component.scss']
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
          start: new Date(x.start)
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