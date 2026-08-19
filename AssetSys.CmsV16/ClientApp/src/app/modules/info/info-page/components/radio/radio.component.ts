import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { InfoDataService } from '../../services/info-data.service';
import { FormControl } from '@angular/forms';
import { firstValueFrom, Subscription } from 'rxjs';
import { EventDataService } from '../../services/event-data.service';
import { CategoryService } from '../../services/category.service';
import { BaseFormPage } from '../base.form';

@Component({
  selector: 'app-info-page-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less'],
  providers: [InfoDataService, CategoryService],
})
export class InfoPageRadioComponent extends BaseFormPage implements OnInit, OnDestroy {
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  @Input() readOnly: Boolean = false;

  items: any[] = [];

  subscriptions: Subscription[] = [];

  isLoaded = false;

  groupRadioName = Date.now().toString();

  constructor(
    private infoDataService: InfoDataService,
    public categoryService: CategoryService,
    private eventDataService: EventDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }
  getValueReadOnly(value: any) {
    try {
      const _item = this.items.find((elm: any) => elm.value === value);
      return _item?.name;
    } catch (ex) {
      console.log(ex);
    }
    return null;
  }
  async getReferenceData(obj: any, dataAction: any = null) {
    let conditions: any = null;

    if (
      this.formItem.expressionData !== null &&
      this.formItem.expressionData !== ''
    ) {
      let jexpression = JSON.parse(this.formItem.expressionData);

      if (Array.isArray(jexpression) && jexpression.length > 0) {
        jexpression = jexpression[0];
      }

      if (jexpression.typeData === 'CONDITION') {
        for (const elm of jexpression.data.rules) {
          if (elm.field === 'parents') {
            elm.value = dataAction.value.id;
            continue;
          }

          if (
            dataAction !== null &&
            dataAction.value !== undefined &&
            (elm.value === undefined || elm.value === null || elm.value === '')
          )
            elm.value = dataAction.value.value;
        }

        conditions = jexpression.data;
      }
    }
    let result: any = [];
    const res = await firstValueFrom(
        this.infoDataService.getList({
          groupCode: obj.data.code,
          conditions: conditions !== null ? [conditions] : null,
          pageSize: Number.MAX_SAFE_INTEGER,
        })
      );
    result = res.data.list || [];
    const objMap: any = {};

    obj.data.list.forEach((elm: any) => (objMap[elm.name] = elm.value));

    this.items.splice(0, this.items.length);

    result.forEach((elm: any) => {
      if (elm[objMap.value] !== undefined && elm[objMap.value] !== null)
        this.items.push({
          name: elm[objMap.name] || '...',
          value: elm[objMap.value],
          id: elm['id'],
        });
    });
  }

  async init(dataAction: any = null) {
    this.infoDataService.setPath(this.initPath(this.formItem));
    this.categoryService.setPath(this.initPath(this.formItem));
    this.isLoaded = false;

    try {
      const obj = JSON.parse(this.formItem.lookupData);

      if (obj !== null && obj.typeData !== null && obj.typeData === 'CUSTOM')
        this.items = obj.data;

      if (obj !== null && obj.typeData !== null && obj.typeData === 'REFERENCE')
        await this.getReferenceData(obj, dataAction);
    } catch (ex) {
      //console.log(ex);
    }

    this.isLoaded = true;

    if (this.formItem.isReadOnly || this.readOnly) this.formCtrl.disable();

    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngOnInit(): void {
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
