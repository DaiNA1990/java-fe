import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoValueEditComponent } from './edit/info-value-edit.component';
import { InfoValueListComponent } from './list/info-value-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { InfoValueHistoryComponent } from './history/info-value-history.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
    declarations: [
        InfoValueEditComponent,
        InfoValueListComponent,
        InfoValueHistoryComponent
    ],
    exports: [
        InfoValueListComponent,
        InfoValueHistoryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        NbTableModule,
        NbPageModule,
        NbPageDialogModule,
        NbLayoutGridModule,
        NbLayoutCardModule,
        NbNumberModule,
        NbTextModule,
        NbCheckboxModule,
    ],
    providers: [],
})
export class InfoValueComponentsModule { }