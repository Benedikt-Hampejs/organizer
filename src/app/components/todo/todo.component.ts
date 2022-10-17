import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EventService } from '../../services/event-service/event.service';
import { Observable } from 'rxjs';
import { Event } from 'src/app/models/Event';
import { calculatePriortyByDay } from '../../helper'
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category-service/category.service';
import { StatisticService, DAY_URL } from '../../services/statistic-service/statistic.service';
import { Category } from '../../models/Category';
import { StatisticsEnum } from 'src/app/enums/StatisticsEnum';
import { Router } from '@angular/router';
import * as moment from 'moment';



@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  events$: Observable<Event[]>;
  categories: Category[] = [];

  clickedEvent: Event;
  todo: Event[] = [];
  done: Event[] = [];

  constructor(private eventService: EventService, 
    private categoryService: CategoryService, 
    private activeRoute: ActivatedRoute, 
    private statisticService: StatisticService, 
    private router: Router ) { }

  ngOnInit(): void {

    this.events$ = this.eventService.loadEvents(null);
    this.events$.subscribe(res => {
      res.sort((a, b) => a.priroty - b.priroty);
      res.forEach(e => {
        const tomorrow: Date = this.getTomorrow();
        const yesterday: Date = this.getYesterday();
        if (new Date(e.start) < tomorrow) {
          if (e.done === true) {
            if (new Date(e.end) > yesterday) {
              this.done = [...this.done, e];
            }
          } else {
            this.todo = [...this.todo, e];
          }
        }

      })
    });

    this.activeRoute.params.subscribe();
    this.categoryService.loadCategory().subscribe(c => this.categories = c);
  }




  private getTomorrow() {
    const tomorrow: Date = new Date();
    tomorrow.setSeconds(0);
    tomorrow.setMinutes(0);
    tomorrow.setUTCHours(0);
    tomorrow.setHours(0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  private getYesterday() {
    const yesterday: Date = new Date();
    yesterday.setSeconds(0);
    yesterday.setMinutes(0);
    yesterday.setUTCHours(0);
    yesterday.setHours(0);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  drop(event: CdkDragDrop<Event[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      const currentItem: Event = event.container.data[event.currentIndex];
      this.updateDone(event, currentItem);
      this.eventService.updateEventDone(currentItem);
    
      // add or remove points for finishing / reactivate task
      const container_id_numbder = +event.container.id.replace("cdk-drop-list-","")
      if (container_id_numbder % 2 == 0) { // %2 == 0 => left container
        this.statisticService.updateStatistic(currentItem, StatisticsEnum.TASK_DOWN)
      }
        
      if (container_id_numbder % 2 == 1) // %2 == 1 => right container
        this.statisticService.updateStatistic(currentItem, StatisticsEnum.TASK_UP)
    }
    event.container.data.forEach(e => {
      e.priroty = calculatePriortyByDay(new Date()) + event.container.data.indexOf(e);
      this.eventService.saveEvent(e).subscribe();
    });
  }

  private updateDone(event: CdkDragDrop<Event[], Event[]>, currentItem: Event) {
    currentItem.done = !currentItem.done;
  }

  showEvent(event: Event) {
    if (this.clickedEvent == null || this.clickedEvent.id !== event.id)
      this.clickedEvent = event;
    else
      this.clickedEvent = null;
  }

  editEvent(event: Event) {
    let dayOfDate = (moment(event.start).format('YYYY-MM-DD'))
    this.router.navigate(["../calender/day/"+dayOfDate])
  }

  deleteEvent(event: Event) {
    this.eventService.deleteEvent(event).subscribe();
    this.todo = this.todo.filter(elem => elem != event)
  }

  

  getColorByEvent(category: number): String {
    if (category == undefined || this.categories == undefined) {
      return '#3f51b5';
    }
      const catsFiltered:Category[]  = this.categories.filter(c => c.id === category)
      if(catsFiltered.length > 0) {
        return catsFiltered[0].color;
      } else {
        return '#3f51b5';
      }
  }
}
