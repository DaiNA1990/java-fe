import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { UserComponentsModule } from './components/user-components.module';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';

@NgModule({
    declarations: [
        UserComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user',
                component: UserComponent,
            },
        ]),
        UserComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserModule { }
