import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoFormEditComponent } from './edit/info-form-edit.component';
import { InfoFormListComponent } from './list/info-form-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { NbSelectModule } from "../../../../components/form/select/module";
import { NbTextareaModule } from "../../../../components/form/textarea/module";
import { SharedModule } from "../../../../_metronic/shared/shared.module";
import { InfoFormDesignComponent } from './design/component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { NbAutocompleteModule } from '@appkkkh/components/form/autocomplete/module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InfoFormPropertyComponent } from './property/component';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InfoFormLayoutComponent } from './layout/component';
import { InfoFormDataFieldComponent } from './data-field/component';
import { InfoPropertyComponentsModule } from '../../info-property/components/info-property-components.module';
import { InfoLayoutComponentsModule } from '../../info-layout/components/info-layout-components.module';
import { InfoFormControlComponent } from './control/component';
import { InfoFormPropertyBuildDataComponent } from './property/subs/build-data/component';
import { InfoFormPropertyBuildValidateComponent } from './property/subs/build-validate/component';
import { InfoFormPropertyBuildConditionUIComponent } from './property/subs/build-condition-ui/component';
import { InfoFormPropertyBuildConditionReadOnlyComponent } from './property/subs/build-condition-readonly/component';
import { InfoFormPropertyBuildConditionDataComponent } from './property/subs/build-condition-data/component';
import { InfoFormPropertyBuildActionComponent } from './property/subs/build-action/component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations: [
        InfoFormEditComponent,
        InfoFormListComponent,
        InfoFormDesignComponent,
        InfoFormDataFieldComponent,
        InfoFormLayoutComponent,
        InfoFormPropertyComponent,
        InfoFormControlComponent,
        InfoFormPropertyBuildDataComponent,
        InfoFormPropertyBuildValidateComponent,
        InfoFormPropertyBuildConditionUIComponent,
        InfoFormPropertyBuildConditionReadOnlyComponent,
        InfoFormPropertyBuildConditionDataComponent,
        InfoFormPropertyBuildActionComponent
    ],
    exports: [
        InfoFormListComponent,
        InfoFormDesignComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SplitterModule,
        AccordionModule,
        PanelModule,
        DragDropModule,
        DialogModule,
        ConfirmDialogModule,
        DropdownModule,
        NbSelectModule,
        ToastModule,
        TabViewModule,
        AutoCompleteModule,
        NbAutocompleteModule,
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
        SharedModule,
        InfoPropertyComponentsModule,
        InfoLayoutComponentsModule
    ],
    providers: [],
})
export class InfoFormComponentsModule { }
