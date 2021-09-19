import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerConfigComponent } from './timer-config.component';

describe('TimerConfigComponent', () => {
  let component: TimerConfigComponent;
  let fixture: ComponentFixture<TimerConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
