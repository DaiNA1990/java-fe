import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { ResourceInfoComponentsModule } from './components/resource-components.module';
import { ResourceInfoComponent } from './resource.component';

@NgModule({
    declarations: [
        ResourceInfoComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'resource/resource',
                component: ResourceInfoComponent,
            },
            {
                path: 'resource/email-template',
                component: ResourceInfoComponent,
                data: {
                    parentCode: 'EMAIL_TEMPLATE'
                }
            }
        ]),
        ResourceInfoComponentsModule,
        NbBreadcrumbModule
    ],
})
export class ResourceModule { }