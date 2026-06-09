import { Component } from '@angular/core';

@Component({
  selector: 'app-user-role-page-action-map',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="UserRolePageActionMap" group="UserRolePageActionMap" name="UserRolePageActionMap"></app-breadcrumb>
  </div>
  <app-user-role-page-action-map-list></app-user-role-page-action-map-list>
  `
})
export class UserRolePageActionMapComponent {

  constructor() {

  }

}