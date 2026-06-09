import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoFormService } from '@appkkkh/modules/info/info-form/services/info-form.service';
import { InfoLayoutService } from '@appkkkh/modules/info/info-layout/services/info-layout.service';

interface FCMapColumn {
  target?: string;
  data?: string;
  type?: string;
  format?: string;
}

@Component({
  selector: 'app-info-form-report-build-map-column',
  templateUrl: `./component.html`,
  providers: [ConfirmationService, MessageService],
})
export class InfoFormReportBuildMapColumnComponent implements OnInit {
  @Input() formCtrl: AbstractControl;

  visible: boolean = false;
  value: any;
  dataMapColumns: [FCMapColumn];
  typeDatas = [
    {
      value: 'string',
      text: 'Kiểu chuỗi',
    },
    {
      value: 'number',
      text: 'Kiểu số',
    },
    {
      value: 'date',
      text: 'Kiểu ngày',
    },
  ];
  formatDatas = [
    {
      value: '0',
      text: 'Số nguyên, không thập phân',
    },
    {
      value: '0.00',
      text: 'Luôn có 2 số thập phân',
    },
    {
      value: '#,##0',
      text: 'Ngăn cách hàng nghìn, không thập phân',
    },
    {
      value: '#,##0.00',
      text: 'Ngăn cách hàng nghìn, 2 số thập phân',
    },
    {
      value: '#,##0.####',
      text: 'Ngăn cách hàng nghìn, tối đa 4 số thập phân',
    },
    {
      value: '0%',
      text: 'Phần trăm, không thập phân',
    },
    {
      value: '0.00%',
      text: 'Phần trăm, 2 số thập phân',
    },
    {
      value: 'dd/MM/yyyy',
      text: 'Ngày/Tháng/Năm (ví dụ: 08/08/2025)',
    },
    {
      value: 'MM-dd-yyyy',
      text: 'Tháng-Ngày-Năm (ví dụ: 08-08-2025)',
    },
    {
      value: 'dd-MMM-yyyy',
      text: 'Ngày-Tháng chữ-Năm (ví dụ: 08-Aug-2025)',
    },
    {
      value: 'dd/MM/yyyy hh:mm',
      text: 'Ngày/Tháng/Năm Giờ:Phút (ví dụ: 08/08/2025 14:30)',
    },
    {
      value: 'hh:mm:ss',
      text: 'Giờ:Phút:Giây (ví dụ: 14:30:45)',
    },
    {
      value: '#,##0 "VNĐ"',
      text: 'Tiền tệ VNĐ, ngăn cách hàng nghìn',
    },
    {
      value: 'dd/MM/yyyy HH:mm',
      text: 'Ngày/Tháng/Năm Giờ:Phút (24h)',
    },
    {
      value: 'dd/MM/yyyy HH:mm:ss',
      text: 'Ngày/Tháng/Năm Giờ:Phút:Giây (24h)',
    },
  ];
  constructor(
    public service: InfoFormService,
    public propertyService: InfoPropertyService,
    public formService: InfoFormService,
    public layoutService: InfoLayoutService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}
  //private parent: any = inject(InfoReportDesignComponent, { optional: true });
  addMapColumn(e: any) {
    if (this.dataMapColumns == null) {
      this.dataMapColumns = [
        {
          target: '',
          data: '',
          type: 'string',
          format: '',
        },
      ];
      return;
    }
    this.dataMapColumns.push({
      target: '',
      data: '',
      type: 'string',
      format: '',
    });
  }

  removeMapColumn(item: FCMapColumn) {
    this.dataMapColumns.splice(this.dataMapColumns.indexOf(item), 1);
  }

  open() {
    this.visible = true;
    this.cdr.detectChanges();
  }

  save() {
    this.formCtrl.setValue(JSON.stringify(this.dataMapColumns));
    this.value = this.formCtrl.value;
    //this.parent.reload(JSON.stringify(this.dataMapColumns));
    this.cdr.detectChanges();
    this.visible = false;
  }
  valueChange(newVal: any) {
    this.formCtrl.setValue(newVal);
  }
  async init() {
    try {
      if (this.formCtrl.value !== null && this.formCtrl.value !== '') {
        this.value = this.formCtrl.value;
        this.dataMapColumns = JSON.parse(this.formCtrl.value);
      }
    } catch (error) {}

    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.init();
  }
}
