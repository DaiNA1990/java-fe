import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserDepartmentComponent } from './user-department.component';
import { UserDepartmentComponentsModule } from './components/user-department-components.module';

@NgModule({
    declarations: [
        UserDepartmentComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-department',
                component: UserDepartmentComponent,
                canActivate: [AuthGuard],
                data: { roles: ['ADMIN'] },
            },
        ]),
        UserDepartmentComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserDepartmentModule { }