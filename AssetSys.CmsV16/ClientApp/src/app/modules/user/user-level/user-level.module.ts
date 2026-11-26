import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserLevelComponent } from './user-level.component';
import { UserLevelComponentsModule } from './components/user-level-components.module';

@NgModule({
    declarations: [
        UserLevelComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-level',
                component: UserLevelComponent,
                canActivate: [AuthGuard],
                data: { roles: ['ADMIN'] },
            },
        ]),
        UserLevelComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserLevelModule { }