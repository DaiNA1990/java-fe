import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { CheckboxModule } from 'primeng/checkbox';
import { NbCheckboxComponent } from './component';
import { NbBoxModule } from '../box-view/module';

@NgModule({  
  declarations: [
    NbCheckboxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    NbBoxModule,
    SharedModule
  ],
  exports: [
    NbCheckboxComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbCheckboxModule { }