import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slider} from './animations'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slider
  ]
})
export class AppComponent {
  title = 'stefan-organizer';
  showTimer: boolean = false;

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
 
  public onRouterOutletActivate(event : any) {
}


}


