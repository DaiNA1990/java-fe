import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbPageDialogComponent } from './component';
import localeVi from '@angular/common/locales/vi';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';

registerLocaleData(localeVi);

@NgModule({
  declarations: [
    NbPageDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    DialogModule,
    SharedModule,
  ],
  exports: [
    NbPageDialogComponent
  ],
  providers: [
  ]
})
export class NbPageDialogModule { }
