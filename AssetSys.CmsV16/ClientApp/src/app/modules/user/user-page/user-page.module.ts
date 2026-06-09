import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserPageComponent } from './user-page.component';
import { UserPageComponentsModule } from './components/user-page-components.module';

@NgModule({
    declarations: [
        UserPageComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-page',
                component: UserPageComponent,
            },
        ]),
        UserPageComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserPageModule { }