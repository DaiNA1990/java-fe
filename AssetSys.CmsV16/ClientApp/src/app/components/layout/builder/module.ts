import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutBuilderComponent } from './component';

@NgModule({
  declarations: [
    NbLayoutBuilderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NbLayoutBuilderComponent,
  ],
  providers: [
  ]
})
export class NbLayoutBuilderModule { }
