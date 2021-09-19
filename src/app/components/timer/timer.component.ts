import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { relativeTimeThreshold } from 'moment';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
import { TimerConfiguration } from 'src/app/models/TimerConfiguration';
import { TimerService } from 'src/app/services/timer-service/timer.service';

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
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  timer?: TimerConfiguration;
  countdown_time: number;
  // State: 1, 3, 5, 7 working
  // State: 2, 4, 6, small break
  // State: 8 big break
  state: number = 1;
  autoRestart: boolean = false;
  constructor(private timerService: TimerService) { }

  ngOnInit(): void {
    this.timerService.loadTimerConfiguration().subscribe(res => {
      this.timer = res;
      this.countdown_time = this.timer.interval;
    })
    this.timerService.timerChanged$.subscribe(_ => {
      console.log("Timer Changed");
      this.timerService.loadTimerConfiguration().subscribe(res => {
        this.timer = res;
        this.countdown_time = this.timer.interval;
        this.countdown.restart();
      })
    }
    )
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
    if (e.action == "done") {
      this.countdown_time = this.getCountdownTime()
      this.autoRestart = true;
    }

    if(e.action == "restart" && this.autoRestart) {
      this.countdown.begin();
      this.autoRestart = false;
    } 

    if (e.action == "restart" && !this.autoRestart) {
      this.state = 1;
    }
  }

  getCountdownTime() {
    this.state++;
    if (this.state % 2 == 1) {
      return this.timer.interval
    }
    else if (this.state < this.timer.intervalCount*2) {
      return this.timer.smallBreak
    }
    else {
      this.state = 0;
      return this.timer.bigBreak
    }
  }
}
