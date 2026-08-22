import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { InfoDataActionService } from '../../services/info-data-action.service';
import { InfoDataService } from '../../services/info-data.service';
import { CategoryService } from '../../services/category.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BaseFormPage } from '../base.form';

@Component({
    selector: 'app-info-data-action',
    templateUrl: `./info-data-action.component.html`,
    styleUrls: ['./info-data-action.component.scss'],
    providers: [InfoDataActionService],
    standalone: false
})
export class InfoDataActionComponent
  extends BaseFormPage
  implements OnInit, OnDestroy
{
  @Input() dataId: number;
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  isVisible: boolean = false;

  formFilter: FormGroup;

  lstData: any[] = [];
  lstDataDM: any[] = [];
  actions: any[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private infoDataActionService: InfoDataActionService,
    private infoDataService: InfoDataService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
  }

  open() {
    this.isVisible = true;
    this.getData(this.dataId);
  }

  close() {
    this.isVisible = false;
  }
  private actionConfig: any = {
  ADD:   { icon: 'pi pi-flag',   color: '#14b8a6' },
  EDIT:  { icon: 'pi pi-pencil', color: '#f59e0b' },
  XN:    { icon: 'pi pi-send',   color: '#14b8a6' },
  TD:    { icon: 'pi pi-search', color: '#7e57c2' },
  APR:   { icon: 'pi pi-check-circle',  color: '#3b82f6' },
  REJ:   { icon: 'pi pi-times',  color: '#ef5350' }
};
  async getData(dataId: number) {
    const res = await firstValueFrom(this.infoDataActionService.getList({ dataId: dataId }));
    let conditions = {
      condition: 'and',
      rules: [{ field: 'loai_danh_muc', operator: '==', value: 'ACTION_HIS' }],
    };
    if(this.lstDataDM === null || this.lstDataDM?.length == 0)
    {
      const resDM = await firstValueFrom(
        this.infoDataService.getList({
          groupCode: 'SYSTEM.CATEGORY',
          conditions: conditions !== null ? JSON.stringify([conditions]) : null,
        }),
      );
      this.lstDataDM = resDM?.data?.list || [];
    }
    this.lstData = res.data;


    const resUser = await firstValueFrom(
      this.categoryService.onetAPI({
        "skip":0,
        "take":10,
        "api": "common/users/search",
        "filters":{
          "username":{
            "value": this.lstData.map(x => x.updatedBy.includes('|') ? x.updatedBy.split('|')[1] : x.updatedBy),
            "matchMode":"in"
          }
        }
      }),
    );
    const lstDataUser = resUser?.data?.result?.subset || [];

    const mapDM = new Map(this.lstDataDM.map((x) => [x.ma, x.ten]));
    const mapUser = new Map(lstDataUser.map((x:any) => [x.username, x.fullname]));
    this.lstData.forEach((item: any) => {
      item['actionName'] = mapDM.get(item.action) ?? null;
      item['fullName'] = mapUser.get(item.updatedBy.includes('|') ? item.updatedBy.split('|')[1] : item.updatedBy) ?? null;
    });
    this.actions = this.lstData.map((x) => {
      const config = this.actionConfig[x.action] || {
        icon: 'pi pi-circle',
        color: '#9e9e9e',
      };

      return {
        time: x.dateUpdated || x.dateCreated,
        action: x.actionName || x.action,
        user: x.updatedBy.includes('|') ? x.updatedBy.split('|')[1] : x.updatedBy,
        fullName: x.fullName,
        icon: config.icon,
        color: config.color
      };
    });

    this.changeDetectorRef.detectChanges();
  }

  init() {
    this.formFilter = this.formBuilder.group({});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngOnInit(): void {
    this.infoDataActionService.setPath(this.initPath(this.formItem));
    this.infoDataService.setPath(this.initPath(this.formItem));
    this.categoryService.setPath(this.initPath(this.formItem));
    this.init();
  }
}
