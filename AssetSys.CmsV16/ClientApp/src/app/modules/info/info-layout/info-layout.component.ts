import { Component } from '@angular/core';

@Component({
  selector: 'app-info-layout',
  template: `
  <!-- <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoLayout" group="InfoLayout" name="InfoLayout"></app-breadcrumb>
  </div> -->
  <app-info-layout-list></app-info-layout-list>
  `
})
export class InfoLayoutComponent {

  constructor() {

  }

}
