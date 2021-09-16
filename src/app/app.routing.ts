import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent} from './dashboard/dashboard.component';
import { TodoComponent} from './todo/todo.component';
import { calendarRoutes, calendarRoutingComponents} from  './calendar/calendar.routing';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { CategoryComponent } from './category/category.component';



const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'todo', component: TodoComponent, data: {animation: 'left'}},
  {path: 'category', component: CategoryComponent, data: {animation: 'right'}},
  {path: 'calender', children: calendarRoutes, data: {animation: 'right'}}
];

export const appRouting = RouterModule.forRoot(routes);


export const routingComponents = [DashboardComponent, TodoComponent, ...calendarRoutingComponents];

export class AppRoutingModule { }
