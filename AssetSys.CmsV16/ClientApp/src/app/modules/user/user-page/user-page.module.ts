import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserPageComponent } from './user-page.component';
import { UserPageComponentsModule } from './components/user-page-components.module';

@NgModule({
    declarations: [
        UserPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-page',
                component: UserPageComponent,
                canActivate: [AuthGuard],
                data: { roles: ['ADMIN'] },
            },
        ]),
        UserPageComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserPageModule { }