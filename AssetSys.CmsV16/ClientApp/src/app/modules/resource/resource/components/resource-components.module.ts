import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceInfoEditComponent } from './edit/resource-edit.component';
import { ResourceInfoListComponent } from './list/resource-list.component';
import { NbPageModule } from '@appkkkh/components/page/list/module';
import { NbTableModule } from '@appkkkh/components/data/table/module';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbLayoutCardModule } from '@appkkkh/components/layout/card/module';
import { NbNumberModule } from '@appkkkh/components/form/number/module';
import { NbDatetimeModule } from '@appkkkh/components/form/datetime/module';
import { NbCheckboxModule } from '@appkkkh/components/form/checkbox/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { ResourceInfoDetailComponent } from './detail/resource-detail.component';
import { NbTextareaModule } from '@appkkkh/components/form/textarea/module';
import { NbEditorModule } from '@appkkkh/components/form/editor/module';

@NgModule({
    declarations: [
        ResourceInfoEditComponent,
        ResourceInfoDetailComponent,
        ResourceInfoListComponent,
    ],
    exports: [
        ResourceInfoListComponent,
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
        NbTextModule,
        NbTextareaModule,
        NbNumberModule,
        NbDatetimeModule,
        NbCheckboxModule,
        NbEditorModule
    ],
    providers: [],
})
export class ResourceInfoComponentsModule { }