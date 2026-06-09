import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { NbSelectGroupComponent } from './component';
import { NbBoxModule } from '../box-view/module';
import { CascadeSelectModule } from 'primeng/cascadeselect';

@NgModule({  
  declarations: [
    NbSelectGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    CascadeSelectModule,
    NbBoxModule,
    SharedModule
  ],
  exports: [
    NbSelectGroupComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbSelectGroupModule { }