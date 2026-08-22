import { style } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
    selector: 'app-job-schedule',
    template: `
    <!-- <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="JobSchedule" group="JobSchedule" name="JobSchedule"></app-breadcrumb>
  </div> -->
    <app-job-schedule-list></app-job-schedule-list>
  `,
    styles: [
        `
      :host ::ng-deep {
        // PrimeNG 21: p-tabView -> p-tabs, .p-tabview-nav-link -> .p-tab
        .p-tab {
          color: rgb(0, 107, 104);
          text-decoration: none !important;
        }
        .p-tabs .p-tablist .p-tab.p-tab-active {
          border-color: rgb(0, 107, 104);
        }
        .p-button {
          border-radius: 6px;
          color: #ffffff;
          background: #006b68;
          border: 1px solid #006b68;
        }

        .p-button-danger {
          background: #ef4444;
          border: 1px solid #ef4444;
        }
      }
    `,
    ],
    standalone: false
})
export class JobScheduleComponent {
  constructor() {}
}
