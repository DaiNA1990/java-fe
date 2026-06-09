import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserTitleComponent } from './user-title.component';
import { UserTitleComponentsModule } from './components/user-title-components.module';

@NgModule({
    declarations: [
        UserTitleComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-title',
                component: UserTitleComponent,
            },
        ]),
        UserTitleComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserTitleModule { }