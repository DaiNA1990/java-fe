import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoPageFormComponent } from './form/component';
import { InfoPageTableComponent } from './table/component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { NbSelectModule } from "../../../../components/form/select/module";
import { NbRadioModule } from "../../../../components/form/radio/module";
import { NbTextareaModule } from "../../../../components/form/textarea/module";
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { TableModule } from 'primeng/table';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InfoPageSelectComponent } from './select/component';
import { InfoPageCheckboxComponent } from './checkbox/checkbox.component';
import { InfoPageRadioComponent } from './radio/radio.component';
import { InfoPageModalComponent } from './modal/component';
import { InfoDataActionComponent } from './action-history/info-data-action.component';
import { EventDataService } from '../services/event-service';
import { InfoPageNumberComponent } from './number/component';
import { InfoPageDatetimeComponent } from './datetime/component';
import { AppPipeModule } from '@appkkkh/infrastructure/pipes/pipe.module';
import { InfoPageFileUploadComponent } from './fileupload/component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';

@NgModule({
    declarations: [
        InfoPageFileUploadComponent,
        InfoPageFormComponent,
        InfoPageTableComponent,
        InfoPageSelectComponent,
        InfoPageRadioComponent,
        InfoPageNumberComponent,
        InfoPageDatetimeComponent,
        InfoPageModalComponent,
        InfoDataActionComponent,
        InfoPageCheckboxComponent
    ],
    exports: [
        InfoPageFormComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AppPipeModule,
        NbBreadcrumbModule,
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
        TimelineModule,
        ToastModule
    ],
    providers: [
        EventDataService
    ],
})
export class InfoPageComponentsModule { }
