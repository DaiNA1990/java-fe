import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoReportSetupComponent } from './info-report-setup.component';
import { InfoReportSetupComponentsModule } from './components/info-report-setup-components.module';

@NgModule({
    declarations: [
        InfoReportSetupComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-report-setup',
                component: InfoReportSetupComponent,
            },
        ]),
        InfoReportSetupComponentsModule,
        NbBreadcrumbModule
    ],
})
export class InfoReportSetupModule { }
