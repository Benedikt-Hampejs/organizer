import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {Event} from 'src/app/models/Event';
import {HttpClient} from '@angular/common/http'
import {EventService} from '../../services/event-service/event.service';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { calculatePriortyByDay } from '../../helper'
import { FormControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CategoryService } from 'src/app/services/category-service/category.service';
import { Category } from 'src/app/models/Category';
import { bufferToggle } from 'rxjs/internal/operators';

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
  //events: Event[] = [];
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
      console.log(eventId);
      this.eventService.getEvent(eventId).subscribe(e => this.formEvent = e);
    }
    this.events$ = this.eventService.loadEvents(this.day);
    this.events$.subscribe(e => {
      e.sort((a,b) => a.priroty - b.priroty);
      if(e.length > 0) {
        this.highestPriority = e[e.length -1].priroty;
      }
      console.log("priority " + this.highestPriority);
    });
    this.eventChangeSubscription = this.eventService.eventChanged$.subscribe(changedEvent => {
      this.events$ = this.eventService.loadEvents(this.day);
      console.log(changedEvent.id);
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



    console.log(this.day.getDay(), this.highestPriority);
    this.eventService.saveEvent(this.formEvent).subscribe();
    //this.events.push(inputs);
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

  getColorByEvent(category: number): String{
    if(category == undefined) {
      return '#3f51b5';
    }
    return this.categories.filter(c => c.id === category)[0].color;
  }
}
