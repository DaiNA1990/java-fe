import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoReportEditComponent } from './edit/info-report-edit.component';
import { InfoReportListComponent } from './list/info-report-list.component';
import { InfoReportBuildReportComponent } from './build-report/build-report.component';
import { InfoReportSetupComponentsModule } from '../../info-report-setup/components/info-report-setup-components.module';
import { InfoFormReportComponent } from './report-setup/component';
import { InfoReportDesignComponent } from './design/component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { NbTextareaModule } from "@appkkkh/components/form/textarea/module";
import { NbBoxModule } from "@appkkkh/components/form/box-view/module";
import {InfoFormReportBuildMapColumnComponent} from './report-setup/subs/build-map-column/component'
import {InfoFormReportBuildGroupDataComponent} from './report-setup/subs/build-group-data/component'
import { NbFileModule } from "@srckkkh/app/components/form/file/module";
import { InfoReportFileUploadComponent } from './fileupload/component';
import { InfoFormReportSetupComponent } from './report-setup/subs/component'

@NgModule({
  declarations: [
    InfoReportEditComponent,
    InfoReportListComponent,
    InfoReportBuildReportComponent,
    InfoFormReportComponent,
    InfoReportDesignComponent,
    InfoFormReportBuildMapColumnComponent,
    InfoFormReportBuildGroupDataComponent,
    InfoReportFileUploadComponent,
    InfoFormReportSetupComponent
  ],
  exports: [InfoReportListComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SplitterModule,
    AccordionModule,
    DialogModule,
    SharedModule,
    NbTableModule,
    NbPageModule,
    NbPageDialogModule,
    NbLayoutGridModule,
    NbLayoutCardModule,
    NbNumberModule,
    NbTextModule,
    NbCheckboxModule,
    ConfirmDialogModule,
    ToastModule,
    PanelModule,
    InfoReportSetupComponentsModule,
    NbTextareaModule,
    NbBoxModule,
    NbFileModule,
    CommonModule,
],
  providers: [ConfirmationService, MessageService],
})
export class InfoReportComponentsModule {}
