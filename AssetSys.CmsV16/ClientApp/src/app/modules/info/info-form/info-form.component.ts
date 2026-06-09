import { Component } from '@angular/core';

@Component({
  selector: 'app-info-form',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoForm" group="InfoForm" name="InfoForm"></app-breadcrumb>
  </div>
  <app-info-form-list></app-info-form-list>
  `
})
export class InfoFormComponent {

  constructor() {

  }

}