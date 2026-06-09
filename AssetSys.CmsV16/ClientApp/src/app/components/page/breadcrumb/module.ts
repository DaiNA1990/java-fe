import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbBreadcrumbComponent } from './component';
import localeVi from '@angular/common/locales/vi';
import { NbTableModule } from '@appkkkh/components/data/table/module';

registerLocaleData(localeVi);

@NgModule({
  declarations: [
    NbBreadcrumbComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NbTableModule,
  ],
  exports: [
    NbBreadcrumbComponent
  ],
  providers: [
  ]
})
export class NbBreadcrumbModule { }
