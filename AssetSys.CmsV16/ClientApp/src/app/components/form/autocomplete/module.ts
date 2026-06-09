import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NbAutocompleteComponent } from './component';
import { NbBoxModule } from '../box-view/module';

@NgModule({  
  declarations: [
    NbAutocompleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    NbBoxModule,
    SharedModule
  ],
  exports: [
    NbAutocompleteComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
    
  ]
})
export class NbAutocompleteModule { }