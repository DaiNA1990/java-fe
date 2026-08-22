import { Component } from '@angular/core';

@Component({
    selector: 'app-user-role-map',
    template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="UserRoleMap" group="UserRoleMap" name="UserRoleMap"></app-breadcrumb>
  </div>
  <app-user-role-map-list></app-user-role-map-list>
  `,
    standalone: false
})
export class UserRoleMapComponent {

  constructor() {

  }

}