import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoGroupService } from '../../services/info-group.service';
import { InfoGroupBuildFormComponent } from '../build-form/build-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { AuthService } from '@appkkkh/modules/user/auth';

@Component({
  selector: 'app-info-group-list',
  templateUrl: `./info-group-list.component.html`,
})
export class InfoGroupListComponent implements OnInit {
  formFilter: FormGroup;

  groupId: number | null = null;
  currentUser: any;

  @ViewChild(InfoGroupBuildFormComponent)
  buildFormModal: InfoGroupBuildFormComponent;

  constructor(
    public service: InfoGroupService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  openBuildForm(item: any) {
    this.buildFormModal.open(item);
  }
  confirmDeleteData(event: Event, item: any) {
    // this.confirmationService.confirm({
    //   target: event.target as EventTarget,
    //   message: `Xóa tất cả dữ liệu của Nhóm ${item.code} này đấy ?`,
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   acceptIcon: 'none',
    //   rejectIcon: 'none',
    //   rejectButtonStyleClass: 'p-button-text',
    //   accept: async () => {
    //     const res = await firstValueFrom(
    //       this.infoDataService.deleteByGroupCode({ groupCode: item.code })
    //     );
    //     this.messageService.add({
    //       severity: res.statusCode !== ResponseCode.ZERO ? 'error' : 'success',
    //       summary: 'Thông báo',
    //       detail: res.message,
    //       life: 3000,
    //     });
    //   },
    // });
  }

  init() {
    this.formFilter = this.fb.group({});
  }
  async ngOnInit(): Promise<void> {
    this.init();
    if (this.currentUser !== null) this.currentUser = null;
    const user = await firstValueFrom(this.auth.currentUserSubject);
    user.functionRoles
      .filter((c: any) => c.functionCode == 'INFOGROUP')
      .forEach((item: any) => {
        const roles = item.subFunction.split(';');
        user.roleCodes = Array.from(new Set([...user.roleCodes, ...roles]));
      });
    this.currentUser = user;
  }
}
