import { Component, ContentChild, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbTableColumnComponent } from '@appkkkh/components/data/table/col';
import { BehaviorSubject, Subscription, forkJoin } from 'rxjs';
import { NbDialogBaseComponent } from '../dialog/dialog.base';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { NbTableComponent } from '@appkkkh/components/data/table/component';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';

interface ListQueryDefault {
  keyword: string;
  page: number;
  pageSize: number;
  sort: string | null;
  sortdirection: string | null;
}

@Component({
    selector: 'nb-page-list',
    templateUrl: './component.html',
    providers: [ConfirmationService, MessageService],
    standalone: false
})
export class NbPageListComponent implements OnInit, OnDestroy {

  @Input() service: any;
  @Input() formFilter: FormGroup;

  @Input() isRowCheckbox = true;
  @Input() isButtonAddIcon = false;
  @Input() isButtonMore = true;
  @Input() isShowPagingReport = true;
  @Input() isLimitAction = false;

  @Input() rowActionWidth = '180px';
  @Input() minWidth = '50rem';

  @Input() isScrollable = false;
  @Input() scrollHeight = '';

  listSubject = new BehaviorSubject<any[]>([]);
  list$ = this.listSubject.asObservable();

  totalRecords = 0;

  itemSubject = new BehaviorSubject<any>(null);
  item$ = this.itemSubject.asObservable();

  hasSelection = false;

  @ContentChildren(NbDialogBaseComponent) formDialogs: QueryList<NbDialogBaseComponent>;

  @ContentChildren(NbTableColumnComponent) columns: QueryList<NbTableColumnComponent>;

  @ViewChild(NbTableComponent) table: NbTableComponent;

  @ViewChild('keywordInput') keywordInput: ElementRef;

  @ContentChild('rowActionsTemplate') rowActionsTemplate: TemplateRef<any>;

  get editDialog() {
    return this.formDialogs.find(c => c.isEdit);
  }

  get detailDialog() {
    return this.formDialogs.find(c => !c.isEdit);
  }

  private unsubscribe: Subscription[] = [];

  queryDefault: ListQueryDefault = {
    keyword: '',
    page: 1,
    pageSize: 10,
    sort: null,
    sortdirection: null
  };

  constructor(private confirmationService: ConfirmationService,
    private messageService: MessageService) {

  }

  getList() {

    let filter = Object.assign(this.queryDefault, this.formFilter.value);

    const subscr = this.service.getList(filter).subscribe((res: any) => {
      this.listSubject.next(res.data.list);
      this.totalRecords = res.data.total;
    });

    this.unsubscribe.push(subscr);
  }

  keywordChanged(e: any) {
    this.queryDefault.keyword = this.keywordInput.nativeElement.value;
    this.queryDefault.page = 1;
    this.getList();
  }

  tableChange(e: any) {

    if (e.selection !== undefined) {
      this.hasSelection = e.selection.length > 0;
      return;
    }

    if (e.page !== undefined) {
      this.queryDefault.page = e.page.first / e.page.rows + 1;
      this.queryDefault.pageSize = e.page.rows;
    }

    if (e.sort !== undefined) {
      this.queryDefault.sort = e.sort.field;
      this.queryDefault.sortdirection = e.sort.order === 1 ? 'asc' : 'desc';
    }

    if (e.filter !== undefined) {
      console.log(e.filter);
    }

    this.getList();
  }

  onAdd() {
    this.editDialog!.showDialog();
  }

  onEdit(item: any) {
    this.editDialog!.showDialog(item);
  }

  onDetail(item: any) {
    this.detailDialog!.showDialog(item);
  }

  delete(id: any) {

    const subscr = this.service.delete({ id: id }).subscribe((res: any) => {
      if (res.statusCode !== ResponseCode.ZERO) {
        this.messageService.add({ severity: 'error', summary: 'Fail', detail: res.message, life: 3000 });
        return;
      }

      this.messageService.add({ severity: 'info', summary: 'Success', detail: res.message });

      this.getList();
    });

    this.unsubscribe.push(subscr);
  }

  confirmDelete(event: Event, item: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.delete(item.id);
      }
    });
  }

  onOff(id: any, status: boolean) {

    const subscr = this.service.onOff({ id: id, status: status }).subscribe((res: any) => {
      if (res.statusCode !== ResponseCode.ZERO) {
        this.messageService.add({ severity: 'error', summary: 'Fail', detail: res.message, life: 3000 });
        return;
      }

      this.messageService.add({ severity: 'info', summary: 'Success', detail: res.message });

      this.getList();
    });

    this.unsubscribe.push(subscr);
  }

  confirmOnOff(event: Event, item: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to on/off?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.onOff(item.id, !item.isShow);
      }
    });
  }

  offAll(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to off ${this.table.selectedItems.length} items?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        forkJoin(this.table.selectedItems.map((e: any) => this.service.onOff({ id: e.id, status: false }))).subscribe((res: any) => {
          this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Update all success' });
          this.getList();
        });
      }
    });
  }

  onAll(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to on ${this.table.selectedItems.length} items?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        forkJoin(this.table.selectedItems.map((e: any) => this.service.onOff({ id: e.id, status: true }))).subscribe((res: any) => {
          this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Update all success' });
          this.getList();
        });
      }
    });
  }

  deleteAll(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure that you want to delete ${this.table.selectedItems.length} items?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        forkJoin(this.table.selectedItems.map((e: any) => this.service.delete({ id: e.id }))).subscribe((res: any) => {
          this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Update all success' });
          this.getList();
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit() {
    this.getList();
  }

}
