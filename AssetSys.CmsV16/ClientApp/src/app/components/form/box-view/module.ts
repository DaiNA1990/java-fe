import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { NbBoxComponent } from './component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({  
  declarations: [
    NbBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    SharedModule
  ],
  exports: [
    NbBoxComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbBoxModule { }