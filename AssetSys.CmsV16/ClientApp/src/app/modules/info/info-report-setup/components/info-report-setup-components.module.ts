import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoReportSetupEditComponent } from './edit/info-report-setup-edit.component';
import { InfoReportSetupListComponent } from './list/info-report-setup-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { NbTextareaModule } from "../../../../components/form/textarea/module";
import { NbSelectModule } from "../../../../components/form/select/module";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        InfoReportSetupEditComponent,
        InfoReportSetupListComponent,
    ],
    exports: [
        InfoReportSetupEditComponent,
        InfoReportSetupListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NbTableModule,
        NbPageModule,
        NbPageDialogModule,
        NbLayoutGridModule,
        NbLayoutCardModule,
        NbNumberModule,
        NbTextModule,
        NbCheckboxModule,
        NbTextareaModule,
        NbSelectModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [],
})
export class InfoReportSetupComponentsModule { }
