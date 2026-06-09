import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
            },
        ]),
        UserRoleComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserRoleModule { }