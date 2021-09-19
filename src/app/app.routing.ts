import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { TodoComponent} from './components/todo/todo.component';
import { calendarRoutes, calendarRoutingComponents} from  './components/calendar/calendar.routing';
import { CategoryComponent } from './components/category/category.component';
import { TimerConfigComponent } from './components/timer-config/timer-config.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'todo', component: TodoComponent,},
  {path: 'category', component: CategoryComponent},
  {path: 'timer-config', component: TimerConfigComponent},
  {path: 'calender', children: calendarRoutes}
];

export const appRouting = RouterModule.forRoot(routes);


export const routingComponents = [DashboardComponent, TodoComponent, ...calendarRoutingComponents];

export class AppRoutingModule { }
