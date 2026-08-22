import { Component } from '@angular/core';

@Component({
    selector: 'app-user-connection',
    template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Kết nối" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-connection-list></app-user-connection-list>
  `,
    standalone: false
})
export class UserConnectionComponent {

  constructor() {

  }

}