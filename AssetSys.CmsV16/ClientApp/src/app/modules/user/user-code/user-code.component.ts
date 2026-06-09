import { Component } from '@angular/core';

@Component({
  selector: 'app-user-code',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Mã xác thực" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-code-list></app-user-code-list>
  `
})
export class UserCodeComponent {

  constructor() {

  }

}