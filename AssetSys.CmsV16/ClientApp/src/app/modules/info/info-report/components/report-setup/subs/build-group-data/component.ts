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

interface FCGroupdata {
  columnGroupName: [{ data: ''; target: '' }];
  columnSumName: [];
  stt: { format: ''; target: '' };
}

@Component({
  selector: 'app-info-form-report-build-group-data',
  templateUrl: `./component.html`,
  providers: [ConfirmationService, MessageService],
})
export class InfoFormReportBuildGroupDataComponent implements OnInit {
  @Input() formCtrl: AbstractControl;

  visible: boolean = false;
  value: any;
  groupData: any;

  defaultGroupData: FCGroupdata = {
    columnGroupName: [{ data: '', target: '' }],
    columnSumName: [],
    stt: { format: '', target: '' },
  };
  typeFormat = [
    {
      value: 'CHUCAI',
      text: 'Chữ cái',
    },
    {
      value: 'LAMA',
      text: 'Số la mã',
    },
    {
      value: 'CHUSO',
      text: 'Chữ số',
    },
  ];
  typeShow = [
    {
      value: '',
      text: 'Bình thường',
    },
    {
      value: 'CHACON',
      text: 'Cha-Con',
    },
  ];
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
  addGroupData(e: any) {
    if (this.groupData == null) {
      this.groupData = {};
    }
    this.groupData['groupData'] = this.defaultGroupData;
  }
  addChildGroupData(group: any) {
    group['groupData'] = {
      columnGroupName: [{ data: '', target: '' }],
      columnSumName: [],
      stt: { format: '',type: '', target: '' },
    };
  }
  removeGroupData(parent: any) {
    if (parent == null) {
      delete this.groupData.groupData;
      return;
    }
    delete parent.groupData;
  }
  addcolumnGroupName(item: any) {
    item.push({ data: '', target: '' });
  }
  removecolumnGroupName(item: any, list: any) {
    list.splice(list.indexOf(item), 1);
  }
  addcolumnSumName(item: any) {
    item.push('');
  }
  removecolumnSumName(item: any, list: any) {
    list.splice(list.indexOf(item), 1);
  }
  addSttGroup(item: any) {
    if (item.stt == null) {
      item['stt'] = { format: '', type: '', target: '' };
    }
  }
  removeSttGroup(parent: any) {
    delete parent.stt;
  }

  // removeGroupData(item: FCMapColumn) {
  //   this.dataMapColumns.splice(this.dataMapColumns.indexOf(item), 1);
  // }

  open() {
    this.visible = true;
    this.cdr.detectChanges();
  }

  save() {
    this.formCtrl.setValue(JSON.stringify(this.groupData));
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
        this.groupData = JSON.parse(this.formCtrl.value);
        if (!this.groupData.summary)
          this.groupData['summary'] = {
            label: '',
            cellLabel: '',
            columnSumName: '',
            columnParam: '',
            borderCell: true,
            sumTop: false,
            sumAll: false,
          };
        if (
          this.groupData?.summary &&
          !('borderCell' in this.groupData.summary)
        ) {
          this.groupData.summary.borderCell = true;
        }
        if (
          this.groupData?.summary &&
          !('sumTop' in this.groupData.summary)
        ) {
          this.groupData.summary.sumTop = false;
        }
        if (
          this.groupData?.summary &&
          !('sumAll' in this.groupData.summary)
        ) {
          this.groupData.summary.sumAll = false;
        }
      } else {
        this.groupData = {
          summary: {
            label: '',
            cellLabel: '',
            columnSumName: '',
            columnParam: '',
            borderCell: true,
            sumTop: false,
            sumAll: false,
          },
        };
      }
    } catch (error) {}

    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.init();
  }
}
