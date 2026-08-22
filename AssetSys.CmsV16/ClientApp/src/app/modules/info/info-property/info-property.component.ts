import { Component } from '@angular/core';

@Component({
    selector: 'app-info-property',
    template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoProperty" group="InfoProperty" name="InfoProperty"></app-breadcrumb>
  </div>
  <app-info-property-list></app-info-property-list>
  `,
    standalone: false
})
export class InfoPropertyComponent {

  constructor() {

  }

}