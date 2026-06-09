import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { UserConnectionComponent } from './user-connection.component';
import { UserConnectionComponentsModule } from './components/user-connection-components.module';

@NgModule({
    declarations: [
        UserConnectionComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'user/user-connection',
                component: UserConnectionComponent,
            },
        ]),
        UserConnectionComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserConnectionModule { }