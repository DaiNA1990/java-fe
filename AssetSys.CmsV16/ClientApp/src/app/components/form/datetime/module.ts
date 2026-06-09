import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { NbDatetimeComponent } from './component';
import { NbBoxModule } from '../box-view/module';

@NgModule({  
  declarations: [
    NbDatetimeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    NbBoxModule,
    SharedModule
  ],
  exports: [
    NbDatetimeComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbDatetimeModule { }