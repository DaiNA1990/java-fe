import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserRoleMapComponent } from './user-role-map.component';
import { UserRoleMapComponentsModule } from './components/user-role-map-components.module';

@NgModule({
    declarations: [
        UserRoleMapComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-role-map',
                component: UserRoleMapComponent,
            },
        ]),
        UserRoleMapComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserRoleMapModule { }