import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserRoleComponent } from './user-role.component';
import { UserRoleComponentsModule } from './components/user-role-components.module';

@NgModule({
    declarations: [
        UserRoleComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-role',
                component: UserRoleComponent,
                canActivate: [AuthGuard],
                data: { roles: ['ADMIN'] },
            },
        ]),
        UserRoleComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserRoleModule { }