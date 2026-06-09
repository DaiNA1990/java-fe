import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import localeVi from '@angular/common/locales/vi';
import { NbTreeComponent } from './component';
import { NbBoxModule } from '@appkkkh/components/form/box-view/module';

registerLocaleData(localeVi);

@NgModule({
  declarations: [
    NbTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeModule,
    NbBoxModule,
  ],
  exports: [
    NbTreeComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [
  ]
})
export class NbTreeModule { }
