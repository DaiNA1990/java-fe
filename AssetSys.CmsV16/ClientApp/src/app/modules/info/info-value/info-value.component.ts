import { Component } from '@angular/core';

@Component({
  selector: 'app-info-value',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoValue" group="InfoValue" name="InfoValue"></app-breadcrumb>
  </div>
  <app-info-value-list></app-info-value-list>
  `
})
export class InfoValueComponent {

  constructor() {

  }

}