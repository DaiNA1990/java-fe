import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
            },
        ]),
        UserLevelComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserLevelModule { }