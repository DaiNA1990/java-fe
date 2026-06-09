import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoReportSetupService } from '../../../info-report-setup/services/info-report-setup.service';
import { InfoReportDesignComponent } from '../design/component';
import { InfoReportSetupEditComponent } from '../../../info-report-setup/components/edit/info-report-setup-edit.component';

@Component({
  selector: 'app-info-form-report',
  templateUrl: `./component.html`,
  providers: [ConfirmationService, MessageService],
})
export class InfoFormReportComponent implements OnInit {
  @Input() reportId: number | null;

  @ViewChild(InfoReportSetupEditComponent, { static: false })
  layoutEdit: InfoReportSetupEditComponent;

  private parent: any = inject(InfoReportDesignComponent, { optional: true });

  layouts: any[] = [];

  visible: boolean = false;

  isSubmiting: boolean = false;

  currentItem: any;

  constructor(
    public infoReportSetupService: InfoReportSetupService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  async getList() {
    const res = await firstValueFrom(
      this.infoReportSetupService.getList({
        reportId: this.reportId,
        pageSize: Number.MAX_SAFE_INTEGER,
      })
    );
    this.layouts = res.data.list;
    this.cdr.detectChanges();
    if (res.data.list.length > 0) this.builder(res.data.list[0]);
  }

  onSubmit(e: any) {
    this.getList();
  }

  async builder(item: any) {
    // const res = await firstValueFrom(this.infoReportSetupService.getById({id:item.id}));
    // item = res.data;
    this.currentItem = item;
    this.parent.itemChosen(item);
  }

  itemSave(item: any) {
    const index = this.layouts.findIndex((o: any) => o.id === item.id);
    Object.assign(this.layouts[index], item);
  }

  // async unlock(item: any) {

  //     const res = await firstValueFrom(this.service.editing({ id: item.id, isEnd: true }));

  //     this.messageService.add({
  //         severity: res.statusCode === ResponseCode.ZERO ? 'success' : 'warn',
  //         summary: 'Thông báo',
  //         detail: res.message,
  //         life: 3000
  //     });

  //     if (res.statusCode === ResponseCode.ZERO)
  //         item.isEditing = false;

  //     this.cdr.detectChanges();
  // }

  async init() {
    await this.getList();
  }

  open(item: any = null) {
    this.layoutEdit.showDialog(item);
  }

  deleteItem(event: any, item: any = null) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Bạn muốn xoá ${item.name}?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Xoá',
      rejectIcon: 'none',
      rejectLabel: 'Đóng',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.deleteItemSubmit(item);
      },
    });
  }

  async deleteItemSubmit(item: any = null) {
    const res = await firstValueFrom(
      this.infoReportSetupService.delete({ id: item.id })
    );

    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: res.message,
      life: 3000,
    });

    this.cdr.detectChanges();

    this.getList();
  }

  ngOnInit(): void {
    this.init();
  }
}
