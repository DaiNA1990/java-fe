import { filter } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { InfoLayoutService } from '../info-page/services/info-layout.service';
import { BaseFormPage } from '../info-page/components/base.form';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '@appkkkh/modules/user/auth';
import { FormConfig, keepConfig } from './services/form-config.service';
@Component({
    selector: 'app-info-page',
    template: `
    <!-- <div class="pb-3 pb-lg-6">
    <app-breadcrumb [module]="layout?.group.name || ''" group="Thông tin" name="Quản lý"></app-breadcrumb>
    </div> -->
    @if (layout !== null && layout !== undefined) {
      <app-info-page-form
        [config]="getFormConfig()"
        />
    }
    @if (layout === null || layout === undefined) {
      <div
        class="page-loader"
        style="display: flex;position: absolute;text-align: center;justify-content: center;align-items: center;opacity: 0.9;"
        >
        <span class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </span>
      </div>
    }
    <!--
    p-toast / p-confirmDialog để ở đây, KHÔNG để trong form.component:
    form lồng nhau (control loại layout, form trong modal) nên mỗi instance sẽ
    render thêm một cái, mà MessageService lại là singleton của info-page.module
    -> một message add() hiện ra trên tất cả các toast, nhìn thành chồng nhau.
    -->
    <p-toast></p-toast>
    <p-confirmDialog appendTo="body"></p-confirmDialog>
    `,
    providers: [
        InfoLayoutService
    ],
    standalone: false
})
export class InfoPageComponent extends BaseFormPage implements OnInit, OnDestroy {
  layout: any = null;
  layoutId: any;
  subscriptions: Subscription[] = [];

  private formConfig: FormConfig | null = null;

  // phải qua keepConfig, không bind object literal thẳng trên template
  getFormConfig(): FormConfig {
    this.formConfig = keepConfig(this.formConfig, {
      layoutModule: this.layout?.module ?? null,
      layoutCode: this.layout?.code ?? null,
      layoutId: this.layoutId,
      dataId: null,
      parentId: null,
      passGroupId: null,
      passDataId: null,
      passParentId: null,
      formType: null,
      identifyId: null,
      readOnly: null,
      ownerModal: null,
    });
    return this.formConfig;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public infoLayoutService: InfoLayoutService,
    private changeDetectorRef: ChangeDetectorRef,
    protected override authService: AuthService
  ) {
    super();
  }

  async getData() {
    this.layoutId = this.activatedRoute.snapshot.params['layoutId'];
    const res = await firstValueFrom(
      this.infoLayoutService.getById({ id: this.layoutId })
    );
    this.layout = res.data;
    this.changeDetectorRef.detectChanges();
    const el = document.querySelector('.app-main') as HTMLElement;
    el.style.position = '';
  }

  async getUserInfo() {
    this.authService.applyLayoutRoles(this.layout.group.pathCode);
    this.changeDetectorRef.detectChanges();
  }

  showLoader() {
    const elements = document.getElementsByClassName('app-main');
    if (elements.length > 0) {
      (elements[0] as HTMLElement).style.position = 'relative';
    }

    if (this.layout !== null) {
      this.layout = null;
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  // ngOnInit(): void {

  //   this.getData();
  //   this.getUserInfo();

  //   this.subscriptions.push(this.router.events.subscribe(c => {
  //     if (c instanceof NavigationStart && c.url.indexOf('/info/info-page') > -1) {
  //       this.showLoader();
  //     }
  //     if (c instanceof NavigationEnd) {
  //       this.getData();
  //       this.getUserInfo();
  //     }
  //   }));
  // }
  async ngOnInit(): Promise<void> {
    //this.infoLayoutService.setPath(this.initPath(formItem));
    await this.getData();
    await this.getUserInfo();
    if (this.currentUser == null || this.layout == null)
      this.router.navigateByUrl('/403');
    const exists = this.currentUser.functionRoles.some(
      (x: any) => x.functionCode === this.layout.group.pathCode
    );
    if (!exists && this.layout.group.pathCode != null)
      this.router.navigateByUrl('/403');
    this.subscriptions.push(
      this.router.events.subscribe(async (c) => {
        if (c instanceof NavigationStart && c.url.includes('/info/info-page')) {
          this.showLoader();
        }
        if (c instanceof NavigationEnd && c.url.includes('/info/info-page')) {
          await this.getData();
          await this.getUserInfo();
        }
      })
    );
  }
}
