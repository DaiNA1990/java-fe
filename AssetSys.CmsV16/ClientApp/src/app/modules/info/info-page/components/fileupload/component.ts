import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileService } from '@appkkkh/modules/file/file/file.service';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseFormPage } from '../base.form';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-info-page-fileupload',
  templateUrl: `./component.html`,
  providers: [ConfirmationService, MessageService, FileService],
})
export class InfoPageFileUploadComponent
  extends BaseFormPage
  implements OnInit
{
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  @Input() readOnly: boolean = false;

  fileChosen: any;
  isECM: any;

  constructor(
    private messageService: MessageService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  chosenFile(event: any) {
    if (this.formCtrl.disabled || this.formItem.isReadOnly || this.readOnly) {
      return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = this.formItem.accept || '*/*';
    fileInput.onchange = (e: any) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
        return;
      }
      this.fileChosen = files[0];
      this.submitFile(files[0]);
    };
    fileInput.click();
  }

  removeFile(event: any) {
    this.formCtrl.setValue('');
  }

  submitFile(file: any) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('isECM', this.isECM ? 'true' : 'false');
    formData.append('groupCode', this.formItem?.layout?.group?.code);
    this.fileService.upload(formData).subscribe({
      next: (res: any) => {
        if (res.statusCode === ResponseCode.ZERO) {
          this.formCtrl.setValue(
            `${res.data[0].fileName}|${res.data[0].fileKey}`,
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Thông báo',
            detail: res.message,
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: res.message,
            life: 3000,
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        const message = err?.error?.message || 'Upload thất bại';
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: message,
          life: 3000,
        });
        this.cdr.detectChanges();
      },
    });
  }
  filename() {
    let file = this.formCtrl.value?.split('|');
    if (file) return file[0];
    return null;
  }
  downloadFile(e: any) {
    let file = this.formCtrl.value?.split('|');
    const filename = file[0];
    const filekey = file.length > 1 && file[1] != 'null' ? file[1] : filename;
    this.fileService
      .download({
        permission: this.formItem.layout.group.code,
        filename: filekey,
        isECM: this.isECM,
        iskeyFile: file.length > 1,
      })
      .subscribe({
        next: (res2) => {
          if (res2.body.statusCode == 1) {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'File không tồn tại',
              life: 3000,
            });
          } else {
            saveAs(res2.body!, filename);
            this.messageService.add({
              severity: 'success',
              summary: 'Thông báo',
              detail: 'Download thành công!',
              life: 3000,
            });
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          const backendMsg = err.error?.message || 'Có lỗi xảy ra khi tải file';
          this.messageService.add({
            severity: 'error',
            summary: `Lỗi ${err.status}`,
            detail: backendMsg,
            life: 3000,
          });
          this.cdr.detectChanges();
        },
      });
  }
  init() {
    this.isECM = this.formItem.controlType === 'file-ecm';
    try {
      if (this.formItem.isReadOnly || this.readOnly) this.formCtrl.disable();
    } catch (ex) {
      console.log(ex);
    }
  }

  ngOnInit(): void {
    this.fileService.setPath(this.initPath(this.formItem));
    this.init();
  }
}
