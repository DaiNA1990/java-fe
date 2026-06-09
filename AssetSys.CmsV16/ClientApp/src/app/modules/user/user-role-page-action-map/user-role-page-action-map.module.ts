import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
            },
        ]),
        UserRolePageActionMapComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserRolePageActionMapModule { }