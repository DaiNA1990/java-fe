import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NbRadioComponent } from './component';
import { NbBoxModule } from '../box-view/module';

@NgModule({  
  declarations: [
    NbRadioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    NbBoxModule,
    SharedModule
  ],
  exports: [
    NbRadioComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbRadioModule { }