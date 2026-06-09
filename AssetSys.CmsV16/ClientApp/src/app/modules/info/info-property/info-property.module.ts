import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoPropertyComponent } from './info-property.component';
import { InfoPropertyComponentsModule } from './components/info-property-components.module';

@NgModule({
    declarations: [
        InfoPropertyComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-property',
                component: InfoPropertyComponent,
            },
        ]),
        InfoPropertyComponentsModule,
        NbBreadcrumbModule
    ],
})
export class InfoPropertyModule { }