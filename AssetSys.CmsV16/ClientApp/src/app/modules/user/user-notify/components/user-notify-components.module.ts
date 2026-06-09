import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserNotifyEditComponent } from './edit/user-notify-edit.component';
import { UserNotifyListComponent } from './list/user-notify-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { UserNotifyDetailComponent } from './detail/user-notify-edit.component';
import { NbSelectModule } from "../../../../components/form/select/module";

@NgModule({
    declarations: [
        UserNotifyDetailComponent,
        UserNotifyEditComponent,
        UserNotifyListComponent,
    ],
    exports: [
        UserNotifyListComponent,
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
    NbCheckboxModule,
    NbSelectModule
],
    providers: [],
})
export class UserNotifyComponentsModule { }