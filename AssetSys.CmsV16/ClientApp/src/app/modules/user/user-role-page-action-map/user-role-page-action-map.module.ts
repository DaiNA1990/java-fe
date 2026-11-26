import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserRolePageActionMapComponent } from './user-role-page-action-map.component';
import { UserRolePageActionMapComponentsModule } from './components/user-role-page-action-map-components.module';

@NgModule({
    declarations: [
        UserRolePageActionMapComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-role-page-action-map',
                component: UserRolePageActionMapComponent,
                canActivate: [AuthGuard],
                data: { roles: ['ADMIN'] },
            },
        ]),
        UserRolePageActionMapComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserRolePageActionMapModule { }