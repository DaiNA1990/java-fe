import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { JobScheduleService } from '../../services/job-schedule.service';
import { JobReportService } from '../../services/job-report.service';
import { FormBuilder } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styles: [
    `
      pre {
        font-family: 'Fira Code', monospace;
        font-size: 13px;
        line-height: 1.4;
        border-radius: 8px;
        max-height: 300px;
      }

      .p-card {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      }

      .p-panel {
        border-radius: 10px;
      }
    `,
  ],
})
export class JobDetailsComponent implements OnInit {
  job: any;
  loading = false;

  constructor(
    public service: JobScheduleService,
    public jobReportService: JobReportService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    // if (id) this.loadJobDetails(id);
  }

  async loadJobDetails(id: string,tenant: any = null) {
    this.loading = true;
    const res = await firstValueFrom(tenant == 'REPORT' ? this.jobReportService.jobById({ id: id }) : this.service.jobById({ id: id }));
    this.job = res;
    this.cdr.detectChanges();
    this.loading = false;
  }
}
