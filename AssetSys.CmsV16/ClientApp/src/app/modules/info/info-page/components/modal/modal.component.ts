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
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-info-page-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: false
})
export class InfoPageModalComponent implements OnInit, OnDestroy {
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  @Input() body: TemplateRef<any>;
  @Input() parentData: any;

  /** form.component.isModalDirty - kiểm tra người dùng đã sửa dữ liệu trong modal chưa */
  @Input() funcCheckDirty: Function;
  /** form.component.submitFromModal - bắn action của nút submit cấu hình trong modal */
  @Input() funcSubmit: Function;
  /** form.component.markModalPristine - reset cờ dirty khi mở modal */
  @Input() funcMarkPristine: Function;

  dataId: any;
  initValue: any;
  groupId: any;
  formType: any;

  isMaximized = false;

  subscriptions: Subscription[] = [];

  @ViewChild('modal') private modalContent: TemplateRef<InfoPageModalComponent>;

  private modalRef: NgbModalRef;

  private isConfirming = false;

  /**
   * Các InfoPageFormComponent nằm trong modal này (control loại `layout`), tự
   * đăng ký qua FormConfig.ownerModal. Mỗi form là một FormGroup riêng nên form
   * cha không thấy được dirty của chúng.
   */
  private childForms: any[] = [];

  registerChildForm(form: any) {
    if (this.childForms.indexOf(form) < 0) this.childForms.push(form);
  }

  unregisterChildForm(form: any) {
    this.childForms = this.childForms.filter((f) => f !== form);
  }

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
        beforeDismiss: () => this.confirmBeforeClose(),
      });

      this.modalRef.shown.subscribe(() => {
        this.markPristine();
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

  async close() {
    debugger
    if (this.modalRef === undefined || this.modalRef === null) return;
    if (await this.confirmBeforeClose()) this.modalRef.close();
  }

  /**
   * Hỏi trước khi đóng modal:
   * - Form chưa sửa gì -> đóng luôn.
   * - Đã sửa -> "Lưu" (gọi submit, modal do FORM_ON_SUBMIT đóng lại),
   *   "Không lưu" -> đóng, X/ESC -> ở lại.
   */
  private confirmBeforeClose(): Promise<boolean> {
    if (this.isConfirming) return Promise.resolve(false);

    const isDirty =
      (this.funcCheckDirty !== undefined &&
        this.funcCheckDirty !== null &&
        this.funcCheckDirty(this.formItem) === true) ||
      this.childForms.some((f) => f.isFormDirty() === true);

    if (!isDirty) return Promise.resolve(true);

    this.isConfirming = true;

    return new Promise<boolean>((resolve) => {
      const done = (result: boolean) => {
        this.isConfirming = false;
        resolve(result);
      };

      this.confirmationService.confirm({
        message:
          this.formItem.message != null && this.formItem.message != ''
            ? this.formItem.message
            : 'Bạn chưa lưu dữ liệu, bạn có muốn lưu không?',
        header: 'Xác nhận',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        acceptLabel: 'Lưu',
        rejectIcon: 'none',
        rejectLabel: 'Không lưu',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          // nút Lưu có thể nằm ngay trong modal (form cha) hoặc trong form lồng
          const submitted =
            (this.funcSubmit !== undefined &&
              this.funcSubmit !== null &&
              this.funcSubmit(this.formItem) === true) ||
            this.childForms.some((f) => f.submitOwnForm() === true);

          if (!submitted)
            this.messageService.add({
              severity: 'warn',
              summary: 'Thông báo',
              detail: 'Không tìm thấy chức năng lưu trong màn hình này',
              life: 3000,
            });

          // Giữ modal mở: nếu lưu thành công, action FORM_ON_SUBMIT sẽ đóng modal.
          done(false);
        },
        reject: (type: ConfirmEventType) => {
          // Nút "Không lưu" -> đóng modal; đóng dialog bằng X/ESC -> ở lại.
          done(type === ConfirmEventType.REJECT);
        },
      });
    });
  }

  /** Reset cờ dirty khi mở modal: FormGroup được dùng lại giữa các lần mở. */
  private markPristine() {
    if (this.funcMarkPristine !== undefined && this.funcMarkPristine !== null)
      this.funcMarkPristine(this.formItem);
    this.childForms.forEach((f) => f.markOwnPristine());
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
