import { Component } from '@angular/core';

@Component({
  selector: 'app-user-page-action',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Tài khoản" group="Thao tác" name="Danh sách"></app-breadcrumb>
  </div>
  <app-user-page-action-list></app-user-page-action-list>
  `
})
export class UserPageActionComponent {

  constructor() {

  }

}