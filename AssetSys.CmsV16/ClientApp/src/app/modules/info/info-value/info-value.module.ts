import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoValueComponent } from './info-value.component';
import { InfoValueComponentsModule } from './components/info-value-components.module';
import { InfoValueHistoryComponent } from './components/history/info-value-history.component';

@NgModule({
    declarations: [
        InfoValueComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-value',
                component: InfoValueComponent,
            },
            {
                path: 'info/info-value-history/:dataId',
                component: InfoValueHistoryComponent
            },
        ]),
        InfoValueComponentsModule,
        NbBreadcrumbModule
    ],
})
export class InfoValueModule { }