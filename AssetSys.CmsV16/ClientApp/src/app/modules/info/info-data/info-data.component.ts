import { Component } from '@angular/core';

@Component({
    selector: 'app-info-data',
    template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoData" group="InfoData" name="InfoData"></app-breadcrumb>
  </div>
  <app-info-data-list></app-info-data-list>
  `,
    standalone: false
})
export class InfoDataComponent {

  constructor() {

  }

}