import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slider } from './animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slider
  ]
})
export class AppComponent {
  title = 'organizer';
  showTimer: boolean = false;

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  public onRouterOutletActivate(event: any) {
  }

  public isBigScreen() {
    const vh = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    return vh > 768;
  }

}


