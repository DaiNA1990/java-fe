import { filter } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  Output,
  EventEmitter,
} from '@angular/core';
import { InfoFormService } from '../../services/service';
import { InfoDataService } from '../../services/info-data-service';
import { firstValueFrom, Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { EventDataService } from '../../services/event-service';
import { cloneDeep } from 'lodash';
import { BaseFormPage } from '../base.form';
import { FileService } from '@appkkkh/modules/file/file/file.service';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { CategoryService } from '../../services/category-service';
import { evaluateExpression } from '../expression-utils';
import jsonata from 'jsonata';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-info-page-table',
  templateUrl: `./component.html`,
  providers: [
    InfoDataService,
    FileService,
    CategoryService,
    InfoFormService,
  ],
})
export class InfoPageTableComponent
  extends BaseFormPage
  implements OnInit, OnDestroy
{
  @Input() parentId: number | null;
  @Input() identifyId: string | null | undefined;
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  @Input() funcGetChild: Function;
  @Input() currentUser: any;
  @Input() parentData: any;
  @Input() formData: any;
  @Input() parentGroupId: number | null;

  columns: any[] = [];
  items: any[] = [];
  itemTotal: any = null;
  sortField: string;
  sortOrder: string;
  sumField: any[] = [];
  maxField: any[] = [];
  minField: any[] = [];
  lastRow: any = false;
  skip: number = 0;
  take: number = 10;
  cols: any;
  isOnSubmit: any = false;

  itemSelection: any[] = [];

  subscriptions: Subscription[] = [];

  filterConditions: any[] = [];

  constructor(
    public service: InfoFormService,
    public infoDataService: InfoDataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public categoryService: CategoryService,
    private fileService: FileService,
    private events: EventDataService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    super();
  }

  async loadCols() {
    let coLst = this.columns.sort((a, b) => a.displayOrder - b.displayOrder);

    coLst = await Promise.all(
      coLst.map(async (col: any) => {
        col.isFrozen = this.isFrozen(col);

        if (col.controlType != 'select') return col;
        let obj;

        try {
          obj =
            col.lookupData !== undefined && col.lookupData !== null
              ? JSON.parse(col.lookupData)
              : null;
        } catch (e) {
          console.log(e);
        }

        try {
          if (obj === undefined || obj === null)
            obj = evaluateExpression(col.lookupData);
        } catch (e) {
          console.log(e);
        }

        if (obj && Array.isArray(obj)) {
          col.optionLst = obj;
        }

        if (obj && obj.typeData === 'CUSTOM') {
          col.optionLst = obj.data;
        }

        if (obj && obj.typeData === 'REFERENCE') {
          col.optionLst = await this.getReferenceData(
            obj,
            col.expressionData,
            col,
          );
        }
        if (obj && obj.typeData === 'API') {
          col.optionLst = await this.getAPIData(obj, col.expressionData, col);
        }

        return col;
      }),
    );
    return coLst;
  }

  mapOperatorAPI(op: string): string {
    const map: Record<string, string> = {
      '==': 'equals',
      '=': 'equals',
      '!=': 'notEquals',
      '<': 'lt',
      '<=': 'lte',
      '>': 'gt',
      '>=': 'gte',
      contains: 'contains',
      'not contains': 'notContains',
      'starts with': 'startsWith',
      'ends with': 'endsWith',
      'is null': 'isNull',
      'is not null': 'isNotNull',
      'is empty': 'isEmpty',
      'is not empty': 'isNotEmpty',
      exists: 'exists',
      'not exists': 'notExists',
      in: 'in', // nếu backend dùng "exists" cho mảng
      'not in': 'notExists', // tương ứng "not in"
      'date is': 'dateIs',
      'date is not': 'dateIsNot',
      'date before': 'dateBefore',
      'date after': 'dateAfter',
      max: 'max', // nếu backend có xử lý
    };

    return map[op.trim().toLowerCase()] || op;
  }
  async getAPIData(
    lookupData: any,
    expressionData: any = null,
    col: any = null,
  ) {
    let filters: any = {};
    const itemLst: any = [];
    const objMap: any = {};

    const columnData = [
      ...new Set(
        this.items
          .map((item) => item[col.property?.code])
          .filter((x) => x !== null && x !== undefined),
      ),
    ];

    if (columnData.length <= 0) return itemLst;

    lookupData.data.list.forEach((elm: any) => (objMap[elm.name] = elm.value));
    if (expressionData !== null && expressionData !== '') {
      let jexpression = JSON.parse(expressionData);
      if (Array.isArray(jexpression) && jexpression.length > 0) {
        jexpression = jexpression.filter((s) => s.typeData == 'CONDITION')[0];
      }

      if (jexpression?.typeData === 'CONDITION') {
        jexpression.data.rules.forEach((c: any) => {
          filters[c.field] = {
            value: c.value,
            matchMode: this.mapOperatorAPI(c.operator),
          };
        });
      }
    }

    filters[objMap.value] = {
      value: columnData,
      matchMode: this.mapOperatorAPI('in'),
    };
    const res = await firstValueFrom(
      this.categoryService.onetAPI({
        skip: 0,
        take: this.take,
        api: lookupData.data.code,
        filters: filters,
      }),
    );

    res?.data?.result?.subset?.forEach((elm: any) => {
      if (elm[objMap.value] !== undefined && elm[objMap.value] !== null)
        itemLst.push({
          name:
            objMap.name
              ?.split('+')
              .map((s: any) => elm[s.trim()])
              .join(' - ') || '...',
          value:
            objMap.value
              ?.split('+')
              .map((s: any) => elm[s.trim()])
              .join(' - ') || '...',
          id: elm['id'],
        });
    });
    return itemLst;
  }

  async getReferenceData(
    lookupData: any,
    expressionData: any = null,
    col: any = null,
  ) {
    let conditions: any = null;
    const itemLst: any = [];
    if (expressionData !== null && expressionData !== '') {
      let jexpression = JSON.parse(expressionData);
      if (Array.isArray(jexpression)) {
        jexpression = jexpression.filter((c) => c.typeData == 'CONDITION')[0];
      }

      if (jexpression !== undefined && jexpression.typeData === 'CONDITION') {
        for (const elm of jexpression.data.rules) {
          if (elm.value.indexOf('@parentData') > -1)
            elm.value = this.parentData[elm.value.replace('@parentData.', '')];
        }

        conditions = jexpression.data;
      }
    }
    const objMap: any = {};

    lookupData.data.list.forEach((elm: any) => (objMap[elm.name] = elm.value));

    const columnData = [
      ...new Set(
        this.items
          .map((item) => item[col.property?.code])
          .filter((x) => x !== null && x !== undefined),
      ),
    ];

    if (columnData.length <= 0) return itemLst;
    if (conditions == null) conditions = { condition: 'and', rules: [] };
    let result: any = [];
    conditions.rules.push({
      field: objMap.value,
      operator: 'in',
      value: columnData,
    });
    const res = await firstValueFrom(
      this.infoDataService.getList({
        groupCode: lookupData.data.code,
        conditions: conditions !== null ? [conditions] : null,
        skip: 0,
        take: this.take,
      }),
    );
    result = res?.data?.list || [];

    result.forEach((elm: any) => {
      if (elm[objMap.value] !== undefined && elm[objMap.value] !== null)
        itemLst.push({
          name:
            objMap.name
              ?.split('+')
              .map((s: any) => elm[s])
              .join('-') || '...',
          value: elm[objMap.value],
          id: elm['id'],
        });
    });
    return itemLst;
  }

  getValueReadOnly(value: any, optionLst: any) {
    try {
      const _item = optionLst.find((elm: any) => elm.value == value);
      return _item?.name;
    } catch (ex) {
      console.log(ex);
    }
    return null;
  }

  checkIsDisplay(control: any, item: any) {
    if (!this.checkPermission(control.permission)) return false;
    let _script: any = '';
    if (
      control.expressionDisplay === undefined ||
      control.expressionDisplay === null ||
      control.expressionDisplay === ''
    )
      return true;

    try {
      _script = this.buildConditionUI(
        JSON.parse(control.expressionDisplay),
        item,
      );
      if (_script === '') return true;
      const result = evaluateExpression(_script);
      return result;
    } catch (e) {
      console.log(_script, e);
    }

    return false;
  }
  checkUserRole(role: any) {
    return this.currentUser.roleCodes.includes(role.toUpperCase());
  }
  checkValueInArr(value: any, arr: any) {
    try {
      const arrVal = JSON.parse(arr);
      return arrVal.includes(value);
    } catch (e) {
      console.log(`Error checkValueInArr:${arr}`);
    }
  }
  buildConditionUI(obj: any, item: any) {
    if (obj === undefined || obj === null || obj.rules.length === 0) return '';

    let query = '';

    const condition = obj.condition === 'or' ? 'or' : 'and';

    for (const rule of obj.rules) {
      rule.value =
        rule.value?.indexOf('@userName') > -1
          ? `\"${rule.value.replace('@userName', this.currentUser.userName)}\"`
          : rule.value;
      if (rule.condition === undefined) {
        if (rule.field.indexOf('@') > -1) {
          if ('@userName' === rule.field) {
            query +=
              (query !== '' ? ` ${condition} ` : '') +
              ` ${
                rule.operator == '=='
                  ? this.checkUserRole(rule.value.replace(/"/g, ''))
                  : !this.checkUserRole(rule.value.replace(/"/g, ''))
              } `;
          }
          if (rule.field.indexOf('@parentData') > -1)
            if (rule.operator == 'is null') {
              query +=
                (query !== '' ? ` ${condition} ` : '') +
                ` ${
                  this.parentData[rule.field.replace('@parentData.', '')] ==
                  null
                } `;
            } else if (rule.operator == 'is not null') {
              query +=
                (query !== '' ? ` ${condition} ` : '') +
                `${
                  this.parentData[rule.field.replace('@parentData.', '')] !=
                  null
                }`;
            } else if (rule.operator == 'in' || rule.operator == 'not in') {
              query +=
                (query !== '' ? ` ${condition} ` : '') +
                ` ${
                  rule.operator == 'in'
                    ? this.checkValueInArr(
                        this.parentData[rule.field.replace('@parentData.', '')],
                        rule.value,
                      )
                    : !this.checkValueInArr(
                        this.parentData[rule.field.replace('@parentData.', '')],
                        rule.value,
                      )
                } `;
            } else
              query +=
                (query !== '' ? ` ${condition} ` : '') +
                `"${this.parentData[rule.field.replace('@parentData.', '')]}" ${
                  rule.operator
                } ${rule.value}`;
          if ('@dataId' === rule.field)
            query +=
              (query !== '' ? ` ${condition} ` : '') +
              `${item['id']} ${rule.operator} ${rule.value}`;
        } else if (rule.operator == 'in' || rule.operator == 'not in') {
          query +=
            (query !== '' ? ` ${condition} ` : '') +
            ` ${
              rule.operator == 'in'
                ? this.checkValueInArr(item[rule.field], rule.value)
                : !this.checkValueInArr(item[rule.field], rule.value)
            } `;
        } else if (rule.operator == 'is null') {
          query +=
            (query !== '' ? ` ${condition} ` : '') +
            ` ${item[rule.field] == null || item[rule.field] == undefined || item[rule.field] == ''} `;
        } else if (rule.operator == 'is not null') {
          query +=
            (query !== '' ? ` ${condition} ` : '') +
            `${!(item[rule.field] == null || item[rule.field] == undefined || item[rule.field] == '')}`;
        } else
          query +=
            (query !== '' ? ` ${condition} ` : '') +
            `"${item[rule.field]}" ${rule.operator} ${rule.value}`;
      }
      if (rule.condition !== undefined)
        query +=
          (query !== '' ? ` ${condition} ` : '') +
          `(${this.buildConditionUI(rule, item)})`;
    }

    return query;
  }

  getParameterData() {
    this.itemSelection = [];
    this.formCtrl?.setValue(this.itemSelection);
    this.sumField = [];
    this.maxField = [];
    this.minField = [];
    this.lastRow = false;

    if (
      this.formItem.action !== null &&
      this.formItem.action.indexOf('TABLE_ON_LOAD') > -1
    ) {
      const jdata = JSON.parse(this.formItem.action);
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_SUM')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            this.sumField.push(f.data);
          });
        });
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_MAX')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            this.maxField.push(f.data);
          });
        });
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_MIN')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            this.minField.push(f.data);
          });
        });
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_LAST_ROW')
        .forEach((c: any) => {
          this.lastRow = true;
        });
    }

    const filterParams = {
      groupId: this.formItem.layout.groupId,
      createdBy:
        this.parentId === null &&
        !(this.formItem.controlType === 'table-filter')
          ? this.identifyId
          : null,
      parentId: !(this.formItem.controlType === 'table-filter')
          ? this.parentId
          : null,
      conditions: this.filterConditions,
      skip: this.skip,
      take: this.take,
      sortField: this.sortField ?? 'date_created',
      sortOrder: this.sortOrder ?? this.formItem.defaultValue ?? 'desc',
      sumField: JSON.stringify(this.sumField),
      maxField: JSON.stringify(this.maxField),
      minField: JSON.stringify(this.minField),
      lastRow: this.lastRow,
    };

    const expParameter = this.getExpressionData(
      'PARAMETER',
      this.formItem.expressionData,
    );

    if (expParameter !== null) {
      const objMap: any = {};

      expParameter.forEach(
        (elm: any) => (objMap[elm.name] = evaluateExpression(elm.value)),
      );

      Object.assign(filterParams, objMap);
    }

    return filterParams;
  }
  evalValue(value: any) {
    try {
      const result = value.replace(/\{([^{}]+)\}/g, (match: any, key: any) => {
        // Replace
        if (key.includes('PARENT:')) {
          const propertyCode = key.split(':')[1];
          const parent = this.parentData[propertyCode];
          return parent ? parent : '';
        } else {
          const parent = this.formData[key];
          return parent ? parent : '';
        }
      });
      return result;
    } catch (e) {
      //console.log(e)
    }
    return value;
  }

  async getAPIDatatable(obj: any) {
    let filters: any = {};

    if (
      this.formItem.expressionData !== null &&
      this.formItem.expressionData !== ''
    ) {
      let jexpression = JSON.parse(this.formItem.expressionData);
      if (Array.isArray(jexpression) && jexpression.length > 0) {
        jexpression = jexpression.filter((s) => s.typeData == 'CONDITION')[0];
      }

      if (jexpression?.typeData === 'CONDITION') {
        jexpression.data.rules.forEach((c: any) => {
          const valueFilter = this.evalValue(c.value);
          const matchMode = this.mapOperatorAPI(c.operator);
          if (valueFilter != null && valueFilter != '') {
            filters[c.field] = {
              value: matchMode == 'in' ? JSON.parse(valueFilter) : valueFilter,
              matchMode: matchMode,
            };
          }
        });
      }
    }
    const objMap: any = {};
    obj.data.list.forEach((elm: any) => (objMap[elm.name] = elm.value));
    const res = await firstValueFrom(
      this.categoryService.onetAPI({
        skip: this.skip,
        take: this.take,
        api: obj.data.code,
        filters: filters,
        orderBy: this.sortField ? objMap[this.sortField] : 'createdDate',
        orderDir: this.sortOrder == 'desc' ? 1 : 0,
      }),
    );
    let lst: any = [];
    if (
      res.data != null &&
      res.data.result &&
      res.data.result.subset &&
      res.data.result.subset.length > 0
    )
      res.data.result.subset.forEach((elm: any) => {
        let item: any = {};
        obj.data.list.forEach(
          (map: any) =>
            (item[map.name] =
              map.name != 'name'
                ? elm[map.value]
                : map.value
                    .split('+')
                    .map((s: any) => elm[s])
                    .join(' - ') || '...'),
        );
        lst.push(item);
      });
    this.items = lst;
    this.itemTotal =
      res.data && res.data.result && res.data.result.totalItemCount
        ? res.data.result.totalItemCount
        : 0;
  }

  async getDataTable() {
    this.items.splice(0, this.items.length);
    this.itemTotal = null;

    let obj;
    try {
      obj =
        this.formItem.lookupData !== undefined &&
        this.formItem.lookupData !== null
          ? JSON.parse(this.formItem.lookupData)
          : null;
    } catch (e) {
      console.log(e);
    }

    if (obj && obj.typeData === 'API') {
      await this.getAPIDatatable(obj);
      this.cols = await this.loadCols();
      this.cdr.detectChanges();
      return;
    }

    const filterParams = this.getParameterData();
    const res = await firstValueFrom(
      this.infoDataService.getList(filterParams),
    );
    this.items = res.data.list;
    this.itemTotal = res.data.total;
    this.cols = await this.loadCols();
    this.cdr.detectChanges();

    if (
      this.formItem.action !== null &&
      this.formItem.action.indexOf('TABLE_ON_LOAD') > -1
    ) {
      const jdata = JSON.parse(this.formItem.action);
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_SUM')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            const sum = res?.data?.ext?.sum[f.data];
            this.events.emit({
              action: f,
              value: sum,
            });
          });
        });
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_MAX')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            const max = res?.data?.ext?.max[f.data];
            this.events.emit({
              action: f,
              value: max,
            });
          });
        });
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_MIN')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            const min = res?.data?.ext?.min[f.data];
            this.events.emit({
              action: f,
              value: min,
            });
          });
        });
      jdata.rules
        .filter((c: any) => c.event === 'TABLE_COUNT')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            this.events.emit({
              action: f,
              value: this.itemTotal,
            });
          });
        });

      jdata.rules
        .filter((c: any) => c.event === 'TABLE_LAST_ROW')
        .forEach((c: any) => {
          c.rules.forEach((f: any) => {
            this.events.emit({
              action: f,
              value: res?.data?.ext?.lastRow,
            });
          });
        });
    }
  }

  filterTable(dataAction: any) {
    this.skip = 0;

    this.filterConditions.splice(0, this.filterConditions.length);

    if (
      this.formItem &&
      this.formItem.expressionData &&
      this.formItem.expressionData !== '' &&
      this.formItem.expressionData.indexOf('"typeData":"CONDITION"') !== -1
    ) {
      let jexpression = JSON.parse(this.formItem.expressionData);
      if (Array.isArray(jexpression)) {
        jexpression = jexpression.filter(
          (c: any) => c.typeData === 'CONDITION',
        )[0];
      }
      let _conditions = cloneDeep(jexpression.data);
      //('filterTable-dataAction', dataAction);
      this.buildConditionFilter(_conditions, {
        ...dataAction.parentData,
        ...dataAction.value,
        ...this.parentData,
      });
      this.filterConditions.push(_conditions);
      this.getDataTable();
      return;
    }

    this.getDataTable();
  }

  hasOperatorChars(input: string): boolean {
    // Bao gồm: + - * / % = < >
    const regex = /[+\-*/%<>=]/;
    return regex.test(input);
  }

  buildConditionFilter(f: any, value: any) {
    f.rules.forEach((c: any) => {
      if (c.value && c.value.indexOf('{') > -1) {
        c.value = c.value.replace('{', '').replace('}', '');
        let evaluatedFormula: any = null;
        if (c.value.includes('COMPANY_ROLE:')) {
          const arrKey = c.value.split(':');
          const propertyCode = arrKey && arrKey.length > 1 ? arrKey[1] : '';
          const arrRole =
            propertyCode != '' ? propertyCode.split(',') : [c.value];
          const hasCommon = this.currentUser.roleCodes.some((x: any) =>
            arrRole.includes(x),
          );
          const value =
            this.currentUser.companyCodeExt != null &&
            this.currentUser.companyCodeExt.length > 0
              ? this.currentUser.companyCodeExt
              : [this.currentUser.companyCode];
          evaluatedFormula = hasCommon ? null : JSON.stringify(value);
        } else if (c.value.includes('DEPARTMENT_ROLE:')) {
          const arrKey = c.value.split(':');
          const propertyCode = arrKey && arrKey.length > 1 ? arrKey[1] : '';
          const arrRole =
            propertyCode != '' ? propertyCode.split(',') : [c.value];
          const hasCommon = this.currentUser.roleCodes.some((x: any) =>
            arrRole.includes(x),
          );
          evaluatedFormula = hasCommon ? null : this.currentUser.departmentCode;
        } else if (c.value.includes('FIELD_ROLE:')) {
          let result: any = [];
          const arrKey = c.value.split(':') || [];
          for (let i = 1; i < arrKey.length; i++) {
            const arrRole1 = arrKey[i].split('|');
            const role1 = arrRole1[0];
            const value1 = arrRole1[1];
            if (this.checkUserRole(role1.trim().toUpperCase()))
              result = result.concat(JSON.parse(value1.trim()));
          }
          result = [...new Set(result)];
          evaluatedFormula = result.length > 0 ? JSON.stringify(result) : null;
        } else {
          evaluatedFormula = c.value.replace(
            /[A-Z_]+(?::[A-Z0-9_,]+)?/gi,
            (match: any) => {
              const field = match;
              if (field.includes('USER:')) {
                const arrKey = field.split(':');
                const propertyCode =
                  arrKey && arrKey.length > 1 ? arrKey[1] : field;
                const parent = this.currentUser[propertyCode];
                return parent ? parent : match;
              } else {
                return value.hasOwnProperty(field) ? value[field] : null;
              }
            },
          );
        }
        try {
          c.value =
            this.hasOperatorChars(evaluatedFormula) ||
            evaluatedFormula == 'null' ||
            evaluatedFormula == 'undefined' ||
            evaluatedFormula.contains('new Date()')
              ? evaluateExpression(evaluatedFormula)
              : evaluatedFormula;
        } catch (ex) {
          c.value = evaluatedFormula;
        }
      }
      if (c.rules) {
        this.buildConditionFilter(c, value);
      }
    });
    f.rules = f.rules.filter((v: any) => {
      return (
        v.value != null ||
        v.operator == 'is null' ||
        (v.rules && v.rules.length > 0)
      );
    });
  }

  onPage(e: any) {
    this.skip = e.first;
    this.take = e.rows;
    this.getDataTable();
  }

  onSort(e: any) {
    this.sortField = e.field;
    this.sortOrder = e.order === 1 ? 'asc' : 'desc';
    this.getDataTable();
  }

  selectionChange(e: any) {
    this.formCtrl?.setValue(e);
    this.itemSelection = e;
  }

  rowClick(event: Event, data: any, item: any) {
    if (
      item.controlType === 'file-download' ||
      item.controlType === 'file-download-ecm'
    ) {
      data.isDownload = true;
      let file = data[item.property.code]?.split('|');
      const filename = file[0];
      const filekey = file.length > 1 && file[1] != "null" ? file[1] : filename;
      this.fileService
        .download({
          permission: this.formItem.layout.group.code,
          filename: filekey,
          isECM: item.controlType === 'file-download-ecm',
          iskeyFile: file.length > 1,
        })
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
              saveAs(res.body!, filename);
              this.messageService.add({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Download thành công!',
                life: 3000,
              });
            }
            data.isDownload = false;
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
            data.isDownload = false;
          },
        });
      // this.fileService
      //   .download({ filename: data[item.property.code] })
      //   .subscribe((res: any) => {
      //     if (res.statusCode === ResponseCode.ZERO) {
      //       this.downloadFileTrigger(res.data, `${data.file}`);
      //       this.messageService.add({
      //         severity: 'success',
      //         summary: 'Thông báo',
      //         detail: res.message,
      //         life: 3000,
      //       });
      //     } else {
      //       this.messageService.add({
      //         severity: 'error',
      //         summary: 'Thông báo',
      //         detail: res.message,
      //         life: 3000,
      //       });
      //     }

      //     data.isDownload = false;
      //   });
      return;
    }

    this.events.emit({
      action: JSON.parse(item.action).rules.find(
        (c: any) => c.action === 'CLICK',
      ),
      dataId: data.id,
      data: data,
      groupId: this.parentGroupId,
    });
  }

  dblClick(event: Event, data: any) {
    window.open(`/info/info-value-history/${data.id}`, '_blank');
  }
  filename(value: any) {
    let file = value?.split('|');
    if (file) return file[0];
    return null;
  }
  deleteRow(data: any) {
    this.confirmationService.confirm({
      //target: event.target as EventTarget,
      message: `Bạn muốn xoá ${data.dataId}?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Xoá',
      rejectIcon: 'none',
      rejectLabel: 'Đóng',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        const isValid = this.validRule(data);
        if (!isValid.valid) {
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: isValid.message,
            life: 3000,
          });
          return;
        }
        this.toggleLoading(true);
        await this.deleteRowSubmit(data.dataId, this.formItem.layout.code, data);
        this.cdr.detectChanges();
        this.getDataTable();
        this.toggleLoading(false);
      },
    });
  }

  validRule(data: any): { valid: boolean; message?: string } {
    let rule: any;
    try {
      rule = JSON.parse(data.action.data);
    } catch {
      return { valid: true };
    }

    if (rule.rule !== 'FIELD_NOT_VALID' || !rule.fields) {
      return { valid: true };
    }

    const fields = rule.fields.split(',').map((x: string) => x.trim());

    const isInvalid = fields.some((field: string) => {
      const val = data?.data?.[field];

      if (rule.value === null || rule.value === 'null') {
        return val != null && String(val).trim() !== '';
      }

      return String(val ?? '').trim() !== String(rule.value);
    });

    return isInvalid
      ? { valid: false, message: rule.falsemsg }
      : { valid: true };
  }

  deleteRowSelection() {
    if (this.itemSelection.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng lựa chọn bản ghi',
        life: 3000,
      });
      return;
    }

    this.confirmationService.confirm({
      //target: event.target as EventTarget,
      message: `Bạn muốn xoá các lựa chọn?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: 'Xoá',
      rejectIcon: 'none',
      rejectLabel: 'Đóng',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.toggleLoading(true);
        const concurrency = 20;
        const queue = [...this.itemSelection];

        while (queue.length) {
          const batch = queue.splice(0, concurrency);

          await Promise.all(
            batch.map(item =>
              this.deleteRowSubmit(item.id, this.formItem.layout.code)
            )
          );
        }
        this.cdr.detectChanges();
        this.getDataTable();
        this.toggleLoading(false);
      },
    });
  }

  async deleteRowSubmit(
    dataId: any,
    layoutCode: any = null,
    dataAction: any = null,
  ) {
    const res = await firstValueFrom(
      this.infoDataService.delete({ id: dataId, layoutCode: layoutCode }),
    );
    if(res.statusCode != 0)
    {
        this.messageService.add({
        severity: 'error',
        summary: 'Thông báo',
        detail: res.message,
        life: 3000,
      });
      return;
    }
    if (dataAction != null)
      for (const r of dataAction.action.rules.filter(
        (r: any) =>
          r.action === 'POST_ACTION' && r.event === 'FORM_UPDATE_FIELD',
      )) {
        const fields: any = {};
        for (const r2 of r.rules) {
          fields[r2.target] = r2.data;
        }
        if (dataAction.data && dataAction.data[r.data]) {
          const res = await firstValueFrom(
            this.infoDataService.saveData({
              id: dataAction.data[r.data],
              layoutCode: r.target,
              properties: fields,
            }),
          );
        }
      }
    if (dataAction != null)
      for (const r of dataAction.action.rules.filter(
        (r: any) =>
          r.action === 'POST_ACTION' && r.event !== 'FORM_UPDATE_FIELD',
      ))
        this.events.emit({
          action: r,
          control: dataAction.control,
        });

    this.messageService.add({
      severity: 'success',
      summary: 'Thông báo',
      detail: res.message,
      life: 3000,
    });
  }

  updateSelection(dataAction: any) {
    if (this.itemSelection.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng lựa chọn bản ghi',
        life: 3000,
      });
      return;
    }

    const properties: any = {};

    dataAction.action.rules.forEach((i: any) => {
      try {
        if (i.data.includes('{USER:')) {
          const arrKey = i.data.replace('{', '').replace('}', '').split(':');
          const propertyCode = arrKey && arrKey.length > 1 ? arrKey[1] : i.data;
          const parent = this.currentUser[propertyCode];
          properties[i.target] = parent ? parent : null;
        } else if (i.data.includes('new Date()')) {
          properties[i.target] = i.data;
        } else {
          properties[i.target] = evaluateExpression(i.data);
        }
      } catch (ex) {
        properties[i.target] = i.data;
      }
    });

    this.confirmationService.confirm({
      //target: event.target as EventTarget,
      message: `Bạn muốn cập nhật các lựa chọn?`,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      acceptLabel: `Lưu thông tin`,
      rejectIcon: 'none',
      rejectLabel: 'Đóng',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        this.toggleLoading(true);
        await Promise.all(
          this.itemSelection.map((item) => {
            this.updateRowSubmit(item, properties, dataAction);
          }),
        );

        this.cdr.detectChanges();

        this.getDataTable();
        this.toggleLoading(false);
      },
    });
  }

  sendSelection(dataAction: any) {
    if (this.itemSelection.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thông báo',
        detail: 'Vui lòng lựa chọn bản ghi',
        life: 3000,
      });
      return;
    }
    this.toggleLoading(true);
    this.events.emit({
      action: dataAction.action.rules.find(
        (c: any) => c.action === 'TABLE_ON_RECEIVE',
      ),
      data: this.itemSelection,
      type: dataAction.action.data,
      control: dataAction.control,
    });
    this.toggleLoading(false);
  }
  private async handleOneElm(elm: any, dataAction: any) {
    let objMap: any[] = [];

    for (const r of dataAction.action.rules.filter(
      (r: any) => r.action === 'MAP_FIELD',
    )) {
      objMap.push(r);
      for (const r2 of r.rules) {
        objMap.push(r2);
      }
    }

    if (!objMap.length) return;

    let lst: any[] = [];

    if (dataAction.type === 'LINE') {
      lst = [elm];
    } else {
      const res = await firstValueFrom(
        this.infoDataService.getList({
          parentId: elm.id,
          groupCode: dataAction.action.data,
          pageSize: Number.MAX_SAFE_INTEGER,
        }),
      );
      lst = res.data.list;
    }

    for (const v of lst) {
      const properties: any = {};

      for (const r2 of objMap) {
        properties[r2.data] =
          r2.event === 'FIELD_VALUE' ? r2.target : v[r2.target];
      }

      const res = await firstValueFrom(
        this.infoDataService.saveData({
          id: null,
          parentId: this.parentId,
          identifyId: this.parentId ? null : this.identifyId,
          layoutCode: this.formItem.layout.code,
          properties,
          control: dataAction.control,
        }),
      );
      if (res.statusCode !== ResponseCode.ZERO) {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: res.message,
          life: 3000,
        });
      }
      else
      {
        this.messageService.add({
          severity: 'success',
          summary: 'Thông báo',
          detail: res.message,
          life: 3000,
        });
      }
    }

    // POST_ACTION
    for (const r of dataAction.action.rules.filter(
      (r: any) => r.action === 'POST_ACTION' && r.event === 'FORM_UPDATE_FIELD',
    )) {
      const fields: any = {};
      for (const r2 of r.rules) {
        fields[r2.target] = r2.data;
      }

      if (r.data) {
        await firstValueFrom(
          this.infoDataService.saveData({
            id: elm.id,
            layoutCode: r.target,
            properties: fields,
            control: dataAction.control,
          }),
        );
      }
    }
  }

  async receiveSelection(dataAction: any) {
    this.toggleLoading(true);

    const concurrency = 20;
    const queue = [...dataAction.data];

    while (queue.length) {
      const batch = queue.splice(0, concurrency);

      await Promise.all(batch.map((elm) => this.handleOneElm(elm, dataAction)));
    }

    for (const action of dataAction.action.rules.filter(
      (c: any) => c.action === 'TABLE_ON_RECEIVE',
    ))
      this.events.emit({ action: action });

    this.toggleLoading(false);
  }

  async updateRowSubmit(item: any, properties: any, dataAction: any) {
    //console.log(dataAction);
    var validate = true;
    for (const action of dataAction.action.rules.filter(
      (c: any) => c.event === 'FORM_VALIDATE' && c.data == 'KHOANAM',
    )) {
      validate =
        (await this.validate(item, properties, dataAction)) && validate;
    }
    if (!validate) return;

    // tạm bỏ không check để có thể update
    // if (
    //   dataAction.control.expressionData.indexOf('"typeData":"CONDITION"') > -1
    // ) {
    //   let jexpression = JSON.parse(dataAction.control.expressionData);
    //   if (Array.isArray(jexpression)) {
    //     jexpression = jexpression.filter(
    //       (f: any) => f.typeData == 'CONDITION'
    //     )[0];
    //   }
    //   const _script = this.buildConditionUI(jexpression.data, item);
    //   if (!evaluateExpression(_script)) return;
    // }

    for (const key of Object.keys(properties)) {
      const val = properties[key];
      if (typeof val === 'string' && val.indexOf('JSONATA:') > -1) {
        const expr = jsonata(val.replace('JSONATA:', ''));
        const result = await expr.evaluate(item);
        properties[key] = result;
      }
    }

    const res = await firstValueFrom(
      this.infoDataService.saveData({
        id: item.id,
        layoutCode: this.formItem.layout.code,
        control: dataAction.control,
        properties: properties,
      }),
    );
    //thêm cho trường hợp update pass layout;
    for (const r of dataAction.action.rules.filter(
      (r: any) => r.action === 'POST_ACTION' && r.event === 'FORM_UPDATE_FIELD',
    )) {
      const fields: any = {};
      if (item && item[r.data] && r.target) {
        for (const r2 of r.rules) {
          fields[r2.target] =
            r2.event == 'FIELD_VALUE' ? r2.data : item[r2.data];
        }
        const res1 = await firstValueFrom(
          this.infoDataService.saveData({
            id: item[r.data],
            layoutCode: r.target,
            properties: fields,
          }),
        );
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Thông báo',
      detail: res.message,
      life: 3000,
    });

    this.cdr.detectChanges();

    this.getDataTable();
  }

  async importExcel(dataAction: any) {
    let fileInput = this.renderer.createElement('input');
    this.renderer.setAttribute(fileInput, 'type', 'file');
    this.renderer.setAttribute(fileInput, 'accept', '.xlsx,.xls'); // ✅ chỉ cho chọn Excel
    this.renderer.setStyle(fileInput, 'display', 'none');

    this.renderer.listen(fileInput, 'change', (event: any) => {
      const file = event.target.files[0];

      if (!file) return;

      // ✅ Check extension
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: 'Chỉ cho phép file Excel (.xlsx, .xls)',
          life: 3000,
        });
        return;
      }

      // ✅ Check MIME (optional nhưng nên có)
      const validMime = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!validMime.includes(file.type)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Thông báo',
          detail: 'File không đúng định dạng Excel',
          life: 3000,
        });
        return;
      }

      const formData = new FormData();
      formData.append('file', file, file.name);

      this.toggleLoading(true);

      this.fileService.uploadTemp(formData).subscribe((res: any) => {
        if (res.statusCode === ResponseCode.ZERO) {
          this.importExcelSubmit(res.data[0].fileName, dataAction);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Thông báo',
            detail: res.message,
            life: 3000,
          });
          this.toggleLoading(false);
        }
      });

      this.renderer.removeChild(this.el.nativeElement, fileInput);
      fileInput = null;
    });

    this.renderer.appendChild(this.el.nativeElement, fileInput);
    fileInput.click();
  }

  toggleLoading(isLoading: boolean) {
    this.isOnSubmit = isLoading;
    this.cdr.detectChanges();
  }

  async importExcelSubmit(filename: string, dataAction: any = null) {
    const res = await firstValueFrom(
      this.infoDataService.importExcel({
        filename: filename,
        dataAction: dataAction,
        layoutCode: dataAction.action.data,
        parentId: this.parentId,
        identifyId: this.identifyId,
      }),
    );
    this.toggleLoading(false);
    this.confirmationService.confirm({
      //target: event.target as EventTarget,
      //message: res.message,
      message: 'Đang thực hiện import dữ liệu. Vui lòng chờ hệ thống xử lý !',
      header: 'Kết quả',
      icon: 'pi pi-exclamation-triangle',
      closeOnEscape: false,
      dismissableMask: false,
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectLabel: 'Đóng',
      acceptLabel: 'Tải file',
      rejectButtonStyleClass: 'p-button-text',
      acceptVisible: !(res.data === 'JOB_SCHEDULLE'),
      reject: () => {
        if (res.data === 'JOB_SCHEDULLE')
          for (const action of dataAction.action.rules.filter(
            (r: any) => r.action === 'FORM_ON_SUBMIT',
          ))
            this.events.emit({
              action: action,
              dataId: this.parentData?.id,
              value: action.event == 'FORM_SET_VALUE' ? this.parentData : null,
            });
      },
      accept: () => {
        this.toggleLoading(true);
        this.fileService.DonwloadTemp({ filename: res.data }).subscribe({
          next: (res2) => {
            if (res2.body.statusCode == 1) {
              this.messageService.add({
                severity: 'error',
                summary: 'Thông báo',
                detail: 'File không tồn tại',
                life: 3000,
              });
            } else {
              saveAs(res2.body!, res.data);
              this.messageService.add({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Download thành công!',
                life: 3000,
              });
            }
            this.toggleLoading(false);
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
            this.toggleLoading(false);
          },
        });
        // this.infoDataService.DonwloadTemp(res.data);
      },
    });
  }

  async exportExcel(dataAction: any) {
    this.toggleLoading(true);

    // const res = await firstValueFrom(
    //   this.infoDataService.exportExcel({
    //     dataAction: dataAction,
    //     query: this.getParameterData(),
    //   })
    // );

    this.infoDataService
      .exportExcel({
        dataAction: dataAction,
        query: this.getParameterData(),
      })
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
            saveAs(
              res.body!,
              `data-export_${new Date()
                .toISOString()
                .slice(0, 19)
                .replace(/T/, '_')
                .replace(/:/g, '')}.xlsx`,
            );
            this.messageService.add({
              severity: 'success',
              summary: 'Thông báo',
              detail: 'Download thành công!',
              life: 3000,
            });
          }
          this.toggleLoading(false);
        },
        error: (err) => {
          const backendMsg = err.error?.message || 'Có lỗi xảy ra khi tải file';
          this.messageService.add({
            severity: 'error',
            summary: `Lỗi ${err.status}`,
            detail: backendMsg,
            life: 3000,
          });
          this.toggleLoading(false);
        },
      });
  }

  async validate(item: any, properties: any, dataAction: any) {
    const mapGroupCode: any = {
      '01': 'QLTS-KH-02',
      '02': 'QLTS-KH-08',
      '03': 'QLTS-KH-09',
    };
    const groupCode = mapGroupCode[item['loai_kh']];
    if (groupCode == null) return true;
    //console.log('validatiteme1', item);
    //lấy ra số lượng đơn vị
    const res = await firstValueFrom(
      this.categoryService.onetAPI({
        api: 'common/branches/search',
        isActive: true,
      }),
    );
    //console.log('validate1', res.data.result.totalItemCount);
    // lấy ra số lượng kế hoạch đầu năm trong năm
    const conditions = {
      condition: 'and',
      rules: [
        { field: 'nam_kh', operator: '==', value: item['nam_kh'] },
        { field: 'loai_kh', operator: '==', value: '01' },
      ],
    };
    const res1 = await firstValueFrom(
      this.infoDataService.getCount({
        groupCode: groupCode,
        conditions: conditions !== null ? [conditions] : null,
      }),
    );
    //console.log('validate2', res1.data.result);
    if (
      res.data?.result?.totalItemCount == res1.data.result &&
      res.data?.result?.totalItemCount != null
    ) {
      return true;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Thông báo',
        detail: 'Vẫn còn đơn vị chưa lập kế hoạch đầu năm.',
        life: 3000,
      });
      return false;
    }
  }

  isFrozen(col: any) {
    if (this.columns.indexOf(col) < this.columns.length - 1) return false;

    const _childs = this.funcGetChild(col.id);

    if (_childs.length > 0) {
      return _childs.every((c: any) => c.controlType === 'button');
    }

    return false;
  }

  getTextWidth(text: any) {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context!.font = '16px Arial';
      return context!.measureText(text).width + 50;
    } catch (e) {
      return 100;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngOnInit(): void {
    this.infoDataService.setPath(this.initPath(this.formItem));
    this.service.setPath(this.initPath(this.formItem));
    this.categoryService.setPath(this.initPath(this.formItem));
    this.fileService.setPath(this.initPath(this.formItem));
    this.columns = this.funcGetChild(this.formItem.id).filter(
      (x: any) => x.isShow === true && this.checkIsDisplay(x, x),
    );
    this.subscriptions.push(
      this.events.event.subscribe((data: any) => {
        this.parentData = data.parentData || this.parentData;

        if (
          data === undefined ||
          data === null ||
          data.action === undefined ||
          data.action === null ||
          data.action.target !== this.formItem.code
        )
          return;
        if (data.action.event === 'TABLE_FILTER') {
          this.filterTable(data);
          return;
        }

        if (data.action.event === 'TABLE_REFRESH') {
          this.getDataTable();
          return;
        }

        if (data.action.event === 'TABLE_DELETE') {
          this.deleteRow(data);
          return;
        }

        if (data.action.event === 'TABLE_DELETE_SELECT') {
          this.deleteRowSelection();
          return;
        }

        if (data.action.event === 'TABLE_UPDATE_SELECT') {
          this.updateSelection(data);
          return;
        }

        if (data.action.event === 'TABLE_SELECT_SEND') {
          this.sendSelection(data);
          return;
        }

        if (data.action.event === 'TABLE_SELECT_RECEIVE') {
          this.receiveSelection(data);
          return;
        }

        if (data.action.event === 'TABLE_IMPORT_EXCEL') {
          this.importExcel(data);
          return;
        }

        if (data.action.event === 'TABLE_EXPORT_EXCEL') {
          this.exportExcel(data);
          return;
        }
      }),
    );

    if (
      this.formItem.action !== undefined &&
      this.formItem.action !== null &&
      this.formItem.action.indexOf('TABLE_ON_INIT') > -1
    ) {
      const dataAction = JSON.parse(this.formItem.action);
      this.events.emit({
        action: dataAction.rules.find((c: any) => c.action === 'TABLE_ON_INIT'),
        data: this.formItem.code,
        value: this.parentData,
      });
    } else {
      if (this.formItem.controlType !== 'table-filter') this.getDataTable();
    }
  }
}
