import { Component } from '@angular/core';

@Component({
  selector: 'app-user-department',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Phòng ban" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-department-list></app-user-department-list>
  `
})
export class UserDepartmentComponent {

  constructor() {

  }

}