import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { firstValueFrom, interval, Subject, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { JobScheduleService } from '../../services/job-schedule.service';
import { JobReportService } from '../../services/job-report.service';
import { FileService } from '@appkkkh/modules/file/file/file.service';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { JobDetailsComponent } from '../edit/job-details.component';

interface PagedResult<T = any> {
  data: T[];
  total: number;
}
interface PagedResponse<T> {
  data?: T[];
  items?: T[];
  total?: number;
  totalRecords?: number;
}
@Component({
  selector: 'app-job-schedule-list',
  templateUrl: './job-schedule-list.component.html',
  styleUrls: ['./job-schedule-list.component.scss'],
  providers: [FileService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobScheduleListComponent implements OnInit, OnDestroy {
  // ViewChilds (match template ids)
  @ViewChild('jobDetails', { static: false }) jobDetailsComp!: JobDetailsComponent;
  @ViewChild('tblProcessing', { static: false }) tblProcessing!: Table;
  @ViewChild('tblScheduled', { static: false }) tblScheduled!: Table;
  @ViewChild('tblSucceeded', { static: false }) tblSucceeded!: Table;
  @ViewChild('tblFailed', { static: false }) tblFailed!: Table;
  @ViewChild('tblDeleted', { static: false }) tblDeleted!: Table;
  @ViewChild('tblAwaiting', { static: false }) tblAwaiting!: Table;
  @ViewChild('tblRetries', { static: false }) tblRetries!: Table;
  @ViewChild('tblRecurring', { static: false }) tblRecurring!: Table;

  // state
  loading = false; // global loading dialog
  selectedStatus = 'enqueued';
  showJobDetail = false;
  activeIndex = 0;

  // selected items
  selectedJobs: any[] = [];
  selectedRecurringJobs: any[] = [];

  // data containers
  queues: any[] = [];
  servers: any[] = [];

  processing: PagedResult = { data: [], total: 0 };
  scheduled: PagedResult = { data: [], total: 0 };
  succeeded: PagedResult = { data: [], total: 0 };
  failed: PagedResult = { data: [], total: 0 };
  deleted: PagedResult = { data: [], total: 0 };
  awaiting: PagedResult = { data: [], total: 0 };
  retries: PagedResult = { data: [], total: 0 };
  recurring: PagedResult = { data: [], total: 0 };
  enqueued: PagedResult = { data: [], total: 0 };

  stats: any = {};
  jobStatuses = [
    { key: 'enqueued', label: 'Enqueued', count: 0 },
    { key: 'scheduled', label: 'Scheduled', count: 0 },
    { key: 'processing', label: 'Processing', count: 0 },
    { key: 'succeeded', label: 'Succeeded', count: 0 },
    { key: 'failed', label: 'Failed', count: 0 },
    { key: 'deleted', label: 'Deleted', count: 0 },
    { key: 'awaiting', label: 'Awaiting', count: 0 },
  ];

  // subscriptions
  private destroy$ = new Subject<void>();

  constructor(
    private jobScheduleService: JobScheduleService,
    private jobReportService: JobReportService,
    private fileService: FileService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fileService.setPath('jobapi');
    // initial loads
    this.loadStats();
    this.loadQueues();

    // auto refresh stats every 5s
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadStats());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------
  // Helpers
  // ---------------------------
  private trackError(tag: string, err: any) {
    console.error(`[JobSchedule] ${tag} error:`, err);
    this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi xảy ra' });
    // ensure update
    this.changeDetectorRef.detectChanges();
  }

  trackByJobId(index: number, item: any) {
    return item?.jobId ?? item?.id ?? index;
  }

  private safeResetTable(table?: Table) {
    try {
      if (table) {
        table.first = 0;
        table.reset();
      }
    } catch (err) {
      // ignore
    }
  }

  // generic paged loader: apiCall must accept {page, pageSize}
  private async loadPaged(apiCall: (args: any) => any, target: PagedResult, event?: any) {
  try {
    if (!event) {
      const t = this.getTableByTarget(target);
      this.safeResetTable(t);
    }

    const page = event ? event.first / event.rows + 1 : 1;
    const pageSize = event ? event.rows : 20;

    const res = await firstValueFrom(apiCall({ page, pageSize })) as PagedResponse<any>;

    target.data =
      res.data ??
      res.items ??
      ([] as any[]);

    target.total =
      res.total ??
      res.totalRecords ??
      (Array.isArray(target.data) ? target.data.length : 0);

    this.changeDetectorRef.detectChanges();
  } catch (err) {
    this.trackError('loadPaged', err);
  }
}


  // map target object to template table ref
  private getTableByTarget(target: PagedResult): Table | undefined {
    switch (target) {
      case this.processing:
        return this.tblProcessing;
      case this.scheduled:
        return this.tblScheduled;
      case this.succeeded:
        return this.tblSucceeded;
      case this.failed:
        return this.tblFailed;
      case this.deleted:
        return this.tblDeleted;
      case this.awaiting:
        return this.tblAwaiting;
      case this.retries:
        return this.tblRetries;
      case this.recurring:
        return this.tblRecurring;
      case this.enqueued:
        return undefined; // queues is not a p-table paged
      default:
        return undefined;
    }
  }

  // ---------------------------
  // Loaders
  // ---------------------------
  async loadStats() {
    try {
      const res = await firstValueFrom(this.jobScheduleService.stats({}).pipe(catchError((e) => { throw e; })));
      this.stats = res ?? {};
      this.jobStatuses = this.jobStatuses.map((s) => ({ ...s, count: this.stats[s.key] ?? 0 }));
      this.changeDetectorRef.detectChanges();
    } catch (err) {
      this.trackError('loadStats', err);
    }
  }

  async loadQueues() {
    try {
      const res = await firstValueFrom(this.jobScheduleService.queues({}).pipe(catchError((e) => { throw e; })));
      this.queues = Array.isArray(res) ? res : (res?.data ?? []);
      // sort by length/fetched (same logic as before)
      this.queues.sort((a: any, b: any) => {
        if (b.length !== a.length) return b.length - a.length;
        return b.fetched - a.fetched;
      });
      this.changeDetectorRef.markForCheck();
    } catch (err) {
      this.trackError('loadQueues', err);
    }
  }

  loadRetries(event?: any) {
    return this.loadPaged(this.jobScheduleService.retries.bind(this.jobScheduleService), this.retries, event);
  }

  loadEnqueued(event?: any) {
    return this.loadPaged(this.jobScheduleService.enqueued.bind(this.jobScheduleService), this.enqueued, event);
  }

  loadDeleted(event?: any) {
    return this.loadPaged(this.jobScheduleService.deleted.bind(this.jobScheduleService), this.deleted, event);
  }

  loadAwaiting(event?: any) {
    return this.loadPaged(this.jobScheduleService.awaiting.bind(this.jobScheduleService), this.awaiting, event);
  }

  loadProcessing(event?: any) {
    return this.loadPaged(this.jobScheduleService.processing.bind(this.jobScheduleService), this.processing, event);
  }

  loadScheduled(event?: any) {
    return this.loadPaged(this.jobScheduleService.scheduled.bind(this.jobScheduleService), this.scheduled, event);
  }

  loadSucceeded(event?: any) {
    return this.loadPaged(this.jobScheduleService.succeeded.bind(this.jobScheduleService), this.succeeded, event);
  }

  loadFailed(event?: any) {
    return this.loadPaged(this.jobScheduleService.failed.bind(this.jobScheduleService), this.failed, event);
  }

  loadRecurring(event?: any) {
    return this.loadPaged(this.jobScheduleService.recurring.bind(this.jobScheduleService), this.recurring, event);
  }

  async loadServers(event?: any) {
    try {
      const page = event ? event.first / event.rows + 1 : 1;
      const pageSize = event ? event.rows : 20;
      const res = await firstValueFrom(this.jobScheduleService.servers({ page, pageSize }).pipe(catchError((e) => { throw e; })));
      this.servers = res ?? [];
      this.changeDetectorRef.markForCheck();
    } catch (err) {
      this.trackError('loadServers', err);
    }
  }

  // ---------------------------
  // Actions
  // ---------------------------
  selectStatus(status: string) {
    this.selectedStatus = status;
    this.selectedJobs = [];
    this.showJobDetail = false;

    if (status === 'enqueued') {
      this.loadQueues();
    } else {
      // clear previous table selection
      const target = this.getTargetByStatus(status);
      if (target) {
        this.safeResetTable(this.getTableByTarget(target));
      }
    }

    this.loadStats();
  }

  private getTargetByStatus(status: string): PagedResult | undefined {
    switch (status) {
      case 'processing': return this.processing;
      case 'scheduled': return this.scheduled;
      case 'succeeded': return this.succeeded;
      case 'failed': return this.failed;
      case 'deleted': return this.deleted;
      case 'awaiting': return this.awaiting;
      case 'retries': return this.retries;
      case 'recurring': return this.recurring;
      default: return undefined;
    }
  }

  onShowJobDetail(jobId: any, tenant: any) {
    this.activeIndex = 0;
    this.showJobDetail = true;
    // ensure jobDetails component available - call in next tick
    setTimeout(async () => {
      try {
        await this.jobDetailsComp?.loadJobDetails(jobId, tenant);
      } catch (err) {
        // ignore
      }
    });
  }

  triggerNow() {
    if (!this.selectedRecurringJobs?.length) {
      this.messageService.add({ severity: 'warn', summary: 'Thông báo', detail: 'Vui lòng lựa chọn bản ghi', life: 3000 });
      return;
    }

    this.confirmationService.confirm({
      message: 'Bạn muốn thực hiện các lựa chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Thực hiện',
      rejectLabel: 'Đóng',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.loading = true;
        try {
          // Promise.allSettled to avoid stop on error
          const promises = this.selectedRecurringJobs.map(item => firstValueFrom(this.jobScheduleService.run({ id: item.id })));
          await Promise.all(promises.map(p => p.catch(e => e)));
          this.selectedRecurringJobs = [];
          await this.loadStats();
        } catch (err) {
          this.trackError('triggerNow', err);
        } finally {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        }
      }
    });
  }

  deleteSelected() {
    if (!this.selectedJobs?.length) {
      this.messageService.add({ severity: 'warn', summary: 'Thông báo', detail: 'Vui lòng lựa chọn bản ghi', life: 3000 });
      return;
    }

    this.confirmationService.confirm({
      message: 'Bạn muốn thực hiện các lựa chọn?',
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Thực hiện',
      rejectLabel: 'Đóng',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.loading = true;
        try {
          const promises = this.selectedJobs.map((item) => {
            const api = item.tenant === 'REPORT' ? this.jobReportService.delete.bind(this.jobReportService) : this.jobScheduleService.delete.bind(this.jobScheduleService);
            return firstValueFrom(api({ id: item.jobId }));
          });
          await Promise.all(promises.map(p => p.catch(e => e)));

          this.selectedJobs = [];
          await this.loadStats();
          // reload current table
          this.reloadActiveTable();
        } catch (err) {
          this.trackError('deleteSelected', err);
        } finally {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        }
      }
    });
  }

  private reloadActiveTable() {
    switch (this.selectedStatus) {
      case 'scheduled':
        this.loadScheduled();
        break;
      case 'processing':
        this.loadProcessing();
        break;
      case 'failed':
        this.loadFailed();
        break;
      default:
        this.loadRetries();
        break;
    }
  }

  // ---------------------------
  // Tabs
  // ---------------------------
  onTabChange(event: any) {
    const idx = event.index;
    switch (idx) {
      case 0:
        this.loadQueues();
        break;
      case 1:
        this.loadRetries();
        break;
      case 2:
        this.loadRecurring();
        break;
      case 3:
        this.loadServers();
        break;
    }
  }

  // ---------------------------
  // File upload
  // ---------------------------
  uploadFile(event: any) {
    const files: File[] = event.files || [];
    const fd = new FormData();
    for (const f of files) fd.append('files', f, f.name);
    fd.append('isReplace', 'true');
    fd.append('isTransfer', 'true');

    this.fileService.uploadTemp(fd).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res?.statusCode === ResponseCode.ZERO) {
          this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: res.message, life: 3000 });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: res.message, life: 3000 });
        }
        this.changeDetectorRef.markForCheck();
      },
      error: (err) => this.trackError('uploadFile', err)
    });
  }
}
