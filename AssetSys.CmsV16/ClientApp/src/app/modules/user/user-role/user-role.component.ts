import { Component } from '@angular/core';

@Component({
    selector: 'app-user-role',
    template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Quyền truy cập" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-role-list></app-user-role-list>
  `,
    standalone: false
})
export class UserRoleComponent {

  constructor() {

  }

}