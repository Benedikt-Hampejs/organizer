import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { TodoComponent} from './components/todo/todo.component';
import { calendarRoutes, calendarRoutingComponents} from  './components/calendar/calendar.routing';
import { CategoryComponent } from './components/category/category.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'todo', component: TodoComponent, data: {animation: 'left'}},
  {path: 'category', component: CategoryComponent, data: {animation: 'right'}},
  {path: 'calender', children: calendarRoutes, data: {animation: 'right'}}
];

export const appRouting = RouterModule.forRoot(routes);


export const routingComponents = [DashboardComponent, TodoComponent, ...calendarRoutingComponents];

export class AppRoutingModule { }
