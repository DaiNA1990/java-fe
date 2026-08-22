import { Component } from '@angular/core';

@Component({
    selector: 'app-user-notify',
    template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Thông báo" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-notify-list></app-user-notify-list>
  `,
    standalone: false
})
export class UserNotifyComponent {

  constructor() {

  }

}