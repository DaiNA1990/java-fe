import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserPageEditComponent } from './edit/user-page-edit.component';
import { UserPageListComponent } from './list/user-page-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { NbTextareaModule } from '@appkkkh/components/form/textarea/module';
import { UserPageActionComponentsModule } from '../../user-page-action/components/user-page-action-components.module';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';

@NgModule({
    declarations: [
        UserPageEditComponent,
        UserPageListComponent,
    ],
    exports: [
        UserPageListComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NbTableModule,
        NbPageModule,
        NbPageDialogModule,
        NbLayoutGridModule,
        NbLayoutCardModule,
        NbNumberModule,
        NbTextModule,
        NbCheckboxModule,
        NbTextareaModule,
        UserPageActionComponentsModule
    ],
    providers: [],
})
export class UserPageComponentsModule { }