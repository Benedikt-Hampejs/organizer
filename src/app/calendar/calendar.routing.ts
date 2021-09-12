import {Routes} from '@angular/router';
import {DayComponent} from './day/day.component';
import { CalendarComponent } from './calendar.component';

export const calendarRoutes: Routes = [
  {
    path: '',
    children: [
        {path: '', component: CalendarComponent, data: {animation: 'left'}},
        {path: 'day/:id', component: DayComponent, data: {animation: 'right'}}
    ]
  }
];

export const calendarRoutingComponents = [CalendarComponent, DayComponent];