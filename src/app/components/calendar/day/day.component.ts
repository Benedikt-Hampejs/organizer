import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event } from 'src/app/models/Event';
import { EventService } from '../../../services/event-service/event.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { calculatePriortyByDay } from '../../../helper'
import { FormControl } from '@angular/forms';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnDestroy {
  events$: Observable<Event[]>;
  categories: Category[];
  category: Category;
  day: Date;
  date = new FormControl(new Date());
  highestPriority: number = null;

  eventChangeSubscription: Subscription;
  
  formEvent: Event = {};

  constructor(private eventService: EventService, private categoryService: CategoryService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryService.loadCategory().subscribe(res =>{
      this.categories = res;
    });
    var dateString = this.route.snapshot.paramMap.get('id');
    var eventId = this.route.snapshot.paramMap.get('event');
    this.day = new Date(dateString);
    this.date = new FormControl(this.day);
    if(eventId != null) {
      this.eventService.getEvent(eventId).subscribe(e => this.formEvent = e);
    }
    this.events$ = this.eventService.loadEvents(this.day);
    this.events$.subscribe(e => {
      e.sort((a,b) => a.priroty - b.priroty);
      if(e.length > 0) {
        this.highestPriority = e[e.length -1].priroty;
      }
    });
    this.eventChangeSubscription = this.eventService.eventChanged$.subscribe(changedEvent => {
      this.events$ = this.eventService.loadEvents(this.day);
    })
  }



  ngOnDestroy(): void {
    this.eventChangeSubscription.unsubscribe();
  }

  saveEvent() {
    this.formEvent.start = this.date.value;
    this.formEvent.done = false;
    this.calculatePriority();
    this.formEvent.priroty = this.highestPriority;



    this.eventService.saveEvent(this.formEvent).subscribe();
    this.formEvent = {}
    this.date = new FormControl(this.day);
  }

  setEditEvent(inputs: Event) {
    this.formEvent = inputs;
  }
  changeStatusEvent(inputs: Event) {
    inputs.done = !inputs.done;
    this.eventService.updateEventDone(inputs);
    this.eventService.saveEvent(inputs).subscribe();
  }

  deleteEvent(input: Event) {
    this.eventService.deleteEvent(input).subscribe();
  }

  calculatePriority() {
    if(this.highestPriority == null) {
      this.highestPriority = calculatePriortyByDay(this.day) + 1;
    } else {
      this.highestPriority++;
    }
  }
  temp:Category[];
  getColorByEvent(category: number): String{
    if(category == undefined) {
      return '#3f51b5';
    }
    return this.categories.filter(c => c.id === category)[0].color;
  }
}
