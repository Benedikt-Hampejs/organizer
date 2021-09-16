import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent} from './dashboard/dashboard.component';
import { TodoComponent} from './todo/todo.component';
import { calendarRoutes, calendarRoutingComponents} from  './calendar/calendar.routing';
import { EventDetailComponent } from './event-detail/event-detail.component';



const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'todo', component: TodoComponent, data: {animation: 'left'}},
  {path: 'calender', children: calendarRoutes, data: {animation: 'right'}},
  {path: 'event-detail/:id', component: EventDetailComponent, outlet: 'right'},

];

export const appRouting = RouterModule.forRoot(routes);


export const routingComponents = [DashboardComponent, TodoComponent, ...calendarRoutingComponents];

export class AppRoutingModule { }
