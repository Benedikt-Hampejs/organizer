import { DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { TimerConfiguration } from 'src/app/models/TimerConfiguration';
import { EventService } from 'src/app/services/event-service/event.service';
import { StatisticService, DAY_URL, WEEK_URL, MONTH_URL, YEAR_URL } from 'src/app/services/statistic-service/statistic.service';
import { TimerService } from 'src/app/services/timer-service/timer.service';
import { Event } from '../../models/Event';
import { StatisticPerCategory } from 'src/app/models/StatisticPerCategory';
import { Statistic } from 'src/app/models/Statistic';

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
  state: number = 0;
  autoRestart: boolean = false;
  constructor(private timerService: TimerService, private eventService: EventService, private statisticService: StatisticService, private datePipe: DatePipe) { }

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

    if (e.action == "resume") {
      if (this.state == 0) {
        this.nextState();
      }
    }

    if (e.action == "done") {
      console.log("done")
      this.updateStatistic()
      this.nextState();
      this.countdown_time = this.getCountdown().time;
      this.autoRestart = true;
    }

    if(e.action == "restart" && this.autoRestart) {
      console.log("restart autostart")
      this.countdown.begin();
      this.autoRestart = false;
    } else if(e.action == "restart" && !this.autoRestart) {
      console.log("war hier");
      this.state = 0;
      this.countdown_time = this.getCountdown().time;
    }
  }
  updateStatistic() {
    if (this.getCountdown().description != "work") return;

    var event: Event;
    const today = new Date()
    this.eventService.loadEvents(null).subscribe(res => {
      res = res.filter(a => !a.done).filter(a => new Date(a.start) < today);
      res = res.sort((a,b) => a.priroty - b.priroty);
      console.log(res)
      event = res[0]

      this.statisticService.getStatistic(today,DAY_URL).subscribe(stat => {
        
        var statOfToday: Statistic = stat[0];
        console.log("Statistic of Today:",statOfToday);
        if (statOfToday == undefined) statOfToday = {}
        if (statOfToday.sum == undefined) statOfToday.sum = 0;
        statOfToday.sum++;

        if (statOfToday.date == undefined) {
          statOfToday.date = new Date();
          statOfToday.date.setSeconds(0);
          statOfToday.date.setMinutes(0);
          statOfToday.date.setUTCHours(0);
          statOfToday.date.setUTCMilliseconds(0);
        } 

        console.log("After Sum:",statOfToday)

        if (statOfToday.statisticPerCategory == undefined) statOfToday.statisticPerCategory = []
        const catStatArray = statOfToday.statisticPerCategory.filter(s => s.id == event.category);
        var statCategory: StatisticPerCategory;
        if (catStatArray.length != 0) {
          statCategory = catStatArray[0];
        }
        if (catStatArray.length == 0) {
          statCategory = {id: event.category, count: 0};
          catStatArray.push(statCategory)
        } 
        statCategory.count++;
        statOfToday.statisticPerCategory = catStatArray
        console.log("After Category:",statOfToday)

        this.statisticService.saveEvent(statOfToday, DAY_URL).subscribe(res => console.log("Result:", res));

      });
    });
    //if (e == undefined) 
    

    
  }

  nextState() {
    this.state = this.state % (this.timer?.intervalCount * 2) + 1;
  }

  getCountdown() {
    if(this.state == 0) {
      return {time: this.timer?.interval, description: 'idle'} 
    }else if (this.state % 2 == 1) {
      return {time: this.timer?.interval, description: 'work'}
    }
    else if (this.state < this.timer?.intervalCount*2) {
      return {time: this.timer?.smallBreak, description: 'small-break'}
    }
    else {
      return {time: this.timer?.bigBreak, description: 'big-break'}
    }
  }
}
