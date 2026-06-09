import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
            },
        ]),
        UserDepartmentComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserDepartmentModule { }