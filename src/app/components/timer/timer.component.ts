import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { CountdownConfig, CountdownEvent } from 'ngx-countdown';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  host: {
    '[class.card]': `true`,
    '[class.text-center]': `true`,
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {

  @Input() countdownStart: number;
  constructor() { }

  ngOnInit(): void {

  }
  config: any = {
    leftTime: 0,
    format: 'mm:ss',
    prettyText: (text) => {
      return text
        .split(':')
        .map((v) => `<span class="item">${v}</span>`)
        .join(':');
    },
  };

  handleEvent(e: CountdownEvent) {
    console.log('Actions', e);
  }

}
