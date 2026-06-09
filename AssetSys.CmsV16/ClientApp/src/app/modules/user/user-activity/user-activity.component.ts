import { Component } from '@angular/core';

@Component({
  selector: 'app-user-activity',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Thao tác" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-activity-list></app-user-activity-list>
  `
})
export class UserActivityComponent {

  constructor() {

  }

}