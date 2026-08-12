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
@Component({
  selector: 'app-info-page',
  template: `
    <!-- <div class="pb-3 pb-lg-6">
    <app-breadcrumb [module]="layout?.group.name || ''" group="Thông tin" name="Quản lý"></app-breadcrumb>
  </div> -->
    <app-info-page-form
      [layoutModule]="layout.module"
      [layoutId]="layoutId"
      [layoutCode]="layout.code"
      [currentUser]="currentUser"
      *ngIf="layout !== null && layout !== undefined"
    />
    <div
      class="page-loader"
      style="display: flex;position: absolute;text-align: center;justify-content: center;align-items: center;opacity: 0.9;"
      *ngIf="layout === null || layout === undefined"
    >
      <span class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </span>
    </div>
    <p-confirmDialog appendTo="body"></p-confirmDialog>
  `,
  providers: [
    InfoLayoutService
  ]
})
export class InfoPageComponent extends BaseFormPage implements OnInit, OnDestroy {
  layout: any = null;
  layoutId: any;
  subscriptions: Subscription[] = [];

  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public service: InfoLayoutService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {
    super();
  }

  async getData() {
    this.layoutId = this.route.snapshot.params['layoutId'];
    const res = await firstValueFrom(
      this.service.getById({ id: this.layoutId })
    );
    this.layout = res.data;
    this.cdr.detectChanges();
    const el = document.querySelector('.app-main') as HTMLElement;
    el.style.position = '';
  }

  async getUserInfo() {
    if (this.currentUser !== null) this.currentUser = null;
    const user = await firstValueFrom(this.auth.currentUserSubject);
    user.functionRoles
      .filter((c: any) => c.functionCode == this.layout.group.pathCode)
      .forEach((item: any) => {
        const roles = item.subFunction.split(';');
        user.roleCodes = Array.from(new Set([...user.roleCodes, ...roles]));
      });
    this.currentUser = user;
    this.cdr.detectChanges();
  }

  showLoader() {
    const elements = document.getElementsByClassName('app-main');
    if (elements.length > 0) {
      (elements[0] as HTMLElement).style.position = 'relative';
    }

    if (this.layout !== null) {
      this.layout = null;
      this.cdr.detectChanges();
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
    //this.service.setPath(this.initPath(formItem));
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
