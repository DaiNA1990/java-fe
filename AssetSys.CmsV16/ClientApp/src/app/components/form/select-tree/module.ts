import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { NbSelectTreeComponent } from './component';
import { NbBoxModule } from '../box-view/module';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({  
  declarations: [
    NbSelectTreeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    TreeSelectModule,
    NbBoxModule,
    SharedModule
  ],
  exports: [
    NbSelectTreeComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbSelectTreeModule { }