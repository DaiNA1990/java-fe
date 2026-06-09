import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { NbTableComponent } from './component';
import { NbTableColumnComponent } from './col';
import localeVi from '@angular/common/locales/vi';

registerLocaleData(localeVi);

@NgModule({
  declarations: [
    NbTableComponent,
    NbTableColumnComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TableModule,
  ],
  exports: [
    NbTableColumnComponent,
    NbTableComponent
  ],
  providers: [
  ]
})
export class NbTableModule { }
