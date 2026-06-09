import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserNotifyComponent } from './user-notify.component';
import { UserNotifyComponentsModule } from './components/user-notify-components.module';

@NgModule({
    declarations: [
        UserNotifyComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-notify',
                component: UserNotifyComponent,
            },
        ]),
        UserNotifyComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserNotifyModule { }