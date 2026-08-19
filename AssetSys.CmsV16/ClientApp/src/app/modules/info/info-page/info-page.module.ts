import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoPageComponent } from './info-page.component';
import { InfoPageComponentsModule } from './components/info-page-components.module';
import { AuthGuard } from '../../user/auth/services/auth.guard';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService,MessageService } from 'primeng/api';
@NgModule({
    declarations: [
        InfoPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-page/:layoutId',
                component: InfoPageComponent,
                canActivate: [AuthGuard],
            }
        ]),
        InfoPageComponentsModule,
        NbBreadcrumbModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService, MessageService]
})
export class InfoPageModule { }
