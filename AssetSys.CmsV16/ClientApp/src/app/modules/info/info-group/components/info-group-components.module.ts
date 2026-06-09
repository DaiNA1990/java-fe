import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoGroupEditComponent } from './edit/info-group-edit.component';
import { InfoGroupListComponent } from './list/info-group-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { InfoPropertyComponentsModule } from '../../info-property/components/info-property-components.module';
import { DialogModule } from 'primeng/dialog';
import { InfoGroupBuildFormComponent } from './build-form/build-form.component';
import { InfoLayoutComponentsModule } from '../../info-layout/components/info-layout-components.module';
import { InfoFormComponentsModule } from '../../info-form/components/info-form-components.module';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NbSelectModule } from "../../../../components/form/select/module";

@NgModule({
  declarations: [
    InfoGroupEditComponent,
    InfoGroupListComponent,
    InfoGroupBuildFormComponent,
  ],
  exports: [InfoGroupListComponent],
  imports: [
    CommonModule,
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
    InfoPropertyComponentsModule,
    InfoLayoutComponentsModule,
    InfoFormComponentsModule,
    ConfirmDialogModule,
    ToastModule,
    NbSelectModule
  ],
  providers: [ConfirmationService, MessageService],
})
export class InfoGroupComponentsModule {}
