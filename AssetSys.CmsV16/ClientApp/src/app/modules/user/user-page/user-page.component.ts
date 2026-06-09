import { Component } from '@angular/core';

@Component({
  selector: 'app-user-page',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Chức năng" group="Tài khoản" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-page-list></app-user-page-list>
  `
})
export class UserPageComponent {

  constructor() {

  }

}