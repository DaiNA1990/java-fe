import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserCodeComponent } from './user-code.component';
import { UserCodeComponentsModule } from './components/user-code-components.module';

@NgModule({
    declarations: [
        UserCodeComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-code',
                component: UserCodeComponent,
                canActivate: [AuthGuard],
                data: { roles: ['ADMIN'] },
            },
        ]),
        UserCodeComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserCodeModule { }