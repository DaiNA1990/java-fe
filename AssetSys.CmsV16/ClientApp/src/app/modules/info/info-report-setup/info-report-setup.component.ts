import { Component } from '@angular/core';

@Component({
  selector: 'app-info-report-setup',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="InfoReportSetup" group="InfoReportSetup" name="InfoReportSetup"></app-breadcrumb>
  </div>
  <app-info-report-setup-list></app-info-report-setup-list>
  `
})
export class InfoReportSetupComponent {

  constructor() {

  }

}
