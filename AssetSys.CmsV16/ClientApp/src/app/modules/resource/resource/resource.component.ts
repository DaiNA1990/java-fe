import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resource',
  template: `
  <div class="pb-3 pb-lg-6">
    <app-breadcrumb module="Thông tin" group="Quản lý" name="Danh sách"></app-breadcrumb>
  </div>
  <app-resource-list [parentCode]="parentCode"  />
  `
})
export class ResourceInfoComponent {

  parentCode: string;

  constructor(private route: ActivatedRoute) {
    this.parentCode = route.snapshot.data['parentCode'];
  }

}