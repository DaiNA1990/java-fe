import {
  ChangeDetectorRef,
  Component,
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
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import icons from '@appkkkh/_metronic/shared/keenicon/icons.json';
import { InfoFormDesignComponent } from '../../../design/component';
import { InfoFormService } from '@appkkkh/modules/info/info-form/services/info-form.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import condition from './condition.json';

interface ConditionData {
  condition?: string;
  rules: ConditionDataRule[];
}

interface ConditionDataRule {
  condition?: string;
  field?: string;
  operator?: string;
  value?: string;
}

@Component({
    selector: 'app-info-form-property-build-condition-data',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService],
    standalone: false
})
export class InfoFormPropertyBuildConditionDataComponent implements OnInit {
  @Input() groupId: any;
  @Input() formCtrl: AbstractControl = new FormControl();

  //private parent: any = inject(InfoFormDesignComponent, { optional: true });

  formControl: FormGroup;
  formParamControl: FormGroup;

  //propertyDS = () => this.infoPropertyService.autocomplete({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER });
  //formDS = () => this.infoFormService.autocomplete({ layoutId: this.layoutId, pageSize: Number.MAX_SAFE_INTEGER });

  visible: boolean = false;

  lstFields: any[] = [];

  lstAutoFields: any[] = [];

  lstParams: any[] = [];

  sql: any = null;

  _jsonata: any = {};

  codeGenerate: any = null;

  maths: any[] = condition.maths;

  fieldMaths: any[] = condition.fieldMaths;

  operators: any[] = condition.operators;

  conditions: any = {
    condition: 'and',
    rules: [
      {
        field: '',
        operator: '=',
        value: '',
      },
      {
        condition: 'or',
        rules: [
          {
            field: '',
            operator: 'contains',
            value: '',
          },
          {
            field: '',
            operator: 'contains',
            value: '',
          },
        ],
      },
    ],
  };

  mathValue: any = {
    mathGroup: '+',
    rules: [
      {
        field: '',
        math: '+',
      },
      {
        mathGroup: '-',
        rules: [
          {
            field: '',
            math: '+',
          },
        ],
      },
    ],
  };

  constructor(
    public infoFormService: InfoFormService,
    public infoPropertyService: InfoPropertyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  open() {
    this.visible = true;
    this.changeDetectorRef.detectChanges();
  }

  search(event: AutoCompleteCompleteEvent) {
    this.lstAutoFields = this.lstFields
      .map((item: any) => `${item.name}(${item.code})`)
      .filter((c: any) => c.indexOf(event.query) > -1);

    this.changeDetectorRef.detectChanges();
  }

  select(event: any, item: any) {
    item.field = event.value.split('(')[1].split(')')[0];
  }

  save() {
    const _conds = [];

    if (
      this.conditions.rules.length > 0 &&
      this.conditions.rules[0].field !== ''
    )
      _conds.push({
        typeData: 'CONDITION',
        data: this.conditions,
      });

    if (this.mathValue.rules.length > 0 && this.mathValue.rules[0].field !== '')
      _conds.push({
        typeData: 'VALUE',
        data: this.mathValue,
      });

    if (this.lstParams.length > 0)
      _conds.push({
        typeData: 'PARAMETER',
        data: this.lstParams,
      });

    if (this.codeGenerate !== null && this.codeGenerate !== '')
      _conds.push({
        typeData: 'CODE_GENERATE',
        data: this.codeGenerate,
      });

    if (this.sql != null && this.sql != '')
      _conds.push({
        typeData: 'SQL',
        data: this.sql,
      });
    if (
      this._jsonata != null &&
      this._jsonata.transform != null &&
      this._jsonata.transform != ''
    )
      _conds.push({
        typeData: 'JSONATA',
        data: this._jsonata,
      });
    if (
      this.formControl.controls.typeData.value == 'Lựa chọn' ||
      this.formControl.controls.typeData.value == null
    )
      this.formCtrl.setValue(null);
    else
      this.formCtrl.setValue(_conds.length > 0 ? JSON.stringify(_conds) : null);
    this.visible = false;
  }

  hasConfig(typeData: any) {
    switch (typeData) {
      case 'CONDITION':
        if (
          this.conditions.rules.length > 0 &&
          this.conditions.rules[0].field !== ''
        )
          return true;
        else return false;
      case 'VALUE':
        if (
          this.mathValue.rules.length > 0 &&
          this.mathValue.rules[0].field !== ''
        )
          return true;
        else return false;
      case 'PARAMETER':
        if (this.lstParams.length > 0) return true;
        else return false;
      case 'CODE_GENERATE':
        if (this.codeGenerate !== null && this.codeGenerate !== '') return true;
        else return false;
      case 'SQL':
        if (this.sql !== null && this.sql !== '') return true;
        else return false;
      case 'JSONATA':
        if (
          this._jsonata != null &&
          this._jsonata.transform != null &&
          this._jsonata.transform != ''
        )
          return true;
        else return false;
      default:
        return false;
    }
  }

  addParam() {
    if (this.formParamControl.invalid) {
      this.formParamControl.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng nhập đúng các trường thông tin',
        life: 3000,
      });
      return;
    }

