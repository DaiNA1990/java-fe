import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserPageActionEditComponent } from './edit/user-page-action-edit.component';
import { UserPageActionListComponent } from './list/user-page-action-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { DialogModule } from 'primeng/dialog';

@NgModule({
    declarations: [
        UserPageActionEditComponent,
        UserPageActionListComponent,
    ],
    exports: [
        UserPageActionListComponent,
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
export class UserPageActionComponentsModule { }