import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoDataEditComponent } from './edit/info-data-edit.component';
import { InfoDataListComponent } from './list/info-data-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';

@NgModule({
    declarations: [
        InfoDataEditComponent,
        InfoDataListComponent,
    ],
    exports: [
        InfoDataListComponent,
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
        NbCheckboxModule,
    ],
    providers: [],
})
export class InfoDataComponentsModule { }