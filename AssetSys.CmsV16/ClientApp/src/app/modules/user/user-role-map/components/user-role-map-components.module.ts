import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRoleMapEditComponent } from './edit/user-role-map-edit.component';
import { UserRoleMapListComponent } from './list/user-role-map-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { UserRoleMapAssignComponent } from './assign/user-role-map-assign.component';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';

@NgModule({
    declarations: [
        UserRoleMapEditComponent,
        UserRoleMapListComponent,
        UserRoleMapAssignComponent
    ],
    exports: [
        UserRoleMapListComponent,
        UserRoleMapAssignComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        PickListModule,
        NbTableModule,
        NbPageModule,
        NbPageDialogModule,
        NbLayoutGridModule,
        NbLayoutCardModule,
        NbNumberModule,
    ],
    providers: [],
})
export class UserRoleMapComponentsModule { }