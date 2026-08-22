import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { InfoDataService } from '../../services/info-data.service';
import { FormControl } from '@angular/forms';
import {
  firstValueFrom,
  Subscription,
  BehaviorSubject,
  from,
  Subject,
  takeUntil,
} from 'rxjs';
import { EventDataService } from '../../services/event-data.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CategoryService } from '../../services/category.service';
import { BaseFormPage } from '../base.form';

@Component({
    selector: 'app-info-page-select',
    template: `
    @if (
      isLoaded &&
      !(readOnly || formItem.isReadOnly) &&
      formItem.controlType === 'select' &&
      !(lookupData?.typeData === 'API')
      ) {
      <p-select
        [formControl]="formCtrl"
        [options]="items"
        [showClear]="true"
        appendTo="body"
        optionLabel="name"
        optionValue="value"
        emptyMessage="Không có dữ liệu"
        emptyFilterMessage="Không tìm thấy dữ liệu"
        [filter]="items.length >= 20"
        [placeholder]="formItem.placeholder || ''"
        (onChange)="onChange($event)"
        >
        <ng-template pTemplate="selectedItem" let-item>
          <span
            #textEl
            class="truncate"
            [pTooltip]="shouldShowTooltip(textEl) ? item?.name : null"
            tooltipPosition="top"
            >
            {{ item?.name }}
          </span>
        </ng-template>
      </p-select>
    }
    @if (
      isLoaded &&
      !(readOnly || formItem.isReadOnly) &&
      ((formItem.controlType === 'select' &&
      lookupData?.typeData === 'API') ||
      formItem.controlType === 'selectLazy')
      ) {
      <p-select
        [formControl]="formCtrl"
        [options]="items"
        [showClear]="true"
        appendTo="body"
        optionLabel="name"
        optionValue="value"
        emptyMessage="Không có dữ liệu"
        emptyFilterMessage="Không tìm thấy dữ liệu"
        [filter]="true"
        (onFilter)="onFilterInput($event)"
        [placeholder]="formItem.placeholder || ''"
        (onChange)="onChange($event)"
        >
        <ng-template pTemplate="selectedItem" let-item>
          <span
            #textEl
            class="truncate"
            [pTooltip]="shouldShowTooltip(textEl) ? item?.name : null"
            tooltipPosition="top"
            >
            {{ item?.name }}
          </span>
        </ng-template>
      </p-select>
    }
    <!-- <div *ngIf="isLoaded && (readOnly || formItem.isReadOnly)">{{ name }}</div> -->
    @if (isLoaded && (readOnly || formItem.isReadOnly)) {
      <input
        type="text"
        pInputText
        [value]="this.getValueReadOnly(formCtrl.value) | formatText"
        [disabled]="true"
        />
    }
    @if (
      isLoaded &&
      !(readOnly || formItem.isReadOnly) &&
      formItem.controlType === 'multiSelect'
      ) {
      <p-multiSelect
        [formControl]="formCtrl"
        [options]="items"
        optionLabel="name"
        optionValue="value"
        appendTo="body"
        emptyMessage="Không có dữ liệu"
        emptyFilterMessage="Không tìm thấy dữ liệu"
        [placeholder]="formItem.placeholder || ''"
        (onChange)="onChange($event)"
        [maxSelectedLabels]="3"
        />
    }
    @if (!isLoaded) {
      <div
        class="form-control form-control-solid text-center"
        data-kt-indicator="on"
        >
        <span class="indicator-progress">
          <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
        </span>
      </div>
    }
    `,
    styles: [
        `
      ::ng-deep {
        .p-select-list {
          margin: 0;
          padding-left: 0;
        }

        .truncate {
          display: block;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    `,
    ],
    providers: [InfoDataService, CategoryService],
    standalone: false
})
export class InfoPageSelectComponent
  extends BaseFormPage
  implements OnInit, OnDestroy
{
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  @Input() readOnly: any = false;
  @Input() parentData: any;
  @Input() formData: any;

  items: any[] = [];

  subscriptions: Subscription[] = [];

  isLoaded = false;
  lookupData: any = null;
  private filterSubject = new BehaviorSubject<string>(''); // Dùng để debounce input
  private unsubscribe$ = new Subject<void>();

  constructor(
    private infoDataService: InfoDataService,
    public categoryService: CategoryService,
    private eventDataService: EventDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  onChange(e: any) {
    if (
      this.formItem.action === undefined ||
      this.formItem.action === null ||
      this.formItem.action === ''
    )
      return;

    try {
      let result: any;
      if (this.formItem.controlType === 'multiSelect') {
        const _item = this.items.filter(
          (elm: any) => e.value?.indexOf(elm.value) > -1
        );
        // Lấy tất cả key duy nhất trong mảng
        const allKeys: string[] = Array.from(
          new Set(
            ([] as string[]).concat(
              ..._item.map((obj: Record<string, any>) => Object.keys(obj))
            )
          )
        );

        // Tạo object kết quả, join giá trị theo từng key
        result = {};
        allKeys.forEach((key) => {
          result[key] = _item
            .map((obj: Record<string, any>) => obj[key] ?? '')
            .join(', ');
        });
      } else {
        result = this.items.find((elm: any) => elm.value == e.value);
      }
      for (const action of JSON.parse(this.formItem.action).rules.filter(
        (c: any) => c.action === 'SELECT_ON_CHANGE'
      )) {
        if (
          (action.event == 'FORM_BIND_VALUE' ||
            action.event == 'FORM_SET_VALUE') &&
          !e.originalEvent &&
          (action.data == null || action.data != 'ANYTIME')
        ) {
          continue;
        }
        setTimeout(
          () =>
            this.eventDataService.emit({
              action: action,
              value: result,
              originalEvent: e.originalEvent,
            }),
          300
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  getValueReadOnly(value: any) {
    try {
      const _item =
        this.formItem.controlType === 'multiSelect'
          ? this.items.filter((elm: any) => value?.indexOf(elm.value) > -1)
          : this.items.find((elm: any) => elm.value == value);
      return this.formItem.controlType === 'multiSelect'
        ? _item?.map((item: any) => item.name).join(',')
        : _item?.name || value;
    } catch (ex) {
      console.log(ex);
    }
    return null;
  }

  evalValue(value: any) {
    try {
      const result = value.replace(/\{([^{}]+)\}/g, (match: any, key: any) => {
        if (key.includes('PARENT:')) {
          const propertyCode = key.split(':')[1];
          const parent = this.parentData[propertyCode];
          return parent ? parent : match;
        } else if (key.includes('USER:')) {
          const propertyCode = key.split(':')[1];
          const parent = this.currentUser[propertyCode];
          return parent ? parent : match;
        } else if (key.includes('COMPANY_ROLE:')) {
          const arrKey = key.split(':');
          const propertyCode = arrKey && arrKey.length > 1 ? arrKey[1] : '';
          const arrRole = propertyCode != '' ? propertyCode.split(',') : [key];
          const hasCommon = this.currentUser.roleCodes.some((x: any) =>
            arrRole.includes(x)
          );
          const value =
            this.currentUser.companyCodeExt != null &&
            this.currentUser.companyCodeExt.length > 0
              ? this.currentUser.companyCodeExt
              : [this.currentUser.companyCode];
          const parent = hasCommon ? '' : JSON.stringify(value);
          return parent;
        } else if (key.includes('DEPARTMENT_ROLE:')) {
          const arrKey = key.split(':');
          const propertyCode = arrKey && arrKey.length > 1 ? arrKey[1] : '';
          const arrRole = propertyCode != '' ? propertyCode.split(',') : [key];
          const hasCommon = this.currentUser.roleCodes.some((x: any) =>
            arrRole.includes(x)
          );
          const parent = hasCommon ? '' : this.currentUser.departmentCode;
          return parent;
        } else {
          const parent = this.formData[key];
          return parent ? parent : match;
        }
      });
      return result;
    } catch (e) {
      //console.log(e)
    }
    return value;
  }

  buildConditionFilter(f: any, value: any) {
    f.rules.forEach((c: any) => {
      if (c.value) {
        c.value = this.evalValue(c.value);
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
  async getReferenceData(
    obj: any,
    dataAction: any = null,
    searchText: any = null
  ) {
    let conditions: any = null;

    if (
      this.formItem.expressionData !== null &&
      this.formItem.expressionData !== ''
    ) {
      let jexpression = JSON.parse(this.formItem.expressionData);

      if (Array.isArray(jexpression) && jexpression.length > 0) {
        jexpression = jexpression.filter((s) => s.typeData == 'CONDITION')[0];
      }

      if (jexpression.typeData === 'CONDITION') {
        this.buildConditionFilter(jexpression.data, dataAction);

        conditions = jexpression.data;
      }
    }
    const objMap: any = {};

    obj.data.list.forEach((elm: any) => (objMap[elm.name] = elm.value));
    if (conditions == null) conditions = { condition: 'and', rules: [] };
    // if (
    //   (this.readOnly || this.formItem.isReadOnly) &&
    //   this.formCtrl.value != null
    // )
    //   conditions.rules.push({
    //     field: objMap.value,
    //     operator: '==',
    //     value: this.formCtrl.value,
    //   });
    //Xử lý cho search text
    if (searchText != null && searchText != '') {
      var conditionSearchText: any = { condition: 'or', rules: [] };
      if (objMap.value != null && searchText != '')
        conditionSearchText.rules.push({
          field: objMap.value,
          operator: 'contains',
          value: searchText,
        });
      if (objMap.name != null && searchText != '')
        conditionSearchText.rules.push({
          field: objMap.name.includes('+')
            ? objMap.name.split('+')[1]
            : objMap.name,
          operator: 'contains',
          value: searchText,
        });
      if (conditionSearchText.rules.length > 0)
        conditions.rules.push(conditionSearchText);
    }
    let result: any = [];
    const res = await firstValueFrom(
      this.infoDataService.getList({
        groupCode: obj.data.code,
        conditions: conditions !== null ? [conditions] : null,
        skip: 0,
        take: 25,
        sortField: obj.data?.sortField ?? 'id',
        sortOrder: 'asc',
      })
    );
    result = res.data.list || [];

    this.items.splice(0, this.items.length);
    let lst: any = [];
    //kiểm tra nếu chưa có value edit trong danh sách optionList thì cần truy vấn lấy để add vào danh sách;
    if (this.formCtrl.value != null) {
      //const exists =
      //  lst.filter((c: any) => c.value == this.formCtrl.value) || [];
      //if (exists.length == 0) {
      conditions.rules.push({
        field: objMap.value,
        operator: '==',
        value: this.formCtrl.value,
      });
      const res1 = await firstValueFrom(
        this.infoDataService.getList({
          groupCode: obj.data.code,
          conditions: conditions !== null ? [conditions] : null,
        })
      );
      res1.data.list.forEach((elm: any) => {
        let item: any = {};
        obj.data.list.forEach(
          (map: any) =>
            (item[map.name] =
              map.name != 'name'
                ? elm[map.value]
                : map.value
                    .split('+')
                    .map((s: any) => elm[s])
                    .join(' - ') || '...')
        );
        lst.push(item);
      });
      this.items = lst;
      //}
    }

    result.forEach((elm: any) => {
      if (elm[objMap.value] !== undefined && elm[objMap.value] !== null) {
        let item: any = {};
        for (const key in objMap) {
          const mappedKey = objMap[key]; // 'ma', 'ten'
          const keys = mappedKey.split('+'); // tách ra array
          item[key] =
            keys.length > 1
              ? keys.map((s: any) => elm[s]).join(' - ') || '...'
              : elm[mappedKey];
        }
        const exists = lst.filter((c: any) => c.value == item.value) || [];
        if (exists.length == 0) lst.push(item);
      }
    });
    this.items = lst;

    this.items.forEach((item: any) => {
      if (typeof item.value === 'number') {
        item.value = String(item.value);
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  // Khi người dùng nhập vào filter
  onFilterInput(event: any) {
    this.filterSubject.next(event.filter); // Đẩy giá trị vào Subject
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
  async getAPIData(obj: any, textSearch: any = null) {
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
          const value = this.evalValue(c.value);
          if (value != null && value != '') {
            const matchMode = this.mapOperatorAPI(c.operator);
            filters[c.field] = {
              value: matchMode == 'in' ? JSON.parse(value) : value,
              matchMode: matchMode,
            };
          }
        });
      }
    }

    const res = await firstValueFrom(
      this.categoryService.onetAPI({
        skip: 0,
        take: 10,
        api: obj.data.code,
        keywords: textSearch,
        filters: filters,
      })
    );
    const objMap: any = {};
    obj.data.list.forEach((elm: any) => (objMap[elm.name] = elm.value));
    this.items.splice(0, this.items.length);
    let lst: any = [];
    //kiểm tra nếu chưa có value edit trong danh sách optionList thì cần truy vấn lấy để add vào danh sách;
    if (this.formCtrl.value != null) {
      // const exists =
      //   lst.filter((c: any) => c.value == this.formCtrl.value) || [];
      // if (exists.length == 0) {
      const filterClone = {
        ...filters,
        [objMap.value]: {
          value: this.formCtrl.value,
          matchMode: this.mapOperatorAPI('='),
        },
      };
      const res1 = await firstValueFrom(
        this.categoryService.onetAPI({
          skip: 0,
          take: 10,
          api: obj.data.code,
          keywords: textSearch,
          filters: filterClone,
        })
      );
      res1.data.result.subset.forEach((elm: any) => {
        let item: any = {};
        obj.data.list.forEach(
          (map: any) =>
            (item[map.name] =
              map.value
                .split('+')
                .map((s: any) => elm[s])
                .join(' - ') || '...')
        );
        lst.push(item);
      });
      this.items = lst;
      //}
    }
    res.data.result.subset.forEach((elm: any) => {
      let item: any = {};
      obj.data.list.forEach(
        (map: any) =>
          (item[map.name] =
            map.value
              .split('+')
              .map((s: any) => elm[s])
              .join(' - ') || '...')
      );
      const exists = lst.filter((c: any) => c.value == item.value) || [];
      if (exists.length == 0) lst.push(item);
    });
    this.items = lst;
    this.items.forEach((item: any) => (item.value = String(item.value)));
    this.changeDetectorRef.detectChanges();
  }

  async selectFirstAuto(dataAction: any = null) {
    const firstObj = this.items.length > 0 ? this.items[0] : null;
    const listCheck =
      this.formItem.controlType === 'multiSelect'
        ? this.formCtrl.value
        : [this.formCtrl.value];
    const hasAny = this.items.some((item) => listCheck.includes(item.value));
    if (!hasAny && dataAction != null && dataAction.originalEvent)
      this.formCtrl.setValue(null);
    if (
      firstObj != null &&
      this.items.length == 1 &&
      dataAction != null &&
      dataAction.originalEvent
    )
      this.formCtrl.setValue(firstObj.value);
  }

  async init(dataAction: any = null) {
    if (
      this.formItem.controlType === 'multiSelect' &&
      typeof this.formCtrl.value === 'string'
    ) {
      try {
        const value = JSON.parse(this.formCtrl.value);
        Array.isArray(value)
          ? this.formCtrl.setValue(value)
          : this.formCtrl.setValue(null);
      } catch {
        this.formCtrl.setValue(null);
      }
    }
    this.isLoaded = false;

    try {
      const obj = JSON.parse(this.formItem.lookupData);
      this.lookupData = obj;

      if (obj !== null && obj.typeData !== null && obj.typeData === 'CUSTOM')
        this.items = obj.data;

      if (
        obj !== null &&
        obj.typeData !== null &&
        obj.typeData === 'REFERENCE' &&
        (this.formItem.controlType === 'select' ||
          this.formItem.controlType === 'multiSelect')
      ) {
        await this.getReferenceData(obj, dataAction);
        if (dataAction != null && dataAction.originalEvent && !(this.formItem.referenceCode == 'NO_SELECT_FIRST_AUTO'))
          this.selectFirstAuto(dataAction);
      }

      if (
        obj !== null &&
        obj.typeData !== null &&
        (obj.typeData === 'API' || this.formItem.controlType === 'selectLazy')
      ) {
        obj.typeData === 'API'
          ? await this.getAPIData(this.lookupData, null)
          : await this.getReferenceData(obj, dataAction, null);

        if (dataAction != null && dataAction.originalEvent && !(this.formItem.referenceCode == 'NO_SELECT_FIRST_AUTO'))
          this.selectFirstAuto(dataAction);

        this.filterSubject
          .pipe(
            debounceTime(500), // Đợi 500ms sau khi nhập
            distinctUntilChanged(), // Chỉ gọi API nếu giá trị thay đổi
            switchMap((searchText) =>
              from(
                obj.typeData === 'API'
                  ? this.getAPIData(this.lookupData, searchText)
                  : this.getReferenceData(obj, dataAction, searchText)
              )
            ) // Chuyển async thành Observable
          )
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe();
      }
    } catch (ex) {
      //console.log(ex);
    }

    this.isLoaded = true;
    this.onChange({ value: this.formCtrl.value });

    this.changeDetectorRef.detectChanges();
  }
  shouldShowTooltip(el: HTMLElement | null): boolean {
    if (!el) return false;
    return el.scrollWidth > el.clientWidth;
  }

  ngOnDestroy(): void {
    // Hủy tất cả subscriptions khi component bị hủy
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngOnInit(): void {
    this.infoDataService.setPath(this.initPath(this.formItem));
    this.categoryService.setPath(this.initPath(this.formItem));
    this.init();
    this.subscriptions.push(
      this.eventDataService.event.subscribe((data: any) => {
        if (
          data === undefined ||
          data === null ||
          data.action === undefined ||
          data.action === null
        )
          return;

        if (data.action.target !== this.formItem.code) return;

        if (data.action.event === 'SELECT_RELOAD') {
          this.init(data);
          return;
        }
      })
    );
  }
}
