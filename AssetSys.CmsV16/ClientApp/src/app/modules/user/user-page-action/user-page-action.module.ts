import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserPageActionComponent } from './user-page-action.component';
import { UserPageActionComponentsModule } from './components/user-page-action-components.module';

@NgModule({
    declarations: [
        UserPageActionComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-page-action',
                component: UserPageActionComponent,
                canActivate: [AuthGuard],
                data: { roles: ['ADMIN'] },
            },
        ]),
        UserPageActionComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserPageActionModule { }