import { Component } from '@angular/core';

import { APP_VERSION } from '../constants';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
	readonly version = APP_VERSION;
}
