import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { appRouting, routingComponents } from './app.routing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card'; 
import {FormsModule} from '@angular/forms'


import { DashboardComponent } from './dashboard/dashboard.component';
import { TodoComponent } from './todo/todo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TabsComponent, TabComponent} from './tabs/tabs.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EventService } from './services/event-service/event.service';
import { HttpClientModule} from '@angular/common/http'
import {SOCKET_IO} from './app.tokens';

import * as io from 'socket.io-client';

export function socketIoFactory() {
  return io;
}



@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DashboardComponent,
    TodoComponent,
    TabsComponent,
    TabComponent
  ],
  imports: [
    appRouting,
    FormsModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatListModule,
    NgbModule,
    HttpClientModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [EventService,
    {provide: SOCKET_IO, useFactory: socketIoFactory},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
