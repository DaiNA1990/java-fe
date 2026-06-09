import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbPageListComponent } from './component';
import localeVi from '@angular/common/locales/vi';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';

registerLocaleData(localeVi);

@NgModule({
  declarations: [
    NbPageListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    NbTableModule,
    SharedModule,
  ],
  exports: [
    NbPageListComponent
  ],
  providers: [
  ]
})
export class NbPageModule { }
