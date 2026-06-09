import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoReportComponent } from './info-report.component';
import { InfoReportComponentsModule } from './components/info-report-components.module';
import { AuthGuard } from '@appkkkh/modules/user/auth/services/auth.guard';

@NgModule({
  declarations: [InfoReportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'info/info-report',
        component: InfoReportComponent,
        canActivate: [AuthGuard],
        data: { permission: 'USER_ADMIN' },
      },
    ]),
    InfoReportComponentsModule,
    NbBreadcrumbModule,
  ],
})
export class InfoReportModule {}
