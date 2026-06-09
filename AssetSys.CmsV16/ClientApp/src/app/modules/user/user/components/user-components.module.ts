import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserEditComponent } from './edit/user-edit.component';
import { UserListComponent } from './list/user-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbSelectModule } from '@appkkkh/components/form/select/module';
import { NbRadioModule } from '@appkkkh/components/form/radio/module';
import { NbDatetimeModule } from '@appkkkh/components/form/datetime/module';
import { NbTreeModule } from '@appkkkh/components/data/tree/module';
import { NbAutocompleteModule } from '@appkkkh/components/form/autocomplete/module';
import { NbEditorModule } from '@appkkkh/components/form/editor/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { UserRoleMapComponentsModule } from '../../user-role-map/components/user-role-map-components.module';
import { NbDirectivesModule } from '@appkkkh/infrastructure/directives/directives.module';

@NgModule({
    declarations: [
        UserEditComponent,
        UserListComponent,
    ],
    exports: [
        UserListComponent,
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
        NbTextModule,
        NbAutocompleteModule,
        NbSelectModule,
        NbRadioModule,
        NbCheckboxModule,
        NbDatetimeModule,
        NbTreeModule,
        NbEditorModule,
        NbDirectivesModule,
        UserRoleMapComponentsModule
    ],
    providers: [],
})
export class UserComponentsModule { }
