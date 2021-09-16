import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import {EventService} from '../services/event-service/event.service';
import { Observable } from 'rxjs';
import {Event} from 'src/app/models/Event';
import { calculatePriortyByDay } from '../helper'
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  events$: Observable<Event[]>;

  todo:Event[] = [

  ];

  done:Event[] = [

  ];


  constructor(private eventService: EventService, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.events$ = this.eventService.loadEvents(null);
    this.events$.subscribe(res => {
      res.sort((a,b) => a.priroty - b.priroty);
      res.forEach(e => {
        const tomorrow: Date = this.getTomorrow();
        const yesterday: Date = this.getYesterday();
        if(new Date(e.start) < tomorrow) {
          if(e.done === true) {
            if(new Date(e.end) > yesterday) {
              this.done = [...this.done, e];
            }
          } else {
            this.todo = [...this.todo, e];
          }
        }
        
    })});

    this.activeRoute.params.subscribe((params) =>  {console.log(params)});
  }

  


  private getTomorrow() {
    const tomorrow: Date = new Date();
    tomorrow.setSeconds(0);
    tomorrow.setMinutes(0);
    tomorrow.setHours(0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  private getYesterday() {
    const yesterday: Date = new Date();
    yesterday.setSeconds(0);
    yesterday.setMinutes(0);
    yesterday.setHours(0);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  drop(event: CdkDragDrop<Event[]>) {
    if (event.previousContainer === event.container) {
      console.log("prev" + event.previousIndex, " current", event.currentIndex)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      const currentItem: Event = event.container.data[event.currentIndex];
      this.updateDone(event, currentItem);
      this.eventService.updateEventDone(currentItem);

    }
    event.container.data.forEach(e => {
      e.priroty = calculatePriortyByDay(new Date()) + event.container.data.indexOf(e);
      this.eventService.saveEvent(e).subscribe();
    });
  }

  private updateDone(event: CdkDragDrop<Event[], Event[]>, currentItem:Event) {
    currentItem.done = !currentItem.done;
  }

  showEvent(event: Event) {
    const url = this.router.url;
    const foundParam: boolean = url.lastIndexOf('event-detail') != -1
    const id:number = foundParam ? +url.substring(url.lastIndexOf('event-detail/') + 13, url.lastIndexOf(')')) : null;
    if(!this.router.url.includes('event-detail') || id !== event.id) {
      this.router.navigate([{outlets: {'right':['event-detail', event.id], }}])
    } else{
      this.router.navigate([{outlets: {'right': null}}])
    }
  }
}
