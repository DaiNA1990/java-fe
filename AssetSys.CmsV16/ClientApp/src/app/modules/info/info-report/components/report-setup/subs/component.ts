import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoReportSetupService } from '../../../../info-report-setup/services/info-report-setup.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoReportDesignComponent } from '../../design/component';

@Component({
  selector: 'app-info-form-report-setup',
  templateUrl: `./component.html`,
  providers: [ConfirmationService, MessageService],
})
export class InfoFormReportSetupComponent implements OnInit {
  private parent: any = inject(InfoReportDesignComponent, { optional: true });

  isLoadProperty: boolean = true;

  dataId: number;
  reportSetupName: any;

  formControl: FormGroup;

  constructor(
    public service: InfoReportSetupService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  itemChosen(item: any) {
    this.isLoadProperty = false;

    setTimeout(() => {
      Object.entries(item).forEach((entry) => {
        const [key, value] = entry;
        if (this.formControl.controls[key] !== undefined) {
          if (
            typeof value === 'string' &&
            /^\d{4}-\d{1,2}-\d{1,2}/.test(value)
          ) {
            this.formControl.controls[key].setValue(new Date(value));
          } else {
            this.formControl.controls[key].setValue(value);
          }
        }
      });

      this.isLoadProperty = true;
      this.dataId = this.formControl.controls['id'].value;
      this.reportSetupName = this.formControl.controls['name'].value;
      this.cdr.detectChanges();
    }, 0);
  }

  async itemSave() {
    if (this.formControl.invalid) {
      this.formControl.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng nhập đúng các trường thông tin',
        life: 3000,
      });
      return;
    }

    if (
      this.formControl.controls['id'].value !== null &&
      this.formControl.controls['id'].value < 1
    )
      this.formControl.controls['id'].setValue(null);

    const res = await firstValueFrom(
      this.service.addOrEdit(this.formControl.getRawValue())
    );
    this.messageService.add({
      severity: 'success',
      summary: 'Thông báo',
      detail: res.message,
      life: 3000,
    });
    this.parent.itemSave(this.formControl.getRawValue());
  }

  init() {
    this.formControl = this.fb.group({
      id: [null, [Validators.nullValidator]],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      description: [null, [Validators.nullValidator]],
      isShow: [null, [Validators.nullValidator]],
      sqlData: [null, [Validators.required]],
      groupData: [null, [Validators.nullValidator]],
      mapColumn: [null, [Validators.required]],
      startRow: [null, [Validators.required]],
      groupCode: [null, [Validators.required]],
      numColumn: [null, [Validators.nullValidator]],
    });
  }

  ngOnInit(): void {
    this.init();
  }
}
