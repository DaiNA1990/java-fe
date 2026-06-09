import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoleEditComponent } from './edit/user-role-edit.component';
import { UserRoleListComponent } from './list/user-role-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { UserRolePageActionMapComponentsModule } from '../../user-role-page-action-map/components/user-role-page-action-map-components.module';
import { SharedModule } from '@appkkkh/_metronic/shared/shared.module';
import { NbDirectivesModule } from '@appkkkh/infrastructure/directives/directives.module';

@NgModule({
    declarations: [
        UserRoleEditComponent,
        UserRoleListComponent,
    ],
    exports: [
        UserRoleListComponent,
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
        NbDirectivesModule,
        UserRolePageActionMapComponentsModule
    ],
    providers: [],
})
export class UserRoleComponentsModule { }