import { Component, OnInit } from '@angular/core';
import { TimerService } from 'src/app/services/timer-service/timer.service';
import { TimerConfiguration } from '../../models/TimerConfiguration';

@Component({
  selector: 'app-timer-config',
  templateUrl: './timer-config.component.html',
  styleUrls: ['./timer-config.component.scss']
})
export class TimerConfigComponent implements OnInit {

  formTimerConfig: TimerConfiguration = {}

  constructor(private timerService: TimerService) { }

  ngOnInit(): void {
    this.timerService.loadTimerConfiguration().subscribe(res =>
      this.formTimerConfig = res
    )
  }

  saveTimerConfiguration() {
    this.timerService.saveTimerConfiguration(this.formTimerConfig).subscribe();
  }



}
