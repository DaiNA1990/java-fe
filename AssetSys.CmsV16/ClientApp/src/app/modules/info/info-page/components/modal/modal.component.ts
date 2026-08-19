import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventDataService } from '../../services/event-data.service';
import { Subscription } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-page-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class InfoPageModalComponent implements OnInit, OnDestroy {
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  @Input() body: TemplateRef<any>;
  @Input() parentData: any;

  dataId: any;
  initValue: any;
  groupId: any;
  formType: any;

  isMaximized = false;

  subscriptions: Subscription[] = [];

  @ViewChild('modal') private modalContent: TemplateRef<InfoPageModalComponent>;

  private modalRef: NgbModalRef;

  constructor(
    private confirmationService: ConfirmationService,
    private eventDataService: EventDataService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngbModal: NgbModal
  ) {}

  onShow(e: any) {
    try {
      if (this.formItem.action !== undefined && this.formItem.action !== null)
        this.eventDataService.emit({
          action: JSON.parse(this.formItem.action).rules.find(
            (c: any) => c.action === 'MODAL_ON_OPEN'
          ),
          dataId: this.dataId,
          initValue: this.initValue,
          parentData: this.parentData,
          formType: this.formType,
          groupId: this.groupId,
        });
    } catch (ex) {
      console.log(ex);
    }
  }

  onHide(e: any) {
    this.dataId = null;

    try {
      this.eventDataService.emit({
        action: JSON.parse(this.formItem.action).rules.find(
          (c: any) => c.action === 'MODAL_ON_CLOSE'
        ),
        dataId: this.dataId,
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  toggleMaximizeCustom(dialog: Dialog) {
    this.isMaximized = !this.isMaximized;
    if (this.isMaximized) {
      dialog.maximized = true;
      dialog.el.nativeElement.classList.add('p-dialog-maximized');
    } else {
      dialog.maximized = false;
      dialog.el.nativeElement.classList.remove('p-dialog-maximized');
    }
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.ngbModal.open(this.modalContent, {
        scrollable: true,
        centered: true,
        backdrop: 'static',
        backdropClass: 'modal-backdrop-z999',
        modalDialogClass:
          'w' + (this.formItem.size < 90 ? this.formItem.size : 90),
        beforeDismiss: () => {
          return new Promise((resolve, reject) => {
            if (this.formItem.message != null && this.formItem.message != '')
              this.confirmationService.confirm({
                message: this.formItem.message ?? 'Bạn chưa lưu dữ liệu, bạn có muốn thoát không?',
                header: 'Xác nhận',
                icon: 'pi pi-exclamation-triangle',
                acceptIcon: 'none',
                acceptLabel: 'Đồng ý',
                rejectIcon: 'none',
                rejectLabel: 'Quay lại',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                  resolve(true);
                },
                reject: () => {
                  resolve(false);
                },
              });
            else {
              resolve(true);
            }
          });
        },
      });

      this.modalRef.shown.subscribe(() => {
        this.onShow(this.modalRef);
        this.changeDetectorRef.detectChanges();
      });

      this.modalRef.hidden.subscribe(() => {
        this.onHide(this.modalRef);
        this.changeDetectorRef.detectChanges();
      });

      this.modalRef.result.then(resolve, resolve);
    });
  }

  close() {
    this.dataId = null;
    if (this.formItem.message != null && this.formItem.message != '')
        this.confirmationService.confirm({
          message: this.formItem.message ?? 'Bạn chưa lưu dữ liệu, bạn có muốn thoát không?',
          header: 'Xác nhận',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: 'none',
          acceptLabel: 'Đồng ý',
          rejectIcon: 'none',
          rejectLabel: 'Quay lại',
          rejectButtonStyleClass: 'p-button-text',
          accept: () => {
            this.modalRef.close();
          }
        });
    else
      this.modalRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.eventDataService.event.subscribe((data: any) => {
        if (
          data === undefined ||
          data === null ||
          data.action === undefined ||
          data.action === null ||
          data.action.target !== this.formItem.code
        )
          return;

        if (data.dataId !== undefined) this.dataId = data.dataId;
        if (data.initValue !== undefined) this.initValue = data.initValue;
        if (data.parentData !== undefined) this.parentData = data.parentData;
        if (data.action.data !== undefined) this.formType = data.action.data;
        if (data.groupId !== undefined) this.groupId = data.groupId;

        if (data.action.event === 'MODAL_OPEN') {
          this.open();
          return;
        }

        if (data.action.event === 'MODAL_CLOSE') {
          this.close();
          return;
        }
      })
    );
  }
}
