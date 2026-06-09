import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoGroupComponent } from './info-group.component';
import { InfoGroupComponentsModule } from './components/info-group-components.module';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';

@NgModule({
    declarations: [
        InfoGroupComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-group',
                component: InfoGroupComponent,
                canActivate: [AuthGuard],
                data: { permission: 'USER_ADMIN' },
            },
        ]),
        InfoGroupComponentsModule,
        NbBreadcrumbModule
    ],
})
export class InfoGroupModule { }
