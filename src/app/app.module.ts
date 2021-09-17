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
import { MatCardModule } from '@angular/material/card'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';


import { DashboardComponent } from './dashboard/dashboard.component';
import { TodoComponent } from './todo/todo.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TabsComponent, TabComponent} from './tabs/tabs.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EventService } from './services/event-service/event.service';
import { CategoryService } from './services/category-service/category.service';
import { HttpClientModule} from '@angular/common/http';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { CategoryComponent } from './category/category.component';

import { ColorPickerModule } from 'ngx-color-picker';



@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    DashboardComponent,
    TodoComponent,
    TabsComponent,
    TabComponent,
    EventDetailComponent,
    CategoryComponent,
  ],
  imports: [
    appRouting,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    HttpClientModule,
    MatMomentDateModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    ColorPickerModule,
    MatSelectModule
  ],
  providers: [EventService, CategoryService, DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
