import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { NbSelectComponent } from './component';
import { NbBoxModule } from '../box-view/module';

@NgModule({  
  declarations: [
    NbSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    NbBoxModule,
    SharedModule
  ],
  exports: [
    NbSelectComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbSelectModule { }