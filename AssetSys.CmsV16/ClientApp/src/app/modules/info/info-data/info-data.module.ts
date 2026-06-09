import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoDataComponent } from './info-data.component';
import { InfoDataComponentsModule } from './components/info-data-components.module';

@NgModule({
    declarations: [
        InfoDataComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-data',
                component: InfoDataComponent,
            },
        ]),
        InfoDataComponentsModule,
        NbBreadcrumbModule
    ],
})
export class InfoDataModule { }