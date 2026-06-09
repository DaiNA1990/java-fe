import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionDirective } from './permission.directive';

@NgModule({
  declarations: [
    PermissionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PermissionDirective
  ]
})
export class NbDirectivesModule {

  static forRoot() {
    return {
      ngModule: NbDirectivesModule,
      providers: []
    };
  }

  static forChild() {
    return {
      ngModule: NbDirectivesModule,
      providers: []

    };

  }
}
