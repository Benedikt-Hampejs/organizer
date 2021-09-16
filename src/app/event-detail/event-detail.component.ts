import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import { EventService } from '../services/event-service/event.service';
import {Event} from '../models/Event';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {

  constructor(private eventSerive: EventService) { }

  @Input() event: Event;

  ngOnInit(): void {
    //this.route.params.subscribe((params) => {this.eventSerive.getEvent(params['id']).subscribe(e => this.event = e)});

  }

}
