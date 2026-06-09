import { Component } from '@angular/core';

@Component({
  selector: 'app-user-title',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Chức danh" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-title-list></app-user-title-list>
  `
})
export class UserTitleComponent {

  constructor() {

  }

}