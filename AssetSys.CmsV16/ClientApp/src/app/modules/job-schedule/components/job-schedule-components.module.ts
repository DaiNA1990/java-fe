import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobScheduleListComponent } from './list/job-schedule-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { NbTextareaModule } from "../../../components/form/textarea/module";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbSelectModule } from "../../../components/form/select/module";
import { NbRadioModule } from "../../../components/form/radio/module";
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { TableModule } from 'primeng/table';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppPipeModule } from '@appkkkh/infrastructure/pipes/pipe.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {JobDetailsComponent} from '../components/edit/job-details.component'

@NgModule({
    declarations: [
        JobScheduleListComponent,
        JobDetailsComponent
    ],
    exports: [
        JobScheduleListComponent,
        JobDetailsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AppPipeModule,
        NbBreadcrumbModule,
        ConfirmDialogModule,
        ToastModule,
        InputTextModule,
        TooltipModule,
        DialogModule,
        CalendarModule,
        TabViewModule,
        ScrollPanelModule,
        TableModule,
        DropdownModule,
        MultiSelectModule,
        CheckboxModule,
        InputNumberModule,
        FileUploadModule,
        OverlayPanelModule,
        NbTableModule,
        NbPageModule,
        NbPageDialogModule,
        NbLayoutGridModule,
        NbLayoutCardModule,
        NbNumberModule,
        NbTextModule,
        NbCheckboxModule,
        NbSelectModule,
        NbTextareaModule,
        NbRadioModule,
        RadioButtonModule,
        ButtonModule,
        ProgressSpinnerModule,
        NgbModalModule,
        PanelModule,
        MessageModule,
        CardModule,
        TimelineModule
    ],
    providers: [],
})
export class JobScheduleComponentsModule { }
