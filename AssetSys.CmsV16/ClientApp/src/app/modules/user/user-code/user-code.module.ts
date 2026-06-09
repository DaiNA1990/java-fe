import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
            },
        ]),
        UserCodeComponentsModule,
        NbBreadcrumbModule
    ],
})
export class UserCodeModule { }