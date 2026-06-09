import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserCodeEditComponent } from './edit/user-code-edit.component';
import { UserCodeListComponent } from './list/user-code-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbDatetimeModule } from '@appkkkh/components/form/datetime/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';

@NgModule({
    declarations: [
        UserCodeEditComponent,
        UserCodeListComponent,
    ],
    exports: [
        UserCodeListComponent,
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
        NbDatetimeModule,
        NbCheckboxModule,
    ],
    providers: [],
})
export class UserCodeComponentsModule { }