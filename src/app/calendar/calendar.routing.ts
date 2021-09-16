import {Routes} from '@angular/router';
import {DayComponent} from './day/day.component';
import { CalendarComponent } from './calendar.component';

export const calendarRoutes: Routes = [
  {
    path: '',
    children: [
        {path: '', component: CalendarComponent},
        {path: 'day/:id', component: DayComponent},
        {path: 'day/:id/:event', component: DayComponent}
    ]
  }
];

export const calendarRoutingComponents = [CalendarComponent, DayComponent];