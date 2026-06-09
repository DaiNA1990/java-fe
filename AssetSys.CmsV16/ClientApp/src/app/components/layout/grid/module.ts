import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutGridItemComponent } from './col';
import { NbLayoutGridComponent } from './component';

@NgModule({
  declarations: [
    NbLayoutGridItemComponent,
    NbLayoutGridComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NbLayoutGridItemComponent,
    NbLayoutGridComponent,
  ],
  providers: [
  ]
})
export class NbLayoutGridModule { }