    this.lstParams.push(this.formParamControl.value);
    this.formParamControl.reset();
  }

  removeItem(item: any) {
    this.lstParams.splice(this.lstParams.indexOf(item), 1);
  }

  async init() {
    let obj: any = null;

    try {
      obj = JSON.parse(this.formCtrl.value);
    } catch (ex) {
      console.log(ex);
    }

    if (!Array.isArray(obj)) obj = [obj];

    for (const o of obj) {
      if (o !== null && o.typeData === 'CONDITION') this.conditions = o.data;

      if (o !== null && o.typeData === 'VALUE') this.mathValue = o.data;

      if (o !== null && o.typeData === 'PARAMETER') this.lstParams = o.data;

      if (o !== null && o.typeData === 'SQL') this.sql = o.data;

      if (o !== null && o.typeData === 'JSONATA') this._jsonata = o.data;

      if (o !== null && o.typeData === 'CODE_GENERATE')
        this.codeGenerate = o.data;
    }

    this.formControl = this.formBuilder.group({
      typeData: [obj[0]?.typeData || null, [Validators.required]],
      data: [obj[0]?.data || null, [Validators.required]],
    });

    this.formParamControl = this.formBuilder.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });

    const res = await firstValueFrom(
      this.infoPropertyService.getList({
        groupId: this.groupId,
        pageSize: Number.MAX_SAFE_INTEGER,
      })
    );

    this.lstFields = res.data.list;

    this.changeDetectorRef.detectChanges();
  }

  addCondition(item: any) {
    item.rules.push({
      field: '',
      operator: '',
      value: '',
    });
  }

  removeCondition(item: any, parent: any) {
    parent.rules.splice(parent.rules.indexOf(item), 1);
  }

  addConditionGroup(item: any) {
    item.rules.push({
      condition: 'and',
      rules: [
        {
          field: '',
          operator: '',
          value: '',
        },
      ],
    });
  }

  removeConditionGroup(item: any, parent: any) {
    parent.rules.splice(parent.rules.indexOf(item), 1);
  }

  addMath(item: any) {
    item.rules.push({
      math: '+',
      field: '',
    });
  }

  removeMath(item: any, parent: any) {
    parent.rules.splice(parent.rules.indexOf(item), 1);
  }

  addMathGroup(item: any) {
    item.rules.push({
      mathGroup: '-',
      rules: [
        {
          field: '',
          math: '+',
        },
      ],
    });
  }

  removeMathGroup(item: any, parent: any) {
    parent.rules.splice(parent.rules.indexOf(item), 1);
  }

  ngOnInit(): void {
    this.init();
  }
}
