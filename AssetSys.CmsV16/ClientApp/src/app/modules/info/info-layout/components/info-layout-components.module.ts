import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoLayoutEditComponent } from './edit/info-layout-edit.component';
import { InfoLayoutListComponent } from './list/info-layout-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { NbSelectModule } from "../../../../components/form/select/module";

@NgModule({
    declarations: [
        InfoLayoutEditComponent,
        InfoLayoutListComponent,
    ],
    exports: [
        InfoLayoutEditComponent,
        InfoLayoutListComponent,
    ],
    imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NbTableModule,
    NbPageModule,
    NbPageDialogModule,
    NbLayoutGridModule,
    NbLayoutCardModule,
    NbNumberModule,
    NbTextModule,
    NbCheckboxModule,
    NbSelectModule
],
    providers: [],
})
export class InfoLayoutComponentsModule { }