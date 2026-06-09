import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { firstValueFrom, Subscription, BehaviorSubject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoFormService } from '../../services/service';
import { InfoDataService } from '../../services/info-data-service';
import { EventDataService } from '../../services/event-service';
import controlTypes from '@appkkkh/modules/info/info-form/components/property/controls.json';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { cloneDeep, forEach } from 'lodash';
import { BaseFormPage } from '../base.form';
import { AuthService } from '@appkkkh/modules/user/auth/services/auth.service';
import jsonata from 'jsonata';
import { MenuComponent } from '@appkkkh/_metronic/kt/components/MenuComponent';
import { InfoReportService } from '../../../info-report/services/info-report.service';
import { evaluateExpression } from '../expression-utils';
import { CategoryService } from '../../services/category-service';
import isEqual from 'lodash/isEqual';
import { saveAs } from 'file-saver';
import { dateUtil } from '../../components/date-util';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
dayjs.extend(duration);
@Component({
  selector: 'app-info-page-form',
  templateUrl: `./component.html`,
  styles: [
    `
      ::ng-deep {
        .p-tabview-nav-link {
          color: rgb(0, 107, 104);
          text-decoration: none !important;
        }
        .p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
          border-color: rgb(0, 107, 104);
        }
        .p-radiobutton
          .p-radiobutton-box:not(.p-disabled):not(.p-highlight):hover {
          border-color: rgb(0, 107, 104) !important;
        }
        .p-radiobutton .p-radiobutton-box:not(.p-disabled).p-focus {
          border-color: rgb(0, 107, 104) !important;
        }
        .p-radiobutton .p-radiobutton-box.p-highlight {
          border-color: rgb(0, 107, 104) !important;
          background: rgb(0, 107, 104) !important;
        }
        .p-radiobutton .p-radiobutton-box.p-highlight:not(.p-disabled):hover {
          border-color: #004f4d !important;
          background: #004f4d !important;
        }
        .p-checkbox .p-checkbox-box.p-highlight {
          border-color: rgb(0, 107, 104) !important;
          background: rgb(0, 107, 104) !important;
        }
        .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover {
          border-color: rgb(0, 107, 104) !important;
        }
        .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
          border-color: rgb(0, 107, 104) !important;
        }
        .p-checkbox:not(.p-checkbox-disabled)
          .p-checkbox-box.p-highlight:hover {
          border-color: #004f4d !important;
          background: #004f4d !important;
        }
        input.p-inputtext[disabled],
        .dropzone.dropzone-queue .dropzone-item,
        textarea[disabled] {
          background-color: #e8e8e8 !important;
        }
      }
    `,
  ],
  providers: [
    InfoDataService,
    CategoryService,
    InfoFormService,
  ],
})
export class InfoPageFormComponent
  extends BaseFormPage
  implements OnDestroy, OnInit, AfterViewInit, OnChanges
{
  @Input() layoutModule: string | null;
  @Input() layoutCode: string | null;
  @Input() layoutId: number | null;
  @Input() passGroupId: number | null;
  @Input() passDataId: number | null;
  @Input() parentId: number | null;
  @Input() identifyId: string | null | undefined;
  @Input() currentUser: any;
  @Input() parentData: any;
  @Input() readOnly: any;

  loadFormSubject = new BehaviorSubject<boolean>(true);

  funcGetChild: Function;

  form: FormGroup;

  forms: any[] = [];

  subscriptions: Subscription[] = [];

  isOnSubmit: boolean = false;

  dataId = null;
  groupId = null;
  groupCode = null;
  parentGroupId = null;

  formType: any = null;

  filterConditions: any[] = [];
  validationRules: any[] = [];
  prevValue: any = {};
  dateupdated: any = null;

  controlTemplateMap: { [key: string]: TemplateRef<any> } = {};

  @ViewChild('cardControlTmpl') cardControlTmpl: TemplateRef<any>;
  @ViewChild('cardHeaderControlTmpl') cardHeaderControlTmpl: TemplateRef<any>;
  @ViewChild('cardBodyControlTmpl') cardBodyControlTmpl: TemplateRef<any>;
  @ViewChild('cardFooterControlTmpl') cardFooterControlTmpl: TemplateRef<any>;
  @ViewChild('containerControlTmpl') containerControlTmpl: TemplateRef<any>;
  @ViewChild('gridControlTmpl') gridControlTmpl: TemplateRef<any>;
  @ViewChild('gridColControlTmpl') gridColControlTmpl: TemplateRef<any>;
  @ViewChild('tabControlTmpl') tabControlTmpl: TemplateRef<any>;
  @ViewChild('layoutControlTmpl') layoutControlTmpl: TemplateRef<any>;
  @ViewChild('tableControlTmpl') tableControlTmpl: TemplateRef<any>;
  @ViewChild('modalControlTmpl') modalControlTmpl: TemplateRef<any>;
  @ViewChild('modalContentControlTmpl')
  modalContentControlTmpl: TemplateRef<any>;
  @ViewChild('modalHeaderControlTmpl') modalHeaderControlTmpl: TemplateRef<any>;
  @ViewChild('modalBodyControlTmpl') modalBodyControlTmpl: TemplateRef<any>;
  @ViewChild('modalFooterControlTmpl') modalFooterControlTmpl: TemplateRef<any>;
  @ViewChild('readonlyControlTmpl') readonlyControlTmpl: TemplateRef<any>;
  @ViewChild('plaintextControlTmpl') plaintextControlTmpl: TemplateRef<any>;
  @ViewChild('valueControlTmpl') valueControlTmpl: TemplateRef<any>;
  @ViewChild('textControlTmpl') textControlTmpl: TemplateRef<any>;
  @ViewChild('textareaControlTmpl') textareaControlTmpl: TemplateRef<any>;
  @ViewChild('yearControlTmpl') yearControlTmpl: TemplateRef<any>;
  @ViewChild('numberControlTmpl') numberControlTmpl: TemplateRef<any>;
  @ViewChild('decimalControlTmpl') decimalControlTmpl: TemplateRef<any>;
  @ViewChild('currencyControlTmpl') currencyControlTmpl: TemplateRef<any>;
  @ViewChild('selectControlTmpl') selectControlTmpl: TemplateRef<any>;
  @ViewChild('dateControlTmpl') dateControlTmpl: TemplateRef<any>;
  @ViewChild('checkboxControlTmpl') checkboxControlTmpl: TemplateRef<any>;
  @ViewChild('radioControlTmpl') radioControlTmpl: TemplateRef<any>;
  @ViewChild('fileControlTmpl') fileControlTmpl: TemplateRef<any>;
  @ViewChild('buttonControlTmpl') buttonControlTmpl: TemplateRef<any>;
  @ViewChild('menuControlTmpl') menuControlTmpl: TemplateRef<any>;
  @ViewChild('separatorControlTmpl') separatorControlTmpl: TemplateRef<any>;
  @ViewChild('dataActionControlTmpl') dataActionControlTmpl: TemplateRef<any>;

  constructor(
    public service: InfoFormService,
    private infoDataService: InfoDataService,
    public infoReportService: InfoReportService,
    private confirmationService: ConfirmationService,
    public auth: AuthService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private events: EventDataService,
    private fb: FormBuilder,
    private el: ElementRef
  ) {
    super();
  }

  init() {
    this.form = this.fb.group({});
    this.subscriptions.push(
      this.form.valueChanges.subscribe(async (formValue: any) => {
        if (this.loadFormSubject.value) {
          return;
        }
        for (let o of this.forms.filter(
          (f: any) =>
            f.expressionData !== undefined &&
            f.expressionData !== null &&
            f.expressionData !== ''
        ))
          await this.runExpressionData(o);
        for (let o of this.forms.filter(
          (f: any) =>
            f.expressionValidate !== undefined &&
            f.expressionValidate !== null &&
            f.expressionValidate !== ''
        ))
          await this.runExpressionValidate(o);

        for (let o of this.forms.filter(
          (f: any) =>
            f.expressionDisplay !== undefined &&
            f.expressionDisplay !== null &&
            f.expressionDisplay !== '' &&
            (f.isTableControl == null || !f.isTableControl)
        ))
          await this.runDisplayControl(o);

        if (!(this.formType == 'VIEW')) {
          for (let o of this.forms.filter(
            (f: any) =>
              f.expressionReadonly !== undefined &&
              f.expressionReadonly !== null &&
              f.expressionReadonly !== ''
          )) {
            await this.runExpressionReadOnly(o);
          }
        }
        this.prevValue = { ...this.value };
      })
    );
  }

  get value() {
    let currForm = this.form?.getRawValue();
    if (this.dataId != null) currForm['id'] = this.dataId;
    if (this.parentId != null) currForm['parentId'] = this.parentId;
    currForm['formType'] = this.formType ?? 'NULL';
    return currForm;
  }
  get valueTransform() {
    let value = this.value;
    value['parentData'] = this.parentData;
    value['currentUser'] = this.currentUser;
    return value;
  }
  setFieldValue(
  field: string,
  value: any,
  typeData: string,
  emitEvent: boolean = true
) {
  if (!this.form.controls[field]) return;

  let finalValue = value;

  switch (typeData) {
    case 'date':
      finalValue = value != null ? dateUtil.parseDate(value) : null;
      break;

    case 'number':
      finalValue = value != null ? Number(value) : null;
      break;

    case 'decimal':
      finalValue = value != null ? parseFloat(value) : null;
      break;

    case 'currency':
      finalValue = value != null ? parseFloat(value) : null;
      break;

    case 'bool':
      finalValue =
        value === true ||
        value === 'true' ||
        value === 1 ||
        value === '1';
      break;

    default:
      finalValue = value;
      break;
  }

  this.form.controls[field].setValue(finalValue, {
    emitEvent: emitEvent,
  });
}
  extractFieldsFromJsonata(expression: string): string[] {
    const RESERVED = new Set([
      'true',
      'false',
      'null',
      'undefined',
      'if',
      'then',
      'else',
      'and',
      'or',
      'not',
      // JSONata functions (core or $-based)
      'floor',
      'number',
      'split',
      'substring',
      'length',
      'map',
      'reduce',
      'filter',
      'count',
      'sum',
      'min',
      'max',
      '$floor',
      '$number',
      '$split',
      '$substring',
      '$length',
      '$map',
      '$reduce',
      '$filter',
      '$count',
      '$sum',
      '$min',
      '$max',
    ]);

    // Loại bỏ các đoạn trong chuỗi string để tránh bắt nhầm
    const stripped = expression.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '');

    // Regex để bắt các từ khóa có dạng: hinh_thuc_lcpakt, field_1, ...
    const regex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;

    const matches = stripped.match(regex) || [];

    return [...new Set(matches.filter((name) => !RESERVED.has(name)))];
  }
  async runExpressionReadOnly(item: any) {
    if (
      item.expressionReadonly === undefined ||
      item.expressionReadonly === null ||
      item.expressionReadonly === ''
    )
      return;
    const expressionReadonly = JSON.parse(item.expressionReadonly);
    try {
      const expression = this.buildConditionUI(expressionReadonly);
      if (expression == '') return;
      const relevantFields = this.extractFieldsFromJsonata(expression);
      const hasChanged = relevantFields.some(
        (f: any) => !isEqual(this.prevValue[f], this.value[f])
      );
      if (!hasChanged && relevantFields.length > 0) return;
      item.readOnly = await this.checkIsReadOnly(
        item,
        expressionReadonly,
        expression
      );
      const controlName =
        item.propertyItem === undefined ||
        item.propertyItem === null ||
        item.propertyItem?.code === ''
          ? item.code
          : item.propertyItem.code;
      const control = this.form.get(controlName);
      if (control) {
        if (item.readOnly && control.enabled)
          control.disable({ emitEvent: false });
        if (!item.readOnly && control.disabled)
          control.enable({ emitEvent: false });
      }
    } catch (ex) {
      console.log(expressionReadonly + ' : ' + String(ex));
    }
  }

  async runExpressionValidate(item: any) {
    if (
      item.expressionValidate === undefined ||
      item.expressionValidate === null ||
      item.expressionValidate === ''
    )
      return;
    const expressionValidate =
      JSON.parse(item.expressionValidate)?.filter(
        (c: any) => c.enable && c.code === 'expression' && c.value
      ) || [];
    try {
      if (expressionValidate.length == 0) return;
      const relevantFields = this.extractFieldsFromJsonata(
        expressionValidate[0].value
      );
      const hasChanged = relevantFields.some(
        (f: any) => !isEqual(this.prevValue[f], this.value[f])
      );
      if (!hasChanged && relevantFields.length > 0) return;
      const controlName =
        item.propertyItem === undefined ||
        item.propertyItem === null ||
        item.propertyItem?.code === ''
          ? item.code
          : item.propertyItem.code;
      const control = this.form.get(controlName);
      control?.updateValueAndValidity({ emitEvent: false });
    } catch (ex) {
      console.log(expressionValidate + ' : ' + String(ex));
    }
  }
  async getAssetQuantity(
    companyCode: any,
    departmentCode: any,
    groupCode: any,
    planDate: any,
    settlementStatus: any = null
  ) {
    if (companyCode == null || groupCode == null) return null;
    const response = await firstValueFrom(
      this.categoryService.getAssetQuantity({
        companyCode: companyCode,
        departmentCode: departmentCode,
        groupCode: groupCode,
        planDate: planDate,
        settlementStatus: settlementStatus,
      })
    );
    return response.statusCode !== ResponseCode.ZERO ? null : response.data;
  }
  async runExpressionData(property: any, passCheckChange: any = false) {
    if (
      property.expressionData === undefined ||
      property.expressionData === null ||
      property.expressionData === '' ||
      property.controlType == 'data'
    )
      return;

    let expressionData = JSON.parse(property.expressionData);
    const arr = Array.isArray(expressionData)
      ? expressionData
      : [expressionData];
    let _expression: any = null;
    for (let obj of arr) {
      try {
        if (
          obj.typeData == 'JSONATA' &&
          obj.data != null &&
          obj.data.transform != null
        ) {
          _expression = obj.data.transform;
          const relevantFields = obj.data?.dependent
            ? obj.data?.dependent.split(',')
            : this.extractFieldsFromJsonata(_expression) || [];
          const hasChanged = relevantFields.some(
            (f: any) => !isEqual(this.prevValue[f], this.value[f])
          );
          if (!hasChanged && relevantFields.length > 0 && !passCheckChange)
            return;
          const expr = jsonata(_expression);
          if (_expression.indexOf('GetAssetQuantity') > -1) {
            expr.registerFunction(
              'GetAssetQuantity',
              (async (
                companyCode: any,
                departmentCode: any = null,
                groupCode: any,
                planDate: any = null,
                settlementStatus: any = null
              ) => {
                return await this.getAssetQuantity(
                  companyCode,
                  departmentCode,
                  groupCode,
                  planDate,
                  settlementStatus
                );
              }).bind(this)
            );
          }
          const result = await expr.evaluate(
            this.convertDatesToStrings(this.valueTransform)
          );
          this.setFieldValue(
            property.propertyItem.code,
            result,
            property.propertyItem.typeData,
            false
          );
          return;
        } else if (obj.typeData == 'VALUE') {
          const relevantFields: any = [];
          _expression = this.buildExpressionData(
            obj.data,
            property.propertyItem?.typeData,
            relevantFields
          );
          const hasChanged = relevantFields.some(
            (f: any) => !isEqual(this.prevValue[f], this.value[f])
          );
          if (!hasChanged && relevantFields.length > 0) return;
          const expr = jsonata(_expression);
          const result = await expr.evaluate(this.valueTransform);
          this.setFieldValue(
            property.propertyItem.code,
            result,
            property.propertyItem.typeData,
            false
          );
          return;
        }
      } catch (ex) {
        console.log(_expression + ' : ' + JSON.stringify(ex));
      }
    }
  }
  convertDatesToStrings(obj: any): any {
    try {
      if (obj instanceof Date) {
        return !isNaN(obj.getTime()) ? obj.toISOString() : null;
      } else if (Array.isArray(obj)) {
        return obj.map((item) => this.convertDatesToStrings(item));
      } else if (obj !== null && typeof obj === 'object') {
        const result: any = {};
        for (const key of Object.keys(obj)) {
          result[key] = this.convertDatesToStrings(obj[key]);
        }
        return result;
      }
      return obj;
    } catch (ex) {
      return obj;
    }
  }

  buildExpressionData(obj: any, typeData: any, dependent: any) {
    if (obj === undefined || obj === null || obj.rules.length === 0) return '';

    let query = '';

    for (const rule of obj.rules) {
      if (rule.mathGroup === undefined) {
        dependent.push(rule.field);
        switch (rule.math) {
          case '+date':
            query += `dayjs(this.form.controls['${rule.field}']?.value)`;
            break;
          case '+day':
            query += `.add(this.form.controls['${rule.field}']?.value, 'd').toDate()`;
            break;
          case '+month':
            query += `.add(this.form.controls['${rule.field}']?.value, 'M').toDate()`;
            break;
          case '-duration-day-e':
            query += `dayjs.duration(this.form.controls['${rule.field}']?.value`;
            break;
          case '-duration-day-s':
            query += `-this.form.controls['${rule.field}']?.value).asDays()`;
            break;
          default:
            if (
              typeData === 'number' ||
              typeData === 'decimal' ||
              typeData === 'currency'
            )
              query += `(${rule.field} ? $number(${rule.field}) : 0) ${rule.math} `;
            else query += `(${rule.field} ? ${rule.field} : '') ${rule.math} `;
            break;
        }
      }

      if (rule.mathGroup !== undefined)
        query +=
          (query !== '' ? ` ${rule.mathGroup} ` : '') +
          `(${this.buildExpressionData(rule, typeData, dependent)})`;
    }

    return query;
  }
  filterByParent(parent: any = null) {
    const childShow = this.forms
      .filter((x) => x.parentId === (parent ? parent.id : null) && x.isShow)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return childShow;
  }
  setOnValidControl(item: any) {
    if (item.propertyItem?.code != null && item.propertyItem?.code != '') {
      const controlName = item.propertyItem.code;
      const control = this.form.get(controlName);
      const syncValidators = this.getValidator(item);
      const asyncValidators = this.getValidatorAsync(item);
      control?.setValidators(syncValidators);
      control?.setAsyncValidators(asyncValidators);
      control?.updateValueAndValidity({ emitEvent: false });
    }
  }
  setOffValidControl(item: any) {
    const controlName =
      item.propertyItem === undefined ||
      item.propertyItem === null ||
      item.propertyItem?.code === ''
        ? item.code
        : item.propertyItem.code;
    const control = this.form.get(controlName);
    control?.clearValidators();
    control?.clearAsyncValidators();
    control?.updateValueAndValidity({ emitEvent: false });
    //control?.parent?.updateValueAndValidity({ emitEvent: false });
  }

  getAllChildControl(parent: any = null) {
    const child = this.forms
      .filter((x) => x.parentId === parent)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return child;
  }

  getControl(item: any): FormControl {
    return (
      (this.form.get(
        item.propertyItem.code === '' ? item.code : item.propertyItem.code
      ) as FormControl) || new FormControl()
    );
  }

  // expressionValidator(expression: string, field: string): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     if (control.parent?.value !== undefined && control.parent?.value !== null)
  //       console.log(jsonata(expression).evaluate(control.parent?.value || {}));

  //     return null;
  //   };
  // }

  expressionValidatorAsync(
    expression: string,
    field: string
  ): AsyncValidatorFn {
    return async (
      control: AbstractControl
    ): Promise<{ [key: string]: any } | null> => {
      try {
        const result = await jsonata(expression).evaluate(this.valueTransform);
        return result ? { expressionValidatorAsync: true } : null;
      } catch (ex) {
        //console.log('Async validator error', String(ex));
        return null;
      }
    };
  }

  getValidator(item: any) {
    const arr: any[] = [];

    try {
      const expressionValidate =
        JSON.parse(item.expressionValidate)?.filter((c: any) => c.enable) || [];

      for (const val of expressionValidate) {
        if (val.code === 'require') arr.push(Validators.required);

        if (val.code === 'min-length')
          arr.push(Validators.minLength(parseInt(val.value)));

        if (val.code === 'max-length')
          arr.push(Validators.maxLength(parseInt(val.value)));

        if (val.code === 'min') arr.push(Validators.min(parseInt(val.value)));

        if (val.code === 'max') arr.push(Validators.max(parseInt(val.value)));
      }
    } catch (e) {
      console.log(e);
    }

    if (arr.length === 0) arr.push(Validators.nullValidator);

    return arr;
  }

  getValidatorAsync(item: any) {
    const arr: any[] = [];
    try {
      const expressionValidate =
        JSON.parse(item.expressionValidate)?.filter((c: any) => c.enable) || [];

      for (const val of expressionValidate) {
        if (val.code === 'expression')
          arr.push(
            this.expressionValidatorAsync(
              val.value,
              item.propertyItem?.code === ''
                ? item.code
                : item.propertyItem.code
            )
          );
      }
    } catch (e) {
      console.log(e);
    }

    return arr;
  }

  hasRequire(str: string) {
    try {
      const expressionValidate =
        JSON.parse(str).filter((c: any) => c.enable && c.code === 'require') ||
        [];
      return expressionValidate.length > 0 ? true : false;
    } catch (e) {
      return false;
    }
  }

  async runDisplayControl(item: any = null, isShowParent: any = true) {
    item.isShow =
      isShowParent && (await this.checkIsDisplay(item.expressionDisplay, item));
    // if (item.isShow) {
    //   this.setOnValidControl(item);
    // } else {
    //   this.setOffValidControl(item);
    // }
    const child = this.forms.filter((x) => x.parentId === item.id) || [];
    if (child.length == 0) return;
    child.forEach(async (o: any) => {
      await this.runDisplayControl(o, item.isShow);
    });
  }
  async checkIsDisplay(str: any, item: any = null) {
    if (item && !this.checkPermission(item.permission)) return false;
    let expression: any = '';
    if (str === undefined || str === null || str === '') return true;
    try {
      const expressionDisplay = JSON.parse(str);
      expression = this.buildConditionUI(expressionDisplay);
      if (expression === '') return true;
      const result = await jsonata(expression).evaluate(this.valueTransform);
      return Boolean(result);
    } catch (ex) {
      console.log(
        (item.propertyItem?.code ?? item.code) +
          ' checkIsDisplay:' +
          expression +
          ' ' +
          JSON.stringify(ex)
      );
    }

    return true;
  }

  async checkIsReadOnly(
    item: any,
    expressionReadonly: any = null,
    expression: any = null
  ) {
    if (this.formType == 'VIEW') return true;
    if (this.readOnly) return true;
    if (item.isReadOnly) return true;
    if (
      item.expressionReadonly === undefined ||
      item.expressionReadonly === null ||
      item.expressionReadonly === ''
    )
      return false;
    try {
      expressionReadonly =
        expressionReadonly ?? JSON.parse(item.expressionReadonly);
      expression = expression ?? this.buildConditionUI(expressionReadonly);
      if (expression === '') return true;
      const result = await jsonata(expression).evaluate(this.valueTransform);
      if (
        expressionReadonly.affirmation &&
        expressionReadonly.affirmation === 'NEGATIVE'
      ) {
        return !Boolean(result);
      } else {
        return Boolean(result);
      }
    } catch (ex) {
      return true;
    }
  }

  // Hàm xây dựng điều kiện hiển thị trên UI
  buildConditionUI(obj: any) {
    if (obj === undefined || obj === null || obj.rules.length === 0) return '';

    let query = '';

    const condition = obj.condition === 'or' ? 'or' : 'and';

    for (const rule of obj.rules) {
      // if (rule.value?.indexOf('"') !== 0)
      //     rule.value = '"' + rule.value + '"';
      rule.operator = rule.operator == '==' ? '=' : rule.operator;
      rule.value =
        rule.value?.indexOf('@userName') > -1
          ? `\"${rule.value.replace('@userName', this.currentUser.userName)}\"`
          : rule.value;
      if (rule.condition === undefined)
        if (rule.field.indexOf('@') > -1) {
          if ('@userName' === rule.field || '@role' === rule.field)
            query +=
              (query !== '' ? ` ${condition} ` : '') +
              ` ($count(currentUser.roleCodes[$ = $uppercase(${rule.value})]) ${
                rule.operator == '=' ? '>' : '='
              } 0) `;
          if (rule.field.indexOf('@parentData') > -1)
            query +=
              (query !== '' ? ` ${condition} ` : '') +
              `${rule.field.replace('@parentData', 'parentData')} ${
                rule.operator
              } ${rule.value}`;
          if ('@dataId' === rule.field)
            query +=
              (query !== '' ? ` ${condition} ` : '') +
              `id ${rule.operator} ${rule.value}`;
        } else if (rule.operator == 'is null') {
          query +=
            (query !== '' ? ` ${condition} ` : '') +
            `(${rule.field} = undefined or ${rule.field} = null)`;
        } else if (rule.operator == 'is not null') {
          query +=
            (query !== '' ? ` ${condition} ` : '') + `(${rule.field} != null)`;
        } else if (rule.operator == 'in' || rule.operator == 'not in') {
          query +=
            (query !== '' ? ` ${condition} ` : '') +
            ` ($count($filter(${rule.value}, function($v) { $v = ${
              rule.field
            } })) ${rule.operator == 'in' ? '>' : '='} 0) `;
        } else
          query +=
            (query !== '' ? ` ${condition} ` : '') +
            `${rule.field} ${rule.operator} ${rule.value}`;

      if (rule.condition !== undefined)
        query +=
          (query !== '' ? ` ${condition} ` : '') +
          `(${this.buildConditionUI(rule)})`;
    }

    return query != '' ? `(${query})` : query;
  }
  markTableChildren(lstControl: any, item: any) {
    lstControl
      .filter((t: any) => t.parentId === item.id)
      .forEach((o: any) => {
        o['isTableControl'] = true;
        this.markTableChildren(lstControl, o);
      });
  }
  async buildControls() {
    const res = await firstValueFrom(
      this.service.getByLayoutCode({
        code: this.layoutCode
      })
    );
    const formItem = res?.data[0];
    this.infoDataService.setPath(this.initPath(formItem));
    this.service.setPath(this.initPath(formItem));
    this.categoryService.setPath(this.initPath(formItem));

    res.data.forEach((item: any) => {
      this.groupId = item.layoutItem.groupId;
      this.groupCode = item.layoutItem.groupItem.code;
      this.parentGroupId = item.layoutItem.groupParentId;
      if (
        item.controlType == 'button' &&
        item.expressionDisplay != null &&
        item.expressionDisplay != '' &&
        JSON.parse(item.expressionDisplay).rules.length > 0
      ) {
        item.isShow = false;
      }
    });
    const lstControl = res.data;
    const lstTableControl = lstControl.filter(
      (t: any) => t.controlType == 'table'
    );
    lstTableControl.forEach((item: any) => {
      item['isTableControl'] = true;
      this.markTableChildren(lstControl, item);
    });

    this.forms.push(...res.data);

    this.cdr.detectChanges();

    if (
      this.el.nativeElement.parentElement !== null &&
      this.el.nativeElement.parentElement.classList !== null &&
      this.el.nativeElement.parentElement.classList.value.indexOf(
        'modal-content'
      ) > -1
    ) {
      setTimeout(() => {
        if (this.el.nativeElement.querySelector('.modal-body')) {
          this.el.nativeElement.classList.add('modal-content');
        } else {
          this.el.nativeElement.classList.add('modal-body');
        }
      }, 300);
    }

    MenuComponent.reinitialization();

    await this.loadForm();
  }

  async loadForm(
    dataId: any = null,
    initValue: any = null,
    cloneValue: any = null
  ) {
    this.loadFormSubject.next(true);
    this.validationRules = [];
    this.dataId = dataId;
    if (this.identifyId === null) this.identifyId = `${new Date().getTime()}`;

    const resValue =
      dataId !== undefined && dataId !== null
        ? await firstValueFrom(this.infoDataService.getById({groupCode: this.groupCode, id: dataId }))
        : null;
    this.dateupdated = resValue?.data['date_updated'];
    const arrControls = [];
    for (const key of Object.keys(this.form.controls)) {
      this.form.removeControl(key);
      for (const item of this.forms.filter(
        (v) =>
          (v.propertyItem?.code && v.propertyItem.code !== ''
            ? v.propertyItem.code
            : v.code) === key
      )) {
        arrControls.push(Object.assign({}, item));
      }
      this.forms = this.forms.filter(
        (v) =>
          !(
            (v.propertyItem?.code && v.propertyItem.code !== ''
              ? v.propertyItem.code
              : v.code) === key
          )
      );
    }

    for (const item of this.forms.filter(
      (c: any) =>
        c.propertyItem.code !== '' || (c.code !== null && c.code !== '')
    )) {
      if (
        controlTypes[0].items.filter((s: any) => s.value == item.controlType)
          .length === 0
      )
        continue;

      arrControls.push(Object.assign({}, item));

      this.forms.splice(this.forms.indexOf(item), 1);
    }

    await Promise.all(
      arrControls.map(async (item: any) => {
        let _value = null;
        if (item.propertyItem?.code == 'dateupdated')
          _value = resValue?.data['date_updated'] || null;
        else if (item.propertyItem?.code == 'updatedby')
          _value = resValue?.data['updated_by'] || null;
        else
          _value =
            resValue?.data[item.propertyItem?.code] || null;
        if (
          item.controlType == 'button' &&
          item.expressionDisplay != null &&
          item.expressionDisplay != ''
        )
          item.isShow = false;
        item.readOnly =
          this.formType == 'VIEW'
            ? true
            : item.readOnly || (await this.checkIsReadOnly(item));
        if (_value === null && cloneValue !== null && dataId === null) {
          _value =
            this.evalValue(
              cloneValue[item.propertyItem?.code],
              item.controlType
            ) ?? null;
        }

        if (
          _value === null &&
          item.defaultValue !== undefined &&
          item.defaultValue !== null &&
          item.defaultValue !== '' &&
          item.defaultValue?.indexOf('current_user.') > -1
        ) {
          if (
            item.defaultValue?.indexOf('current_user.companyCode') > -1 &&
            this.currentUser.companyCodeExt &&
            this.currentUser.companyCodeExt.length > 0
          ) {
            _value = this.currentUser.companyCodeExt[0];
          } else
            _value =
              this.currentUser[item.defaultValue.replace('current_user.', '')];
        }

        if (
          _value === null &&
          item.defaultValue !== undefined &&
          item.defaultValue !== null &&
          item.defaultValue !== '' &&
          dataId === null &&
          item.defaultValue.indexOf('copyfrom:') < 0 &&
          item.defaultValue?.indexOf('current_user.') < 0
        ) {
          _value = this.evalValue(item.defaultValue, item.controlType);
        }

        if (_value === null && initValue != null && dataId === null) {
          _value = this.evalValue(
            initValue[item.propertyItem?.code],
            item.controlType
          );
        }
        item.isRequired = this.hasRequire(item.expressionValidate);
        const controlName =
          item.propertyItem?.code && item.propertyItem.code !== ''
            ? item.propertyItem.code
            : item.code;
        const control = this.fb.control(
          {
            value: this.formatData(
              _value,
              item.propertyItem?.typeData,
              item.controlType
            ),
            disabled: item.readOnly === true,
          },
          this.getValidator(item),
          this.getValidatorAsync(item)
        );
        this.form.addControl(controlName, control);
      })
    );

    this.forms.push(...arrControls);
    this.cdr.detectChanges();
    this.loadFormSubject.next(false);

    for (let item of this.forms.filter(
      (f: any) =>
        f.expressionData !== undefined &&
        f.expressionData !== null &&
        f.expressionData !== '' &&
        f.controlType == 'data' &&
        this.value
    )) {
      if (
        !(
          item.referenceCode == null ||
          item.referenceCode == undefined ||
          item.referenceCode == ''
        )
      ) {
        const conditions: any = [];
        if (
          item &&
          item.expressionData &&
          item.expressionData !== '' &&
          item.expressionData.indexOf('"typeData":"CONDITION"') !== -1
        ) {
          let jexpression = cloneDeep(JSON.parse(item.expressionData));
          if (Array.isArray(jexpression)) {
            jexpression = jexpression.find((c) => c.typeData == 'CONDITION');
          }
          this.buildConditionFilter(jexpression.data, this.valueTransform);
          conditions.push(jexpression.data);
        }
        const res = await firstValueFrom(
          this.infoDataService.getList({
            groupCode: item.referenceCode,
            conditions: conditions !== null ? conditions : null,
            skip: 0,
            take: 100,
          })
        );
        //Xử lý nâng cao trước nếu có config
        let result: any = res.data?.list;
        let expressionJsonata = cloneDeep(JSON.parse(item.expressionData));
        if (Array.isArray(expressionJsonata)) {
          expressionJsonata = expressionJsonata.find(
            (c) => c.typeData == 'JSONATA'
          );
        }
        let _expression: any = expressionJsonata?.data?.transform;
        if (_expression != null && _expression != '') {
          result = await jsonata(_expression).evaluate(result);
        }
        const controlName =
          item.propertyItem === undefined ||
          item.propertyItem === null ||
          item.propertyItem?.code === ''
            ? item.code
            : item.propertyItem.code;
        const control = this.form.get(controlName);
        if (control) {
          control.setValue(result);
        }
      }
    }

    for (let item of this.forms.filter(
      (f: any) => !f.isTableControl || f.isTableControl == null
    )) {
      if (item.expressionDisplay != null && item.expressionDisplay != '')
        await this.runDisplayControl(item);
      if (
        item.defaultValue !== undefined &&
        item.defaultValue !== null &&
        item.defaultValue !== '' &&
        dataId !== null &&
        item.defaultValue.indexOf('copyfrom:') > -1 &&
        item.isShow
      ) {
        const value = this.value[item.defaultValue.replace('copyfrom:', '')];
        const controlName =
          item.propertyItem === undefined ||
          item.propertyItem === null ||
          item.propertyItem?.code === ''
            ? item.code
            : item.propertyItem.code;
        const curValue = this.value[controlName];
        const control = this.form.get(controlName);
        if (control && curValue == null) {
          control.setValue(value);
        }
      }

      if (item.controlType === 'numberAuto' && dataId == null) {
        const value = await this.autoIncrease(item);
        const controlName =
          item.propertyItem === undefined ||
          item.propertyItem === null ||
          item.propertyItem?.code === ''
            ? item.code
            : item.propertyItem.code;
        const control = this.form.get(controlName);
        if (control) {
          control.setValue(value);
        }
      }
    }

    for (let item of this.forms.filter(
      (f: any) =>
        f.expressionData !== undefined &&
        f.expressionData !== null &&
        f.expressionData !== '' &&
        f.controlType != 'data'
    ))
      await this.runExpressionData(item, true);

    if (!(this.formType == 'VIEW')) {
      for (let o of this.forms.filter(
        (f: any) =>
          f.expressionReadonly !== undefined &&
          f.expressionReadonly !== null &&
          f.expressionReadonly !== ''
      )) {
        await this.runExpressionReadOnly(o);
      }
    }
  }

  formatData(value: any, typeData: any, controlType: any) {
    if (typeData === 'string' && controlType !== 'year' && value)
      return String(value);
    if (typeData === 'number' && value) return Number(value);
    if (typeData === 'bool' && value)
      return (value === true || value === 'True' || value === 'true') ?? false;
    return value;
  }

  refreshForm(data: any = null) {
    this.parentData = data.parentData;
    this.formType = data.formType;
    if (Object.keys(this.form.controls).length === 0) {
      setTimeout(() => this.refreshForm(data), 50);
      return;
    }
    this.loadForm(data.dataId, data.initValue);
  }
  checkUserRole(role: any) {
    return this.currentUser.roleCodes.includes(role.toUpperCase());
  }
  evalValue(value: any, controlType: any) {
    try {
      if (value == null || value == undefined) return null;
      //     return value;
      // if (value.indexOf('@parentData') > -1)
      //     value = value.replace("@parentData", "this.parentData")
      const result = value.replace(/\{([^{}]+)\}/g, (match: any, key: any) => {
        // Replace
        if (key.includes('PARENT:')) {
          const propertyCode = key.split(':')[1];
          const parent = this.parentData[propertyCode];
          return controlType.indexOf('number') > -1 ? parent : parent ?? '';
        } else if (key.includes('USER:')) {
          const propertyCode = key.split(':')[1];
          return this.currentUser[propertyCode];
        } else {
          const value = this.convertDatesToStrings(this.value);
          const parent = value[key];
          return controlType.indexOf('number') > -1
            ? parent
            : (controlType.indexOf('multiSelect') > -1
                ? JSON.stringify(parent)
                : parent) ?? '';
        }
      });
      if (result == 'null' || result == 'undefined') return null;
      if (
        controlType.indexOf('text') > -1 ||
        controlType.indexOf('select') > -1 ||
        controlType.indexOf('multiSelect') > -1 ||
        controlType.indexOf('radio') > -1 ||
        (result?.indexOf('new Date()') < 0 && controlType.indexOf('date') > -1)
      )
        return result;
      return evaluateExpression(result);
    } catch (e) {
      //console.log(e)
    }
    return value;
  }

  btnClick(item: any) {
    if (item?.message)
      this.confirmationService.confirm({
        //target: event.target as EventTarget,
        message: `${item?.message}`,
        header: 'Xác nhận',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        acceptLabel: `Thực hiện`,
        rejectIcon: 'none',
        rejectLabel: 'Đóng',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          for (const action of JSON.parse(item.action).rules.filter(
            (c: any) => c.action != 'POST_ACTION'
          ))
            this.events.emit({
              action: action,
              control: item,
              forms: this.forms,
              value: this.value,
              parentData: this.parentData,
              groupId: this.passGroupId,
            });
        },
      });
    else
      for (const action of JSON.parse(item.action).rules.filter(
        (c: any) => c.action != 'POST_ACTION'
      ))
        this.events.emit({
          action: action,
          control: item,
          forms: this.forms,
          value: this.valueTransform,
          parentData: this.parentData,
          groupId: this.passGroupId,
        });
  }

  reset(control: any) {
    this.form.reset();
  }

  submit(actionData: any) {
    this.submitSend(actionData);
    // this.confirmationService.confirm({
    //   //target: event.target as EventTarget,
    //   message: `Bạn muốn thực hiện thao tác?`,
    //   header: 'Xác nhận',
    //   icon: 'pi pi-exclamation-triangle',
    //   acceptIcon: 'none',
    //   acceptLabel: `Thực hiện`,
    //   rejectIcon: 'none',
    //   rejectLabel: 'Đóng',
    //   rejectButtonStyleClass: 'p-button-text',
    //   accept: () => {
    //     this.submitSend(actionData);
    //   },
    // });
  }
  setOffIsShowChild(lstControl: any, item: any) {
    lstControl
      .filter((t: any) => t.parentId === item.id)
      .forEach((o: any) => {
        o.isShow = false;
        this.setOffValidControl(o);
        this.setOffIsShowChild(lstControl, o);
      });
  }
  async formValid(actionData: any) {
    const lstNoShow = this.forms.filter((t: any) => !t.isShow);
    lstNoShow.forEach((item) => {
      this.setOffValidControl(item);
      this.setOffIsShowChild(this.forms, item);
    });
    if (this.form.invalid) {
      Object.entries(this.form.controls).forEach((entry) =>
        entry[1].markAsTouched()
      );
      const invalidControlNames = Object.entries(this.form.controls)
        .filter(([name, control]) => control.status === 'INVALID')
        .map(([name, control]) => ({
          name,
          errors: control.errors,
        }));
      console.log('invalidControlNames', invalidControlNames);
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng nhập đúng các trường thông tin',
        life: 3000,
      });
      return false;
    }
    if (
      actionData &&
      actionData.control &&
      actionData.control &&
      actionData.control.expressionValidate &&
      actionData.control.expressionValidate != ''
    ) {
      try {
        const expressionValidate =
          JSON.parse(actionData.control.expressionValidate)?.find(
            (c: any) => c.enable && c.code === 'expression'
          ) || {};
        if (expressionValidate.value) {
          const expr = jsonata(expressionValidate.value);
          const result = await expr.evaluate(this.valueTransform);
          if (result.length > 0) {
            this.messageService.add({
              severity: 'warn',
              summary: 'Thông báo',
              detail: result,
              life: 3000,
            });
            return false;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    return true;
  }
  showIsloading(isShow: boolean) {
    this.isOnSubmit = isShow;
    this.cdr.detectChanges();
  }
  async submitSend(actionData: any) {
    if (this.isOnSubmit) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Đang gửi thông tin',
        life: 3000,
      });
      return;
    }
    this.showIsloading(true);

    if (!(await this.formValid(actionData))) {
      this.showIsloading(false);
      return;
    }
    let properties: any = this.value;
    if (actionData.action && actionData.action.rules)
      for (const rule of actionData.action.rules) {
        if (rule.target && rule.data && rule.action === 'UPDATE_FIELD') {
          properties[rule.target] =
            rule.event == 'FIELD_VALUE'
              ? rule.data
              : this.evalValue(rule.data, '');
        }
      }

    const expCond = this.getExpressionData(
      'CONDITION',
      actionData.control?.expressionData
    );
    if (expCond !== null) {
      for (const exp of expCond.rules) {
        if (
          exp.data !== undefined &&
          exp.data !== null &&
          exp.data.indexOf('field:') > -1 &&
          this.form.controls[exp.field].value !==
            this.form.controls[exp.data.split('field:')[1]].value
        ) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Thông báo',
            detail: actionData.control.message,
            life: 3000,
          });
          this.showIsloading(false);
          return;
        }
      }
    }
    const res = await firstValueFrom(
      this.infoDataService.saveData({
        id: this.dataId,
        parentId: this.parentId,
        identifyId: this.parentId ? null : this.identifyId,
        layoutCode: this.layoutCode,
        properties: properties,
        control: actionData.control,
        dataTime: this.dateupdated
      })
    );

    if (res.statusCode !== ResponseCode.ZERO) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: res.message,
        life: 3000,
      });
      this.showIsloading(false);
      return;
    }
    //thêm cho trường hợp update pass layout;
    for (const r of actionData.action.rules.filter(
      (r: any) => r.action === 'POST_ACTION' && r.event === 'FORM_UPDATE_FIELD'
    )) {
      actionData.data =
        actionData.data ?? actionData.value ?? this.valueTransform;
      const fields: any = {};
      if (actionData.data && actionData.data[r.data] && r.target) {
        for (const r2 of r.rules) {
          if (r2.data != null && r2.data.indexOf('PARENT:') > -1)
            fields[r2.target] =
              r2.event == 'FIELD_VALUE'
                ? r2.data
                : actionData.data.parentData[r2.data.replace('PARENT:', '')];
          else
            fields[r2.target] =
              r2.event == 'FIELD_VALUE' ? r2.data : actionData.data[r2.data];
        }
        const res = await firstValueFrom(
          this.infoDataService.saveData({
            id: actionData.data[r.data],
            layoutCode: r.target,
            properties: fields,
          })
        );
      }
    }
    //thêm cho trường hợp update line pass layout;
    for (const r of actionData.action.rules.filter(
      (r: any) =>
        r.action === 'POST_ACTION' && r.event === 'FORM_UPDATE_LINE_FIELD'
    )) {
      if (r.target == null || r.target == '') continue;

      const filterParams: any = {
        groupCode: r.data,
        parentId: this.dataId,
        skip: 0,
        take: 100,
      };

      const res = await firstValueFrom(
        this.infoDataService.getList(filterParams)
      );

      if (!(res && res.data && res.data.list && res.data.list.length > 0))
        continue;

      for (const item of res.data.list) {
        const fields: any = {};
        for (const r2 of r.rules) {
          fields[r2.target] =
            r2.event == 'FIELD_VALUE' ? r2.data : this.valueTransform[r2.data];
        }
        const res1 = await firstValueFrom(
          this.infoDataService.saveData({
            id: item.id,
            layoutCode: r.target,
            properties: fields,
          })
        );
      }
    }

    this.showIsloading(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Thông báo',
      detail: res.message,
      life: 3000,
    });
    for (const action of actionData.action.rules.filter(
      (r: any) => r.action === 'FORM_ON_SUBMIT'
    ))
      this.events.emit({
        action: action,
        dataId: this.dataId || res.data,
        value: action.event == 'FORM_SET_VALUE' ? this.valueTransform : null,
      });
  }
  hasOperatorChars(input: string): boolean {
    // Bao gồm: + - * / % = < >
    const regex = /[+\-*/%<>=]/;
    return regex.test(input);
  }
  buildConditionFilter(f: any, value: any) {
    value = this.convertDatesToStrings(value);
    f.rules.forEach((c: any) => {
      if (c.value) {
        if (value[c.value]) {
          c.value = value[c.value];
        } else {
          const evaluatedFormula = c.value.replace(
            /\b[a-zA-Z_]\w*\b/g,
            (match: any) => {
              return value.hasOwnProperty(match) ? value[match] : match;
            }
          );
          try {
            c.value =
              this.hasOperatorChars(evaluatedFormula) ||
              evaluatedFormula == 'null' ||
              evaluatedFormula == 'undefined' ||
              evaluatedFormula.indexOf('new Date()') > -1
                ? evaluateExpression(evaluatedFormula)
                : evaluatedFormula;
          } catch (ex) {
            c.value = evaluatedFormula;
          }
        }
      }
      if (c.rules) {
        this.buildConditionFilter(c, value);
      }
    });
    f.rules = f.rules.filter((v: any) => {
      return v.value != null || (v.rules && v.rules.length > 0);
    });
  }
  async clone(dataAction: any) {
    if (this.isOnSubmit) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Đang gửi thông tin',
        life: 3000,
      });
      return;
    }
    this.showIsloading(true);
    //let cloneValue: any = {};
    let properties: any = {};
    for (const preAction of dataAction.action.rules.filter(
      (i: any) => i.action === 'PRE_ACTION'
    )) {
      preAction.rules
        .filter((i: any) => i.action === 'UPDATE_FIELD')
        .forEach((i: any) => {
          const item = this.forms.find(
            (v) =>
              v.propertyItem.code === i.target ||
              (v.propertyItem.code === '' && v.code === i.target)
          );
          properties[i.target] =
            i.event === 'MAP_FIELD_TO'
              ? this.evalValue(i.data, item?.controlType ?? null)
              : i.data;
        });
    }
    // for (const postAction of dataAction.action.rules.filter((i: any) => i.action === 'POST_ACTION')) {
    //     postAction.rules.filter((i: any) => i.action === 'UPDATE_FIELD').forEach((i: any) => postProperties[i.target] = (i.event === 'MAP_FIELD_TO' ? eval(i.data) : i.data));
    // }
    let data: any = {
      id: this.dataId,
      properties: properties,
      type: dataAction.action.data,
      layoutCode: this.layoutCode,
    };
    const res = await firstValueFrom(this.infoDataService.clone(data));

    if (data.type == 'ALL') {
      if (res.statusCode === ResponseCode.ZERO) {
        while (true) {
          const res1 = await firstValueFrom(
            this.infoDataService.backgroundStatus({ id: res.data.jobId })
          );
          if (res1.data.statusCode === ResponseCode.ZERO) {
            for (const action of dataAction.action.rules.filter(
              (c: any) => c.action != 'POST_ACTION'
            ))
              this.events.emit({
                action: action,
                dataId: res.data.id,
              });
            this.showIsloading(false);
            break;
          }
          if (res1.data.statusCode === ResponseCode.TWO) {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: 'Có lỗi xảy ra, vui lòng thử lại !',
              life: 3000,
            });
            this.showIsloading(false);
            break;
          }
          // đợi 3s rồi check lại
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: res.message,
          life: 3000,
        });
      }
    } else {
      for (const action of dataAction.action.rules.filter(
        (c: any) => c.action != 'POST_ACTION'
      ))
        this.events.emit({
          action: action,
          dataId: res.data.id,
        });
      this.showIsloading(false);
    }
  }
  async validateFieldNotNull(dataAction: any, _validRule: any) {
    const conditions = {
      condition: 'or',
      rules: [] as { field: string; operator: string; value: string }[],
    };
    const fields = _validRule.fields
      .split(',')
      .map((x: any) => x.trim().toLowerCase());
    fields.forEach((field: any) => {
      conditions.rules.push({ field: field, operator: 'is null', value: '' });
      conditions.rules.push({ field: field, operator: '==', value: '' });
    });
    const filterParams: any = {
      groupCode: _validRule.groupCode,
      parentId: this.dataId,
      conditions: [conditions],
    };
    const res = await firstValueFrom(
      this.infoDataService.getCount(filterParams)
    );
    if (res.data.result > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo',
        detail: _validRule.falsemsg,
        life: 3000,
      });
      return false;
    }
    // for (const action of dataAction.action.rules.filter(
    //   (c: any) => c.action != 'POST_ACTION'
    // ))
    //   this.events.emit({
    //     action: action,
    //     initValue: this.value,
    //     control: dataAction.control,
    //     value: this.valueTransform,
    //   });
    return true;
  }

  async validateWithCondition(dataAction: any) {
    const _validRule = JSON.parse(dataAction.action.data);
    this.filterConditions.splice(0, this.filterConditions.length);
    if (
      !_validRule.where &&
      dataAction.control &&
      dataAction.control.expressionData &&
      dataAction.control.expressionData !== '' &&
      dataAction.control.expressionData.indexOf('"typeData":"CONDITION"') !== -1
    ) {
      let jexpression = cloneDeep(
        JSON.parse(dataAction.control.expressionData)
      );
      if (Array.isArray(jexpression)) {
        jexpression = jexpression.filter((c) => c.typeData == 'CONDITION')[0];
      }
      this.buildConditionFilter(jexpression.data, this.valueTransform);
      this.filterConditions.push(jexpression.data);
    }
    //xử lý điều kiện truyền từ ngoài vào
    if (_validRule.where) {
      let jexpressionData = _validRule.where;
      this.buildConditionFilter(jexpressionData, this.valueTransform);
      this.filterConditions.push(jexpressionData);
    }

    const filterParams: any = {
      conditions: this.filterConditions,
    };
    for (const dk of _validRule.condition) {
      filterParams[dk.field] = dk.value;
    }
    const res = await firstValueFrom(
      this.infoDataService.getCount(filterParams)
    );

    if (_validRule.rule === 'NOT_EXISTS' && res.data.result > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo',
        detail: _validRule.falsemsg,
        life: 3000,
      });
      return false;
    }
    if (_validRule.rule === 'EXISTS' && res.data.result == 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo',
        detail: _validRule.falsemsg,
        life: 3000,
      });
      return false;
    }
    return true;
  }

  async ValidateCustom(dataAction: any) {
    const res = await firstValueFrom(
      this.infoDataService.ValidateCustom(this.value)
    );
  }

  async validate(dataAction: any) {
    let _validRule: any;
    try {
      _validRule = JSON.parse(dataAction.action.data);
    } catch (e) {}
    if (
      _validRule == null ||
      (_validRule &&
        _validRule.rule &&
        _validRule.rule.indexOf('NOT_VALID') < 0)
    ) {
      if (!(await this.formValid(dataAction))) return;
    }

    if (_validRule != null) {
      _validRule.rule = _validRule.rule.replace('_NOT_VALID', '');
      if (
        _validRule.rule == 'FIELD_NOT_NULL' &&
        _validRule.groupCode &&
        _validRule.fields
      ) {
        if (!(await this.validateFieldNotNull(dataAction, _validRule))) return;
        for (const action of dataAction.action.rules.filter(
          (c: any) => c.action != 'POST_ACTION'
        ))
          this.events.emit({
            action: action,
            initValue: this.value,
            control: dataAction.control,
            value: this.valueTransform,
          });
        return;
      } else if (_validRule.rule.includes('VALID_CUSTOM')) {
        var value = this.value;
        value['groupId'] = this.groupId;
        const res = await firstValueFrom(
          this.infoDataService.ValidateCustom(value)
        );
        if (res.statusCode !== ResponseCode.ZERO) {
          if (res.data.typeValid == 'WARNING') {
            this.confirmationService.confirm({
              //target: event.target as EventTarget,
              message: `${res.data.messageValid}`,
              header: 'Xác nhận',
              icon: 'pi pi-exclamation-triangle',
              acceptIcon: 'none',
              acceptLabel: `Thực hiện`,
              rejectIcon: 'none',
              rejectLabel: 'Đóng',
              rejectButtonStyleClass: 'p-button-text',
              accept: () => {
                for (const action of dataAction.action.rules.filter(
                  (c: any) => c.action != 'POST_ACTION'
                ))
                  this.events.emit({
                    action: action,
                    initValue: this.value,
                    control: dataAction.control,
                    value: this.valueTransform,
                  });
              },
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: `${res.data.messageValid}`,
              life: 3000,
            });
          }
          return;
        }
      } else {
        const dataActionString = JSON.stringify(dataAction);
        if (
          !dataActionString.includes('FORM_SUBMIT') &&
          !dataActionString.includes('FORM_UPDATE_FIELD')
        )
          if (!(await this.validateWithCondition(dataAction))) return;
        for (const action of dataAction.action.rules.filter(
          (c: any) => c.action != 'POST_ACTION'
        ))
          this.events.emit({
            action: action,
            initValue: this.value,
            control: dataAction.control,
            value: this.valueTransform,
          });
        return;
      }
    }

    for (const action of dataAction.action.rules.filter(
      (c: any) => c.action != 'POST_ACTION'
    ))
      this.events.emit({
        action: action,
        initValue: this.value,
        control: dataAction.control,
        value: this.valueTransform,
      });
  }

  async autoIncrease(item: any) {
    this.filterConditions.splice(0, this.filterConditions.length);

    if (
      item &&
      item.expressionData &&
      item.expressionData !== '' &&
      item.expressionData.indexOf('"typeData":"CONDITION"') !== -1
    ) {
      let _conditions = cloneDeep(JSON.parse(item.expressionData).data);
      this.buildConditionFilter(_conditions, this.valueTransform);
      this.filterConditions.push(_conditions);
    }
    const filterParams: any = {
      groupId: item.layoutItem?.groupId,
      parentId: this.parentId,
      conditions: this.filterConditions,
      createdBy: this.parentId ? null : this.identifyId,
    };
    const res = await firstValueFrom(
      this.infoDataService.getCount(filterParams)
    );
    if (res.data && res.data.result > 0) {
      return Number(res.data.result) + 1;
    }
    return 1;
  }

  async updateField(dataAction: any) {
    if (this.isOnSubmit) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Đang gửi thông tin',
        life: 3000,
      });
      return;
    }
    this.showIsloading(true);
    const properties: any = {};
    dataAction.action.rules
      .filter((i: any) => i.action === 'UPDATE_FIELD')
      .forEach((i: any) => {
        properties[i.target] =
          i.event == 'FIELD_VALUE' ? i.data : this.evalValue(i.data, '');
      });
    await this.updateFieldSubmit(dataAction, properties);
    // if (dataAction.action.data != null) {
    //   await this.updateFieldSubmit(dataAction, properties);
    //   return;
    // }
    // this.confirmationService.confirm({
    //   //target: event.target as EventTarget,
    //   message: `Bạn muốn cập nhật thông tin?`,
    //   header: 'Xác nhận',
    //   icon: 'pi pi-exclamation-triangle',
    //   acceptIcon: 'none',
    //   acceptLabel: `Lưu thông tin`,
    //   rejectIcon: 'none',
    //   rejectLabel: 'Đóng',
    //   rejectButtonStyleClass: 'p-button-text',
    //   accept: async () => {
    //     await this.updateFieldSubmit(dataAction, properties);
    //   },
    // });
  }

  async updateFieldSubmit(dataAction: any, properties: any) {
    const id =
      dataAction.action.data != null &&
      dataAction.action.data != '' &&
      dataAction.value
        ? dataAction.value[dataAction.action.data] ?? this.dataId
        : this.dataId;
    const res = await firstValueFrom(
      this.infoDataService.saveData({
        id: id,
        layoutCode: this.layoutCode,
        properties: properties,
        dataTime: this.dateupdated
      })
    );
    //thêm cho trường hợp update pass layout;
    for (const r of dataAction.action.rules.filter(
      (r: any) => r.action === 'POST_ACTION' && r.event === 'FORM_UPDATE_FIELD'
    )) {
      dataAction.data =
        dataAction.data ?? dataAction.value ?? this.valueTransform;
      const fields: any = {};
      if (dataAction.data && dataAction.data[r.data] && r.target) {
        for (const r2 of r.rules) {
          if (r2.data != null && r2.data.indexOf('PARENT:') > -1)
            fields[r2.target] =
              r2.event == 'FIELD_VALUE'
                ? r2.data
                : dataAction.data.parentData[r2.data.replace('PARENT:', '')];
          else
            fields[r2.target] =
              r2.event == 'FIELD_VALUE' ? r2.data : dataAction.data[r2.data];
        }
        const res = await firstValueFrom(
          this.infoDataService.saveData({
            id: dataAction.data[r.data],
            layoutCode: r.target,
            properties: fields,
          })
        );
      }
    }

    //thêm cho trường hợp update line pass layout;
    for (const r of dataAction.action.rules.filter(
      (r: any) =>
        r.action === 'POST_ACTION' && r.event === 'FORM_UPDATE_LINE_FIELD'
    )) {
      if (r.target == null || r.target == '') continue;

      const filterParams: any = {
        groupCode: r.data,
        parentId: this.dataId,
        skip: 0,
        take: 100,
      };

      const res = await firstValueFrom(
        this.infoDataService.getList(filterParams)
      );

      if (!(res && res.data && res.data.list && res.data.list.length > 0))
        continue;

      for (const item of res.data.list) {
        const fields: any = {};
        for (const r2 of r.rules) {
          fields[r2.target] =
            r2.event == 'FIELD_VALUE' ? r2.data : this.valueTransform[r2.data];
        }
        const res1 = await firstValueFrom(
          this.infoDataService.saveData({
            id: item.id,
            layoutCode: r.target,
            properties: fields,
          })
        );
      }
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Thông báo',
      detail: res.message,
      life: 3000,
    });

    dataAction.action.rules
      .filter((i: any) => i.action === 'FORM_ON_SUBMIT')
      .forEach((i: any) =>
        this.events.emit({
          action: i,
          dataId: this.dataId,
          value: i.event == 'FORM_SET_VALUE' ? this.valueTransform : null,
        })
      );
    this.showIsloading(false);
  }

  setValueControl(dataAction: any) {
    if (this.form.controls[dataAction.action.data] !== undefined) {
      var item = this.forms.find(
        (t) => t.propertyItem.code == dataAction.action.data
      );
      if (
        dataAction.action.rules !== null &&
        dataAction.action.rules.length > 0
      ) {
        let value =
          dataAction.action.rules[0].event === 'FIELD_VALUE'
            ? dataAction.action.rules[0].data
            : dataAction.value != null &&
              dataAction.value[dataAction.action.rules[0].data]
            ? dataAction.value[dataAction.action.rules[0].data]
            : null;
        if (value === 'null' || value === 'undefined') {
          value = null;
        }
        this.setFieldValue(
          dataAction.action.data,
          value,
          item?.propertyItem.typeData
        );
      } else {
        this.setFieldValue(
          dataAction.action.data,
          dataAction.value,
          item?.propertyItem.typeData
        );
      }
    }
  }

  bindValueControl(dataAction: any) {
    if (dataAction.value == null || dataAction.value == undefined)
      dataAction.value = {};

    for (const rule of dataAction.action.rules) {
      var item = this.forms.find((t) => t.propertyItem.code == rule.data);
      this.setFieldValue(
        rule.data,
        dataAction.value[rule.target],
        item?.propertyItem.typeData
      );
    }
  }

  // async sendTableFilter(dataAction: any) {

  //     await firstValueFrom(this.loadFormSubject.pipe(filter(a => !a), take(1)));

  //     const _value: any = {};
  //     _value[dataAction.action.rules[0].rules[0].target] = this.form.value[dataAction.action.rules[0].rules[0].data];
  //     this.events.emit({
  //         action: dataAction.action.rules[0],
  //         value: _value
  //     });
  // }
  async collectionData(dataAction: any) {
    if (this.isOnSubmit) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Đang gửi thông tin',
        life: 3000,
      });
      return;
    }
    this.showIsloading(true);
    if (!(await this.formValid(dataAction))) {
      this.showIsloading(false);
      return;
    }
    if (dataAction.action.data && dataAction.action.data !== '') {
      await this.collection(dataAction);
    } else {
      await this.collectionPB(dataAction);
    }
  }

  async collectionPB(dataAction: any) {
    let properties: any = this.value;

    if (dataAction.action && dataAction.action.rules)
      for (const rule of dataAction.action.rules) {
        if (rule.target && rule.data && rule.action === 'UPDATE_FIELD') {
          properties[rule.target] = rule.data;
        }
      }

    const res = await firstValueFrom(
      this.infoDataService.saveData({
        id: this.dataId,
        parentId: this.parentId,
        identifyId: this.identifyId,
        layoutCode: this.layoutCode,
        properties: properties,
      })
    );

    if (res.statusCode !== ResponseCode.ZERO) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: res.message,
        life: 3000,
      });
      this.showIsloading(false);
      return;
    }
    this.dataId = this.dataId || res.data;
    this.filterConditions.splice(0, this.filterConditions.length);

    if (
      dataAction.control &&
      dataAction.control.expressionData &&
      dataAction.control.expressionData !== '' &&
      dataAction.control.expressionData.indexOf('"typeData":"CONDITION"') !== -1
    ) {
      let jexpression = cloneDeep(
        JSON.parse(dataAction.control.expressionData)
      );
      if (Array.isArray(jexpression)) {
        jexpression = jexpression[0];
      }
      this.buildConditionFilter(jexpression.data, this.value);
      this.filterConditions.push(jexpression.data);
    }
    let preDataUpd: any = {};
    for (const action of dataAction.action.rules.filter(
      (i: any) => i.action === 'PRE_ACTION'
    )) {
      action.rules
        .filter((i: any) => i.action === 'UPDATE_FIELD')
        .forEach(
          (i: any) =>
            (preDataUpd[i.target] =
              i.event === 'MAP_FIELD_TO' ? evaluateExpression(i.data) : i.data)
        );
    }
    let postDataUpd: any = {};
    for (const action of dataAction.action.rules.filter(
      (i: any) => i.action === 'POST_ACTION'
    )) {
      action.rules
        .filter((i: any) => i.action === 'UPDATE_FIELD')
        .forEach(
          (i: any) =>
            (postDataUpd[i.target] =
              i.event === 'MAP_FIELD_TO' ? evaluateExpression(i.data) : i.data)
        );
    }

    let data: any = {
      id: this.dataId,
      groupCode: dataAction.action.data,
      conditions: this.filterConditions,
      preDataUpd: preDataUpd,
      postDataUpd: postDataUpd,
    };
    const res1 = await firstValueFrom(this.infoDataService.collection(data));
    for (const action of dataAction.action.rules.filter(
      (c: any) => c.action != 'POST_ACTION'
    ))
      this.events.emit({
        action: action,
        dataId: this.dataId || res.data,
      });
    this.showIsloading(false);
  }

  async collection(dataAction: any) {
    let data: any = {
      id: this.parentId ?? this.dataId,
      data: dataAction.action.data,
    };
    const res = await firstValueFrom(this.infoDataService.summaryData(data));
    const startTime = Date.now();
    const maxDuration = 60000; // 1 phút

    while (Date.now() - startTime < maxDuration) {
      const res1 = await firstValueFrom(
        this.infoDataService.backgroundStatus({ id: res.data.jobId }),
      );

      if (res1.data.statusCode === ResponseCode.ZERO) {
        for (const action of dataAction.action.rules.filter(
          (c: any) => c.action !== 'POST_ACTION',
        )) {
          this.events.emit({
            action: action,
            dataId: this.dataId,
          });
        }
        this.showIsloading(false);
        return;
      }

      if (res1.data.statusCode === ResponseCode.TWO) {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: 'Có lỗi xảy ra, vui lòng thử lại !',
          life: 3000,
        });
        this.showIsloading(false);
        return;
      }

      // đợi 3s rồi check lại
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // ⏰ quá 1 phút
    this.messageService.add({
      severity: 'warn',
      summary: 'Thông báo',
      detail: 'Lượng dữ liệu cần xử lý lớn, hệ thống chuyển sang chế độ chạy ẩn!',
      life: 3000,
    });
    this.showIsloading(false);
  }

  async approveAll(dataAction: any) {
    if (this.isOnSubmit) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Đang gửi thông tin',
        life: 3000,
      });
      return;
    }
    this.showIsloading(true);
    if (!(await this.formValid(dataAction))) {
      this.showIsloading(false);
      return;
    }
    this.filterConditions.splice(0, this.filterConditions.length);

    if (
      dataAction.control &&
      dataAction.control.expressionData &&
      dataAction.control.expressionData !== '' &&
      dataAction.control.expressionData.indexOf('"typeData":"CONDITION"') !== -1
    ) {
      let jexpression = cloneDeep(
        JSON.parse(dataAction.control.expressionData)
      );
      if (Array.isArray(jexpression)) {
        jexpression = jexpression[0];
      }
      this.buildConditionFilter(jexpression.data, this.value);
      // const all = await firstValueFrom(
      //   this.infoDataService.getCount({
      //     groupId: dataAction.control.layoutItem?.groupId,
      //     conditions: JSON.stringify([jexpression.data]),
      //   })
      // );
      // if (all.data?.result == null || all.data?.result == 0) {
      //   this.messageService.add({
      //     severity: 'error',
      //     summary: 'Thông báo',
      //     detail: 'Không có kế hoạch để duyệt',
      //     life: 3000,
      //   });
      //   return;
      // }
      if (dataAction.action.data == null || dataAction.action.data == '') {
        this.showIsloading(false);
        return;
      }
      const res = await firstValueFrom(
        this.infoDataService.approveAll({
          groupId: dataAction.control.layoutItem?.groupId,
          conditions: [jexpression.data],
          groupChildCode: dataAction.action.data,
        })
      );
      this.messageService.add({
        severity: res.statusCode !== ResponseCode.ZERO ? 'error' : 'success',
        summary: 'Thông báo',
        detail: res.message,
        life: 3000,
      });
      if (res.statusCode == ResponseCode.ZERO)
        for (const action of dataAction.action.rules.filter(
          (c: any) => c.action != 'POST_ACTION'
        ))
          this.events.emit({
            action: action,
            value: this.valueTransform,
          });
      // jexpression.data.rules.push({
      //   field: 'trang_thai_new',
      //   operator: '==',
      //   value: '02',
      // });
      // const khdudkduyet = await firstValueFrom(
      //   this.infoDataService.getCount({
      //     groupId: dataAction.control.layoutItem?.groupId,
      //     conditions: JSON.stringify([jexpression.data]),
      //   })
      // );
      // if (all.data?.result > khdudkduyet.data?.result || khdudkduyet.data?.result == null) {
      //   this.messageService.add({
      //     severity: 'error',
      //     summary: 'Thông báo',
      //     detail: 'Tồn tại kế hoạch chưa chuyển tiếp',
      //     life: 3000,
      //   });
      //   return;
      // }

      // console.log('jexpression.res', khdudkduyet.data);
    }
    this.showIsloading(false);
  }

  async approvePB(dataAction: any) {
    if (this.isOnSubmit) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Đang gửi thông tin',
        life: 3000,
      });
      return;
    }
    this.showIsloading(true);
    if (!(await this.formValid(dataAction))) {
      this.showIsloading(false);
      return;
    }
    if (dataAction.action.data == null || dataAction.action.data == '') return;
    const res = await firstValueFrom(
      this.infoDataService.approvePB({
        id: this.dataId,
        layoutCode: dataAction.action.data,
      })
    );
    this.messageService.add({
      severity: res.statusCode !== ResponseCode.ZERO ? 'error' : 'success',
      summary: 'Thông báo',
      detail: res.message,
      life: 3000,
    });
    if (res.statusCode == ResponseCode.ZERO)
      for (const action of dataAction.action.rules.filter(
        (c: any) => c.action != 'POST_ACTION'
      ))
        this.events.emit({
          action: action,
          value: this.valueTransform,
          dataId: this.dataId || res.data,
        });
    this.showIsloading(false);
  }

  async executeReport(dataAction: any) {
    if (this.isOnSubmit) {
      this.messageService.add({
        severity: 'info',
        summary: 'Thông báo',
        detail: 'Đang gửi thông tin',
        life: 3000,
      });
      return;
    }
    this.showIsloading(true);
    let conditions: any = null;
    if (dataAction.control?.expressionData) {
      conditions = this.getExpressionData(
        'CONDITION',
        dataAction.control.expressionData
      );
    }
    if (conditions) this.buildConditionFilter(conditions, this.value);

    const res = await firstValueFrom(
      this.infoReportService.executeReport({
        reportCode: dataAction.action.data,
        conditions: conditions ? conditions : null,
        control: dataAction.control,
      })
    );

    if (res.statusCode === ResponseCode.ZERO) {
      while (true) {
        const res1 = await firstValueFrom(
          this.infoReportService.getStatusProcessReport({ id: res.data.jobId })
        );
        if (res1.data.statusCode === ResponseCode.ZERO) {
          this.infoReportService
            .donwloadReportFile({ filename: res.data.filename })
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
                  saveAs(res2.body!, res.data.filename);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Thông báo',
                    detail: 'Download thành công!',
                    life: 3000,
                  });
                }
                this.showIsloading(false);
              },
              error: (err) => {
                const backendMsg =
                  err.error?.message || 'Có lỗi xảy ra khi tải file';
                this.messageService.add({
                  severity: 'error',
                  summary: `Lỗi ${err.status}`,
                  detail: backendMsg,
                  life: 3000,
                });
                this.showIsloading(false);
              },
            });
          break;
        }
        if (res1.data.statusCode === ResponseCode.ZERO) {
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: 'Có lỗi xảy ra, vui lòng thử lại!',
            life: 3000,
          });
          this.showIsloading(false);
          break;
        }
        // đợi 3s rồi check lại
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo',
        detail: res.message,
        life: 3000,
      });
    }
    this.showIsloading(false);
  }

  async downloadFile(dataAction: any) {
    this.isOnSubmit = true;
    this.cdr.detectChanges();
    this.infoReportService
      .downloadTemplate({ filename: dataAction.action.data })
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
            saveAs(res2.body!, dataAction.action.data);
            this.messageService.add({
              severity: 'success',
              summary: 'Thông báo',
              detail: 'Download thành công!',
              life: 3000,
            });
          }
          this.isOnSubmit = false;
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
          this.isOnSubmit = false;
          this.cdr.detectChanges();
        },
      });
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  ngAfterViewInit() {
    this.controlTemplateMap = {
      card: this.cardControlTmpl,
      'card-header': this.cardHeaderControlTmpl,
      'card-body': this.cardBodyControlTmpl,
      'card-footer': this.cardFooterControlTmpl,
      container: this.containerControlTmpl,
      grid: this.gridControlTmpl,
      'grid-item': this.gridColControlTmpl,
      tab: this.tabControlTmpl,
      layout: this.layoutControlTmpl,
      table: this.tableControlTmpl,
      'table-filter': this.tableControlTmpl,
      modal: this.modalControlTmpl,
      'modal-content': this.modalContentControlTmpl,
      'modal-header': this.modalHeaderControlTmpl,
      'modal-body': this.modalBodyControlTmpl,
      'modal-footer': this.modalFooterControlTmpl,
      readonly: this.readonlyControlTmpl,
      plaintext: this.plaintextControlTmpl,
      value: this.valueControlTmpl,
      text: this.textControlTmpl,
      textarea: this.textareaControlTmpl,
      year: this.yearControlTmpl,
      number: this.numberControlTmpl,
      numberAuto: this.numberControlTmpl,
      decimal: this.decimalControlTmpl,
      currency: this.currencyControlTmpl,
      select: this.selectControlTmpl,
      multiSelect: this.selectControlTmpl,
      selectLazy: this.selectControlTmpl,
      datetime: this.dateControlTmpl,
      checkbox: this.checkboxControlTmpl,
      radio: this.radioControlTmpl,
      file: this.fileControlTmpl,
      'file-ecm': this.fileControlTmpl,
      button: this.buttonControlTmpl,
      menu: this.menuControlTmpl,
      separator: this.separatorControlTmpl,
      'button-history': this.dataActionControlTmpl,
    };
  }

  getTemplate(controlType: string): TemplateRef<any> {
    return this.controlTemplateMap[controlType] || null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (
      changes['parentData'] &&
      !isEqual(
        changes['parentData'].previousValue,
        changes['parentData'].currentValue
      )
    ) {
      for (let o of this.forms.filter(
        (f: any) =>
          f.expressionDisplay !== undefined &&
          f.expressionDisplay !== null &&
          f.expressionDisplay !== '' &&
          (f.isTableControl == null || !f.isTableControl)
      ))
        await this.runDisplayControl(o);
      for (let item of this.forms.filter(
        (f: any) =>
          f.expressionData !== undefined &&
          f.expressionData !== null &&
          f.expressionData !== ''
      )) {
        if (item.controlType != 'data') {
          this.runExpressionData(item, true);
        }
      }
    }
  }

  ngOnInit(): void {
    this.funcGetChild = this.getAllChildControl.bind(this);
    this.init();
    this.buildControls();
    this.subscriptions.push(
      this.events.event.subscribe((data: any) => {
        if (
          data === undefined ||
          data === null ||
          data.action === undefined ||
          data.action === null ||
          data.action.target !== this.layoutCode
        )
          return;

        if (data.action.event === 'FORM_VALIDATE') {
          this.validate(data);
          return;
        }

        if (data.action.event === 'FORM_SUBMIT') {
          this.submit(data);
          return;
        }

        if (data.action.event === 'FORM_RESET') {
          this.reset(data);
          return;
        }

        if (data.action.event === 'FORM_REFRESH') {
          this.refreshForm(data);
          return;
        }

        if (data.action.event === 'FORM_UPDATE_FIELD') {
          this.updateField(data);
          return;
        }
        if (data.action.event === 'FORM_SET_VALUE') {
          this.setValueControl(data);
          return;
        }

        if (data.action.event === 'FORM_BIND_VALUE') {
          this.bindValueControl(data);
          return;
        }

        if (data.action.event === 'FORM_CLONE') {
          this.clone(data);
          return;
        }

        if (data.action.event === 'FORM_COLLECTION') {
          this.collectionData(data);
          return;
        }
        if (data.action.event === 'FORM_APPROVE_ALL') {
          this.approveAll(data);
          return;
        }
        if (data.action.event === 'FORM_APPROVE_PB') {
          this.approvePB(data);
          return;
        }
        if (data.action.event === 'EXECUTE_REPORT') {
          this.executeReport(data);
          return;
        }
        if (data.action.event === 'DOWNLOAD_FILE') {
          this.downloadFile(data);
          return;
        }
      })
    );
  }
}
