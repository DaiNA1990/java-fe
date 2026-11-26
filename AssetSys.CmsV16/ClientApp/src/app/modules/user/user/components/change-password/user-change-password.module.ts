import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NbPageDialogModule } from '@appkkkh/components/page/dialog/module';
import { NbLayoutGridModule } from '@appkkkh/components/layout/grid/module';
import { NbTextModule } from '@appkkkh/components/form/text/module';
import { UserChangePasswordComponent } from './user-change-password.component';

@NgModule({
    declarations: [
        UserChangePasswordComponent,
    ],
    exports: [
        UserChangePasswordComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        NbPageDialogModule,
        NbLayoutGridModule,
        NbTextModule,
    ],
})
export class UserChangePasswordModule { }
