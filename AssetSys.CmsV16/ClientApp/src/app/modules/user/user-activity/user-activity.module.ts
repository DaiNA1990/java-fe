import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserActivityComponent } from './user-activity.component';
import { UserActivityComponentsModule } from './components/user-activity-components.module';

@NgModule({
    declarations: [
        UserActivityComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-activity',
                component: UserActivityComponent,
            },
        ]),
        UserActivityComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserActivityModule { }