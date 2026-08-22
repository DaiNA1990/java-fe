import { Component } from '@angular/core';

@Component({
    selector: 'app-user-level',
    template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Cấp bậc" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-level-list></app-user-level-list>
  `,
    standalone: false
})
export class UserLevelComponent {

  constructor() {

  }

}