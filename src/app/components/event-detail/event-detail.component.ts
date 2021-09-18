import { Component, Input } from '@angular/core';
import {Event} from '../../models/Event';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent{

  constructor() { }

  @Input() event: Event;

}
