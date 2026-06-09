import { Component } from '@angular/core';

@Component({
  selector: 'app-info-group',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoGroup" group="InfoGroup" name="InfoGroup"></app-breadcrumb>
  </div>
  <app-info-group-list></app-info-group-list>
  `
})
export class InfoGroupComponent {

  constructor() {

  }

}
