import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoLayoutComponent } from './info-layout.component';
import { InfoLayoutComponentsModule } from './components/info-layout-components.module';

@NgModule({
    declarations: [
        InfoLayoutComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-layout',
                component: InfoLayoutComponent,
            },
        ]),
        InfoLayoutComponentsModule,
        NbBreadcrumbModule
    ],
})
export class InfoLayoutModule { }