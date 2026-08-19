import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { InfoReportService } from '../../services/info-report.service';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseFormPage } from '../../../info-page/components/base.form';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-info-report-fileupload',
  templateUrl: `./component.html`,
  providers: [ConfirmationService, MessageService],
})
export class InfoReportFileUploadComponent
  extends BaseFormPage
  implements OnInit
{
  @Input() formCtrl: AbstractControl;
  @Input() readOnly: boolean = false;

  fileChosen: any;

  constructor(
    private messageService: MessageService,
    private infoReportService: InfoReportService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  chosenFile(event: any) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
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

    this.infoReportService.uploadTemplate(formData).subscribe((res: any) => {
      if (res.statusCode === ResponseCode.ZERO) {
        this.formCtrl.setValue(res.data[0].fileName);
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
      this.changeDetectorRef.detectChanges();
    });
  }

  downloadFile(e: any) {
    this.infoReportService
      .downloadTemplate({ filename: this.formCtrl.value })
      .subscribe({
        next: (res) => {
          if (res.body.statusCode == 1) {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'File không tồn tại',
              life: 3000,
            });
          } else {
            saveAs(res.body!, this.formCtrl.value);
            this.messageService.add({
              severity: 'success',
              summary: 'Thông báo',
              detail: 'Download thành công!',
              life: 3000,
            });
          }
        },
        error: (err) => {
          const backendMsg = err.error?.message || 'Có lỗi xảy ra khi tải file';
          this.messageService.add({
            severity: 'error',
            summary: `Lỗi ${err.status}`,
            detail: backendMsg,
            life: 3000,
          });
        },
      });
  }

  init() {}

  ngOnInit(): void {
    this.init();
  }
}
