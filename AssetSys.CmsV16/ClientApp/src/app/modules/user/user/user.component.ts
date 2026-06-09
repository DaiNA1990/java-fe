import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Quản lý" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-list></app-user-list>
  `
})
export class UserComponent {

  constructor() {

  }

}