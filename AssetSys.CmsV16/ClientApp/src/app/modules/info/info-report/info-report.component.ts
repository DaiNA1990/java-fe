import { Component } from '@angular/core';

@Component({
  selector: 'app-info-report',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoReport" group="InfoReport" name="InfoReport"></app-breadcrumb>
  </div>
  <app-info-report-list></app-info-report-list>
  `
})
export class InfoReportComponent {

  constructor() {

  }

}
