import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { JobScheduleComponent } from './job-schedule.component';
import { JobScheduleComponentsModule } from './components/job-schedule-components.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AuthGuard } from '../user/auth/services/auth.guard';

@NgModule({
    declarations: [
        JobScheduleComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'job-schedule',
                component: JobScheduleComponent,
                canActivate: [AuthGuard],
            },
        ]),
        JobScheduleComponentsModule,
        NbBreadcrumbModule,
    ],
    providers: [MessageService,ConfirmationService],
})
export class JobScheduleModule { }
